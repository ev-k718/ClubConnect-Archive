import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: "node",
  preset: "ts-jest",
  detectOpenHandles: true,
  testTimeout: 10000,
  collectCoverage: false,
  transform: {},
};

export default jestConfig;
