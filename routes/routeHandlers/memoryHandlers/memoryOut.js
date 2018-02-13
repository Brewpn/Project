const findMethod = require('../../../db/commonMethods/find');
ObjectID = require('mongodb').ObjectID;

exports.get = async function (req, res, done) {

    const collectionName = "Memory";
    const query = {owner_id: ObjectID(req.user._id)};

    const methodSettings = {collectionName, query};


    (async function () {
        try {
            const response = await findMethod(methodSettings);
            res.status(200).send(response);
        }
        catch (err) {
            res.status(500).send(err.stack)
        }

    })()

};