const express = require('express');
const jwt = require('jsonwebtoken');


module.exports = function (app, passport) {

    app.get('/', require('./routeHandlers/frontpage').get);


    app.get('/memories',
        passport.authenticate('bearer', {session: false}),
        require('./routeHandlers/memoryHandlers/memoryOut').get);

    app.delete('/memories',
        passport.authenticate('bearer', {session: false}),
        require('./routeHandlers/memoryHandlers/memoryDelete').delete);

    app.post('/memories',
        passport.authenticate('bearer', {session: false}),
        require('./routeHandlers/memoryHandlers/memoryCreate').post);

    ///////////////
    ///AUTH ROUTES
    /////

    // here we have rout that creates new refresh token and new access token
    app.post('/auth/refresh-token',
        require('./routeHandlers/authHandlers/refreshTokenHandler').post);

    //google auth link
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    //callback google auth
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/',
            session: false
        }), require('./routeHandlers/authHandlers/generateTokenHandler').get
    );
};
