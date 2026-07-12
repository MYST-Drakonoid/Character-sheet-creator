import { Router } from 'express';

import {
    showCharacterList,
    showCharacterSheet,
    showAddCharacterDataForm,
    processAddCharacterData
} from '../controllers/charactersController.js';

const router = Router();

router.get('/', showCharacterList);
router.get('/new', (req, res) => {
    res.send('Create character placeholder');
});

router.get('/:id', showCharacterSheet);
router.get('/:id/add', showAddCharacterDataForm);
router.post('/:id/add', processAddCharacterData);

export default router;