require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

const Person = require('./models/person')


app.get('/api/persons', (request, response) =>{
    Person.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const time = new Date()
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${time}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    Person.find(request.params.id)
        .then(notes => {
            response.json(notes)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }
    Person.find({name : body.name})
    .then(notes => {
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        })
    })
    .catch(error => next(error))

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    
    person.save().then(savedPerson => {
        return response.json(savedPerson)
    })

})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})