document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    // Load todos on page load
    fetchTodos();

    // Add new todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = todoInput.value.trim();
        if (task) {
            addTodo(task);
            todoInput.value = '';
        }
    });

    // Fetch todos from server
    function fetchTodos() {
        fetch('/api/todos')
            .then(response => response.json())
            .then(todos => renderTodos(todos))
            .catch(error => console.error('Error:', error));
    }

    // Add new todo to server
    function addTodo(task) {
        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task })
        })
        .then(response => response.json())
        .then(todo => {
            fetchTodos(); // Refresh the list
        })
        .catch(error => console.error('Error:', error));
    }

    // Toggle todo completion status
    function toggleTodo(id) {
        fetch(`/api/todos/${id}`, {
            method: 'PUT'
        })
        .then(response => response.json())
        .then(updatedTodo => {
            fetchTodos(); // Refresh the list
        })
        .catch(error => console.error('Error:', error));
    }

    // Delete todo
    function deleteTodo(id) {
        fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchTodos(); // Refresh the list
        })
        .catch(error => console.error('Error:', error));
    }

    // Render todos to the DOM
    function renderTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            if (todo.completed) {
                li.classList.add('completed');
            }

            const span = document.createElement('span');
            span.textContent = todo.task;
            span.addEventListener('click', () => toggleTodo(todo.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
            });

            li.appendChild(span);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }
});