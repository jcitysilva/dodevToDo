document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoPriority = document.getElementById("todo-priority");
  const todoList = document.getElementById("todo-list");
  const filterSelect = document.getElementById("filter-select");
  const searchInput = document.getElementById("search-input");
  const eraseButton = document.getElementById("erase-button");
  const clearTasksButton = document.getElementById("clear-tasks-button");
  const exportButton = document.getElementById("export-button");
  
  // Novos elementos para edição
  const editForm = document.getElementById("edit-form");
  const editInput = document.getElementById("edit-input");
  const editPriority = document.getElementById("edit-priority"); // Novo elemento select para prioridade
  const cancelEditBtn = document.getElementById("cancel-edit-btn");

  let arrayTodos = [];
  let editingTodo = null;

  function prioridadeParaNumero(prioridade) {
    switch (prioridade.toLowerCase()) {
      case 'muito baixa': return 1;
      case 'baixa': return 2;
      case 'média': return 3;
      case 'alta': return 4;
      case 'muito alta': return 5;
      default: return 0;
    }
  }

  function OrdenarAlfabeticaCrescente(array) {
    return array.sort((a, b) => a.text.localeCompare(b.text));
  }

  function OrdenarAlfabeticaDecrescente(array) {
    return array.sort((a, b) => b.text.localeCompare(a.text));
  }

  function OrdenarPrioridadeCrescente(array) {
    return array.sort((a, b) => {
      const prioridadeA = prioridadeParaNumero(a.priority);
      const prioridadeB = prioridadeParaNumero(b.priority);
      return prioridadeA - prioridadeB || a.text.localeCompare(b.text);
    });
  }

  function OrdenarPrioridadeDecrescente(array) {
    return array.sort((a, b) => {
      const prioridadeA = prioridadeParaNumero(a.priority);
      const prioridadeB = prioridadeParaNumero(b.priority);
      return prioridadeB - prioridadeA || b.text.localeCompare(a.text);
    });
  }

  function criarToDo(text, priority) {
    return { text, priority, done: false };
  }

  function adicionarToDoAoDOM(todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = todo.text;
    todoDiv.appendChild(todoTitle);

    const todoPriority = document.createElement("h3");
    todoPriority.innerText = todo.priority;
    todoDiv.appendChild(todoPriority);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todoDiv.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todoDiv.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todoDiv.appendChild(deleteBtn);

    todoList.appendChild(todoDiv);

    // Eventos dos botões
    doneBtn.addEventListener("click", () => {
      todo.done = !todo.done;
      todoDiv.classList.toggle("done");
    });

    editBtn.addEventListener("click", () => {
      editInput.value = todo.text;
      editPriority.value = todo.priority; // Atualiza o valor da prioridade
      editForm.classList.remove("hide");
      todoForm.classList.add("hide");
      editingTodo = todo;
    });

    deleteBtn.addEventListener("click", () => {
      arrayTodos = arrayTodos.filter(t => t !== todo);
      todoList.removeChild(todoDiv);
    });
  }

  function saveTodo(text, priority) {
    const todo = criarToDo(text, priority);
    arrayTodos.push(todo);
    adicionarToDoAoDOM(todo);
  }

  function filtrarTodos(query) {
    while (todoList.firstChild) {
      todoList.removeChild(todoList.firstChild);
    }

    const todosFiltrados = arrayTodos.filter((todo) => 
      todo.text.toLowerCase().includes(query.toLowerCase())
    );

    todosFiltrados.forEach((todo) => {
      adicionarToDoAoDOM(todo);
    });
  }

  function clearAllTasks() {
    arrayTodos = [];
    while (todoList.firstChild) {
      todoList.removeChild(todoList.firstChild);
    }
  }

  function exportToExcel() {
    let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    table += '<tr><th style="border: 1px solid black; padding: 5px;">Tarefa</th><th style="border: 1px solid black; padding: 5px;">Prioridade</th></tr>';
    arrayTodos.forEach(todo => {
      table += `<tr><td style="border: 1px solid black; padding: 5px;">${todo.text}</td><td style="border: 1px solid black; padding: 5px;">${todo.priority}</td></tr>`;
    });
    table += '</table>';

    const blob = new Blob([table], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo_list.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value.trim();
    const priorityValue = todoPriority.value;

    if (inputValue && priorityValue) {
      saveTodo(inputValue, priorityValue);
      todoInput.value = "";
      todoPriority.value = "Muito Baixa";
    }
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    editingTodo.text = editInput.value.trim();
    editingTodo.priority = editPriority.value;
    editForm.classList.add("hide");
    todoForm.classList.remove("hide");
    filtrarTodos(searchInput.value);
  });

  cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editForm.classList.add("hide");
    todoForm.classList.remove("hide");
  });

  filterSelect.addEventListener("change", () => {
    let sortedArray;
    switch (filterSelect.value) {
      case "alfabetica-cresc":
        sortedArray = OrdenarAlfabeticaCrescente(arrayTodos);
        break;
      case "alfabetica-decresc":
        sortedArray = OrdenarAlfabeticaDecrescente(arrayTodos);
        break;
      case "prioridade-cresc":
        sortedArray = OrdenarPrioridadeCrescente(arrayTodos);
        break;
      case "prioridade-decresc":
        sortedArray = OrdenarPrioridadeDecrescente(arrayTodos);
        break;
      default:
        sortedArray = arrayTodos;
    }

    while (todoList.firstChild) {
      todoList.removeChild(todoList.firstChild);
    }

    sortedArray.forEach((todo) => {
      adicionarToDoAoDOM(todo);
    });
  });

  searchInput.addEventListener("input", () => {
    filtrarTodos(searchInput.value);
  });

  eraseButton.addEventListener("click", () => {
    searchInput.value = "";
    filtrarTodos("");
  });

  clearTasksButton.addEventListener("click", clearAllTasks);
  exportButton.addEventListener("click", exportToExcel);
});
