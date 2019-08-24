module.exports = {
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['src/__tests__/'],
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
