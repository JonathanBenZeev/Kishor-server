const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '' }) {
    try {
        // const criteria = {
        //     vendor: { $regex: filterBy.txt, $options: 'i' }
        // }
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find().toArray()
        console.log(stays);
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stays) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: ObjectId(stays) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stays}`, err)
        throw err
    }
}

async function remove(stays) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ _id: ObjectId(stays) })
        return stays
    } catch (err) {
        logger.error(`cannot remove stay ${stays}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update(stay) {
    try {
        const stayToSave = {
            inventaions: stay.inventaions
        }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: ObjectId(stay._id) }, { $set: stayToSave })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay}`, err)
        throw err
    }
}



module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}
