# Todo App
Simple todo app written in Node.js with test coverage using Jest
## Features

*   Add new tasks with a description and due date.
*   Mark tasks as complete or incomplete.
*   List all tasks, or filter by completion status (completed, pending).
*   Delete tasks by their unique ID.
*   Update existing tasks (description, due date).
*   In-memory storage for tasks.

## Project Structure

```
todo-assignment/
├── src/
│   ├── Task.js             # Task class definition
│   ├── TodoListManager.js  # TodoListManager class definition
│   └── index.js            # Main entry point/exports
├── tests/
│   └── todoListManager.test.js # Jest tests
├── .gitignore
├── package.json
└── README.md
```

## Setup and Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone https://github.com/Kan1shak/todo-assignment.git
    cd todo-assignment
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    This will install Jest, which is listed under `devDependencies`.

## Running Tests

To run the unit tests and see a coverage report:

```bash
npm test
```

This command executes Jest and looks for test files (e.g., `*.test.js`).

## Usage Example

You can use the `TodoListManager` in your Node.js applications:

```javascript
const { TodoListManager } = require('./src');

const manager = new TodoListManager();

try {
    // Add tasks
    const task1 = manager.addTask('Buy milk and eggs', '2024-08-15');
    const task2 = manager.addTask('Finish project report', '2024-08-20');
    console.log('Added task:', task1.description);

    // Mark a task as complete
    manager.markTaskComplete(task1.id);
    console.log(`Task "${task1.description}" marked as complete.`);

    // List all tasks
    console.log('\nAll Tasks:');
    manager.listTasks().forEach(task => {
        console.log(`- [${task.completed ? 'x' : ' '}] (ID: ${task.id}) ${task.description} (Due: ${task.dueDate})`);
    });

    // List pending tasks
    console.log('\nPending Tasks:');
    manager.listTasks('pending').forEach(task => {
        console.log(`- (ID: ${task.id}) ${task.description} (Due: ${task.dueDate})`);
    });

    // Update a task
    manager.updateTask(task2.id, { description: 'Finish AND REVIEW project report' });
    console.log(`\nTask "${task2.description}" updated.`);


    // Delete a task
    manager.deleteTask(task1.id);
    console.log(`\nTask with ID ${task1.id} deleted.`);

    console.log('\nTasks after deletion:');
    manager.listTasks().forEach(task => {
        console.log(`- [${task.completed ? 'x' : ' '}] (ID: ${task.id}) ${task.description} (Due: ${task.dueDate})`);
    });

} catch (error) {
    console.error('An error occurred:', error.message);
}
```

**To Run:**

1.  Save all these files in their respective locations.
2.  Open your terminal in the `todo-assignment` directory.
3.  Run `npm test`.

This should execute the Jest tests and show you the results, including a coverage report. You can also create a separate `app.js` or similar file in the root or `src` to run the usage example from the README.
