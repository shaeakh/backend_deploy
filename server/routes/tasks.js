const express = require('express');
const router = express.Router();

const task = [
    {
        id: 1,
        text: 'Task 1',
        day: 'Day 1',
        reminder: true
    },
    {
        id: 2,
        text: 'Task 2',
        day: 'Day 2',
        reminder: true
    },
]

router.get('/', (req, res) => {
    res.json(task);
}).post('/', (req, res) => {
    const newTask = req.body;
    newTask.id = task.length + 1;
    task.push(newTask);
    res.json(task);
}).put('/:id', (req, res) => {
    const updatedTask = req.body;
    task.forEach((task) => {
        if (task.id === parseInt(req.params.id)) {
            task.text = updatedTask.text || task.text;
            task.day = updatedTask.day || task.day;
            task.reminder = updatedTask.reminder || task.reminder;
        }
    });
    res.json(task);
}).delete('/:id', (req, res) => {
    const index = task.findIndex((t) => t.id === parseInt(req.params.id));
    if (index !== -1) {
        task.splice(index, 1);
    }
    res.json(task);
});

module.exports = router;