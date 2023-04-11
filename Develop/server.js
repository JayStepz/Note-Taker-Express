const express = require('express');
const path = require('path');
const api = require('./Develop/public/assets/js/index');
const { createNote, getNotes, deleteNote } = require('./Develop/public/assets/js/index');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', api);

app.use(express.static('./public'));

// GET route for start page
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

// POST route for creating notes
app.post('/notes', createNote);

// POST route for rendering notes
app.post('/notes', getNotes);

// POST route for deleting notes
app.delete('/notes:id', deleteNote);

app.listen(PORT, () => 
    console.log(`App is listening at http://localhost:${PORT}.`)
);