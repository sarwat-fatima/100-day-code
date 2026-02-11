function TaskItem({ task, deleteTask, toggleTask }) {
  return (
    <div className="task">
      <span
        onClick={() => toggleTask(task.id)}
        className={task.done ? "done" : ""}
      >
        {task.text}
      </span>

      <button onClick={() => deleteTask(task.id)}>
        ❌
      </button>
    </div>
  );
}

export default TaskItem;
