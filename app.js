const form = document.querySelector("#todo-form");
const input = document.getElementById("task-input");
const todoList = document.querySelector(".list-group");
const resetButton = document.getElementById("reset");
const firstCard = document.querySelectorAll(".mb-3")[0];
const secondCard = document.querySelector(".my-3");
const deleteTodo = document.querySelector(".list-group");
const search = document.getElementById("todoSearch");
const check = document.querySelector(".list-group");
const edit = document.querySelector(".list-group");

runEvents();

function runEvents() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    deleteTodo.addEventListener("click", removeToDoUI);
    resetButton.addEventListener("click", clearAllTodos);
    search.addEventListener("keyup", searchToDo);
    check.addEventListener("click", checkedToDoUI);
    edit.addEventListener("click", editToDoUI);

}

function editToDoUI(e) {
    const editItem = e.target;
    if (editItem.className === "fa-solid fa-pen text-primary") {
        const li = editItem.parentElement.parentElement;
        const oldText = li.firstChild.textContent.trim();

        const input = document.createElement("input");
        input.type = "text";
        input.value = oldText;
        input.className = "form-control form-control-sm";

        li.firstChild.replaceWith(input);
        input.focus();

        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault(); // form submit olmasın
                input.blur();
            }
        });

        input.addEventListener("blur", function () {
            const newText = input.value.trim() || oldText;
            li.firstChild.replaceWith(document.createTextNode(newText + " "));

            let todos = checkTodosFromStorage();
            todos = todos.map(todo => {
                if (todo.text === oldText) {
                    todo.text = newText;
                }
                return todo;
            });
            localStorage.setItem("todos", JSON.stringify(todos));
        });
        // console.log("çalıştı");
        // const prevItem = editItem.parentElement.parentElement;
        // const oldText = prevItem.firstChild.textContent.trim();
        // const newText = prompt("Edit your todo : ", oldText);
        // if (newText !== null && newText.trim() !== "") {
        //     prevItem.firstChild.textContent = newText.trim();

        //     let todos = checkTodosFromStorage();
        //     todos = todos.map(todo => {
        //         if (todo.text === oldText) {
        //             todo.text = newText.trim();
        //         }
        //         return todo;
        //     });
        //     localStorage.setItem("todos", JSON.stringify(todos));
        // } else {
        //     showAlert("danger", "eksik");
        // }
    }
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
                todo.style.setProperty("display", "flex", "important");
            } else {
                todo.style.setProperty("display", "none", "important");
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
        const span = li.querySelector("span");
        span.style.textDecoration = "none";
        li.style.backgroundColor = todos.find(t => t.text === text).completed ? "#b7b4c29a" : "rgba(255, 255, 255, 0.36)";
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
    listItem.className = "list-group-item";
    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.alignItems = "flex-start";
    listItem.style.backgroundColor = "rgba(255, 255, 255, 0.36)";
    listItem.style.padding = "10px 15px";
    listItem.style.flexWrap = "nowrap";
    listItem.style.minHeight = "auto";
    listItem.style.height = "auto";

    listItem.style.setProperty("height", "auto", "important");

    const textSpan = document.createElement("span");
    textSpan.textContent = newTodo.text;
    textSpan.style.whiteSpace = "normal";
    textSpan.style.wordWrap = "break-word";
    textSpan.style.overflowWrap = "break-word";
    textSpan.style.lineHeight = "1.5";
    textSpan.style.flex = "1";
    textSpan.style.marginRight = "10px";
    textSpan.style.minWidth = "0";
    textSpan.style.maxWidth = "calc(100% - 100px)";
    listItem.appendChild(textSpan);

    const iconSpan = document.createElement("span");
    iconSpan.innerHTML = `
        <i class="fa fa-check text-success" style="cursor: pointer; margin-right: 8px;"></i>
        <i class="fa-solid fa-pen text-primary" style="cursor: pointer; margin-right: 8px;"></i>
        <i class="fa fa-trash text-danger" style="cursor: pointer;"></i>
    `;
    iconSpan.style.display = "flex";
    iconSpan.style.alignItems = "center";
    iconSpan.style.flexShrink = "0";
    iconSpan.style.whiteSpace = "nowrap";
    listItem.appendChild(iconSpan);

    if (newTodo.priority === "high")
        listItem.style.borderLeft = "10px solid rgba(147, 81, 255, 0.9)";
    else if (newTodo.priority === "medium")
        listItem.style.borderLeft = "10px solid rgba(102, 148, 248, 0.75)";
    else
        listItem.style.borderLeft = "10px solid rgba(243, 178, 245, 1)";

    if (newTodo.completed) {
        textSpan.style.color = "gray";
        textSpan.style.textDecoration = "line-through";
        listItem.style.backgroundColor = "#b7b4c29a";
    }

    todoList.appendChild(listItem);
    input.value = "";
}

function addTodoStyles() {
    if (!document.getElementById('todo-custom-styles')) {
        const style = document.createElement('style');
        style.id = 'todo-custom-styles';
        style.textContent = `
            .list-group-item.todo-item {
                display: flex !important;
                justify-content: space-between !important;
                align-items: flex-start !important;
                flex-wrap: nowrap !important;
                height: auto !important;
                min-height: 50px !important;
                padding: 10px 15px !important;
                background-color: rgba(255, 255, 255, 0.36) !important;
            }
            
            .todo-text {
                flex: 1 !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
                white-space: normal !important;
                line-height: 1.5 !important;
                margin-right: 10px !important;
                min-width: 0 !important;
                max-width: calc(100% - 100px) !important;
            }
            
            .todo-icons {
                display: flex !important;
                align-items: center !important;
                flex-shrink: 0 !important;
                white-space: nowrap !important;
                gap: 8px !important;
            }
            
            .todo-icons i {
                cursor: pointer !important;
            }
        `;
        document.head.appendChild(style);
    }
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