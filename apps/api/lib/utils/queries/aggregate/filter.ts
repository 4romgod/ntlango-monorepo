import type {FilterInput, LocationFilterInput} from '@ntlango/commons/types';
import {FilterOperatorInput} from '@ntlango/commons/types';
import type {PipelineStage} from 'mongoose';

const buildOperatorSymbol = (operator?: FilterOperatorInput) => {
  const normalized = operator || FilterOperatorInput.eq;
  return `$${normalized}` as `$${FilterOperatorInput}`;
};

/**
 * Creates location filter match conditions for events.
 * Supports text-based filtering (city, state/province, country) and geospatial proximity search.
 * Note: "state" field is used for both states (US) and provinces (Canada, etc.) - they are equivalent.
 * 
 * Filter modes:
 * - Text only (city/state/country): Matches events by address text (case-insensitive)
 * - Geospatial only (lat/lng + radius): Matches events within radius (requires stored coordinates)
 * - Both: Uses $and - events must match BOTH proximity AND text criteria
 */
export const createLocationMatchStage = (location: LocationFilterInput): PipelineStage[] => {
  const {city, state, country, latitude, longitude, radiusKm} = location;
  const stages: PipelineStage[] = [];
  const textConditions: Record<string, any> = {};

  // City/state/country text-based filtering (case-insensitive regex)
  if (city) {
    textConditions['location.address.city'] = {$regex: city, $options: 'i'};
  }
  if (state) {
    textConditions['location.address.state'] = {$regex: state, $options: 'i'};
  }
  if (country) {
    textConditions['location.address.country'] = {$regex: country, $options: 'i'};
  }

  // Add text conditions as a match stage if present
  if (Object.keys(textConditions).length > 0) {
    stages.push({$match: textConditions});
  }

  // Geospatial filtering using Haversine formula approximation
  // Works with coordinates stored as {latitude, longitude} object
  if (latitude !== undefined && longitude !== undefined) {
    const radiusKmValue = radiusKm || 50; // Default 50km radius

    // Convert degrees to radians for the formula
    const userLatRad = (latitude * Math.PI) / 180;
    const userLngRad = (longitude * Math.PI) / 180;

    // Use $addFields to calculate distance, then filter
    // Equirectangular approximation: d = R * sqrt(Δlat² + (cos(midLat) * Δlng)²)
    // Accurate within ~0.5% for distances under 200km at mid-latitudes, sufficient for event filtering
    stages.push({
      $addFields: {
        _distanceKm: {
          $let: {
            vars: {
              lat1: userLatRad,
              lng1: userLngRad,
              lat2: {$multiply: [{$ifNull: ['$location.coordinates.latitude', 0]}, Math.PI / 180]},
              lng2: {$multiply: [{$ifNull: ['$location.coordinates.longitude', 0]}, Math.PI / 180]},
            },
            in: {
              $multiply: [
                6371, // Earth radius in km
                {
                  $sqrt: {
                    $add: [
                      {$pow: [{$subtract: ['$$lat2', '$$lat1']}, 2]},
                      {
                        $pow: [
                          {
                            $multiply: [
                              {$cos: {$divide: [{$add: ['$$lat1', '$$lat2']}, 2]}},
                              {$subtract: ['$$lng2', '$$lng1']},
                            ],
                          },
                          2,
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });

    // Filter by distance
    stages.push({
      $match: {
        _distanceKm: {$lte: radiusKmValue},
        'location.coordinates.latitude': {$exists: true},
        'location.coordinates.longitude': {$exists: true},
      },
    });

    // Remove the temporary distance field
    stages.push({
      $project: {
        _distanceKm: 0,
      },
    });
  }

  return stages;
};

export const createEventPipelineStages = (filters: FilterInput[]): PipelineStage[] => {
  if (!filters.length) {
    return [];
  }

  const buildMatchClause = ({field, value, operator}: FilterInput) => {
    const operatorSymbol = buildOperatorSymbol(operator);

    if (Array.isArray(value)) {
      if (value.length === 0) {
        throw new Error(`Filter field "${field}" cannot have an empty array as value`);
      }
      const arrayOperator = operatorSymbol === '$ne' ? '$nin' : '$in';
      return {
        [field]: {[arrayOperator]: value},
      };
    }

    return {
      [field]: {[operatorSymbol]: value},
    };
  };

  const matchClauses = filters.map(buildMatchClause);
  const matchPayload = matchClauses.length === 1 ? matchClauses[0] : {$and: matchClauses};

  const matchStage: PipelineStage.Match = {
    $match: matchPayload,
  };

  return [matchStage];
};
