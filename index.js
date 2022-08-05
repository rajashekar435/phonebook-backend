require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require('./models/person');

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/',(request,response) =>{
    response.end('<h1>Notes app backend');
});


app.get('/api/persons',(request,response)=>{
    Person.find({}).then(result => {
        response.json(result);
    })
})


app.get('/api/persons/:id',(request, response, next)=>{

    Person.findById(request.params.id).then(person =>{
        if(person)
            response.json(person);
        else
            response.status(404).end();
    })
    .catch( error => next(error));     
});


app.get('/info',(request,response)=>{
    Person.find({}).count( (err,count) =>{
        if(err){
            console.log(error);
            response.status(500).end();
        }
        else{
            return response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `);
        }
        
    });
    
});

app.post('/api/persons',(request,response,next) =>{
    const body = request.body;

    Person.find({
        'name': {'$regex': `^${body.name}$`,$options:'i'}
    }).then(result => {
        console.log(result);
        if(result.length != 0){
            return response.status(400).json({
                error: "Name already exists. Add a unique name"
            });
        }
        else{
            const person = new Person({
                name: body.name,
                number: body.number
            })
        
            person
                    .save()
                    .then(returnedPerson =>{
                        response.json(returnedPerson);
                    })
                    .catch(error => next(error));
        }    
    }).catch(error => next(error));
})

app.delete('/api/persons/:id',(request,response,next)=>{
    
    Person.findByIdAndRemove(request.params.id)
            .then(result =>{
                if(result){
                    response.status(204).end();
                }
                else{
                    response.status(404).send({error: `Person with id ${request.params.id} not found`});
                }
            })
            .catch(error => next(error));
});


app.put('/api/persons/:id',(request,response,next) =>{
    const body = request.body;

    const person = {
        name : body.name,
        number : body.number
    };
    Person.findByIdAndUpdate(request.params.id, person, {new : true, runValidators: true, context: 'query'})
            .then( updatedPerson =>{
                if(updatedPerson)
                    response.json(updatedPerson);
                else
                    response.status(404).send({error: `Person with id ${request.params.id} not found`});
            })
            .catch(error => next(error));
    
})

const unknownEndpoint = (request, response) =>{
    response.status(400).send('Unknown endpoint');
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) =>{
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id' })
    } 
    else if(error.name === 'ValidationError'){
        return response.status(400).send({error: error.message});
    }
    next(error);
}

app.use(errorHandler);


const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
    console.log(`App started on port ${PORT}`);
})