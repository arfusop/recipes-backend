const {model, Schema} = requrie('mongoose')

const userSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  createdAt: String
})

module.exports = model('User', userSchema)
