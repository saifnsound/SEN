var map = require("hashmap");

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

function generate(array, marksForDifficulty, marksIncrement, n, topics) {
    if (array.length >= marksForDifficulty / marksIncrement) {
        var questions = [];
        var topicsCount = [];
        var topicMap = new map();
        for (let i = 0; i < n; i++) {
            let x = {
                count: 0,
                questions: []
            }
            topicMap.set(topics[i], x);
        }
        for (let i = 0; i < array.length; i++) {
            let x = topicMap.get(array[i].topic);
            x.count++;
            x.questions.push(array[i]._id);
            topicMap.set(array[i].topic, x);
        }
        topicMap.forEach(function (value, key) {
            var x = {
                topic: key,
                count: value.count,
                questions: value.questions
            }
            topicsCount.push(x);
        });
        topicsCount.sort(function (a, b) {
            return a.count - b.count
        });
        topicsCount.forEach((topic) => {
            shuffle(topic.questions);
        })
        var marks = 0,
            index = 0;
        while (marks < marksForDifficulty) {
            if (topicsCount[index].count > 0) {
                questions.push(topicsCount[index].questions[topicsCount[index].count - 1]);
                topicsCount[index].count--;
                marks = marks + marksIncrement;
            }
            index = (index + 1) % n;
        }
        return questions;
    } else {
        return -1;
    }
}

function generateQuestions(allQuestions, newPaper, topics) {
    var easy = [],
        medium = [],
        hard = [];
    allQuestions.forEach((question) => {
        if (newPaper.format.includes(question.format) && newPaper.subject == question.subject && topics.includes(question.topic)) {
            if (question.difficulty == 1) {
                easy.push(question);
            } else if (question.difficulty == 2) {
                medium.push(question)
            } else {
                hard.push(question);
            }
        }
    });
    var n = topics.length;
    if (newPaper.difficulty == 1) {
        var easyGenerated = generate(easy, 55, 5, n, topics);
        var mediumGenerated = generate(medium, 30, 10, n, topics);
        var hardGenerated = generate(hard, 15, 15, n, topics);
    } else if (newPaper.difficulty == 2) {
        var easyGenerated = generate(easy, 45, 5, n, topics);
        var mediumGenerated = generate(medium, 40, 10, n, topics);
        var hardGenerated = generate(hard, 15, 15, n, topics);
    } else {
        var easyGenerated = generate(easy, 20, 5, n, topics);
        var mediumGenerated = generate(medium, 50, 10, n, topics);
        var hardGenerated = generate(hard, 30, 15, n, topics);
    }
    if (easyGenerated != -1 && mediumGenerated != -1 && hardGenerated != -1) {
        easyGenerated = easyGenerated.concat(mediumGenerated.concat(hardGenerated));
        return easyGenerated;
    } else {
        return -1;
    }
}

module.exports = {
    generateQuestions
}