// server/utils/index.js
exports.formatResponse = (success, message, data = null) => ({
  success,
  message,
  data,
});
