export const loadTodos = () => {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
};

export const saveTodos = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
}; 