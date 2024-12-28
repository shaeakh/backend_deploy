const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const corsOptions = {
    origin: "*", // allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/task', require('./routes/tasks'));

app.get('/', (req, res) => {
    res.send('Server is running');
});



// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});