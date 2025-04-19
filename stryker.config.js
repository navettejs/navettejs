export default {
  packageManager: 'yarn',
  checkers: ['typescript'],
  reporters: ['clear-text', 'progress', 'html'],
  testRunner: 'jest',
  coverageAnalysis: 'off',
  tsconfigFile: 'tsconfig.test.json',
  mutate: ['src/**/*.ts', '!src/**/*.test.ts'],
};
