var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
    format: {
        type: String,
        required: true,
        enum: ['MCQ', 'FITB', 'TF']
    },
    public: Boolean,
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
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