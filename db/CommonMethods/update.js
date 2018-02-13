const getCollections = require('../index');

async function updateMethod({collectionName, query, parameter}) {

    async function update() {

        let result;

        try {
            const collection = (await (await getCollections(collectionName)));
            result = await collection.update(query, {$set: parameter});

            return await result;
        }
        catch (err) {
            throw new Error(err);
        }
    }

    return await  update();
}

module.exports = updateMethod;