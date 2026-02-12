import { useState } from "react";

export default function TaskForm({ addTask }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    addTask(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Add study task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
