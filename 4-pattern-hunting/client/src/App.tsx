import { NotificationHub } from './components/NotificationHub';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="app">
          <header className="app-header">
            <h1>Notification Hub</h1>
          </header>
          <div className="notification-container">
            <NotificationHub />
          </div>
        </div>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App; 