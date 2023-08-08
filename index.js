
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')



const app = express()

morgan.token('body', (req, res) => { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())


const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {

  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id )

  if (typeof person === 'undefined') {
    response.sendStatus(404)
  } else {
    response.json(person)
  }
})



app.get('/info', (request, response) => {

  let now = new Date()
  response.send(
    `<p>phonebook has ${persons.length} contacts</p>
    <p>${now}</p>`
  )
})

app.post('/api/persons', (request, response) => {

  console.log(request.body)

  const id = (Math.random() * 10000000).floor

  const nameExists = typeof persons.find( p => p.name === request.body.name) !== 'undefined'
  const numExists = typeof persons.find( p => p.number === request.body.number) !== 'undefined'

  if (nameExists || numExists) {// continue here
    response.sendStatus(409)
  } else {
    persons.concat({...request.body, id: id})
    response.sendStatus(200)

  }
})

app.delete('/api/persons/:id', (request, response) => {

  const id = request.params.id
  persons = persons.filter( p => p.id !== id )

  response.send(200)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})