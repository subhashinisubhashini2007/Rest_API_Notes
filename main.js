const express = require('express');
const app = express();
const errorHandler = require('./utils/errorHandler');   

app.use(express.json());
app.use(errorHandler);

let notes =[
    {
        id: 1,
        title: 'Learn Node.js',
        content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.'
    }
]

app.get("/notes", (req, res) => {
    res.status(200).json({
        count: notes.length,
        data: notes
    });
});

app.post("/notes", (req, res, next) => {
    try{
        const { title, content } = req.body;
        if (!title || !content) {
            const error = new Error('Title and content are required');
            error.statusCode = 404;
            throw error;
        }   

        const newNote = {
            id: notes.length + 1,
            title,
            content
        };
        notes.push(newNote);
        res.status(201).json({
            message: 'Note created successfully',
            data: newNote
        });
    }
    catch (error) {
        next(error);
    }
});

app.put("/notes/:id", (req, res, next) => {
    try {
        const note = notes.find(data=>data.id===Number(req.params.id));
        if (!note) {
            const error = new Error('Note not found');
            error.statusCode = 404;
            throw error;
        }
        const { title, content } = req.body;
        note.title=title || note.title;
        note.content=content || note.content;
        res.status(200).json({
            message: 'Note updated successfully',
            data: note
        });
    }
    catch (error) {
        next(error);
    }       

});

app.delete("/notes/:id", (req, res, next) => {
    try {
        const note = notes.find(data=>data.id===Number(req.params.id));
        if (!note) {
            const error = new Error('Note not found');
            error.statusCode = 404;
            throw error;
        }   
        notes = notes.filter(data=>data.id!==Number(req.params.id));
        res.status(200).json({
            message: 'Note deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }       
});

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
