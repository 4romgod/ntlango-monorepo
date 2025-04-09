import {APPLICATION_STAGES} from '@ntlango/commons';
import {config} from 'dotenv';
import {GRAPHQL_API_PATH} from './constants';
config();

// Environment viriables
export const API_DOMAIN = `${process.env.API_DOMAIN}`;
export const API_PORT = `${process.env.API_PORT}`;
export const AWS_REGION = `${process.env.AWS_REGION}`;
export const STAGE = `${process.env.STAGE}`;
export const GRAPHQL_URL = (STAGE == APPLICATION_STAGES.DEV) ? `${API_DOMAIN}:${API_PORT}${GRAPHQL_API_PATH}` : `${process.env.GRAPHQL_URL}`;

// Local development environment variables
export const MONGO_DB_URL = `${process.env.MONGO_DB_URL}`;
export const JWT_SECRET = `${process.env.JWT_SECRET}`;

// Secrets
export const NTLANGO_SECRET_ARN = `${process.env.NTLANGO_SECRET_ARN}`;
