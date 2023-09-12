const api = 'http://localhost:3001/contact';
const list = document.getElementById('list');
const elem = document.getElementById('title');
const editModal = document.getElementById('editModal');
const editNameInput = document.getElementById('editNameInput');
const saveEditButton = document.getElementById('saveEditButton');
let contacts = [];

elem.innerHTML = 'Rodando Node.js com Webpack';

// Função para atualizar a lista de contatos
function updateContactList() {
    fetch(api, { method: 'get' })
        .then((response) => response.json())
        .then(function (data) {
            // Preenche o array 'contacts' com os contatos do servidor
            contacts = data;

            list.innerHTML = ''; // Limpa a lista antes de recriá-la
            data.forEach((contact, index) => {
                // Cria um elemento <li> para o contato
                let li = document.createElement('li');
                li.innerHTML = contact.name;

                // Cria os botões "Excluir" e "Alterar" para este contato
                createButtons(li, contact, index);

                // Adiciona o elemento <li> à lista
                list.appendChild(li);
            });
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const nameRegex = /^[A-Za-z\s]+$/;

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário
    
        const nameInput = document.querySelector('input[name="name"]');
        const newName = nameInput.value;
    
        // Validações
        if (!nameRegex.test(newName)) {
            alert('Nome deve conter apenas letras e espaços.');
            return;
        }
    
        if (newName.trim() === '') {
            alert('Nome é um campo obrigatório.');
            return;
        }
    
        if (!currentContact) {
            // Adicione o novo contato
            fetch(api, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `name=${encodeURIComponent(newName)}`,
            })
            .then((response) => response.json())
            .then(function () {
                // Atualiza a lista de contatos após a adição bem-sucedida
                updateContactList();
                // Limpa o input
                nameInput.value = '';
            })
            .catch(function (error) {
                console.error('Erro ao adicionar contato:', error);
            });
        } else {
            // Envia a solicitação PUT com o nome do contato atual e o novo nome
            fetch(`${api}/${encodeURIComponent(currentContact)}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `newName=${encodeURIComponent(newName)}`,
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro na solicitação PUT');
                }
            })
            .then(function () {
                // Atualiza a lista de contatos após o sucesso
                updateContactList();
                // Fecha a modal
                editModal.style.display = 'none';
                // Limpa o input
                nameInput.value = '';
                // Limpa a variável do contato atual
                currentContact = null;
            })
            .catch(function (error) {
                console.error('Erro ao alterar contato:', error);
            });
        }
    });

    // Chama a função para atualizar a lista de contatos ao carregar a página
    updateContactList();
});

function createButtons(li, contact, index) {
    // Cria o botão "Excluir"
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.style.cssText = 'padding: 5px 10px; margin-left: 10px; vertical-align: middle;';

    // Cria o botão "Alterar Nome" para todos os contatos
    let editButton = document.createElement('button');
    editButton.textContent = 'Alterar Nome';
    editButton.style.cssText = 'padding: 5px 10px; margin-left: 10px; vertical-align: middle;';

    editButton.addEventListener('click', function () {
        console.log('Clicou no botão Alterar Nome. Contact:', contact);
        editContact(contact.name); // Passa o nome do contato
    });  

    // Adiciona os botões "Editar" e "Excluir" ao elemento <li> do contato
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    deleteButton.addEventListener('click', function () {
        // Solicita ao servidor que exclua o contato
        fetch(`${api}/${encodeURIComponent(contact.name)}`, {
            method: 'delete',
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Analisa o JSON apenas se a resposta for bem-sucedida
                } else {
                    throw new Error('Erro na solicitação DELETE');
                }
            })
            .then(function () {
                // Atualiza a lista após a exclusão bem-sucedida
                updateContactList();
            })
            .catch(function (error) {
                console.error('Erro ao excluir contato:', error);
            });
    });
}

let currentContact = null;

function editContact(contactName) {
    console.log('Editando contato:', contactName);
    currentContact = contactName;
    editNameInput.value = contactName;
    editModal.style.display = 'block';
}

// Função para salvar a edição do contato
saveEditButton.addEventListener('click', function () {
    const newName = editNameInput.value;

    console.log('Novo nome:', newName);

    // Validação do novo nome
    if (newName === '') {
        alert('Nome é um campo obrigatório.');
        return;
    }

    if (!currentContact) {
        alert('Erro: Nenhum contato selecionado para edição.');
        return;
    }

    const oldName = currentContact;

    console.log('Nome antigo:', oldName);

    // Encontra o índice do contato atual no array 'contacts'
    const contactIndex = contacts.findIndex((contact) => contact.name === oldName);

    if (contactIndex === -1) {
        console.error('Erro: Contato não encontrado no array de contatos.');
        return;
    }

    // Atualiza o nome do contato no array
    contacts[contactIndex].name = newName;

    // Envia a solicitação PUT com o nome antigo e o novo nome
    fetch(`${api}/${encodeURIComponent(oldName)}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `newName=${encodeURIComponent(newName)}`,
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro na solicitação PUT');
        }
    })
    .then(function () {
        // Atualiza a lista de contatos após o sucesso
        updateContactList();
        // Fecha a modal
        editModal.style.display = 'none';
        // Limpa o input
        editNameInput.value = '';
        // Limpa a variável do contato atual
        currentContact = null;
    })
    .catch(function (error) {
        console.error('Erro ao alterar contato:', error);
    });
});

// Botão Cancelar da modal.
document.getElementById('cancelEditButton').addEventListener('click', function () {
    // Fecha a modal
    editModal.style.display = 'none';
    // Limpa o input
    editNameInput.value = '';
});