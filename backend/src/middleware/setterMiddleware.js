import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

const setOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  ) //populating user model through userId in orderModel

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  res.locals.order = order
  next()
})

export { setOrderById }
