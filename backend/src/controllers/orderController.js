import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

//  @desc     Create new order
//  @route    POST /api/orders
//  @access   Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400) //bad request
    throw new Error('No order items')
  } else {
    const order = new Order({
      orderItems,
      user: req.userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

//  @desc     Get order by ID
//  @route    GET /api/orders/:id
//  @access   authOrder
const getOrder = (req, res) => {
  res.json(res.locals.order)
}

//  @desc     Get all orders
//  @route    GET /api/orders
//  @access   Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

//  @desc     Update order to paid
//  @route    PUT /api/orders/:id/pay
//  @access   authOrder
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = res.locals.order

  order.isPaid = true
  order.paidAt = Date.now()
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  }
  const updatedOrder = await order.save()

  res.json(updatedOrder)
})

//  @desc     Update order to delivered
//  @route    PUT /api/orders/:id/deliver
//  @access   authAdmin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = res.locals.order

  order.isDelivered = true
  order.deliveredAt = Date.now()

  const updatedOrder = await order.save()

  res.json(updatedOrder)
})

//  @desc     Get logged in user orders
//  @route    GET /api/orders/myorders
//  @access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.userId })

  if (!orders.length) {
    res.status(404)
    throw new Error('Orders not found')
  }

  res.json(orders)
})

export {
  addOrderItems,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}
