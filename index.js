/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const Contact = require('./models/contact')
const express = require('express')
const morgan = require('morgan')


const app = express()

morgan.token('body', (req, res) => { return JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (_request, response, next) => {

  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Contact.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})


app.get('/info', (_request, response, next) => {
  let now = new Date()

  Contact.countDocuments()
    .then(count => {
      response.send(
        `<p>phonebook has ${count} contacts</p>
        <p>${now}</p>`
      )
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name and number must be provided' })
  }

  const update = { name: name, number: number }
  const options = { upsert: true, new: true, runValidators: true }

  // Find a document with the specified name, update it if it exists or create a new one if it doesn't
  Contact.findOneAndUpdate({ name: name }, update, options)
    .then(updatedDocument => {
      response.json(updatedDocument)
    })
    .catch(error => next(error))
})



app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const update = { number: request.body.number }

  Contact.findByIdAndUpdate(id, update, { new: true })
    .then(updatedDocument => {

      response.json(updatedDocument)
    })
    .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {

  const id = request.params.id

  Contact.findByIdAndRemove(id).then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))

})

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


