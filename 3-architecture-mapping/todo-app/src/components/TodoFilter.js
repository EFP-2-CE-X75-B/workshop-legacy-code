import React from 'react';

function TodoFilter({ currentFilter, onFilterChange }) {
  return (
    <div className="todo-filter">
      <button 
        className={currentFilter === 'all' ? 'active' : ''}
        onClick={() => onFilterChange('all')}
      >
        Tous
      </button>
      <button 
        className={currentFilter === 'active' ? 'active' : ''}
        onClick={() => onFilterChange('active')}
      >
        À faire
      </button>
      <button 
        className={currentFilter === 'completed' ? 'active' : ''}
        onClick={() => onFilterChange('completed')}
      >
        Terminés
      </button>
    </div>
  );
}

export default TodoFilter; 