/**
 * Parse profile.
 *
 * References:
 *
 * @param {object|string} json
 * @return {object}
 * @api public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  
  return profile;
};