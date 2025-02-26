'use strict'

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBwwf5QsqT2NSoNdAA-54isZtwIRDLna80",
    authDomain: "todoserver-ef08e.firebaseapp.com",
    projectId: "todoserver-ef08e",
    storageBucket: "todoserver-ef08e.firebasestorage.app",
    messagingSenderId: "63186881975",
    appId: "1:63186881975:web:8b6d2ac98ca9b9cb5aec32",
    measurementId: "G-FP3EDVTTHF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCollection = collection(db, 'tasks'); 

const todoList = document.querySelector('.todo-list');
const todoInput = document.getElementById('todo-main-input');
const todoBlock = document.querySelector('.todo-block');
const deleteButtonAll = document.getElementById('del-allbtn');
let todoTasksArr = [];

onSnapshot(query(tasksCollection, orderBy('timestamp', 'asc')), (querySnapshot) => {
    todoTasksArr = [];
todoList.innerHTML = '';
querySnapshot.forEach((doc) => {
    const task = { id: doc.id, ...doc.data() };
    todoTasksArr.push(task);
        addTodoToDOM(task);
});

updateDeleteButtonAll();
});

todoBlock.addEventListener('click', async event => {
    const target = event.target;

    if (target.id === 'add-todo') {
        await addTodo();
    } else if (target.classList.contains('delete-item')) {
        await deleteTodoItem(target);
    } else if (target.classList.contains('edit-item')) {
        handleEdit(target);
    } else if (target.id === 'del-allbtn') {
    await clearAllTodos();
    }
});

todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('add-todo').click();
    }
});

todoList.addEventListener('change', async event => {
    if (event.target.classList.contains('done-item')) {
        await toggleTodoCompletion(event.target);
    }
});

async function addTodo() {
    const data = {
            text: todoInput.value.trim(),
            completed: false,
            timestamp: serverTimestamp()
        };
    if (!data.text) {
        alert('пустые поля нельзя отправить');
        return;
    }

    await addDoc(tasksCollection, data);
    todoInput.value = '';
}

function addTodoToDOM(task) {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    
    if (task.completed) {
        todoItem.classList.add('check-bg');
    }

    const taskText = document.createElement('div');
    taskText.classList.add('todo-p');
    taskText.textContent = task.text; 

    const editButton = document.createElement('button');
    editButton.classList.add('edit-item');

    const doneCheckbox = document.createElement('input');
    doneCheckbox.type = 'checkbox';
    doneCheckbox.classList.add('done-item');
    doneCheckbox.checked = task.completed;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-item');
    deleteButton.textContent = 'X';

    todoItem.appendChild(taskText);
    todoItem.appendChild(editButton);
    todoItem.appendChild(doneCheckbox);
    todoItem.appendChild(deleteButton);

    todoList.prepend(todoItem);
    todoItem.dataset.id = task.id;
}

async function deleteTodoItem(button) {
    const todoItem = button.closest('.todo-item');
    const taskId = todoItem.dataset.id;

    await deleteDoc(doc(db, 'tasks', taskId));
}

function handleEdit(button) {
    const todoItem = button.closest('.todo-item');
    const textElement = todoItem.querySelector('.todo-p');
    const currentText = textElement.textContent;
    const taskId = todoItem.dataset.id;


    toggleOtherTodoButtons(todoItem, false);

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
    editInput.classList.add('todo-input');

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('save-item');

    todoItem.replaceChild(editInput, textElement);
    todoItem.appendChild(saveButton);
    button.style.display = 'none';

    saveButton.addEventListener('click', async () => {
        const newText = editInput.value.trim();

        if (!newText) {
            alert('пустые поля нельзя отправить');
            return;
        }
        
        await updateDoc(doc(db, 'tasks', taskId), { text: newText });
        textElement.textContent = newText;
        todoItem.replaceChild(textElement, editInput);
        saveButton.remove();
        button.style.display = '';

        toggleOtherTodoButtons(todoItem, true);
    });
}

async function toggleTodoCompletion(checkbox) {
    const todoItem = checkbox.closest('.todo-item');
    const taskId = todoItem.dataset.id;

    await updateDoc(doc(db, 'tasks', taskId), { completed: checkbox.checked });
    todoItem.classList.toggle('check-bg');
}

async function clearAllTodos() {
    const taskDelet = todoTasksArr.map(task => deleteDoc(doc(db, 'tasks', task.id)));
    await Promise.all(taskDelet)
}

function updateDeleteButtonAll() {
    deleteButtonAll.style.display = todoTasksArr.length > 1 ? '' : 'none';
}

function toggleOtherTodoButtons(todoItem, visible) {
    const buttons = todoItem.querySelectorAll('.done-item, .delete-item');
    buttons.forEach(button => {
        button.style.display = visible ? '' : 'none';
    });
}

updateDeleteButtonAll();




// анонимная аутентификация

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyBwwf5QsqT2NSoNdAA-54isZtwIRDLna80",
//     authDomain: "todoserver-ef08e.firebaseapp.com",
//     projectId: "todoserver-ef08e",
//     storageBucket: "todoserver-ef08e.firebasestorage.app",
//     messagingSenderId: "63186881975",
//     appId: "1:63186881975:web:8b6d2ac98ca9b9cb5aec32",
//     measurementId: "G-FP3EDVTTHF"
// };


// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app); 
// let tasksCollection; 

// const todoList = document.querySelector('.todo-list');
// const todoInput = document.getElementById('todo-main-input');
// const todoBlock = document.querySelector('.todo-block');
// const deleteButtonAll = document.getElementById('del-allbtn');
// let todoTasksArr = [];

// // Анонимная аутентификация при загрузке страницы
// signInAnonymously(auth)
//     .then(() => {
//         // После успешной аутентификации
//         onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 //  Устанавливаем tasksCollection только после аутентификации, используя UID пользователя
//                 tasksCollection = collection(db, 'todos', user.uid, 'tasks');
//                 // Подписываемся на изменения данных
//                 subscribeToTasks(tasksCollection);
//             } else {
//                 console.log('Не удалось войти анонимно');
//             }
//         });
//     })
//     .catch((error) => {
//         console.error("Ошибка анонимной аутентификации:", error);
//     });

// // Функция для подписки на изменения tasksCollection
// function subscribeToTasks(tasksCollection) {
//     onSnapshot(query(tasksCollection, orderBy('timestamp', 'asc')), (querySnapshot) => {
//         todoTasksArr = [];
//         todoList.innerHTML = '';
//         querySnapshot.forEach((doc) => {
//             const task = { id: doc.id, ...doc.data() };
//             todoTasksArr.push(task);
//             addTodoToDOM(task);
//         });
//         updateDeleteButtonAll();
//     });
// }

// todoBlock.addEventListener('click', async event => {
//     const target = event.target;

//     if (target.id === 'add-todo') {
//         await addTodo();
//     } else if (target.classList.contains('delete-item')) {
//         await deleteTodoItem(target);
//     } else if (target.classList.contains('edit-item')) {
//         handleEdit(target);
//     } else if (target.id === 'del-allbtn') {
//         await clearAllTodos();
//     }
// });

// todoInput.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//         document.getElementById('add-todo').click();
//     }
// });

// todoList.addEventListener('change', async event => {
//     if (event.target.classList.contains('done-item')) {
//         await toggleTodoCompletion(event.target);
//     }
// });

// async function addTodo() {
//     const data = {
//         text: todoInput.value.trim(),
//         completed: false,
//         timestamp: serverTimestamp()
//     };
//     if (!data.text) {
//         alert('пустые поля нельзя отправить');
//         return;
//     }

//     await addDoc(tasksCollection, data);
//     todoInput.value = '';
// }

// function addTodoToDOM(task) {
//     const todoItem = document.createElement('li');
//     todoItem.classList.add('todo-item');
    
//     if (task.completed) {
//         todoItem.classList.add('check-bg');
//     }

//     todoItem.innerHTML = 
//         `<p class='todo-p'>${task.text}</p>
//         <button class='edit-item'></button>
//         <input type='checkbox' class='done-item' ${task.completed ? 'checked' : ''}>
//         <button class='delete-item'>X</button>`
//     ;
//     todoList.prepend(todoItem);

//     todoItem.dataset.id = task.id;
    
// }

// async function deleteTodoItem(button) {
//     const todoItem = button.closest('.todo-item');
//     const taskId = todoItem.dataset.id;

//     await deleteDoc(doc(tasksCollection.firestore, tasksCollection.path, taskId));
// }


// function handleEdit(button) {
//     const todoItem = button.closest('.todo-item');
//     const textElement = todoItem.querySelector('.todo-p');
//     const currentText = textElement.textContent;
//     const taskId = todoItem.dataset.id;


//     toggleOtherTodoButtons(todoItem, false);

//     const editInput = document.createElement('input');
//     editInput.type = 'text';
//     editInput.value = currentText;
//     editInput.classList.add('todo-input');

//     const saveButton = document.createElement('button');
//     saveButton.textContent = 'Save';
//     saveButton.classList.add('save-item');

//     todoItem.replaceChild(editInput, textElement);
//     todoItem.appendChild(saveButton);
//     button.style.display = 'none';

//     saveButton.addEventListener('click', async () => {
//         const newText = editInput.value.trim();

//         if (!newText) {
//             alert('пустые поля нельзя отправить');
//             return;
//         }
        
//         await updateDoc(doc(tasksCollection.firestore, tasksCollection.path, taskId), { text: newText });
//         textElement.textContent = newText;
//         todoItem.replaceChild(textElement, editInput);
//         saveButton.remove();
//         button.style.display = '';

//         toggleOtherTodoButtons(todoItem, true);
//     });
// }

// async function toggleTodoCompletion(checkbox) {
//     const todoItem = checkbox.closest('.todo-item');
//     const taskId = todoItem.dataset.id;

//     await updateDoc(doc(tasksCollection.firestore, tasksCollection.path, taskId), { completed: checkbox.checked });
//     todoItem.classList.toggle('check-bg');
// }

// async function clearAllTodos() {
//     const taskDelet = todoTasksArr.map(task => deleteDoc(doc(tasksCollection.firestore, tasksCollection.path, task.id)));
//     await Promise.all(taskDelet)

// }

// function updateDeleteButtonAll() {
//     deleteButtonAll.style.display = todoTasksArr.length > 1 ? '' : 'none';
// }

// function toggleOtherTodoButtons(todoItem, visible) {
//     const buttons = todoItem.querySelectorAll('.done-item, .delete-item');
//     buttons.forEach(button => {
//         button.style.display = visible ? '' : 'none';
//     });
// }

// updateDeleteButtonAll();


// rule firebase 
// {
// "rules": {
//     "todos": {
//     "$user_id": {
//         ".read": "auth != null && auth.uid == $user_id",
//         ".write": "auth != null && auth.uid == $user_id"
//     }
//     }
// }
// }