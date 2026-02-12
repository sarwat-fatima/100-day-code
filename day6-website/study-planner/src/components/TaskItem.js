export default function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div className="task">
      <span
        onClick={() => toggleTask(task.id)}
        style={{
          textDecoration: task.done ? "line-through" : "none"
        }}
      >
        {task.text}
      </span>

      <button onClick={() => deleteTask(task.id)}>❌</button>
    </div>
  );
}
