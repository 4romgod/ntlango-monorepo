import type {PipelineStage} from 'mongoose';

export const createEventLookupStages = (): PipelineStage[] => {
  return [
    {
      $lookup: {
        from: 'eventcategories',
        localField: 'eventCategories',
        foreignField: 'eventCategoryId',
        as: 'eventCategories',
      },
    },
    {
      $lookup: {
        from: 'users',
        let: {organizerUserIds: '$organizers.user'},
        pipeline: [
          {
            $match: {
              $expr: {$in: ['$userId', '$$organizerUserIds']},
            },
          },
        ],
        as: 'organizersUsersMap',
      },
    },
    {
      $addFields: {
        // Create a map for O(1) lookup instead of O(n) filtering
        organizersUserMap: {
          $arrayToObject: {
            $map: {
              input: '$organizersUsersMap',
              as: 'user',
              in: {k: '$$user.userId', v: '$$user'},
            },
          },
        },
      },
    },
    {
      $addFields: {
        organizers: {
          $map: {
            input: '$organizers',
            as: 'organizer',
            in: {
              user: {
                $getField: {
                  field: '$$organizer.user',
                  input: '$organizersUserMap',
                },
              },
              role: '$$organizer.role',
            },
          },
        },
      },
    },
    {
      $project: {
        organizersUsersMap: 0,
        organizersUserMap: 0,
      },
    },
  ];
};
