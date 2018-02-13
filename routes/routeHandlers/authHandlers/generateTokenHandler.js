const jwt = require('jsonwebtoken');
const findMethod = require('db/CommonMethods/find');
const updateMethod = require('db/CommonMethods/update');
const ObjectID = require('mongodb').ObjectID;

exports.get = async function (req, res) {

    const collectionName = 'User';
    const findOnlyOne = true;

    const query = {_id: ObjectID(req.user._id)};

    const methodSettings = {collectionName, query, findOnlyOne};


    async function generateToken() {
        try {

            let user = await findMethod(methodSettings);
            let payloadRefreshToken = {
                _id : user._id
            };

            let parameter = {
                'google.token': jwt.sign(payloadRefreshToken, 'secret', {expiresIn: '30d'})
            };

            await updateMethod({collectionName, query, parameter});

            let payloadAccessToken = {
                Name: user.google.name,
                email: user.google.email
            };
            let accessToken = jwt.sign(payloadAccessToken, 'secret', {expiresIn: '1d'});
            return {
                user: user.google.name,
                accessToken: accessToken,
                refreshToken: parameter['google.token'],
                expiresInMinutes: 24*60
            };
        }
        catch (err) {
            res.send(err)
        }
    }

    try {
        let result = await generateToken();
        res.status(200).send(result);
    }
    catch (err){
        res.status(500).send(`error!`)
    }

};