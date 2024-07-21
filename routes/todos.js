const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authenticateUser = require('../middleware/authenticateToken');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           description: The title of the todo
 *         description:
 *           type: string
 *           description: The description of the todo
 *         status:
 *           type: string
 *           description: The status of the todo (e.g., pending, completed, in-progress)
 *           enum: [pending, completed, in-progress]
 *         user:
 *           type: string
 *           description: The user ID associated with the todo
 *       required:
 *         - title
 */


/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Add a new todo to the list.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request
 */
router.post('/', authenticateUser, async (req, res) => {
    const { title, description, status } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const todo = new Todo({
        title,
        description: description || '',
        status: status || 'pending',
        user: req.user._id,
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve a list of all todos.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 */
router.get('/', authenticateUser, async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     description: Retrieve a single todo by its ID.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the todo to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 */
router.get('/:id', authenticateUser,validateObjectId, getTodo, (req, res) => {
    res.json(res.todo);
});

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     description: Modify a todo's details by its ID.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the todo to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 */
router.put('/:id', authenticateUser,validateObjectId, getTodo, async (req, res) => {
    const { title, description, status } = req.body;

    if (title != null) {
        res.todo.title = title;
    }
    if (description != null) {
        res.todo.description = description;
    }
    if (status != null) {
        if (!['pending', 'completed', 'in-progress'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        res.todo.status = status;
    }

    try {
        const updatedTodo = await res.todo.save();
        res.json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     description: Remove a todo from the list by its ID.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the todo to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Invalid ID
 */
router.delete('/:id', authenticateUser,validateObjectId, getTodo, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete Todo with ID: ${id}`); // Log the ID
        const todo = await Todo.findByIdAndDelete(id);
        if (todo) {
            console.log(`Successfully deleted Todo: ${todo}`);
            res.status(200).json(todo);
        } else {
            console.log(`Todo with ID ${id} not found`);
            res.status(404).json({ "message": "Todo Record Not Found" });
        }
    } catch (error) {
        console.error(`Error during DELETE operation: ${error.message}`);
        if (error.name === "CastError") {
            res.status(400).json({ "message": "Invalid Id" });
        } else {
            res.status(400).json({ "message": "Internal Server Error", "error": error.message });
        }
    }
});

function validateObjectId(req, res, next) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Id' });
    }
    next();
}

async function getTodo(req, res, next) {
    let todo;
    try {
        todo = await Todo.findById(req.params.id);
        if (todo == null) {
            return res.status(404).json({ message: 'Cannot find todo' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
    res.todo = todo;
    next();
}

module.exports = router;
