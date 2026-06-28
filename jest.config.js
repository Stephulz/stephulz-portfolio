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
      statements: 97,
      branches: 89,
      functions: 93,
      lines: 98,
    },
    'src/app/app.component.ts': {
      branches: 50,
    },
    'src/app/core/services/theme.service.ts': {
      branches: 80,
    },
    'src/app/core/services/translation.service.ts': {
      branches: 80,
    },
  },
};
