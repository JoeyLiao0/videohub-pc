module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
    transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.js$': 'babel-jest'
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: [
      '**/tests/**/*.spec.[jt]s?(x)', // 修改为你的测试文件路径和模式
    ]
  };