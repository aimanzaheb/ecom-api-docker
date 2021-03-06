import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
// import uniqueValidator from 'mongoose-unique-validator'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //not need to regenerate hash if not updating or creating the pass
    next()
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// userSchema.plugin(uniqueValidator, {
//   message: 'Error, {VALUE} {PATH} already exists',
// })

const User = mongoose.model('User', userSchema)

export default User
