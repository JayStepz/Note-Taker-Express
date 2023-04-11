const express = require('express');
const util = require('util');
const fs = require('fs');
const path = require('path');
const {v4:uuidv4} = require('uuid');
const api = require('./Develop/public/assets/js/index');
const { createNote, getNotes, deleteNote } = require('./Develop/public/assets/js/index');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', api);

app.use(express.static('./public'));

const grabNotes = () => {
    return fs.readFile('./db/db.json', 'utf-8')
    .then(notes => [].concat(JSON.parse(notes)))
};

// GET route for start page
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/note', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8')
    .then(notes => res.json(notes))
    .catch(err => res.json(err))
});

app.post('/api/notes', ({ body }, res) => {
    grabNotes().then(oldNotes => {
        var newNotes = [...oldNotes, {title: body.title, text: body.text, id: uuidv4()}]

        fs.writeFile('./db/db.json', json.stringify(newNotes))
        .then(() => res.json({message: 'Notes updated.'}))
        .catch(err => res.json(err))
    })
});

app.delete('/api/notes:id', deleteNote);

app.listen(PORT, () => 
    console.log(`App is listening at http://localhost:${PORT}.`)
);