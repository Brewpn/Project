const createMethod = require('db/commonMethods/create');
ObjectID = require('mongodb').ObjectID;

exports.post = async function (req, res) {

    const collectionName = "Memory";
    const query = req.body.create_memory;
    const methodSettings = {collectionName, query};


    (async function () {
        try {
            const response = await createMethod(methodSettings);
            res.status(200).send(response);
        }
        catch (err) {
            res.status(500).send(err.stack)
        }

    })()

};