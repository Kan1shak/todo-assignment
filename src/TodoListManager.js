const Task = require('./Task');

/**
 * Manages a collection of tasks.
 */
class TodoListManager {
    constructor() {
        this.tasks = [];
    }
    getTaskList(params) {
        return this.tasks.map(task => task.getTaskDetails());
    }
}
