const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


router.get('/', (req, res) => {
    try {
        const db_path = path.join(__dirname, '../db.json');
        const services = JSON.parse(fs.readFileSync(db_path));
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', (req, res) => {
    try {
        const db_path = path.join(__dirname, '../db.json');
        const services = JSON.parse(fs.readFileSync(db_path));
        const service = services.find(s => s.id === parseInt(req.params.id));
        
        if (!service) {
            return res.status(404).json({ error: 'no service found' });
        }
        
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', (req, res) => {
    try {
        const db_path = path.join(__dirname, '../db.json');
        const services = JSON.parse(fs.readFileSync(db_path));
        
        const newService = {
            id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        };
        
        services.push(newService);
        fs.writeFileSync(db_path, JSON.stringify(services, null, 2));
        
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/:id', (req, res) => {
    try {
        const db_path = path.join(__dirname, '../db.json');
        const services = JSON.parse(fs.readFileSync(db_path));
        const index = services.findIndex(s => s.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'no service found' });
        }
        
        services[index] = {
            ...services[index],
            ...req.body,
            id: services[index].id 
        };
        
        fs.writeFileSync(db_path, JSON.stringify(services, null, 2));
        res.status(200).json(services[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

 
router.delete('/:id', (req, res) => {
    try {
        const db_path = path.join(__dirname, '../db.json');
        let services = JSON.parse(fs.readFileSync(db_path));
        const serviceIndex = services.findIndex(s => s.id === parseInt(req.params.id));
        
        if (serviceIndex === -1) {
            return res.status(404).json({ error: 'no service found' });
        }
        
        services = services.filter(s => s.id !== parseInt(req.params.id));
        fs.writeFileSync(db_path, JSON.stringify(services, null, 2));
        
        res.status(200).json({ message: 'service deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;