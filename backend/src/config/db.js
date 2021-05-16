import mongoose from 'mongoose'

const connectDB = async () => {
  // used async because mongo db .connect, .find return promise

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }) //without these option we get errors in console

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Couldn't connect to mongo, error: ${error.message}`.red.underline.bold)
    setTimeout(connectDB, 5000)
    //process.exit(1) //1 means exit with failure
  }
}

export default connectDB
