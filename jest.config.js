module.exports = {
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src',
  ],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['src/__tests__/', 'src/app.ts', 'src/hookTemplate.ts'],
  coverageReporters: ['text-summary', 'lcov'],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100,
  //   },
  // },
};
