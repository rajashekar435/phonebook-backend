const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

const phoneNumberValidator = number => /^(\d{8,})|(\d{2,3}-\d{7,})$/.test(number);
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        validate : phoneNumberValidator
    }
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