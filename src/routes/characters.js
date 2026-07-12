import { Router } from 'express';
import {
    showCharacterSheet,
    showAddCharacterDataForm,
    processAddCharacterData
} from '../controllers/charactersController.js';

const router = Router();

router.get('/:id', showCharacterSheet);
router.get('/:id/add', showAddCharacterDataForm);
router.post('/:id/add', processAddCharacterData);

router.get('/', (req, res) => {
    res.send('Character list placeholder');
});

router.get('/new', (req, res) => {
    res.send('Create character placeholder');
});

export default router;