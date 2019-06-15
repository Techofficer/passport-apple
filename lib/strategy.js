/**
 * Module dependencies.
 */
const util = require('util');
const OAuth2Strategy = require('passport-oauth2');
const appleSignin = require("apple-signin");
const Profile = require('./profile');
const InternalOAuthError = OAuth2Strategy.InternalOAuthError;
const AuthorizationError = OAuth2Strategy.AuthorizationError;

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
	this._options = options || {};
	this._verify = verify;
	this.name = 'apple';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Authenticate request by delegating to a service provider using OAuth 2.0.
 *
 * @param {Object} req
 * @api protected
 */
OAuth2Strategy.prototype.authenticate = function(req, options) {
	var self = this;

	if (req.query && req.query.error) {
	    if (req.query.error == 'access_denied') return this.fail({ message: req.query.error_description });
	    return this.error(new AuthorizationError(req.query.error_description, req.query.error, req.query.error_uri));
	}

	const redirectUri = options.callbackURL || self._options.callbackURL;

	if (req.query && req.query.code){
		const state = req.query.state;

		function verified(error, user, info) {
			if (error) return self.error(error);
			if (!user) return self.fail(info); 

			info = info || {};
			if (state) { info.state = state; }
			self.success(user, info);
		}

		const params = {clientID: self._options.clientID, redirectUri: redirectUri, clientSecret: appleSignin.getClientSecret(self._options)};
		appleSignin.getAuthorizationToken(req.query.code, params).then(token => {
        	var idToken = token['id_token'];
        	if (!idToken) { return self.error(new Error('ID Token not present in token response')); }

        	appleSignin.verifyIdToken(idToken, self._options.clientID).then(jwtClaims => {
        		const profile = {};
        		profile.id = jwtClaims.sub;

        		self._verify(token.access_token, token.refresh_token, profile, verified);
        	}).catch(error => {
				return self.error(new InternalOAuthError('token is not verified', error));
			});
		}).catch(error => {
			return self.error(new InternalOAuthError('failed to obtain access token', error));
		});
	} else {
		let params = self._options;
		params.redirectUri = redirectUri;
		params.scope = options.scope || params.scope;
		params.state = options.state;

      	self.redirect(appleSignin.getAuthorizationUrl(self._options));
	}
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;