import 'reflect-metadata';
import {Arg, Authorized, Mutation, Query, Resolver} from 'type-graphql';
import {CancelEventParticipantInput, EventParticipant, UpsertEventParticipantInput, UserRole} from '@ntlango/commons/types';
import {EventParticipantDAO} from '@/mongodb/dao';
import {validateMongodbId} from '@/validation';

@Resolver()
export class EventParticipantResolver {
  @Authorized([UserRole.Admin, UserRole.Host, UserRole.User])
  @Mutation(() => EventParticipant)
  async upsertEventParticipant(@Arg('input', () => UpsertEventParticipantInput) input: UpsertEventParticipantInput): Promise<EventParticipant> {
    validateMongodbId(input.eventId);
    return EventParticipantDAO.upsert(input);
  }

  @Authorized([UserRole.Admin, UserRole.Host, UserRole.User])
  @Mutation(() => EventParticipant)
  async cancelEventParticipant(
    @Arg('input', () => CancelEventParticipantInput) input: CancelEventParticipantInput,
  ): Promise<EventParticipant> {
    validateMongodbId(input.eventId);
    return EventParticipantDAO.cancel(input);
  }

  @Authorized([UserRole.Admin, UserRole.Host, UserRole.User])
  @Query(() => [EventParticipant])
  async readEventParticipants(@Arg('eventId', () => String) eventId: string): Promise<EventParticipant[]> {
    validateMongodbId(eventId);
    return EventParticipantDAO.readByEvent(eventId);
  }
}
