const Task = require('./Task');

/**
 * Manages a collection of tasks.
 */
class TodoListManager {
    constructor() {
        this.tasks = [];
        this.nextId = 1; // For auto-incrementing task IDs
    }

    /**
     * Adds a new task to the list.
     * @param {string} description - The description of the task.
     * @param {string} dueDate - The due date of the task (YYYY-MM-DD).
     * @returns {Task} The newly created task.
     * @throws {Error} If description or dueDate is invalid.
     */
    addTask(description, dueDate) {
        // Task class constructor will handle detailed validation
        try {
            const newTask = new Task(this.nextId, description, dueDate);
            this.tasks.push(newTask);
            this.nextId++;
            return newTask;
        } catch (error) {
            console.error("Error adding task:", error.message);
            throw error;
        }
    }

    /**
     * Finds a task by its ID.
     * @param {number} taskId - The ID of the task to find.
     * @returns {Task|undefined} The found task or undefined if not found.
     * @private // Indicates it's primarily for internal use, though accessible
     */
    _findTaskById(taskId) {
        if (typeof taskId !== 'number') {
            console.warn("Attempted to find task with non-numeric ID:", taskId);
            return undefined;
        }
        return this.tasks.find(task => task.id === taskId);
    }

    /**
     * Marks a task as complete.
     * @param {number} taskId - The ID of the task to mark as complete.
     * @returns {Task} The updated task.
     * @throws {Error} If the task with the given ID is not found.
     */
    markTaskComplete(taskId) {
        const task = this._findTaskById(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found. Cannot mark as complete.`);
        }
        task.markComplete();
        return task;
    }

    /**
     * Marks a task as incomplete. (Useful for toggling)
     * @param {number} taskId - The ID of the task to mark as incomplete.
     * @returns {Task} The updated task.
     * @throws {Error} If the task with the given ID is not found.
     */
    markTaskIncomplete(taskId) {
        const task = this._findTaskById(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found. Cannot mark as incomplete.`);
        }
        task.markIncomplete();
        return task;
    }


    /**
     * Lists tasks, with an option to filter by completion status.
     * @param {string} [filterStatus='all'] - Filter by 'all', 'completed', or 'pending'.
     * @returns {Task[]} An array of tasks matching the filter.
     * @throws {Error} If filterStatus is invalid.
     */
    listTasks(filterStatus = 'all') {
        switch (filterStatus.toLowerCase()) {
            case 'all':
                return [...this.tasks]; // Return a copy to prevent external modification
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            default:
                throw new Error(`Invalid filter status: "${filterStatus}". Use 'all', 'completed', or 'pending'.`);
        }
    }

    /**
     * Deletes a task by its ID.
     * @param {number} taskId - The ID of the task to delete.
     * @returns {boolean} True if the task was deleted, false otherwise (though it throws on not found).
     * @throws {Error} If the task with the given ID is not found.
     */
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error(`Task with ID ${taskId} not found. Cannot delete.`);
        }
        this.tasks.splice(taskIndex, 1);
        return true;
    }

    /**
     * Updates an existing task's description or due date.
     * @param {number} taskId - The ID of the task to update.
     * @param {object} updates - An object containing updates (e.g., { description: 'new desc', dueDate: 'YYYY-MM-DD' }).
     * @returns {Task} The updated task.
     * @throws {Error} If task not found or update parameters are invalid.
     */
    updateTask(taskId, updates) {
        const task = this._findTaskById(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found. Cannot update.`);
        }

        if (updates.hasOwnProperty('description')) {
            task.updateDescription(updates.description);
        }
        if (updates.hasOwnProperty('dueDate')) {
            task.updateDueDate(updates.dueDate);
        }
        return task;
    }
}

module.exports = TodoListManager;