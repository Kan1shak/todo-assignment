const {
    TodoListManager,
    Task
} = require('../src');

const { 
    describe, 
    test, 
    expect, 
    beforeEach 
} = require('@jest/globals');

describe('TodoListManager', () => {
    let manager;

    // Runs before each test in this describe block
    beforeEach(() => {
        manager = new TodoListManager();
    });

    describe('Task Class (Basic Validation)', () => {
        test('should create a task with valid properties', () => {
            const task = new Task(1, 'Test Task', '2024-12-31');
            expect(task.id).toBe(1);
            expect(task.description).toBe('Test Task');
            expect(task.dueDate).toBe('2024-12-31');
            expect(task.completed).toBe(false);
        });

        test('should throw error for empty description', () => {
            expect(() => new Task(1, '', '2024-12-31')).toThrow('Task description cannot be empty.');
            expect(() => new Task(1, '   ', '2024-12-31')).toThrow('Task description cannot be empty.');
        });

        test('should throw error for invalid due date format', () => {
            expect(() => new Task(1, 'Valid Desc', '2024/12/31')).toThrow('Invalid or missing due date.');
            expect(() => new Task(1, 'Valid Desc', '31-12-2024')).toThrow('Invalid or missing due date.');
            expect(() => new Task(1, 'Valid Desc', '')).toThrow('Invalid or missing due date.');
        });

        test('task methods should update properties', () => {
            const task = new Task(1, 'Initial', '2024-01-01');
            task.markComplete();
            expect(task.completed).toBe(true);
            task.markIncomplete();
            expect(task.completed).toBe(false);
            task.updateDescription('Updated Desc');
            expect(task.description).toBe('Updated Desc');
            task.updateDueDate('2025-01-01');
            expect(task.dueDate).toBe('2025-01-01');
        });
    });

    describe('addTask', () => {
        test('should add a new task and assign an auto-incremented ID', () => {
            const task1 = manager.addTask('Buy groceries', '2024-08-15');
            expect(task1.id).toBe(1);
            expect(task1.description).toBe('Buy groceries');
            expect(task1.dueDate).toBe('2024-08-15');
            expect(task1.completed).toBe(false);
            expect(manager.listTasks().length).toBe(1);

            const task2 = manager.addTask('Read a book', '2024-08-20');
            expect(task2.id).toBe(2);
            expect(manager.listTasks().length).toBe(2);
        });

        test('should throw an error if description is empty', () => {
            expect(() => manager.addTask('', '2024-08-15')).toThrow('Task description cannot be empty.');
        });

        test('should throw an error if due date is invalid', () => {
            expect(() => manager.addTask('Valid task', 'invalid-date')).toThrow('Invalid or missing due date.');
        });
    });

    describe('markTaskComplete', () => {
        test('should mark an existing task as complete', () => {
            const task = manager.addTask('Learn Jest', '2024-09-01');
            const updatedTask = manager.markTaskComplete(task.id);
            expect(updatedTask.completed).toBe(true);
            expect(manager._findTaskById(task.id).completed).toBe(true);
        });

        test('should throw an error if task ID does not exist', () => {
            expect(() => manager.markTaskComplete(999)).toThrow('Task with ID 999 not found. Cannot mark as complete.');
        });
    });

    describe('markTaskIncomplete', () => {
        test('should mark an existing completed task as incomplete', () => {
            const task = manager.addTask('Write tests', '2024-09-05');
            manager.markTaskComplete(task.id); // First complete it
            expect(manager._findTaskById(task.id).completed).toBe(true);

            const updatedTask = manager.markTaskIncomplete(task.id);
            expect(updatedTask.completed).toBe(false);
            expect(manager._findTaskById(task.id).completed).toBe(false);
        });

        test('should throw an error if task ID does not exist', () => {
            expect(() => manager.markTaskIncomplete(999)).toThrow('Task with ID 999 not found. Cannot mark as incomplete.');
        });
    });

    describe('listTasks', () => {
        beforeEach(() => {
            // Setup some tasks for list tests
            manager.addTask('Task 1 (Pending)', '2024-10-01'); // id 1
            const task2 = manager.addTask('Task 2 (Completed)', '2024-10-02'); // id 2
            manager.markTaskComplete(task2.id);
            manager.addTask('Task 3 (Pending)', '2024-10-03'); // id 3
        });

        test('should list all tasks by default or with "all" filter', () => {
            expect(manager.listTasks().length).toBe(3);
            expect(manager.listTasks('all').length).toBe(3);
        });

        test('should list only completed tasks with "completed" filter', () => {
            const completedTasks = manager.listTasks('completed');
            expect(completedTasks.length).toBe(1);
            expect(completedTasks[0].description).toBe('Task 2 (Completed)');
            expect(completedTasks[0].completed).toBe(true);
        });

        test('should list only pending tasks with "pending" filter', () => {
            const pendingTasks = manager.listTasks('pending');
            expect(pendingTasks.length).toBe(2);
            expect(pendingTasks.every(task => !task.completed)).toBe(true);
        });

        test('should return an empty array if no tasks match filter', () => {
            const emptyManager = new TodoListManager();
            expect(emptyManager.listTasks('completed').length).toBe(0);
        });

        test('should throw an error for an invalid filter status', () => {
            expect(() => manager.listTasks('invalidFilter')).toThrow('Invalid filter status: "invalidFilter". Use \'all\', \'completed\', or \'pending\'.');
        });

        test('should return a copy of tasks, not a direct reference', () => {
            const tasks = manager.listTasks();
            tasks.push(new Task(99, 'Intruder', '2099-01-01')); // Modify the returned array
            expect(manager.listTasks().length).toBe(3); // Original manager's list should be unchanged
        });
    });

    describe('deleteTask', () => {
        test('should delete an existing task by ID', () => {
            const task1 = manager.addTask('Task to delete', '2024-11-01');
            manager.addTask('Another task', '2024-11-05');
            expect(manager.listTasks().length).toBe(2);

            const result = manager.deleteTask(task1.id);
            expect(result).toBe(true);
            expect(manager.listTasks().length).toBe(1);
            expect(manager._findTaskById(task1.id)).toBeUndefined();
        });

        test('should throw an error if task ID to delete does not exist', () => {
            manager.addTask('Some task', '2024-01-01');
            expect(() => manager.deleteTask(999)).toThrow('Task with ID 999 not found. Cannot delete.');
            expect(manager.listTasks().length).toBe(1); // Ensure no task was accidentally deleted
        });
    });

    describe('updateTask', () => {
        test('should update task description', () => {
            const task = manager.addTask('Old description', '2024-12-01');
            const updatedTask = manager.updateTask(task.id, { description: 'New description' });
            expect(updatedTask.description).toBe('New description');
            expect(manager._findTaskById(task.id).description).toBe('New description');
        });

        test('should update task due date', () => {
            const task = manager.addTask('A task', '2024-12-01');
            const updatedTask = manager.updateTask(task.id, { dueDate: '2025-01-15' });
            expect(updatedTask.dueDate).toBe('2025-01-15');
            expect(manager._findTaskById(task.id).dueDate).toBe('2025-01-15');
        });

        test('should update both description and due date', () => {
            const task = manager.addTask('Initial', '2024-01-01');
            const updatedTask = manager.updateTask(task.id, { description: 'Changed', dueDate: '2025-02-02' });
            expect(updatedTask.description).toBe('Changed');
            expect(updatedTask.dueDate).toBe('2025-02-02');
        });

        test('should throw error if task to update not found', () => {
            expect(() => manager.updateTask(999, { description: 'Test' })).toThrow('Task with ID 999 not found. Cannot update.');
        });

        test('should throw error for invalid new description during update', () => {
            const task = manager.addTask('Valid task', '2024-12-01');
            expect(() => manager.updateTask(task.id, { description: '' })).toThrow('New task description cannot be empty.');
        });

        test('should throw error for invalid new due date during update', () => {
            const task = manager.addTask('Valid task', '2024-12-01');
            expect(() => manager.updateTask(task.id, { dueDate: 'invalid' })).toThrow('Invalid or missing new due date.');
        });
    });

    describe('_findTaskById (internal helper)', () => {
        test('should find an existing task by ID', () => {
            const task = manager.addTask('Find me', '2024-07-07');
            const found = manager._findTaskById(task.id);
            expect(found).toBe(task);
        });

        test('should return undefined if task ID does not exist', () => {
            expect(manager._findTaskById(123)).toBeUndefined();
        });

        test('should return undefined for non-numeric ID', () => {
            expect(manager._findTaskById('abc')).toBeUndefined();
            expect(manager._findTaskById(null)).toBeUndefined();
            expect(manager._findTaskById(undefined)).toBeUndefined();
        });
    });
});