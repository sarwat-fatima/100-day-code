export default function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div className="task">
      <label className="task-main">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => toggleTask(task.id)}
        />
        <span
          style={{
            textDecoration: task.done ? "line-through" : "none"
          }}
        >
          {task.text}
        </span>
      </label>

      <button
        className="icon-btn delete-btn"
        onClick={() => deleteTask(task.id)}
        aria-label={`Delete task: ${task.text}`}
        title="Delete task"
      >
        x
      </button>
    </div>
  );
}
