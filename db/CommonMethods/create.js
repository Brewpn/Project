const getCollections = require('../index');

async function createMethod({collectionName, query}) {

    async function create() {

        let result;

        try {
            const collection = (await (await getCollections(collectionName)));
            result = await collection.insert(query);

            return await result.ops[0];
        }
        catch (err) {
            throw new Error(err);
        }
    }

    return await  create();
}

module.exports = createMethod;


