import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);

  // Load saved tasks
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      done: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  return (
    <div className="container">
      <Header />
      <TaskForm addTask={addTask} />
      <TaskList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleTask={toggleTask}
      />
    </div>
  );
}

export default App;
