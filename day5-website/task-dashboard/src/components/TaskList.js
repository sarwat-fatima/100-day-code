import TaskItem from "./TaskItem";

function TaskList({ tasks, deleteTask, toggleTask }) {
  return (
    <div>
      {tasks.length === 0 && <p>No tasks yet 😴</p>}

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
