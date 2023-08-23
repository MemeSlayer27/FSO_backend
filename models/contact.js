/* eslint-disable linebreak-style */
const mongoose = require('mongoose')
require('dotenv').config()


mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  // eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    validate: {
      validator: v => {
        return v.length >= 3
      },

    }
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: v => {
        return /^\d{2,3}-\d+$/.test(v)
      }
    }
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Contact', contactSchema)