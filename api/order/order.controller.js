const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const stayService = require('../stay/stay.service')
const orderService = require('./order.service')
const asyncLocalStorage = require('../../services/als.service')


async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function addOrder(req, res) {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    if (!loggedinUser) return res.status(401).send({ err: 'You must be logged in' })
    try {
        //Prepare order for  order.service to save to DB
        var order = req.body
        order = await orderService.add(order)

        //Prepare order to be sent back out
        // order.buyer = loggedinUser
        // order.stay = await stayService.getById(order.stayId)
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)
        // delete order.buyerId
        // delete order.stayId



        // const fullUser = await userService.getById(loggedinUser._id)
        res.json(order)
    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}


async function updateOrders(req, res) {

    try {

        const orders = req.body
        const updatedOrders = await orderService.updateMany(orders)
        res.json(updatedOrders)

    } catch (err) {

    }
}

async function updateOrder(req, res) {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    try {
        const order = req.body
        const updatedOrder = await orderService.update(order)


        //Update parties involved
        let otherPartyId;
        if (order.buyer._id === loggedinUser._id) {
            otherPartyId = updatedOrder.hostId;
        } else {
            otherPartyId = updatedOrder.buyerId;
        }
   
 

        res.json(updatedOrder)
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

async function deleteOrder(req, res) {
    try {
        const orderId = req.params.id
        const deletedCount = await orderService.remove(orderId)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove order' })
        }
    } catch (err) {
        logger.error('Failed to delete order', err)
        res.status(500).send({ err: 'Failed to delete order' })
    }
}

async function addOrderMsg(req, res) {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    try {
        const orderId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await orderService.addOrderMsg(orderId, msg)
        const order = await orderService.getById(orderId)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

async function removeOrderMsg(req, res) {
    try {
        const orderId = req.params.id
        const { msgId } = req.params


        const removedMsgId = await orderService.removeOrderMsg(orderId, msgId)
        console.log(removedMsgId, 'removedMsgId')
        res.send(removedMsgId)
    } catch (err) {
        logger.error('Failed to remove order msg', err)
        res.status(500).send({ err: 'Failed to remove order msg' })
    }
}






module.exports = {
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    addOrderMsg,
    removeOrderMsg,
    updateOrders

}