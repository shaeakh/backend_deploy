const router = express.Router();

// GET all services
router.get('/', async (req, res) => {
    try {
        res.json({ message: 'List of all services' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
