const {
    Schema,
    model
} = require('mongoose')

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    job: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },

})

module.exports = model('teacher', teacherSchema)