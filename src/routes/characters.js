import { Router } from 'express';
import { body } from 'express-validator';

import {
    showCharacterList,
    showCharacterSheet,
    showAddCharacterDataForm,
    processAddCharacterData,
    showCreateCharacterForm,
    processCreateCharacter
} from '../controllers/charactersController.js';

const router = Router();

const characterValidation = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Character name is required.'),

    body('level')
        .isInt({ min: 1, max: 20 })
        .withMessage('Level must be between 1 and 20.')
        .toInt()
];

router.get('/', showCharacterList);
router.get('/new', showCreateCharacterForm);
router.post('/', characterValidation, processCreateCharacter);

router.get('/:id', showCharacterSheet);
router.get('/:id/add', showAddCharacterDataForm);
router.post('/:id/add', processAddCharacterData);

export default router;