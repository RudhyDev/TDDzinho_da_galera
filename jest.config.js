module.exports = {
  roots : ['<rootDir>/src'],
  testEnvironment : 'node',
  tranform: {
    '.+\\.ts$':'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  }
}