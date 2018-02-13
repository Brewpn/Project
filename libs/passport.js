const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const BearerStrategy = require('passport-http-bearer').Strategy;

const createMethod = require('../db/CommonMethods/create');
const findMethod = require('../db/CommonMethods/find');
const ObjectID = require('mongodb').ObjectID;


module.exports = function (passport) {

    const collectionName = 'User';
    const findOnlyOne = true;


    //here we have GoogleStrategy that save our user data in DB
    passport.use(new GoogleStrategy({

            clientID: process.env.clientId,
            clientSecret: process.env.clientSecret,
            callbackURL: process.env.callbackURL

        }, async function (request, token, refreshToken, profile, done) {

            const query = {'google.profileId': profile.id};
            const methodSettings = {collectionName, query, findOnlyOne};

            try {
                let user = await findMethod(methodSettings);

                let newUser = user ? user : await createMethod({
                    collectionName: 'User',
                    query: {
                        google: {
                            profileId: profile.id,
                            token: request,
                            name: profile.displayName,
                            email: profile.emails[0].value
                        }

                    }
                });

                return done(null, newUser);
            }
            catch (err) {
                return done(err);
            }
        })
    );


    // Bearer strategy that verifying access token
    passport.use(new BearerStrategy(function (token, done) {
        jwt.verify(token, 'secret', function (err, decoded) {
            if (err)
                return done(err);
            const query = {'google.email': decoded.email};
            const methodSettings = {collectionName, query, findOnlyOne};
            (async function () {
                try {
                    const user = await findMethod(methodSettings);
                    let User = user ? user : false;
                    return done(null, User)
                }
                catch (err) {
                    return done(err)
                }
            })();
        });
    }));

};