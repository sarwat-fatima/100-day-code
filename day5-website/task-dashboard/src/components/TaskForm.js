import { useState } from "react";

function TaskForm({ addTask }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;

    addTask(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a task..."
      />
      <button>Add</button>
    </form>
  );
}

export default TaskForm;
