import mongoose from 'mongoose';
import {CustomError, ErrorTypes} from '../exceptions';

export const validateMongodbId = (id: string, message?: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw CustomError(message || `Invalid id: ${id}`, ErrorTypes.BAD_USER_INPUT);
    }
};
