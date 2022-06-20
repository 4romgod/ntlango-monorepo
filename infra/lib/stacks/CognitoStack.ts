import { Stack, StackProps, App } from 'aws-cdk-lib';
import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
  AccountRecovery,
  StringAttribute,
} from 'aws-cdk-lib/aws-cognito';
import { CfnOutput } from 'aws-cdk-lib';
import { serviceName } from '../constants/appConstants';
import { CognitoAuthRole } from '../constructs/CognitoAuthRole';

/**
 * Documentaion https://branchv60--serverless-stack.netlify.app/chapters/configure-cognito-identity-pool-in-cdk.html
 */
export class CognitoStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, `${serviceName}UserPool`, {
      standardAttributes: {
        email: { required: true, mutable: false },
        givenName: { required: true, mutable: true },
        familyName: { required: true, mutable: false },
      },
      customAttributes: {
        isAdmin: new StringAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      autoVerify: { email: true },
      selfSignUpEnabled: true,
      signInAliases: { email: true },
    });

    const userPoolClient = new UserPoolClient(this, `${serviceName}UserPoolClient`, {
      userPool,
      generateSecret: false,
    });

    const identityPool = new CfnIdentityPool(this, `${serviceName}IdentityPool`, {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    const cognitoAuthRole = new CognitoAuthRole(this, `${serviceName}CognitoAuthRole`, {
      identityPool,
    });

    new CfnOutput(this, `${serviceName}UserPoolId`, {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, `${serviceName}UserPoolClientId`, {
      value: userPoolClient.userPoolClientId,
    });
    new CfnOutput(this, `${serviceName}IdentityPoolId`, {
      value: identityPool.ref,
    });
    new CfnOutput(this, `${serviceName}AuthRoleName`, {
      value: cognitoAuthRole.authRole.roleName,
    });
  }
};
