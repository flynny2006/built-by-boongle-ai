import './App.css';
import TodoApp from './components/TodoApp';
import { Toaster } from './components/Notifications';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <TodoApp />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
