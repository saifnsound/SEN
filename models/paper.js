var mongoose = require("mongoose");

var paperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 50
    },
    difficulty: {
        type: Number,
        required: true,
        enum: [1, 2, 3]
    },
    subject: String,
    time: String,
    topic: String,
    questions: [Object],
    questionPDF: Object,
    solutionPDF: Object,
    format: [],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Paper", paperSchema);