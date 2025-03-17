import React from 'react';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.title}
      </span>
      <button onClick={() => onDelete(todo.id)}>
        Supprimer
      </button>
    </div>
  );
}

export default TodoItem; 