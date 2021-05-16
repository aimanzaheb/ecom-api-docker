import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//  @desc     Fetch all products
//  @route    GET /api/products
//  @access   Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i', //case insensitive
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  // res.status(401)
  // throw new Error('Not Authorized')
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

//  @desc     Fetch single product
//  @route    GET /api/products/:id
//  @access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found') //implicit & explicit exception will be handle by custom errorMiddleware because of express-async-handler

    //alternative way without express-async-handler but implicit exceptions will handle by 'default error handler' so it cant be reach to frontend
    // const error = new Error('Product not found')
    // next(error)
  }
})

//  @desc     Delete single product
//  @route    DELETE /api/products/:id
//  @access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    //if( product.user._id.equals(req.userId) ) //to delete only by that admin who created product

    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found') //implicit & explicit exception will be handle by custom errorMiddleware because of express-async-handler

    //alternative way without express-async-handler but implicit exceptions will handle by 'default error handler' so it cant be reach to frontend
    // const error = new Error('Product not found')
    // next(error)
  }
})

//  @desc     Create single product
//  @route    POST /api/products
//  @access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.userId,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

//  @desc     Update single product
//  @route    PUT /api/products/:id
//  @access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  product.name = name || product.name
  product.price = price || product.price
  product.description = description || product.desciption
  product.image = image || product.image
  product.brand = brand || product.brand
  product.category = category || product.category
  product.countInStock = countInStock || product.countInStock

  const updatedProduct = await product.save()
  res.status(201).json(updatedProduct)
})

//  @desc     Create new review
//  @route    POST /api/products/:id/reviews
//  @access   Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.userId.toString()
  )

  if (alreadyReviewed) {
    res.status(400)
    throw new Error('Product already reviewed')
  }

  const review = {
    name: req.userName,
    rating: Number(rating),
    comment,
    user: req.userId,
  }

  product.reviews.push(review)

  product.numReviews = product.reviews.length

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length

  await product.save()
  res.status(201).json({ message: 'Review Added' })
})

//  @desc     Get top rated products
//  @route    GET /api/products/top
//  @access   Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3) //-1 for descending order

  res.json(products)
})

export {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
