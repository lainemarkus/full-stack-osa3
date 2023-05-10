const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(morgan('tiny', { stream: { write: (msg) => console.log(msg.trim()) } }));
app.use(morgan(':req-body'));
app.use(cors())
app.use(requestLogger)
app.use(express.static('build'))
morgan.token('req-body', (req) => JSON.stringify(req.body));



let persons = [
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
  


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {

  const date = new Date()


  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)

})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

  response.json(person)
})

const generateId = () => {

  const randomId = Math.floor(Math.random()*100000)
  console.log(randomId)
  
  return randomId
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.headers)
  if (persons.some(person => (person.name === body.name))){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  if (persons.some(person => (person.number === body.number))){
    return response.status(400).json({ 
      error: 'number must be unique' 
    })
  }

  if (body.name === "") {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (body.number === "") {
    return response.status(400).json({
      error: 'number is missing'
    })
  }


  
  
  
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})



app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const http = require('http')


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(process.env.PORT)
  console.log(`Server running on port ${PORT}`)
})
