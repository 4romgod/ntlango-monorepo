export const getCreateEventMutation = (event: any) => {
    return {
        query: `mutation CreateEvent($input: CreateEventInputType!) {
            createEvent(input: $input) {
              id
              slug
              title
              description
              organizers {
                id
                given_name
                username
              }
              eventCategory {
                id
                slug
                name
              }
            }
        }`,
        variables: {
            input: event,
        },
    };
};
