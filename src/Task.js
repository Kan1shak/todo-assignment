/**
 * Represents a single task in the to-do list.
 */
class Task {
  constructor(id, description, dueDate) {
    this.id = id;
    this.description = description;
    this.dueDate = dueDate;
    this.completed = false;
  }

  getTaskDetails() {
    return `Task: ${this.id}, Description: ${this.description}, Due Date: ${this.dueDate}`;
  }
}