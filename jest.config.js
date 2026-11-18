module.exports = {
  collectCoverageFrom: [
    'backend/src/**/*.ts',
    'frontend/src/**/*.ts',
    'shared/*/src**/*.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/shared/jest.setup.ts'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: { parser: { syntax: 'typescript', tsx: true } },
        module: { type: 'commonjs' },
      },
    ],
  },
  moduleNameMapper: {
    '^@remote-mixer/(.+)$': '<rootDir>/shared/$1/src/index.ts',
  },
}
