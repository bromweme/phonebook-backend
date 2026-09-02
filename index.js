require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

const Person = require('./models/person')


app.get('/api/persons', (request, response, next) =>{
    Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const time = new Date()
    Person.find({})
    .then(persons => {
        response.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${time}</p>`
        )
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body
    if(!name || !number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }
    Person.find({name : name})
    .then(person => {
        if(person.length) {
            console.log(person)
            return response.status(400).json({
                error: 'The name already exists in the phonebook'
            }).end()
        } else {
            const person = new Person({
                name: name,
                number: number,
            })
            
            person.save().then(savedPerson => {
                return response.json(savedPerson)
            })
        }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findOneAndUpdate({"name" : name})
    .then(person => {
        if (!person) {
            return response.status(404).end()
        }
        person.name = name
        person.number = number
        person
        .save()
        .then(updatedPerson => {
            return person.save().then((updatedPerson) => {
            response.json(updatedPerson)
        })})
        .catch(error => next(error))

    })
    .catch(error => next(error))
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