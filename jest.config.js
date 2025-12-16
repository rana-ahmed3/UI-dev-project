export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testPathIgnorePatterns: ['/node_modules/'],
};