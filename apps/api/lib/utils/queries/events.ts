import {EventQueryParams} from '../../graphql/types';

export type QueryParams<T> = Partial<{[K in keyof T]: T[K]}>;

export const transformReadEventsQueryParams = (queryParams?: EventQueryParams) => {
    const queryConditions: any = {};

    if (queryParams && queryParams.organizers && queryParams.organizers.length) {
        queryConditions.organizers = {$in: queryParams.organizers};
        delete queryParams.organizers;
    }

    return queryConditions;
};
