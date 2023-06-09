const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const {v4:uuidv4} = require('uuid');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('./public'));

const grabNotes = () => {
    return readFile('./db/db.json', 'utf-8')
    .then((notes) => JSON.parse(notes))
    .catch(err => {
        console.log(err);
        return [];
    });
};

// GET route for start page
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    grabNotes()
    .then(notes => res.json(notes))
    .catch(err => res.json(err))
});

app.post('/api/notes', ({ body }, res) => {
    grabNotes()
        .then(notes => {
            const newNotes = [...notes, {title: body.title, text: body.text, id: uuidv4()}]
            
            writeFile('./db/db.json', JSON.stringify(newNotes))
            .then(() => res.json(newNotes))
            .catch(err => res.json(err))
    })
});

app.delete('/api/notes:id', (req, res) => {
    grabNotes()
        .then(notes => {
            const newNotes = notes.filter(notes => notes.id !== req.params.id);
            
            writeFile('./db/db.json', JSON.stringify(newNotes))
            .then(() => res.json({message: "Note deleted."}))
            .catch(err => res.json(err))
        })
});

app.listen(PORT, () => 
    console.log(`App is listening at http://localhost:${PORT}.`)
);