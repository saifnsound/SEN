var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
    format: {
        type: String,
        required: true,
        enum: ['MCQ', 'FITB', 'TF']
    },
    public: String,
    subject: {
        type: String,
        required: true,
        maxlength: 50
    },
    topic: {
        type: String,
        required: true,
        maxlength: 50
    },
    question: {
        type: String,
        required: true,
        maxlength: 500
    },
    solution: {
        type: String,
        required: true,
        maxlength: 50
    },
    difficulty: {
        type: Number,
        required: true,
        enum: [1, 2, 3]
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Question", questionSchema);