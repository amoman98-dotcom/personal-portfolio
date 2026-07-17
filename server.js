const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/projects', (req, res) => {
    fs.readFile(path.join(__dirname, 'projects.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read projects data' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    const messagesPath = path.join(__dirname, 'messages.json');

    fs.readFile(messagesPath, 'utf8', (err, data) => {
        let messages = [];
        if (!err && data) {
            messages = JSON.parse(data);
        }

        messages.push(newMessage);

        fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Failed to store message' });
            }
            res.status(201).json({ success: true, message: 'Message stored successfully!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});