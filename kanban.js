export default class Kanban {
  static getTasks(columnId) {
    const data = read()[columnId];
    return data.tasks;
  }
  static insertTask(columnId, content) {
    const data = read();
    const column = data.find((column) => {
      return column.columnId == columnId;
    });

    const task = {
      taskId: Math.floor(Math.random() * 100000),
      content: content,
    };

    if (!column) {
      throw new Error("Column doesn't exist");
    }

    column.tasks.push(task);
    console.log(data);
    save(data);

    return task;
  }
  static updateTask(taskId, updatedInformation) {
    const data = read();

    function findColumnTask() {
      for (const column of data) {
        const task = column.tasks.find((item) => {
          return item.taskId == taskId;
        });

        if (task) {
          return [task, column];
        }
      }
    }

    const [task, currentColumn] = findColumnTask();

    const targetColumn = data.find((column) => {
      return column.columnId == updatedInformation.columnId;
    });
    task.content = updatedInformation.content;
    console.log(`Task is:::::::::::: ${JSON.stringify(task)}`);
    console.log(`Current column is::::::::: ${JSON.stringify(currentColumn)}`);
    currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1);

    targetColumn.tasks.push(task);

    save(data);
  }

  static deleteTask(taskId) {
    const data = read();
    for (const column of data) {
      const task = column.tasks.find((item) => {
        return item.taskId == taskId;
      });

      if (task) {
        column.tasks.splice(column.tasks.indexOf(task), 1);
      }
    }

    save(data);
  }
  static getAllTasks() {
    const data = read();
    columnCount();
    console.log(
      `getAllTasks is:::::::::: ${JSON.stringify([
        [data[0].tasks],
        [data[1].tasks],
        [data[2].tasks],
      ])}`
    );
    return [data[0].tasks, data[1].tasks, data[2].tasks];
  }
}

function read() {
  const data = localStorage.getItem("data");

  if (!data) {
    return [
      { columnId: 0, tasks: [] },
      { columnId: 1, tasks: [] },
      { columnId: 2, tasks: [] },
    ];
  }
  return JSON.parse(data);
}

function save(data) {
  localStorage.setItem("data", JSON.stringify(data));
  columnCount();
}

function columnCount() {
  const data = read();

  const todo = document.querySelector("span.todo");
  todo.textContent = data[0].tasks.length;

  const pending = document.querySelector("span.pending");
  pending.textContent = data[1].tasks.length;

  const completed = document.querySelector("span.completed");
  completed.textContent = data[2].tasks.length;
}

// console.log(Kanban.getAllTasks());
// console.log(Kanban.getTasks(1));

// Kanban.insertTask(0, "Add todo Mior");

// console.log(Kanban.deleteTask(38833));

// console.log(Kanban.getTasks(1));

// console.log(Kanban.getAllTasks());
// console.log(
//   Kanban.updateTask(97522, { columnId: 0, content: "new update text3333" })
// );
// console.log(Kanban.getAllTasks());
