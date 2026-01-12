import {GraphQLError} from 'graphql';
import type {UpdateQuery} from 'mongoose';
import {Types} from 'mongoose';
import type {
  Follow as FollowEntity,
  CreateFollowInput,
  FollowTargetType,
  FollowNotificationPreferences,
} from '@ntlango/commons/types';
import {FollowApprovalStatus} from '@ntlango/commons/types';
import {Follow as FollowModel} from '@/mongodb/models';
import {CustomError, ErrorTypes, KnownCommonError} from '@/utils';
import {logger} from '@/utils/logger';

class FollowDAO {
  static async upsert(input: CreateFollowInput & {followerUserId: string}): Promise<FollowEntity> {
    try {
      const {followerUserId, targetType, targetId, notificationPreferences} = input;
      const update: UpdateQuery<FollowEntity> = {
        $set: {
          targetType,
          targetId,
        },
        $setOnInsert: {
          followId: new Types.ObjectId().toString(),
          createdAt: new Date(),
          approvalStatus: FollowApprovalStatus.Accepted, // Default to Accepted, will be overridden based on privacy settings in resolver
        },
      };
      
      // Handle nested notification preferences
      if (notificationPreferences) {
        if (notificationPreferences.contentVisibility !== undefined) {
          (update.$set as any)['notificationPreferences.contentVisibility'] = notificationPreferences.contentVisibility;
        }
      }
      
      const follow = await FollowModel.findOneAndUpdate({followerUserId, targetType, targetId}, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }).exec();

      if (!follow) {
        throw CustomError('Unable to upsert follow', ErrorTypes.INTERNAL_SERVER_ERROR);
      }

      return follow.toObject();
    } catch (error) {
      logger.error('Error upserting follow', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw KnownCommonError(error);
    }
  }

  static async updateNotificationPreferences(
    followId: string,
    userId: string,
    notificationPreferences: Partial<FollowNotificationPreferences>,
  ): Promise<FollowEntity> {
    try {
      const update: UpdateQuery<FollowEntity> = {
        $set: {},
      };

      // Update nested fields individually
      if (notificationPreferences.contentVisibility !== undefined) {
        (update.$set as any)['notificationPreferences.contentVisibility'] = notificationPreferences.contentVisibility;
      }

      const follow = await FollowModel.findOneAndUpdate({followId, followerUserId: userId}, update, {new: true}).exec();

      if (!follow) {
        throw CustomError('Follow not found or user not authorized', ErrorTypes.NOT_FOUND);
      }

      return follow.toObject();
    } catch (error) {
      logger.error('Error updating notification preferences', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw KnownCommonError(error);
    }
  }

  static async updateApprovalStatus(followId: string, targetUserId: string, approvalStatus: FollowApprovalStatus): Promise<FollowEntity> {
    try {
      // Find the follow where the targetUserId is the one being followed
      const follow = await FollowModel.findOne({followId}).exec();

      if (!follow) {
        throw CustomError('Follow request not found', ErrorTypes.NOT_FOUND);
      }

      // Verify that the targetUserId is indeed the target of this follow
      // (only the person being followed can accept/reject)
      if (follow.targetId !== targetUserId) {
        throw CustomError('Not authorized to modify this follow request', ErrorTypes.UNAUTHORIZED);
      }

      follow.approvalStatus = approvalStatus;
      await follow.save();

      return follow.toObject();
    } catch (error) {
      logger.error('Error updating approval status', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw KnownCommonError(error);
    }
  }

  static async readPendingFollows(targetUserId: string, targetType: FollowTargetType): Promise<FollowEntity[]> {
    try {
      const follows = await FollowModel.find({
        targetId: targetUserId,
        targetType,
        approvalStatus: FollowApprovalStatus.Pending,
      })
        .sort({createdAt: -1})
        .exec();
      return follows.map((f) => f.toObject());
    } catch (error) {
      logger.error('Error reading pending follows', error);
      throw KnownCommonError(error);
    }
  }

  static async readFollowingForUser(followerUserId: string): Promise<FollowEntity[]> {
    try {
      const follows = await FollowModel.find({followerUserId}).sort({createdAt: -1}).exec();
      return follows.map((f) => f.toObject());
    } catch (error) {
      logger.error('Error reading following list', error);
      throw KnownCommonError(error);
    }
  }

  static async readFollowers(targetType: FollowTargetType, targetId: string): Promise<FollowEntity[]> {
    try {
      const follows = await FollowModel.find({targetType, targetId}).sort({createdAt: -1}).exec();
      return follows.map((f) => f.toObject());
    } catch (error) {
      logger.error('Error reading followers', error);
      throw KnownCommonError(error);
    }
  }

  static async remove(params: {followerUserId: string; targetType: FollowTargetType; targetId: string}): Promise<boolean> {
    try {
      const removed = await FollowModel.findOneAndDelete(params).exec();
      if (!removed) {
        throw CustomError('Follow edge not found', ErrorTypes.NOT_FOUND);
      }
      return true;
    } catch (error) {
      logger.error('Error removing follow', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw KnownCommonError(error);
    }
  }
}

export default FollowDAO;
