const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
// Creates token: body and assign req.body to it,
morgan.token('body', (req, res) => JSON.stringify(req.body))
// Custom morgan call -> Simple would be: app.use(morgan('tiny))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'))
app.use(express.json())
app.use(cors())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '1234'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '8909'
  },
  {
    id: 3,
    name: 'Dan Avramob',
    number: '1468'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '6565'
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} persons.</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  console.log(persons)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name and/or Number missing'
    })
  }

  if (persons.find((el) => el.name === body.name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.ceil(Math.random() * 100000)
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
