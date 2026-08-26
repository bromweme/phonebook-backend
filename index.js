const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

let persons = [  
    {
      "name": "Arto Hellas",
      "number": "5134565875",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
]

app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

app.get('/info', (request, response) => {
    const time = new Date()
    console.log(request)
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${time}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
        morgan('tiny')
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }
    const isFound = persons.find(person => person.name === body.name)
    if(isFound) {
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        })
    }

    
    const id = Math.floor(Math.random() * 1000)
    const person = {
        "id": id,
        "name": body.name,
        "number": body.number,
    }
    persons = persons.concat(person)
    response.send(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})