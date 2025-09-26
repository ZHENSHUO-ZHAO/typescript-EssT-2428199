enum Status {
  done = "done",
  inProgress = "in-progress",
  todo = "todo",
}

interface TodoItem {
  id: number;
  title: string;
  status: Status;
  completedOn?: Date;
}

const todoItems: TodoItem[] = [
  {
    id: 1,
    title: "Learn HTML",
    status: Status.done,
    completedOn: new Date("2021-09-11"),
  },
  { id: 2, title: "Learn TypeScript", status: Status.inProgress },
  { id: 3, title: "Write the best app in the world", status: Status.todo },
];

function addTodoItem(todo: string): TodoItem {
  const id = getNextId(todoItems);

  const newTodo = {
    id,
    title: todo,
    status: Status.todo,
  };

  todoItems.push(newTodo);

  return newTodo;
}

function getNextId<T extends { id: number }>(items: T[]): number {
  return items.reduce((max, x) => (x.id > max ? max : x.id), 0) + 1;
}

const newTodo = addTodoItem(
  "Buy lots of stuff with all the money we make from the app"
);

console.log(JSON.stringify(newTodo));
