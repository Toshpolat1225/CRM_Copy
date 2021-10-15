const {
    Schema,
    model
} = require('mongoose')

const studentSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    payment: {
        type: Number,
        required: true,
        default: 0
    },
    muster: {
        type: Object,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    
    groupId: {
        ref: 'groups',
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = model('student', studentSchema)