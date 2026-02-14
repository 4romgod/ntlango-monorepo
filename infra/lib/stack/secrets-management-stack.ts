import { SecretValue, StackProps, Stack } from 'aws-cdk-lib';
import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { configDotenv } from 'dotenv';

configDotenv();

export class SecretsManagementStack extends Stack {
  public readonly ntlangoSecret: ISecret;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stageSegment = `${process.env.STAGE ?? 'Beta'}`.toLowerCase();

    this.ntlangoSecret = new Secret(this, 'backendSecret', {
      secretName: `ntlango/backend/${stageSegment}`,
      description: 'Ntlango backend secrets',
      secretObjectValue: {
        MONGO_DB_URL: SecretValue.unsafePlainText(process.env.MONGO_DB_URL ?? ''),
        JWT_SECRET: SecretValue.unsafePlainText(process.env.JWT_SECRET ?? ''),
      },
    });
  }
}
