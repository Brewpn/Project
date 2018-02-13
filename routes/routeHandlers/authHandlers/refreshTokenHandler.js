const findMethod = require('db/CommonMethods/find');
const updateMethod = require('db/CommonMethods/update');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;

exports.post = function (req, res) {
    const oldRefreshToken = req.body.refreshToken;

    const collectionName = 'User';
    const findOnlyOne = true;


    jwt.verify(oldRefreshToken, 'secret', function (err, decoded) {
        if (err)
            throw new Error(err);
        const query = {_id: ObjectID(decoded._id)};
        const methodSettings = {collectionName, query, findOnlyOne};

        (async function () {
            try {
                let user = await findMethod(methodSettings);
                if (oldRefreshToken === user.google.token) {
                    let payloadRefreshToken = {
                        _id: user._id,
                    };
                    user.google.token = jwt.sign(payloadRefreshToken, 'secret', {expiresIn: '30d'});

                    await updateMethod({
                        collectionName,
                        query,
                        parameter: {
                            'google.token': user.google.token
                        }
                    });

                    let payloadAccessToken = {
                        Name: user.google.name,
                        email: user.google.email
                    };

                    let accessToken = jwt.sign(payloadAccessToken, 'secret', {expiresIn: '1d'});
                    res.json({
                        accessToken: accessToken,
                        refreshToken: user.google.token,
                        expiresInMinutes: 24 * 60
                    });
                } else res.send('Invalid ID token')

            } catch (err) {
                res
                    .status(err.status)
                    .send(err.message)
            }
        })();

        // const refreshTokenPromise = new Promise((resolve, reject) => {
        //     resolve(findMethod(methodSettings))
        // })
        //     .then(user => {
        //         return new Promise((resolve, reject) => {
        //             if (oldRefreshToken === user.google.token)
        //                 resolve(user);
        //             else
        //                 reject(new Error('Invalid refresh token'));
        //         });
        //     })
        //     .then(user => {
        //
        //         let payloadRefreshToken = {
        //             _id: user._id,
        //         };
        //
        //         user.google.token = jwt.sign(payloadRefreshToken, 'secret', {expiresIn: '30d'});
        //
        //         return (user);
        //     })
        //     .then(user => {
        //         updateMethod({
        //             collectionName,
        //             query,
        //             parameter: {
        //                 token: user.google.token
        //             }
        //         });
        //
        //         return user;
        //     })
        //     .then(user => {
        //         let payloadAccessToken = {
        //             Name: user.google.name,
        //             email: user.google.email
        //         };
        //
        //         let accessToken = jwt.sign(payloadAccessToken, 'secret', {expiresIn: '1d'});
        //         return {
        //             accessToken: accessToken,
        //             refreshToken: user.google.token,
        //             expiresInMinutes: 24 * 60
        //         };
        //     })
        //     .then(tokens => {
        //         res.json(tokens);
        //     })
        //     .catch((err) => {
        //         res
        //             .status(err.status)
        //             .send(err.message)
        //     });
    });

};