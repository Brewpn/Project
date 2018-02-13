const getCollections = require('../index');

async function findMethod({collectionName, query, findOnlyOne}) {

    async function get() {

        let result;

        try {
            const collection = (await (await getCollections(collectionName)));
            if (findOnlyOne) {
                result = await collection.findOne(query)
            } else {
                result = await (await collection.find(query)).toArray();
            }
            return await result;

        }
        catch (err) {
            throw new Error(err);
        }
    }

    return await  get();
}

module.exports = findMethod;