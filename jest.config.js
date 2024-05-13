module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }],
  },
  clearMocks: true,
  resetMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts,jsx,tsx}',
    '!src/**/*.d.ts',
    '!dist/**/*'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '<rootDir>/src/App.ts',
    '<rootDir>/src/infrastructure/messaging/WorkerService.ts'

  ]
};
