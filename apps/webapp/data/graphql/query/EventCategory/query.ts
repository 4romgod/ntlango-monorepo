import { graphql } from '@/data/graphql/types';

export const GetAllEventCategoriesDocument = graphql(`
  query GetAllEventCategories {
    readEventCategories {
      eventCategoryId
      slug
      name
      iconName
      description
      color
    }
  }
`);
