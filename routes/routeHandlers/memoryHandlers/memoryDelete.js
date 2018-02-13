const deleteMethod = require('db/commonMethods/delete');
const ObjectID = require('mongodb').ObjectID;

exports.delete = async function (req, res) {

    const collectionName = "Memory";
    const delete_id = req.body.delete_id.map(item => {
        return ObjectID(item)
    });
    const query = {
        _id: {$in : delete_id}
    };

    const methodSettings = {collectionName, query};


    (async function () {
        try {
            const response = await deleteMethod(methodSettings);
            res.status(200).send(response);
        }
        catch (err) {
            res.status(500).send(err.stack)
        }

    })()

};