import 'reflect-metadata';
import {Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from 'type-graphql';
import {CancelEventParticipantInput, EventParticipant, UpsertEventParticipantInput, User, UserRole} from '@ntlango/commons/types';
import {EventParticipantDAO} from '@/mongodb/dao';
import {validateMongodbId} from '@/validation';
import type {ServerContext} from '@/graphql';
import {EventParticipantService} from '@/services';

@Resolver(() => EventParticipant)
export class EventParticipantResolver {
  @Authorized([UserRole.Admin, UserRole.Host, UserRole.User])
  @Mutation(() => EventParticipant)
  async upsertEventParticipant(@Arg('input', () => UpsertEventParticipantInput) input: UpsertEventParticipantInput): Promise<EventParticipant> {
    validateMongodbId(input.eventId);
    validateMongodbId(input.userId);
    return EventParticipantService.rsvp(input);
  }

  @Authorized([UserRole.Admin, UserRole.Host, UserRole.User])
  @Mutation(() => EventParticipant)
  async cancelEventParticipant(@Arg('input', () => CancelEventParticipantInput) input: CancelEventParticipantInput): Promise<EventParticipant> {
    validateMongodbId(input.eventId);
    validateMongodbId(input.userId);
    return EventParticipantService.cancel(input);
  }

  @Authorized([UserRole.Admin, UserRole.Host, UserRole.User])
  @Query(() => [EventParticipant])
  async readEventParticipants(@Arg('eventId', () => String) eventId: string): Promise<EventParticipant[]> {
    validateMongodbId(eventId);
    return EventParticipantDAO.readByEvent(eventId);
  }

  /**
   * Get the current user's RSVP status for a specific event.
   * Returns null if the user has not RSVP'd to the event.
   */
  @Authorized([UserRole.Admin, UserRole.Host, UserRole.User])
  @Query(() => EventParticipant, {nullable: true, description: "Get the current user's RSVP for a specific event"})
  async myRsvpStatus(@Arg('eventId', () => String) eventId: string, @Ctx() context: ServerContext): Promise<EventParticipant | null> {
    validateMongodbId(eventId);
    if (!context.user?.userId) {
      return null;
    }
    return EventParticipantDAO.readByEventAndUser(eventId, context.user.userId);
  }

  /**
   * Get all events the current user has RSVP'd to.
   * Returns active RSVPs by default (excludes cancelled).
   */
  @Authorized([UserRole.Admin, UserRole.Host, UserRole.User])
  @Query(() => [EventParticipant], {description: "Get all events the current user has RSVP'd to"})
  async myRsvps(@Arg('includeCancelled', () => Boolean, {nullable: true, defaultValue: false}) includeCancelled: boolean, @Ctx() context: ServerContext): Promise<EventParticipant[]> {
    if (!context.user?.userId) {
      return [];
    }
    return EventParticipantDAO.readByUser(context.user.userId, !includeCancelled);
  }

  @FieldResolver(() => User, {nullable: true})
  async user(@Root() participant: EventParticipant, @Ctx() context: ServerContext): Promise<User | null> {
    if (!participant.userId) {
      return null;
    }

    // If already populated (check on participant object which may have user field from population)
    const participantAny = participant as any;
    if (participantAny.user && typeof participantAny.user === 'object' && 'userId' in participantAny.user) {
      return participantAny.user as User;
    }

    // Batch-load via DataLoader
    try {
      return await context.loaders.user.load(participant.userId);
    } catch {
      return null;
    }
  }
}
