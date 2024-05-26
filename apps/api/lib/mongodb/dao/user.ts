import {User} from '../models';
import {UserType, UpdateUserInputType, CreateUserInputType, UserQueryParams, LoginUserInputType, JwtUserPayload, UserRole} from '../../graphql/types';
import {ErrorTypes, CustomError, KnownCommonError} from '../../utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../../constants';
import {GraphQLError} from 'graphql';

class UserDAO {
    static async create(userData: CreateUserInputType): Promise<UserType> {
        try {
            const userProps: JwtUserPayload = {
                ...userData,
                userType: UserRole.User,
                username: userData.username ?? userData.email.split('@')[0],
                email: userData.email.toLocaleLowerCase(),
                encrypted_password: await bcrypt.hash(userData.password, 10),
            };

            const jwtToken = jwt.sign(userProps, JWT_SECRET, {expiresIn: '2h'});
            const newUser = new User({...userProps, token: jwtToken});

            return await newUser.save();
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            } else {
                console.log('Error when creating a new user', error);
                throw KnownCommonError(error);
            }
        }
    }

    static async login(loginData: LoginUserInputType): Promise<UserType> {
        try {
            const user = await User.findOne({email: loginData.email});
            if (user) {
                if (await bcrypt.compare(loginData.password, user.encrypted_password)) {
                    const jwtPayload: JwtUserPayload = {...user.toObject({getters: true}), token: undefined};
                    const jwtToken = jwt.sign(jwtPayload, JWT_SECRET, {expiresIn: '2h'});
                    user.token = jwtToken;

                    console.log(user);
                    return await user.save();
                } else {
                    throw CustomError(`Email and Password do not match`, ErrorTypes.BAD_USER_INPUT);
                }
            } else {
                throw CustomError(`User with email ${loginData.email} does not exist`, ErrorTypes.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            } else {
                console.log('Error when user logging in', error);
                throw KnownCommonError(error);
            }
        }
    }

    static async readUserById(userId: string, projections?: Array<string>): Promise<UserType> {
        try {
            const query = User.findById(userId);
            if (projections && projections.length) {
                query.select(projections.join(' '));
            }
            const user = await query.exec();

            if (!user) {
                throw CustomError(`User with id ${userId} does not exist`, ErrorTypes.NOT_FOUND);
            }

            return user;
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            } else {
                console.log('Error reading user by id', error);
                throw KnownCommonError(error);
            }
        }
    }

    static async readUserByUsername(username: string, projections?: Array<string>): Promise<UserType> {
        try {
            const query = User.findOne({username});
            if (projections && projections.length) {
                query.select(projections.join(' '));
            }
            const user = await query.exec();

            if (!user) {
                throw CustomError(`User with username ${username} does not exist`, ErrorTypes.NOT_FOUND);
            }
            return user;
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            } else {
                console.log('Error reading user by username', error);
                throw KnownCommonError(error);
            }
        }
    }

    static async readUsers(queryParams?: UserQueryParams, projections?: Array<string>): Promise<Array<UserType>> {
        try {
            const query = User.find({...queryParams});

            if (queryParams?.userIDList && queryParams.userIDList.length > 0) {
                query.where('id').in(queryParams.userIDList);
            }

            if (projections && projections.length) {
                query.select(projections.join(' '));
            }

            return await query.exec();
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            } else {
                console.log('Error querying users', error);
                throw KnownCommonError(error);
            }
        }
    }

    static async updateUser(user: UpdateUserInputType) {
        try {
            let encrypted_password: string | undefined;
            if (user.password) {
                encrypted_password = await bcrypt.hash(user.password, 10);
            }
            const {id, ...updatableFields} = user;
            const updatedUser = await User.findByIdAndUpdate(user.id, {...updatableFields, encrypted_password}, {new: true}).exec();
            if (!updatedUser) {
                throw CustomError('User not found', ErrorTypes.NOT_FOUND);
            }
            return updatedUser;
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            } else {
                console.log('Error updating users', error);
                throw KnownCommonError(error);
            }
        }
    }

    static async deleteUserById(userId: string): Promise<UserType> {
        try {
            const deletedUser = await User.findByIdAndDelete(userId).exec();
            if (!deletedUser) {
                throw CustomError('User not found', ErrorTypes.NOT_FOUND);
            }
            return deletedUser;
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            } else {
                console.log(`Error deleting user with id ${userId}`, error);
                throw KnownCommonError(error);
            }
        }
    }

    static async deleteUserByEmail(email: string): Promise<UserType> {
        try {
            const deletedUser = await User.findOneAndDelete({email}).exec();
            if (!deletedUser) {
                throw CustomError('User not found', ErrorTypes.NOT_FOUND);
            }
            return deletedUser;
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            } else {
                console.log(`Error deleting user with email ${email}`, error);
                throw KnownCommonError(error);
            }
        }
    }
}

export default UserDAO;
