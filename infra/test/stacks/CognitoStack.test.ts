import {App} from 'aws-cdk-lib';
import {Template, Match} from 'aws-cdk-lib/assertions';
import {CognitoStack} from '../../lib/stacks/CognitoStack';

let template: Template;

describe('CognitoStack', () => {
    beforeAll(() => {
        const app = new App();
        const cognitoStack = new CognitoStack(app, 'cognitoStackId');
        template = Template.fromStack(cognitoStack);
    });

    test('CognitoStack Created', () => {
        template.hasResourceProperties('AWS::Cognito::UserPool', {});
        template.resourceCountIs('AWS::Cognito::UserPool', 1);
    });
});
