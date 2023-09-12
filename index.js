const api = 'http://localhost:3001/contact';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const server = express();
const nameRegex = /^[A-Za-z\s]+$/;

server.use(express.static('../node'));

server.listen(3001);
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));

const contacts = [
    { "name": "Filipe Cavalcante" },
    { "name": "Maria" },
    { "name": "João" },
    { "name": "Giovanna" },
];

// Lista
server.get('/contact', (req, res) => {
    return res.json(contacts);
});

// Adiciona
server.post('/contact', (req, res) => {
    const { name } = req.body;

    // Validações

    if (!nameRegex.test(name)) {
        return res.status(400).json({ error: 'Nome deve conter apenas letras e números.' });
    }

    if (name.trim() === '') {
        return res.status(400).json({ error: 'Nome é um campo obrigatório.' });
    }

    contacts.push({ "name": name });
    return res.json(contacts);
});

// Altera
server.put('/contact/:name', (req, res) => {
    const { name } = req.params;
    const { newName } = req.body;

    // Encontra o contato pelo nome
    const contactIndex = contacts.findIndex((contact) => contact.name === name);

    if (contactIndex === -1) {
        return res.status(404).json({ error: 'Contato não encontrado.' });
    }

    // Atualiza o nome do contato no índice encontrado
    contacts[contactIndex].name = newName;

    return res.json(contacts);
});


// Exclui
server.delete('/contact/:name', (req, res) => {
    const { name } = req.params;

    const contactIndex = contacts.findIndex((contact) => contact.name === name);

    if (contactIndex === -1) {
        return res.status(404).json({ error: 'Contato não encontrado.' });
    }

    contacts.splice(contactIndex, 1);
    return res.json(contacts);
});
