const { createCjsPreset } = require('jest-preset-angular/presets/index.js');
const preset = createCjsPreset({
  tsconfig: '<rootDir>/tsconfig.spec.json',
});

/** @type {import('jest').Config} */
module.exports = {
  ...preset,
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // This regex catches imports looking for the env file
    '(.*)/env$': '<rootDir>/src/app/mock/env.mock.ts',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'lcov', 'text-summary'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.d.ts',
    '!src/main.ts',
    '!src/main.server.ts',
    '!src/server.ts',
    '!src/app/app.config.ts',
    '!src/app/app.config.server.ts',
    '!src/app/app.routes.ts',
    '!src/app/core/utils/cookie.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    }
  },
};
