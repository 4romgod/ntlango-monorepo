import {GRAPHQL_URL} from '@/constants';

const setup = async () => {
  console.log('\nSetting up integration tests...');
  console.log('Will be testing endpoint: ', GRAPHQL_URL);
  console.log('Done setting up integration tests!');
};

export default setup;
