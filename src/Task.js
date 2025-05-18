/**
 * Represents a single task in the to-do list.
 */
class Task {
    /**
    * Creates a new Task instance.
    * @param {number} id - The unique identifier for the task.
    * @param {string} description - The description of the task.
    * @param {string} dueDate - The due date of the task in ISO format (YYYY-MM-DD).
    * @param {boolean} [completed=false] - Indicates whether the task is completed.
    */
    constructor(id, description, dueDate, completed = false) {
        if (!description || typeof description !== 'string' || description.trim() === '') {
            throw new Error('Task description cannot be empty.');
        }
        if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
            throw new Error('Invalid or missing due date. Expected format YYYY-MM-DD.');
        }
        this.id = id;
        this.description = description.trim();
        this.dueDate = dueDate;
        this.completed = completed;
    }
   
    /**
    * Marks the task as complete.
    */
    markComplete() {
        this.completed = true;
    }

    /**
    * Marks the task as incomplete.
    */
    markIncomplete() {
        this.completed = false;
    }

    /**
    * Updates the description of the task.
    * @param {string} newDescription - The new description for the task.
    */
    updateDescription(newDescription) {
        if (!newDescription || typeof newDescription !== 'string' || newDescription.trim() === '') {
            throw new Error('New task description cannot be empty.');
        }
        this.description = newDescription.trim();
    }

    /**
    * Updates the due date of the task.
    * @param {string} newDueDate - The new due date for the task (YYYY-MM-DD).
    */
    updateDueDate(newDueDate) {
         if (!newDueDate || !/^\d{4}-\d{2}-\d{2}$/.test(newDueDate)) {
            throw new Error('Invalid or missing new due date. Expected format YYYY-MM-DD.');
        }
        this.dueDate = newDueDate;
    }

}

module.exports = Task;