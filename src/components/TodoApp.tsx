import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Priority = 'low' | 'medium' | 'high';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>('low');

  // Load todos from local storage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos: Todo[] = JSON.parse(savedTodos);
        // Ensure loaded todos have a priority, default to 'low' if missing
        const todosWithPriority = parsedTodos.map(todo => ({
          ...todo,
          priority: todo.priority || 'low' as Priority // Default to 'low' if priority is undefined
        }));
        setTodos(todosWithPriority);
        toast.info("Todos loaded from local storage.");
      } catch (error) {
        console.error("Failed to parse todos from local storage:", error);
        toast.error("Failed to load todos from local storage. Starting fresh!");
        setTodos([]); // Start with an empty array on error
      }
    } else {
      toast.info("No saved todos found. Starting fresh!");
    }
  }, []);

  // Save todos to local storage whenever the todos state changes
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
      // Avoid logging on initial load if no todos were saved or if the length hasn't changed
      const savedTodosLength = JSON.parse(localStorage.getItem('todos') || '[]').length;
      if (todos.length > 0 || savedTodosLength > 0) {
         // Only show save toast if the state actually changed from the last save
         // This is a simplified check, a more robust check would compare content
         // For this example, we'll log on any state change that results in non-empty todos
         toast.info("Todos saved to local storage.");
      }
    } catch (error) {
      console.error("Failed to save todos to local storage:", error);
      toast.error("Failed to save todos to local storage.");
    }
  }, [todos]);

  const addTodo = () => {
    if (newTodoText.trim() === '') {
      toast.warning("Please enter a todo item.");
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(), // Simple unique ID
      text: newTodoText.trim(),
      completed: false,
      priority: newTodoPriority,
    };
    setTodos([...todos, newTodo]);
    setNewTodoText('');
    setNewTodoPriority('low'); // Reset priority to default after adding
    toast.success(`Added todo: "${newTodo.text}" with priority "${newTodo.priority}".`);
  };

  const toggleTodoComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    const toggledTodo = todos.find(todo => todo.id === id);
    if (toggledTodo) {
        toast.info(`${toggledTodo.text} marked as ${toggledTodo.completed ? 'incomplete' : 'complete'}.`);
    }
  };

  const deleteTodo = (id: string) => {
    const deletedTodo = todos.find(todo => todo.id === id);
    setTodos(todos.filter(todo => todo.id !== id));
    if (deletedTodo) {
        toast.error(`Deleted todo: "${deletedTodo.text}"`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const getPriorityBorderColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 dark:border-l-red-700';
      case 'medium':
        return 'border-l-orange-500 dark:border-l-orange-700';
      case 'low':
        return 'border-l-green-500 dark:border-l-green-700';
      default:
        return 'border-l-transparent';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Modern Todo App</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Add a new todo"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow"
          />
           <Select value={newTodoPriority} onValueChange={(value: Priority) => setNewTodoPriority(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTodo}>Add</Button>
        </div>

        <div className="flex flex-col gap-3">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground">No todos yet! Add one above.</p>
          ) : (
            todos.map(todo => (
              <div
                key={todo.id}
                className={cn(
                  "flex items-center justify-between p-3 border rounded-md bg-card border-l-4",
                  getPriorityBorderColor(todo.priority)
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodoComplete(todo.id)}
                  />
                  <Label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-base ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.text}
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoApp;
