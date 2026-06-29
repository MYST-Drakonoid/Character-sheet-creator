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

export default router;