/**
 * Migration script to geocode existing events that have addresses but no coordinates.
 * 
 * Usage: npx ts-node -r tsconfig-paths/register lib/scripts/geocode-events.ts
 * 
 * Note: This script respects Nominatim's rate limit (1 request/second).
 */

import {getConfigValue, MongoDbClient} from '@/clients';
import {Event as EventModel} from '@/mongodb/models';
import {enrichLocationWithCoordinates} from '@/utils/geocode';
import {logger} from '@/utils/logger';
import {SECRET_KEYS} from '@/constants';

const DELAY_MS = 1100; // 1.1 seconds between requests to respect Nominatim rate limit

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

async function geocodeExistingEvents() {
  logger.info('Starting geocoding migration for existing events...');

  const mongoDbUrl = await getConfigValue(SECRET_KEYS.MONGO_DB_URL);
  await MongoDbClient.connectToDatabase(mongoDbUrl);
  logger.info('Connected to MongoDB');

  try {
    // Find all events with venue location that have address but no coordinates
    const events = await EventModel.find({
      'location.locationType': 'venue',
      'location.address': {$exists: true},
      $or: [
        {'location.coordinates': {$exists: false}},
        {'location.coordinates.latitude': {$exists: false}},
        {'location.coordinates.longitude': {$exists: false}},
      ],
    }).exec();

    logger.info(`Found ${events.length} events to geocode`);
    
    // Show estimated time
    const estimatedMs = events.length * DELAY_MS;
    logger.info(`Estimated time: ${formatDuration(estimatedMs)} (at ${DELAY_MS}ms per request)`);
    logger.info('');

    const startTime = Date.now();
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const address = event.location?.address;
      
      // Calculate progress and ETA
      const progress = ((i + 1) / events.length * 100).toFixed(1);
      const elapsed = Date.now() - startTime;
      const avgTimePerEvent = i > 0 ? elapsed / i : DELAY_MS;
      const remainingEvents = events.length - i - 1;
      const eta = formatDuration(remainingEvents * avgTimePerEvent);
      
      logger.info(`[${i + 1}/${events.length}] (${progress}% | ETA: ${eta}) Processing: "${event.title}"`);
      logger.info(`  Address: ${address?.city}, ${address?.state}, ${address?.country}`);

      try {
        // Create a mutable copy of the location
        const locationCopy = JSON.parse(JSON.stringify(event.location));
        
        // Enrich with coordinates
        await enrichLocationWithCoordinates(locationCopy);

        if (locationCopy.coordinates?.latitude && locationCopy.coordinates?.longitude) {
          // Update the event in the database
          await EventModel.updateOne(
            {_id: event._id},
            {$set: {'location.coordinates': locationCopy.coordinates}}
          );
          
          logger.info(`  ✓ Geocoded to: ${locationCopy.coordinates.latitude}, ${locationCopy.coordinates.longitude}`);
          successCount++;
        } else {
          logger.warn(`  ✗ Could not geocode address`);
          failCount++;
        }
      } catch (error) {
        logger.error(`  ✗ Error geocoding event:`, error);
        failCount++;
      }

      // Respect rate limit (except for last item)
      if (i < events.length - 1) {
        await sleep(DELAY_MS);
      }
    }

    logger.info('');
    logger.info('=== Geocoding Migration Complete ===');
    logger.info(`  Successful: ${successCount}`);
    logger.info(`  Failed: ${failCount}`);
    logger.info(`  Total: ${events.length}`);
    logger.info(`  Duration: ${formatDuration(Date.now() - startTime)}`);
  } finally {
    await MongoDbClient.disconnectFromDatabase();
    logger.info('Disconnected from MongoDB');
  }
}

// Run the migration
geocodeExistingEvents()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error('Migration failed:', error);
    process.exit(1);
  });
