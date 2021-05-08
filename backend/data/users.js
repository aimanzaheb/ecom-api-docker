import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'aimanzaheb6@gmail.com',
    password: bcrypt.hashSync('123456', 10), //sync method is fine here because we are not registering or login through form
    isAdmin: true,
  },
  {
    name: 'Mannu',
    email: 'mannu@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Ankit',
    email: 'ankit@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users
