import express, {Express} from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import {MongoDbClient} from './clients';
import {API_DOMAIN, MONGO_DB_URL, API_PATH, HttpStatusCode} from './constants';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import createSchema from './graphql/schema';
import {createServer} from 'http';
import cors from 'cors';
import type {ListenOptions} from 'net';
import {GraphQLFormattedError} from 'graphql';
import {ApolloServerErrorCode} from '@apollo/server/errors';

export interface ServerContext {
    token?: string;
}

export const createGraphQlServer = async (listenOptions: ListenOptions) => {
    console.log('Creating Apollo with Express middleware server...');

    await MongoDbClient.connectToDatabase(MONGO_DB_URL);

    const expressApp: Express = express();
    expressApp.use(morgan('dev'));
    expressApp.use(bodyParser.json({limit: '50mb'}));
    expressApp.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

    const apolloServer = new ApolloServer<ServerContext>({
        schema: await createSchema(),
        plugins: [
            ApolloServerPluginDrainHttpServer({
                httpServer: createServer(expressApp),
            }),
        ],
        includeStacktraceInErrorResponses: false,
        status400ForVariableCoercionErrors: true,
        formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
            console.log(error);
            if (formattedError.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
                return {
                    ...formattedError,
                    message: "Your query doesn't match the schema. Try double-checking it!",
                };
            }
            return formattedError;
        },
    });

    console.log('Starting the apollo server...');
    await apolloServer.start();

    console.log('Adding express middleware to apollo server...');
    expressApp.use(
        API_PATH,
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({req}) => ({token: req.headers.token}),
        }),
    );

    expressApp.get('/health', (req, res) => {
        res.status(HttpStatusCode.OK).send('Okay!');
    });

    const url = `${API_DOMAIN}:${listenOptions.port}${API_PATH}`;
    const httpServer = expressApp.listen(listenOptions.port, () => {
        console.log(`⚡️[server]: Server is running at ${url}`);
        expressApp.emit('appInitialized');
    });
    console.log('Server has been created!');
    return {url, expressApp, apolloServer, httpServer};
};
