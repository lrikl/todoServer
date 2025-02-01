const todoList = document.querySelector('.todo-list');
const todoInput = document.getElementById('todo-main-input');
const todoBlock = document.querySelector('.todo-block');
const deleteButtonAll = document.getElementById('del-allbtn');
let todoTasksArr = [];

onSnapshot(tasksCollection, (querySnapshot) => {
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

todoList.addEventListener('change', async event => {
    if (event.target.classList.contains('done-item')) {
        await toggleTodoCompletion(event.target);
    }
});

async function addTodo() {
    const data = {
            text: todoInput.value.trim(),
            completed: false
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

    todoItem.innerHTML = 
        `<p class='todo-p'>${task.text}</p>
        <button class='edit-item'></button>
        <input type='checkbox' class='done-item' ${task.completed ? 'checked' : ''}>
        <button class='delete-item'>X</button>`
    ;
    todoList.appendChild(todoItem);

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