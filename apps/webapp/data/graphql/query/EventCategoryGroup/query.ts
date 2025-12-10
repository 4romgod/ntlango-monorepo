import { graphql } from '@/data/graphql/types';

export const GetAllEventCategoryGroupsDocument = graphql(`
  query GetAllEventCategoryGroups {
    readEventCategoryGroups {
      eventCategoryGroupId
      name
      slug
      eventCategoryList {
        eventCategoryId
        slug
        name
        iconName
        description
        color
      }
    }
  }
`);
