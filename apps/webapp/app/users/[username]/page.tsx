import EventBox from '@/components/events/event-box';
import { getClient } from '@/data/graphql';
import { FilterOperatorInput, GetAllEventsDocument, GetUserByUsernameDocument } from '@/data/graphql/types/graphql';
import { Person } from '@mui/icons-material';
import { Container, Typography, Avatar, Box, Divider, Grid } from '@mui/material';

export default async function UserPage({ params }: { params: { username: string } }) {
  const { data: userRetrieved } = await getClient().query({
    query: GetUserByUsernameDocument,
    variables: { username: params.username },
  });
  const user = userRetrieved.readUserByUsername;

  const { data: eventsRetrieved } = await getClient().query({
    query: GetAllEventsDocument,
    variables: {
      options: {
        filters: [
          {
            field: 'organizerList.userId',
            operator: FilterOperatorInput.Eq,
            value: user.userId,
          }
        ],
      },
    },
  });

  const events = eventsRetrieved.readEvents;

  return (
    <Container>
      <Box my={4}>
        <Box marginTop={9}>
          <Grid container spacing={5}>
            <Grid item md={3} id="event-filters" width={'100%'}>
              <Typography variant="h4" fontWeight="bold" paddingBottom={2}>
                {`${user.given_name} ${user.family_name}`}
              </Typography>
              <Divider />
              <Box marginTop={4}>
                <Avatar src={user.profile_picture || '/user-icon.png'} alt={user.username} sx={{ width: 100, height: 100 }}>
                  <Person sx={{ width: 60, height: 60 }} />
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    <b>First Name:</b> {user.given_name}
                  </Typography>
                  <Typography variant="body1">
                    <b>Second Name:</b> {user.family_name}
                  </Typography>
                  <Typography variant="body1">
                    <b>Email:</b> {user.email}
                  </Typography>
                  <Typography variant="body1">
                    <b>Gender:</b> {user.gender}
                  </Typography>
                  <Typography variant="body1">
                    <b>Birthdate:</b> {user.birthdate}
                  </Typography>
                  <Typography variant="body1">
                    <b>Address:</b> {user.address}
                  </Typography>
                  <Typography variant="body1">
                    <b>User Type:</b> {user.userRole}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item md={9} id="event-filters" width={'100%'}>
              <Typography variant="h4" fontWeight="bold" align="center" paddingBottom={2}>
                Organized Events
              </Typography>
              <Divider />
              <Box component="div">
                {events.map((event) => {
                  return (
                    <Grid item key={`EventTileGrid.${event.eventId}`} xs={12}>
                      <Box component="div">
                        <EventBox event={event} />
                      </Box>
                    </Grid>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
