import {MongoDbClient} from '../clients';
import {IEvent, IUser} from '../interface';
import {EventDAO, UserDAO} from '../mongodb/dao';
import {usersMockData, eventsMockData} from '../mongodb/mockData';
import {MONGO_DB_URL} from '../constants';

async function seedUsers(users: Array<IUser>) {
    for (const user of users) {
        await UserDAO.create({
            ...user,
            password: 'randomPassword',
            createdAt: undefined,
            updatedAt: undefined,
        });
    }
}

async function seedEvents(events: Array<IEvent>, userIds: Array<string>) {
    for (const event of events) {
        const randomIndex1 = Math.floor(Math.random() * 4);
        const randomIndex2 = Math.floor(Math.random() * 4);
        const randomIndex3 = Math.floor(Math.random() * 4);
        const randomIndex4 = Math.floor(Math.random() * 4);

        await EventDAO.create({
            ...event,
            organizers: [userIds.at(randomIndex1)!, userIds.at(randomIndex2)!],
            rSVPs: [userIds.at(randomIndex3)!, userIds.at(randomIndex4)!],
            createdAt: undefined,
            updatedAt: undefined,
        });
    }
}

async function main() {
    await MongoDbClient.connectToDatabase(MONGO_DB_URL);
    await seedUsers(usersMockData);

    const allUserIds = (await UserDAO.readUsers()).map((user) => user.id!);

    await seedEvents(eventsMockData, allUserIds);
    await MongoDbClient.disconnectFromDatabase();
}

main().catch((err) => {
    console.error('An error occurred while attempting to seed the database:', err);
});
