import {serviceName} from './constants/appConstants';
import {ServiceAccount, Stage} from './constants/interfaces';

export const ALPHA_DUB: ServiceAccount = {
    name: `${serviceName} Api Alpha Dub`,
    awsAccountId: '045383269136',
    awsRegion: 'eu-west-1',
    stage: Stage.ALPHA,
};
