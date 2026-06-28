import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/app/**/*.spec.ts',
        'src/app/**/*.d.ts',
        'src/main.ts',
        'src/main.server.ts',
        'src/server.ts',
        'src/app/app.config.ts',
        'src/app/app.config.server.ts',
        'src/app/app.routes.ts',
      ],
    },
  },
});
