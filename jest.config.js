module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  testTimeout: 30000,
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|react-native-.*|nativewind)/)',
  ],
};
