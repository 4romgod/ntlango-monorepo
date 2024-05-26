import mongoose from 'mongoose';
import {CustomError, ErrorTypes} from '../exceptions';
import {ZodSchema} from 'zod';

export const validateMongodbId = (id: string, message?: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw CustomError(message || `Invalid id: ${id}`, ErrorTypes.BAD_USER_INPUT);
    }
};

export const validateInput = <Type>(schema: ZodSchema, input: Type) => {
    const {error, success} = schema.safeParse(input);
    if (!success && error) {
        const {message, path} = error.issues[0];
        throw CustomError(message, ErrorTypes.BAD_USER_INPUT, {argumentName: path[0]});
    }
};
