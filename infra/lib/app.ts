import {App} from 'aws-cdk-lib';
import {ALPHA_DUB} from './accounts';
import {serviceName} from './constants/appConstants';
import {CognitoStack} from './stacks/CognitoStack';

const app = new App();

new CognitoStack(app, `${serviceName}CognitoStack`, {
    env: {
        account: ALPHA_DUB.awsAccountId,
        region: ALPHA_DUB.awsRegion,
    },
});
