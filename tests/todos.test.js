const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const Todo = require('../models/Todo');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let token;
let userId;

describe('Todos API', () => {
    
    beforeAll(async () => {
        
        
       
        const user = new User({
            username: 'squbix1',
            password: await bcrypt.hash('squbix1', 10)
        });
        await user.save();
        userId = user._id;

        
        token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    
    beforeEach(async () => {
       
        await Todo.deleteMany({});
    });
    describe('GET /api/todos', () => {
        it('should retrieve all todos', async () => {
            const todo = new Todo({
                title: 'Test Todo',
                description: 'This is a test todo',
                status: 'pending',
                user: userId
            });
            await todo.save();

            const response = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].title).toBe('Test Todo');
        });
    });
    describe('GET /api/todos/:id', () => {
        it('should retrieve a todo by its ID', async () => {
            const todo = new Todo({
                title: 'Test Todo',
                description: 'This is a test todo',
                status: 'pending',
                user: userId
            });
            await todo.save();

            const response = await request(app)
                .get(`/api/todos/${todo._id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.title).toBe('Test Todo');
        });

        it('should return a 404 error for a non-existent todo', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/todos/${nonExistentId}`) // Invalid ID
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toEqual({ message: 'Cannot find todo' });
        });

        it('should return a 400 error for an invalid ID', async () => {
            const response = await request(app)
                .get('/api/todos/invalid-id') // Invalid ID format
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({ message: 'Invalid Id' });
        });
    });
    describe('PUT /api/todos/:id', () => {
        it('should update a todo by its ID', async () => {
            const todo = new Todo({
                title: 'Test Todo',
                description: 'This is a test todo',
                status: 'pending',
                user: userId
            });
            await todo.save();

            const response = await request(app)
                .put(`/api/todos/${todo._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Todo',
                    description: 'This is an updated test todo',
                    status: 'completed'
                })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.title).toBe('Updated Todo');
            expect(response.body.description).toBe('This is an updated test todo');
            expect(response.body.status).toBe('completed');
        });

        it('should return a 404 error for a non-existent todo', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/api/todos/${nonExistentId}`) // Invalid ID
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Todo'
                })
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toEqual({ message: 'Cannot find todo' });
        });

        it('should return a 400 error for an invalid ID', async () => {
            const response = await request(app)
                .put('/api/todos/invalid-id') // Invalid ID format
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Todo'
                })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({ message: 'Invalid Id' });
        });
    });
    describe('DELETE /api/todos/:id', () => {
        it('should delete a todo by its ID', async () => {
            const todo = new Todo({
                title: 'Test Todo',
                description: 'This is a test todo',
                status: 'pending',
                user: userId
            });
            await todo.save();

            const response = await request(app)
                .delete(`/api/todos/${todo._id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body._id).toBe(todo._id.toString());
            expect(response.body.title).toBe('Test Todo');
        });

        it('should return a 404 error for a non-existent todo', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/todos/${nonExistentId}`) 
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toEqual({ message: 'Cannot find todo' });
        });

        it('should return a 400 error for an invalid ID', async () => {
            const response = await request(app)
                .delete('/api/todos/invalid-id') 
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({ message: 'Invalid Id' });
        });
    });
});
