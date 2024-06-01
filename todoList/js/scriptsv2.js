document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoPriority = document.getElementById("todo-priority");
  const todoList = document.getElementById("todo-list");
  const filterSelect = document.getElementById("filter-select");
  const searchInput = document.getElementById("search-input");
  const eraseButton = document.getElementById("erase-button");
  const searchForm = document.getElementById("search-form");

  const arrayTodos = [];

  // Função que converte prioridade em número para facilitar a comparação
  function prioridadeParaNumero(prioridade) {
    switch (prioridade.toLowerCase()) {
      case 'muito baixa':
        return 1;
      case 'baixa':
        return 2;
      case 'média':
        return 3;
      case 'alta':
        return 4;
      case 'muito alta':
        return 5;
      default:
        return 0;
    }
  }

  // Funções de ordenação
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
      return prioridadeB - prioridadeA || a.text.localeCompare(b.text);
    });
  }

  function criarToDoElemento(todo) {
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

    return todoDiv;
  }

  function adicionarToDoAoDOM(todo) {
    const todoElemento = criarToDoElemento(todo);
    todoList.appendChild(todoElemento);
  }

  function saveTodo(text, priority) {
    const todo = { text, priority, done: false };
    arrayTodos.push(todo);
    adicionarToDoAoDOM(todo);
  }

  function filtrarTodos(query) {
    const todosFiltrados = arrayTodos.filter((todo) => 
      todo.text.toLowerCase().includes(query.toLowerCase())
    );

    while (todoList.firstChild) {
      todoList.removeChild(todoList.firstChild);
    }

    if (todosFiltrados.length === 0 && query !== "") {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.innerText = "Nenhum resultado encontrado.";
      todoList.appendChild(noResultsMessage);
    } else {
      todosFiltrados.forEach((todo) => {
        adicionarToDoAoDOM(todo);
      });
    }
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

  filterSelect.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    let sortedTodos = [];

    switch (filterValue) {
      case "alfabetica-cresc":
        sortedTodos = OrdenarAlfabeticaCrescente(arrayTodos);
        break;
      case "alfabetica-decresc":
        sortedTodos = OrdenarAlfabeticaDecrescente(arrayTodos);
        break;
      case "prioridade-cresc":
        sortedTodos = OrdenarPrioridadeCrescente(arrayTodos);
        break;
      case "prioridade-decresc":
        sortedTodos = OrdenarPrioridadeDecrescente(arrayTodos);
        break;
    }

    while (todoList.firstChild) {
      todoList.removeChild(todoList.firstChild);
    }

    sortedTodos.forEach((todo) => {
      adicionarToDoAoDOM(todo);
    });
  });

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    filtrarTodos(query);
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    filtrarTodos(query);
  });

  eraseButton.addEventListener("click", () => {
    searchInput.value = "";
    filtrarTodos("");
  });
});
