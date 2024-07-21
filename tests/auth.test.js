const request = require('supertest');
const app = require('../app');
const  User  = require('../models/user');
const { connectDb, closeDb } = require('./testDb');
require('dotenv').config();
const bcrypt = require('bcryptjs');

beforeAll(async () => {
    try {
        const port = process.env.PORT || 3001; 
        server = app.listen(port);
        
        await connectDb();
        await User.deleteMany({});
        
    } catch (err) {
        console.error('Error in beforeAll:', err);
    }
});

afterAll(async () => {
    try {
        server.close()
        await closeDb();
    } catch (err) {
        console.error('Error in afterAll:', err);
    }
});

describe('Auth API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'anjaneyamishra', password: 'anjaneyamishra' });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
        });

        it('should not register a user with an existing username', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({ username: 'anjaneyamishra', password: 'anjaneyamishra' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'anjaneyamishra', password: 'anjaneyamishra' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Username is already taken');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login a user', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({ username: 'anjaneyamishra', password: 'anjaneyamishra' });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'anjaneyamishra', password: 'anjaneyamishra' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login a user with invalid credentials', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({ username: 'anjaneyamishra', password: 'anjaneyamishra' });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'anjaneyamishra', password: 'wrongpassword' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid username or password');
        });
    });
});
