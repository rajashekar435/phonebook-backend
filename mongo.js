const mongoose = require('mongoose');

if(process.argv.length != 3 && process.argv.length != 5){
    console.log('For displaying phonebook contents please provide the password as an argument: node mongo.js <password>');
    console.log(`For adding a person to phonebook please provide the person's name and phone number as arguments: node mongo.js <password> <person-name> <person-number>`);
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.fspxm.mongodb.net/phoneBookDB?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});


const Person = mongoose.model('Person',personSchema);

mongoose
        .connect(url)
        .then(() =>{
            
            if(process.argv.length == 5){
                const person = new Person({
                    name: process.argv[3],
                    number: process.argv[4]
                })

                return person.save().then(() => {
                    console.log(`Added ${process.argv[3]} with number ${process.argv[4]} to phonebook`);
                });
                
                
            }
            else{
                return Person.find({}).then(result =>{
                    console.log("Phonebook: ")
                    result.forEach(person => console.log(`${person.name} ${person.number}`));
                })
            } 
        })
        .then(()=>{
            mongoose.connection.close();
        })
        .catch(err => console.log(err));

