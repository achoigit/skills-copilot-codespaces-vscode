// Create web server
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/comments', function(req, res) {
    fs.readFile('comments.json', 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading comments.json');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/comments', function(req, res) {
    fs.readFile('comments.json', 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading comments.json');
            return;
        }
        const comments = JSON.parse(data);
        comments.push(req.body);
        fs.writeFile('comments.json', JSON.stringify(comments, null, 2), function(err) {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing comments.json');
                return;
            }
            res.json(comments);
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// Path: public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comments</title>
    <style>
        #comments {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Comments</h1>
    <form id="comment-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">
        <label for="comment">Comment:</label>
        <textarea id="comment" name="comment"></textarea>
        <button type="submit">Submit</button>
    </form>
    <div id="comments"></div>
    <script>
        const