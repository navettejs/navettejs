import type { Config } from 'jest';

const jestConfig: Config = {
  collectCoverage: true,
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  transform: {
    // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  testPathIgnorePatterns: ['.stryker-tmp'],
  testEnvironment: 'jsdom',
};

export default jestConfig;
