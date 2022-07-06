export enum Stage {
    ALPHA = 'alpha',
    BETA = 'beta',
    GAMMA = 'gamma',
    PROD = 'prod',
}

export interface ServiceAccount {
    name: string;
    awsAccountId: string;
    awsRegion: string;
    stage: Stage;
}
