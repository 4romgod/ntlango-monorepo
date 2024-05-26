export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHENTICATED = 401,
    UNAUTHORIZED = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

export enum STAGES {
    DEV = 'dev',
    BETA = 'beta',
    GAMMA = 'gamma',
    PROD = 'prod',
}

export const API_PATH = '/v1/graphql';

export const REGEX_PHONE_NUMBER = /^\+\d{1,3}\d{3,14}$/;
export const REGEX_DATE = /^\d{2}\/\d{2}\/\d{4}$/;
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
