
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')){
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
};

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);




// функции
function addTask (event) {
    // отменяем отправку формы
    event.preventDefault();

    // достаём текст из поля ввода
    const taskText = taskInput.value;

    // описали задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // добавляем объект в массив с задачей
    tasks.push(newTask);
    saveToLocalStorage();

    renderTask(newTask);
    

    // очищаем поле ввода и возвращаем на него фокус
    taskInput.value = ""; // очищаем поле ввода
    taskInput.focus();

    // 
    // if (tasksList.children.length > 1) {
    //     emptyList.classList.add('none');
    // }
    checkEmptyList();

    
};

function deleteTask (event) {
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.list-group-item');

    // определяем айди задачи, приведя его к типу числа
    const id = Number(parentNode.id);

    // находим индекс задачи в массиве
    // const index = tasks.findIndex( (task) => task.id === id);

    // удаляем задачу из массива через фильтрацию массива
    // 
    
    tasks = tasks.filter(function (task) {
        if (task.id === id) {
            return false;
        } else {
            return true;
        }
    });

    saveToLocalStorage();

    // tasks = tasks.filter((task) => task.id !== id); - можно сократить до такого вида


    parentNode.remove();
    // if (tasksList.children.length === 1) {
    //     emptyList.classList.remove('none');
    // }
    checkEmptyList();

};

function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;


    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);
    const task = tasks.find ( (task)  => task.id === id);
    task.done = !task.done //получаем ОБРАТНОЕ значение, вот так :)

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
};

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
                                    <li id="emptyList" class="list-group-item empty-list">
                                        <img src="./../img/empty.jpg" alt="Empty" class="mt-3">
                                        
                                    </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
};

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

function renderTask(task) {
    // добавляем класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // формируем разметку для новой задачи
    const taskHTML = `
                    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`

    //  добавляем задачу в список
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
