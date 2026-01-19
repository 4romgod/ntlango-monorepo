import 'reflect-metadata';
import {Arg, Mutation, Resolver, Query, Authorized, Ctx} from 'type-graphql';
import {
  CreateOrganizationMembershipInput,
  DeleteOrganizationMembershipInput,
  OrganizationMembership,
  UpdateOrganizationMembershipInput,
  UserRole,
} from '@ntlango/commons/types';
import {OrganizationMembershipDAO} from '@/mongodb/dao';
import {RESOLVER_DESCRIPTIONS} from '@/constants';
import {validateInput, validateMongodbId} from '@/validation';
import {
  CreateOrganizationMembershipInputSchema,
  DeleteOrganizationMembershipInputSchema,
  UpdateOrganizationMembershipInputSchema,
} from '@/validation/zod';
import {ERROR_MESSAGES} from '@/validation';
import {OrganizationMembershipService} from '@/services';
import type {ServerContext} from '@/graphql';
import {getAuthenticatedUser} from '@/utils';

@Resolver(() => OrganizationMembership)
export class OrganizationMembershipResolver {
  @Authorized([UserRole.Admin])
  @Mutation(() => OrganizationMembership, {
    description: RESOLVER_DESCRIPTIONS.ORGANIZATION_MEMBERSHIP.createOrganizationMembership,
  })
  async createOrganizationMembership(
    @Arg('input', () => CreateOrganizationMembershipInput) input: CreateOrganizationMembershipInput,
    @Ctx() context: ServerContext,
  ): Promise<OrganizationMembership> {
    validateInput<CreateOrganizationMembershipInput>(CreateOrganizationMembershipInputSchema, input);
    const user = getAuthenticatedUser(context);
    return OrganizationMembershipService.addMember(input, user.userId);
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => OrganizationMembership, {
    description: RESOLVER_DESCRIPTIONS.ORGANIZATION_MEMBERSHIP.updateOrganizationMembership,
  })
  async updateOrganizationMembership(
    @Arg('input', () => UpdateOrganizationMembershipInput) input: UpdateOrganizationMembershipInput,
    @Ctx() context: ServerContext,
  ): Promise<OrganizationMembership> {
    validateInput<UpdateOrganizationMembershipInput>(UpdateOrganizationMembershipInputSchema, input);
    validateMongodbId(input.membershipId, ERROR_MESSAGES.NOT_FOUND('Organization membership', 'ID', input.membershipId));
    const user = getAuthenticatedUser(context);
    return OrganizationMembershipService.updateMemberRole(input, user.userId);
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => OrganizationMembership, {
    description: RESOLVER_DESCRIPTIONS.ORGANIZATION_MEMBERSHIP.deleteOrganizationMembership,
  })
  async deleteOrganizationMembership(
    @Arg('input', () => DeleteOrganizationMembershipInput) input: DeleteOrganizationMembershipInput,
  ): Promise<OrganizationMembership> {
    validateInput<DeleteOrganizationMembershipInput>(DeleteOrganizationMembershipInputSchema, input);
    validateMongodbId(input.membershipId, ERROR_MESSAGES.NOT_FOUND('Organization membership', 'ID', input.membershipId));
    return OrganizationMembershipService.removeMember(input.membershipId);
  }

  @Query(() => OrganizationMembership, {
    description: RESOLVER_DESCRIPTIONS.ORGANIZATION_MEMBERSHIP.readOrganizationMembershipById,
  })
  async readOrganizationMembershipById(@Arg('membershipId', () => String) membershipId: string): Promise<OrganizationMembership> {
    validateMongodbId(membershipId, ERROR_MESSAGES.NOT_FOUND('Organization membership', 'ID', membershipId));
    return OrganizationMembershipDAO.readMembershipById(membershipId);
  }

  @Query(() => [OrganizationMembership], {
    description: RESOLVER_DESCRIPTIONS.ORGANIZATION_MEMBERSHIP.readOrganizationMembershipsByOrgId,
  })
  async readOrganizationMembershipsByOrgId(@Arg('orgId', () => String) orgId: string): Promise<OrganizationMembership[]> {
    validateMongodbId(orgId, ERROR_MESSAGES.NOT_FOUND('Organization', 'ID', orgId));
    return OrganizationMembershipDAO.readMembershipsByOrgId(orgId);
  }
}
