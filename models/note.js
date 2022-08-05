const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON',{
    transform : (doc, ret) =>{
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
})

mongoose.connect(url);

module.exports = mongoose.model('Person',personSchema);