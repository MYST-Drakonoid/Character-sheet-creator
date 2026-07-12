import {
    getCharacterById,
    getCharacterChildRecords,
    insertRecord,
    getCharactersByUserId
} from '../utils/sqlqueries.js';

export const showCharacterSheet = async (req, res) => {
    const characterId = req.params.id;
    const userId = req.session.user?.id;

    try {
        const character = await getCharacterById(characterId, userId);

        if (!character) {
            return res.status(404).render('errors/404', {
                title: 'Character Not Found'
            });
        }

        const items = await getCharacterChildRecords('character_items', characterId, userId, 'item_name');
        const spells = await getCharacterChildRecords('character_spells', characterId, userId, 'spell_level, spell_name');
        const proficiencies = await getCharacterChildRecords('character_proficiencies', characterId, userId, 'category, name');
        const languages = await getCharacterChildRecords('character_languages', characterId, userId, 'language');
        const feats = await getCharacterChildRecords('character_feats', characterId, userId, 'feat_name');

        res.render('characters/detail', {
            title: character.name,
            character,
            items,
            spells,
            proficiencies,
            languages,
            feats
        });
    } catch (error) {
        console.error('Error loading character sheet:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error,
            stack: error.stack
        });
    }
};

export const showCharacterList = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const characters = await getCharactersByUserId(userId);

        res.render('characters/index', {
            title: 'My Characters',
            characters
        });
    } catch (error) {
        next(error);
    }
};

export const showAddCharacterDataForm = async (req, res) => {
    res.render('characters/add', {
        title: 'Add to Character',
        characterId: req.params.id,
        selectedType: req.query.type || 'item'
    });
};


export const processAddCharacterData = async (req, res) => {
    const characterId = req.params.id;
    const { type } = req.body;

    try {
        if (type === 'item') {
            await insertRecord('character_items', {
                character_id: characterId,
                item_name: req.body.item_name,
                quantity: req.body.quantity || 1,
                is_equipped: req.body.is_equipped === 'on',
                is_homebrew: req.body.is_homebrew === 'on',
                notes: req.body.notes || null
            });
        }

        if (type === 'spell') {
            await insertRecord('character_spells', {
                character_id: characterId,
                spell_name: req.body.spell_name,
                spell_level: req.body.spell_level || 0,
                is_prepared: req.body.is_prepared === 'on',
                is_homebrew: req.body.is_homebrew === 'on',
                notes: req.body.notes || null
            });
        }

        if (type === 'proficiency') {
            await insertRecord('character_proficiencies', {
                character_id: characterId,
                category: req.body.category,
                name: req.body.name,
                source: req.body.source || null,
                is_homebrew: req.body.is_homebrew === 'on',
                notes: req.body.notes || null
            });
        }

        if (type === 'language') {
            await insertRecord('character_languages', {
                character_id: characterId,
                language: req.body.language,
                is_homebrew: req.body.is_homebrew === 'on',
                notes: req.body.notes || null
            });
        }

        if (type === 'feat') {
            await insertRecord('character_feats', {
                character_id: characterId,
                feat_name: req.body.feat_name,
                is_homebrew: req.body.is_homebrew === 'on',
                notes: req.body.notes || null
            });
        }

        res.redirect(`/characters/${characterId}`);
    } catch (error) {
        console.error('Error adding character data:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error,
            stack: error.stack
        });
    }
};

