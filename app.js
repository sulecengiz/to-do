const form = document.querySelector("#todo-form");
const input = document.getElementById("task-input");
const todoList = document.querySelector(".list-group");
const resetButton = document.getElementById("reset");
const firstCard = document.querySelectorAll(".mb-3")[0];
const secondCard = document.querySelector(".my-3");
const deleteTodo = document.querySelector(".list-group");
const search = document.getElementById("todoSearch");
const check = document.querySelector(".list-group");

runEvents();

function runEvents() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    deleteTodo.addEventListener("click", removeToDoUI);
    resetButton.addEventListener("click", clearAllTodos);
    search.addEventListener("keyup", searchToDo);
    check.addEventListener("click", checkedToDoUI)
}

function disableFilter() {
    search.value = "";
    search.disabled = true;
}

function searchToDo(e) {
    const filterValue = e.target.value.toLowerCase().trim();
    const todoListesi = document.querySelectorAll(".list-group-item");
    if (todoListesi.length > 0) {
        todoListesi.forEach(function (todo) {
            if (todo.textContent.toLowerCase().trim().includes(filterValue)) {
                todo.setAttribute("style", "display : block");
            } else {
                todo.setAttribute("style", "display : none !important");
            }
        });
    }

    if (todoList.children.length === 0)
        disableFilter();
}

function removeToDoFromStorage(e) {
    const removeItem = e.target;
    if (removeItem.className === "fa fa-trash text-danger") {
        const prevItem = removeItem.parentElement.parentElement;
        const text = prevItem.firstChild.textContent.trim(); // silinecek todo'nun text'i

        let todos = checkTodosFromStorage();
        todos = todos.filter(todo => todo.text !== text);
        localStorage.setItem("todos", JSON.stringify(todos));
        prevItem.remove();
    }
    if (todoList.children.length === 0)
        disableFilter();
}

function removeToDoUI(e) {
    const removeItem = e.target;
    if (removeItem.className === "fa fa-trash text-danger") {
        removeToDoFromStorage(e);
    }
    if (todoList.children.length === 0)
        disableFilter();
}

function checkedToDoUI(e) {
    const checkItem = e.target;
    if (checkItem.className === "fa fa-check text-success") {
        const li = checkItem.parentElement.parentElement;
        const text = li.firstChild.textContent.trim();

        let todos = checkTodosFromStorage();
        todos = todos.map(todo => {
            if (todo.text === text) {
                todo.completed = !todo.completed; // durum tersine çevrilir
            }
            return todo;
        });

        localStorage.setItem("todos", JSON.stringify(todos));

        li.style.color = todos.find(t => t.text === text).completed ? "gray" : "black";
        li.style.textDecoration = todos.find(t => t.text === text).completed ? "line-through" : "none";
        li.style.backgroundColor = todos.find(t => t.text === text).completed ? "#e0e4e49a" : "white";
    }
}

function checkedToDoFromStorage(e) {
    let todos = [];
    if (localStorage.getItem("todos")) {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodo(e) {
    const inputText = input.value.trim();
    const priorityValue = document.getElementById("priority").value;
    if (inputText === "" || inputText === null) {
        showAlert("danger", "Please enter a todo item.");
    } else {
        const newTodoObj = {
            text: inputText,
            completed: false,
            priority: priorityValue
        };
        addTodoToUI(newTodoObj);
        addTodoToStorage(newTodoObj);
        showAlert("success", "Todo item added successfully.");
    }
    search.disabled = false;
    e.preventDefault();
}


function addTodoToStorage(newTodo) {
    let todos = checkTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));

}


function addTodoToUI(newTodo) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    listItem.textContent = newTodo.text;

    if (newTodo.priority === "high")
        listItem.style.borderLeft = "10px solid rgba(147, 81, 255, 0.9)";
    else if (newTodo.priority === "medium")
        listItem.style.borderLeft = "10px solid rgba(102, 148, 248, 0.75)";
    else
        listItem.style.borderLeft = "10px solid rgba(243, 178, 245, 1)";

    if (newTodo.completed) {
        listItem.style.color = "gray";
        listItem.style.textDecoration = "line-through";
        listItem.style.backgroundColor = "#e0e4e49a";
    }

    const span = document.createElement("span");
    span.innerHTML = `
        <i class="fa fa-check text-success" aria-hidden="true"></i>
        <i class="fa fa-trash text-danger" aria-hidden="true"></i>
    `;
    listItem.appendChild(span);
    todoList.appendChild(listItem);
    input.value = "";


}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    secondCard.appendChild(alert);
    setTimeout(function () {
        alert.remove();
    }, 2500);

}

function clearAllTodos() {
    if (confirm("Are you sure you want to clear all todos?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
        disableFilter();
    }

}

function checkTodosFromStorage() {
    let todos = [];
    if (localStorage.getItem("todos")) {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function pageLoaded() {
    let todos = checkTodosFromStorage();
    todos.forEach(function (todo) {
        addTodoToUI(todo);
    });
    if (todoList.children.length === 0)
        disableFilter();
}