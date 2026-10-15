module.exports = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.js",
  ],

  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },

  moduleFileExtensions: [
    "js",
    "jsx",
  ],

  testMatch: [
    "**/tests/**/*.test.jsx",
    "**/?(*.)+(test|spec).jsx",
  ],
};