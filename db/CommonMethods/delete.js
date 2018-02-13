const getCollections = require('../index');

async function deleteMethod({collectionName, query, deleteOnlyOne}) {

    async function remove() {

        let result;

        try {
            const collection = (await (await getCollections(collectionName)));
                result = await collection.remove(query,  deleteOnlyOne);

            return await result;

        }
        catch (err) {
            throw new Error(err);
        }
    }

    return await  remove();
}

module.exports = deleteMethod;