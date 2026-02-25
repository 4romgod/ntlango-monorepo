import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testTimeout: 20000,
  testMatch: ['<rootDir>/test/e2e/**/*.test.[jt]s?(x)'],
  // Run all test files in parallel — tests are I/O-bound (network calls to
  // Lambda in CI) and each file uses a unique port locally, so high concurrency
  // is safe and cuts CI wall-clock time from ~13 min to ~3 min.
  maxWorkers: '100%',
  moduleNameMapper: {
    '^@/(?!test)(.*)$': '<rootDir>/lib/$1',
    '^@/test/(.*)$': '<rootDir>/test/$1',
    '^@gatherle/commons$': '<rootDir>/../../packages/commons/lib/index.ts',
    '^@gatherle/commons/(.*)$': '<rootDir>/../../packages/commons/lib/$1',
  },
  globalSetup: '<rootDir>/test/e2e/setup.ts',
  detectOpenHandles: true,
  forceExit: true,
  // Enhanced reporting for clear test results
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/test/e2e/reports',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
    [
      '<rootDir>/test/utils/summaryReporter.ts',
      {
        outputFile: '<rootDir>/test/e2e/reports/summary.txt',
      },
    ],
  ],
};

export default config;
