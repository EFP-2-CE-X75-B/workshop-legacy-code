import React from 'react';
import { Layout } from './layouts/Layout';
import TodoPage from './pages/TodoPage';
import './assets/styles/App.css';

function App() {
  return (
    <Layout>
      <TodoPage />
    </Layout>
  );
}

export default App; 