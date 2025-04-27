import type { Config } from 'jest';
import baseConfig from './jest.config';

const jestConfig: Config = {
  ...baseConfig,
  testPathIgnorePatterns: [],
};

export default jestConfig;
