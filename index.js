const express = require('express');
const morgan = require('morgan');
const app = express();

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
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
    res.json(persons);
})


app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if(person){
        res.json(person);
    }
    else{
        res.status(404).end();
    }
})


app.get('/info',(req,res)=>{(req.get('Server-Timing'));
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
})

app.post('/api/persons',(req,res) =>{
    const body = req.body;

    const generateId = ()=>{
        return Math.floor(Math.random() * 10e9);
    }

    if(!body.name || !body.number){
        return res.json({
            error: "Name or number is missing"
        })
    }

    if(persons.find(person => person.name.toLowerCase() === body.name.toLowerCase()) !== undefined){
        return res.json({
            error: "Name already exists. It must be unique"
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    res.json(person);
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



const PORT = 3001;

app.listen(PORT, ()=>{
    console.log(`App started on port ${PORT}`);
})