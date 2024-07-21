require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const dbConnect = require('./db/db'); 
const cors = require('cors');


const todos = require('./routes/todos');
const auth = require('./routes/auth');

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'ToDo API',
            version: '1.0.0',
            description: 'API for managing todos',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'],  // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.use(cors());

// Connect to MongoDB
dbConnect();

// Middleware
app.use(bodyParser.json());


// Routes
app.use('/api/todos', todos);
app.use('/api/auth', auth);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the ToDo API');
});

if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
module.exports = app;
