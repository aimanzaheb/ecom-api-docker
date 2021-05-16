import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB() //witll not work without dotenv module and dotenv.config()

const importData = async () => {
  //used async because mongoose methods returns promise
  try {
    await Order.deleteMany() //delete all
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id //we know first user is admin

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser } //spread operator to return all data in product along with user
    })

    await Product.insertMany(sampleProducts)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1) //exit with failure
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1) //exit with failure
  }
}

if (process.argv[2] === '-d') {
  //-d will be passed from terminal
  destroyData()
} else {
  importData()
}
