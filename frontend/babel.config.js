module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // ⚠️ CHECK HERE: Ensure it's 'plugins' with NO leading dot ('.') ⚠️
    plugins: [
      "nativewind/babel"
    ],
  };
};