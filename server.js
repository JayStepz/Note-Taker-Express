const express = require('express');
const fs = require('fs');
const path = require('path');
const {v4:uuidv4} = require('uuid');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('./public'));

const grabNotes = () => {
    return fs.readFile('./db/db.json', 'utf8', (err, data) => {})
    .then((notes) => [].concat(JSON.parse(notes)))
};

// GET route for start page
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, './Develop/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
);

app.get('/note', (req, res) => {
    fs.readFile('./Develop/db/db.json', 'utf8')
    .then(notes => res.json(notes))
    .catch(err => res.json(err))
});

app.post('/api/notes', ({ body }, res) => {
    grabNotes().then(oldNotes => {
        const newNotes = [...oldNotes, {title: body.title, text: body.text, id: uuidv4()}]
        console.log(newNotes);
        fs.writeFile('./Develop/db/db.json', json.stringify(newNotes))
        .then(() => res.json({message: 'Notes updated.'}))
        .catch(err => res.json(err))
    })
});

// app.delete('/api/notes:id', deleteNote);

app.listen(PORT, () => 
    console.log(`App is listening at http://localhost:${PORT}.`)
);