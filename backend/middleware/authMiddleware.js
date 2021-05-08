import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const authToken = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET) //invalid signature exception on invalid token which will be caught by catch

      const user = await User.findById(decoded.userId).select('-password')

      req.userName = user.name
      req.userId = decoded.userId
      req.isAdmin = decoded.isAdmin
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const authAdmin = (req, res, next) => {
  if (req.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

const authOrder = asyncHandler(async (req, res, next) => {
  if (!req.isAdmin && !res.locals.order.user._id.equals(req.userId)) {
    res.status(401)
    throw new Error('Not authorized for this order')
  }

  next()
})

export { authToken, authAdmin, authOrder }
