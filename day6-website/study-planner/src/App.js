import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [dark, setDark] = useState(false);

  // load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // apply theme class to entire page
  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [dark]);

  const addTask = (text) => {
    setTasks([...tasks, { id: Date.now(), text, done: false }]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completed = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;

  return (
    <div className={dark ? "app dark" : "app"}>
      <Header dark={dark} setDark={setDark} />

      <div className="progress">
        <div style={{ width: `${progress}%` }}></div>
      </div>

      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
}

export default App;
