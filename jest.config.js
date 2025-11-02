module.exports = {
  testEnvironment: "node",
  testMatch: ["**/server/tests/**/*.test.js"],
  moduleDirectories: ["node_modules", "server", "server/utils", "server/services"],
  collectCoverageFrom: ["server/**/*.{js,jsx}", "!server/index.js", "!server/**/db/**"],
};
