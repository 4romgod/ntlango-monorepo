import type {APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context} from 'aws-lambda';
import {startServerAndCreateLambdaHandler, handlers} from '@as-integrations/aws-lambda';
import {createApolloServer} from '@/graphql';
import {getConfigValue, MongoDbClient} from '@/clients';
import {SECRET_KEYS} from '@/constants';
import { logger } from '@/utils/logger';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, token',
  'Access-Control-Max-Age': '86400',
};

export const graphqlLambdaHandler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => {
  try {
    logger.info('Lambda handler invoked');
    logger.debug(`Request ID: ${context.awsRequestId}`);
    logger.debug(`Path: ${event.path}`);
    logger.debug(`HTTP Method: ${event.httpMethod}`);
    logger.debug(`Body: ${event.body ? event.body.substring(0, 200) : 'no body'}`);
    
    // Handle CORS preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      logger.info('Handling OPTIONS preflight request');
      return {
        statusCode: 204,
        body: '',
        headers: CORS_HEADERS,
      };
    }
    
    logger.info('Creating Apollo Server with Lambda Integration...');

    const secret = await getConfigValue(SECRET_KEYS.MONGO_DB_URL);
    await MongoDbClient.connectToDatabase(secret);

    const apolloServer = await createApolloServer();

    logger.info('Starting server and creating lambda handler...');
    const lambdaHandler = startServerAndCreateLambdaHandler(apolloServer, handlers.createAPIGatewayProxyEventRequestHandler(), {
      context: async ({event, context}) => {
        return {
          token: event.headers.token,
          lambdaEvent: event,
          lambdaContext: context,
        };
      },
    });

    logger.info('Executing lambda handler...');
    const startTime = Date.now();
    const result = await lambdaHandler(event, context, callback);
    const duration = Date.now() - startTime;
    logger.info(`Lambda handler execution completed in ${duration}ms`);
    logger.debug(`Result status: ${result?.statusCode}`);
    logger.debug(`Result body length: ${result?.body?.length || 0}`);
    logger.info('Returning result to API Gateway...');
    
    // Handle case where result might be void
    if (!result) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No response from handler' }),
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      };
    }
    
    // Add CORS headers to the response
    return {
      ...result,
      headers: {
        ...(result.headers || {}),
        ...CORS_HEADERS,
      },
    };
  } catch (error) {
    logger.error('Error in lambda handler:', error);
    logger.error(`Error details: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    };
  }
};
