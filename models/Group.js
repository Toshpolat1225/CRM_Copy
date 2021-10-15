const {
    Schema,
    model
} = require('mongoose')

const groupSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    timeLesson: {
        type: Date,
        default: new Date(Date.now()).getTime()
    },
    teacherId: {
        ref: 'teacher',
        type: Schema.Types.ObjectId,
    },
})

module.exports = model('group', groupSchema)