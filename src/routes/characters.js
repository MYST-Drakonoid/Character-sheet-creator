import { Router } from 'express';
import { body } from 'express-validator';

import {
    showCharacterList,
    showCharacterSheet,
    showAddCharacterDataForm,
    processAddCharacterData,
    processCreateCharacter,
    showEditCharacterForm,
    processEditCharacter,
    showCreateCharacterForm,
    processDeleteCharacter,
    showDeleteCharacterConfirmation
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
        .toInt(),
    body('strength')
        .isInt({ min: 1, max: 30 })
        .withMessage('Strength must be between 1 and 30.')
        .toInt(),

    body('dexterity')
        .isInt({ min: 1, max: 30 })
        .withMessage('Dexterity must be between 1 and 30.')
        .toInt(),

    body('constitution')
        .isInt({ min: 1, max: 30 })
        .withMessage('Constitution must be between 1 and 30.')
        .toInt(),

    body('intelligence')
        .isInt({ min: 1, max: 30 })
        .withMessage('Intelligence must be between 1 and 30.')
        .toInt(),

    body('wisdom')
        .isInt({ min: 1, max: 30 })
        .withMessage('Wisdom must be between 1 and 30.')
        .toInt(),

    body('charisma')
        .isInt({ min: 1, max: 30 })
        .withMessage('Charisma must be between 1 and 30.')
        .toInt()
];

const characterDataValidation = [
    body('type')
        .isIn([
            'item',
            'spell',
            'proficiency',
            'language',
            'feat'
        ])
        .withMessage('Invalid character data type.'),

    // Item validation
    body('item_name')
        .if((value, { req }) => req.body.type === 'item')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Item name is required and must be under 100 characters.'),

    body('quantity')
        .if((value, { req }) => req.body.type === 'item')
        .isInt({ min: 1, max: 9999 })
        .withMessage('Quantity must be a whole number of at least 1.')
        .toInt(),

    // Spell validation
    body('spell_name')
        .if((value, { req }) => req.body.type === 'spell')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Spell name is required and must be under 100 characters.'),

    body('spell_level')
        .if((value, { req }) => req.body.type === 'spell')
        .isInt({ min: 0, max: 9 })
        .withMessage('Spell level must be between 0 and 9.')
        .toInt(),

    // Proficiency validation
    body('category')
        .if((value, { req }) => req.body.type === 'proficiency')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Proficiency category is required.'),

    body('name')
        .if((value, { req }) => req.body.type === 'proficiency')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Proficiency name is required.'),

    body('source')
        .if((value, { req }) =>
            req.body.type === 'proficiency' && value
        )
        .trim()
        .isLength({ max: 100 })
        .withMessage('Proficiency source must be under 100 characters.'),

    // Language validation
    body('language')
        .if((value, { req }) => req.body.type === 'language')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Language name is required.'),

    // Feat validation
    body('feat_name')
        .if((value, { req }) => req.body.type === 'feat')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Feat name is required.'),

    // Shared notes validation
    body('notes')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Notes must be under 2,000 characters.')
];


router.get('/', showCharacterList);
router.get('/new', showCreateCharacterForm);
router.post('/', characterValidation, processCreateCharacter);

router.get('/:id/edit', showEditCharacterForm);

router.post(
    '/:id/edit',
    characterValidation,
    processEditCharacter
);

router.get(
    '/:id/delete',
    showDeleteCharacterConfirmation
);

router.post(
    '/:id/delete',
    processDeleteCharacter
);


router.get('/:id', showCharacterSheet);
router.get('/:id/add', showAddCharacterDataForm);
router.post(
    '/:id/add',
    characterDataValidation,
    processAddCharacterData
);

export default router;