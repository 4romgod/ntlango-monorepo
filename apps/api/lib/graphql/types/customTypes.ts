import {COMMON_DESCRIPTIONS} from '@/constants';
import {GraphQLScalarType} from 'graphql';

export const AnyType = new GraphQLScalarType({
    name: 'AnyType',
    description: COMMON_DESCRIPTIONS.TYPE_ANY,
    serialize(value: unknown): any {
        return value;
    },
    parseValue(value: unknown): any {
        return value;
    },
    parseLiteral(ast): any {
        return ast;
    },
});
