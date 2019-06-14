# passport-appleid

Passport strategy for authenticating with Apple ID using the OAuth 2.0 API.

This module lets you authenticate using Apple ID in your Node.js applications. By plugging into Passport, Apple authentication can be easily integrated into any Node.JS application or framework that supports Connect-style middleware, including Express.

## Prerequisites
1. You should be enrolled in [Apple Developer Program](https://developer.apple.com/programs/).
2. Please have a look at [Apple documentation](
https://developer.apple.com/sign-in-with-apple/get-started/) related to "Sign in with Apple" feature.
3. You should create App ID and Service ID in your Apple Developer Account.
4. You should generate private key for your Service ID in your Apple Developer Account.

More detail about configuration can be found in [blog post](https://medium.com/@artyomefremov/add-sign-in-with-apple-button-to-your-website-today-part-1-12ed1444623a?postPublishedType=initial) and [Apple docs](https://help.apple.com/developer-account/#/dev1c0e25352).

## Installation

Install the module using [npm](http://npmjs.com):

```bash
npm install --save passport-appleid
```
## Usage

### Configure Strategy
The Apple authentication strategy authenticates users using Apple ID and OAuth 2.0 tokens. The Apple Service ID, Apple Team ID, and private key can be obtained in Apple Developer Account. The strategy also requires a verify callback, which receives the access token and optional refresh token, as well as profile which contains the authenticated user's Apple profile. The verify callback must call done providing a user to complete authentication.

```javascript
const AppleStrategy = require("passport-appleid");

passport.use(new AppleStrategy({
    clientID: APPLE_SERVICE_ID,
    callbackURL: 'https://www.example.net/auth/apple/callback',
    teamId: APPLE_TEAM_ID,
    keyIdentifier: 'RB1233456',
    privateKeyPath: path.join(__dirname, "./AuthKey_RB1233456.p8")
  }, 
  function(accessToken, refreshToken, profile, done) {
    const id = profile.id;
    User.findOrCreate(..., function (err, user) {
        done(err, user);
    });
  }
}));
```

### Authenticate Requests
Use ```passport.authenticate()```, specifying the 'apple' strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com) application:
```javascript
app.get('/auth/apple',
  passport.authenticate('apple'));

app.get('/auth/apple/callback',
  passport.authenticate('apple', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```
## Examples
Developers using the popular [Express](http://expressjs.com) web framework can refer to an [example](https://github.com/Techofficer/express-apple-signin-example) as a starting point for their own web applications. 

You can also check [live example](http://apple-auth.gotechmakers.com)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[The MIT License](https://choosealicense.com/licenses/mit/)

Copyright (c) 2019 Artem Efremov <https://gotechmakers.com>

## Support
If you have any questions or need help with integration, then you can contact me by email [efremov.artserg@gmail.com](efremov.artserg@gmail.com).