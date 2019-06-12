/**
 * Module dependencies.
 */
const util = require('util');
const OAuth2Strategy = require('passport-oauth2');
const appleSignin = require("apple-signin");
const Profile = require('./profile');


/**
 * `Strategy` constructor.
 *
 * The Apple authentication strategy authenticates requests by delegating to
 * Apple using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`           identifier of Apple Service ID
 *   - `callbackURL`        URL to which Apple will redirect the user after granting authorization
 *   - `teamId`             apple Developer Team ID.
 *   - `keyIdentifier`      identifier of private Apple key associated with clientID
 *   - `privateKeyPath`     path to private Apple key associated with clientID
 *   - `scope`              (optional) array of permission scopes to request.  valid scopes include:
 *
 * Examples:
 *
 *     passport.use(new AppleStrategy({
 *         clientID: '123-456-789',
 *         callbackURL: 'https://www.example.net/auth/apple/callback',
 *         teamId: "123456AB",
 *         keyIdentifier: 'RB1233456',
 *         privateKeyPath: path.join(__dirname, "./AuthKey_RB1233456.p8")
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://appleid.apple.com/auth/authorize';
  options.tokenURL = options.tokenURL || 'https://appleid.apple.com/auth/token';
  options.clientSecret = appleSignin.getClientSecret(options);

  OAuth2Strategy.call(this, options, verify);
  this.name = 'apple';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Bitbucket.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 * A token used to access allowed data. Currently, no data set has been defined for access.
 * https://developer.apple.com/documentation/signinwithapplerestapi/tokenresponse
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  const profile = Profile.parse({});
  done(null, profile);
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;