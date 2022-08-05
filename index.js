require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require('./models/note');

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

app.get('/',(req,res) =>{
    res.end('<h1>Notes app backend');
});


app.get('/api/persons',(req,res)=>{
    Person.find({}).then(result => {
        res.json(result);
    })
})


app.get('/api/persons/:id',(req,res)=>{

    const tempName = `^micheal$`;
    Person.find({
        'name': {'$regex': tempName,$options:'i'}
    }).then(result => {
        console.log(result.length);
    });
    Person.findById(req.params.id).then(person =>{
        if(person)
            res.json(person);
        else
        res.status(404).end();
    })
    .catch( () => {
        res.status(500).end();
    });     
});


app.get('/info',(req,res)=>{
    Person.find({}).count( (err,count) =>{
        if(err){
            console.log()
        }
        else{
            return res.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `);
        }
        
    });
    
});

app.post('/api/persons',(req,res) =>{
    const body = req.body;

    if(!body.name || !body.number){
        return res.status(400).json({
            error: "Name or number is missing"
        })
    }

    Person.find({
        'name': {'$regex': `^${body.name}$`,$options:'i'}
    }).then(result => {
        console.log(result);
        if(result.length != 0){
            return res.status(400).json({
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
                        res.json(returnedPerson);
                    })
                    .catch(err =>{
                        res.status(500).end();
                    })
        }    
    });
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if(person){
        persons = persons.filter(p => p.id !== person.id)
        res.status(204).end();
    }
    else{
        return res.status(400).json({
            error: `Person with id ${id} not found`
        });
    }
})



const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
    console.log(`App started on port ${PORT}`);
})