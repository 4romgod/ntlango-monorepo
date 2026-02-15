import { MongoDbClient, getConfigValue } from '@/clients';
import { SECRET_KEYS, validateEnv } from '@/constants';

let isDbConnected = false;

export const ensureDatabaseConnection = async () => {
  if (!isDbConnected) {
    validateEnv();
    const secret = await getConfigValue(SECRET_KEYS.MONGO_DB_URL);
    await MongoDbClient.connectToDatabase(secret);
    isDbConnected = true;
  }
};
