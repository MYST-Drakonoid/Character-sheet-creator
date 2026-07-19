-- Database seed file for student course catalog
-- This file creates tables and inserts all initial data

BEGIN;

/***************************************************************************
    D&D Character Creator Database Schema

    Purpose:
    This schema supports a character-creator-focused application.

    Design idea:
    - The characters table stores one row per character.
    - Calculated values such as armor class, initiative, skill bonuses,
      saving throws, proficiency bonus, and spell save DC are NOT stored here.
      Those should be calculated in application code.
    - Repeating character details such as items, spells, proficiencies,
      languages, and feats are stored in child tables.
***************************************************************************/


/***************************************************************************
    DROP TABLES

    PostgreSQL does not support CREATE OR REPLACE TABLE.

    Instead, we drop child tables first, then parent tables.
    CASCADE removes dependent constraints safely.
***************************************************************************/

DROP TABLE IF EXISTS character_spellbook_spells CASCADE;
DROP TABLE IF EXISTS character_spellbooks CASCADE;

DROP TABLE IF EXISTS character_feats CASCADE;
DROP TABLE IF EXISTS character_languages CASCADE;
DROP TABLE IF EXISTS character_proficiencies CASCADE;
DROP TABLE IF EXISTS character_spells CASCADE;
DROP TABLE IF EXISTS character_items CASCADE;
DROP TABLE IF EXISTS characters CASCADE;

DROP TABLE IF EXISTS subclass_levels CASCADE;
DROP TABLE IF EXISTS class_resource_levels CASCADE;
DROP TABLE IF EXISTS class_resources CASCADE;
DROP TABLE IF EXISTS class_levels CASCADE;

DROP TABLE IF EXISTS subclasses CASCADE;
DROP TABLE IF EXISTS feats CASCADE;
DROP TABLE IF EXISTS backgrounds CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS races CASCADE;

DROP TABLE IF EXISTS users CASCADE;


/***************************************************************************
    USERS

    Stores login/account information.

    Every saved character belongs to one user.
***************************************************************************/

CREATE TABLE users (
    -- Unique user ID
    id SERIAL PRIMARY KEY,

    -- Display name for the user
    name VARCHAR(100) NOT NULL,

    -- Email used for login
    email VARCHAR(255) NOT NULL UNIQUE,

    -- Bcrypt-hashed password
    password VARCHAR(255) NOT NULL,

    -- Record tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20)
NOT NULL
DEFAULT 'user';

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
ADD CONSTRAINT users_role_check
CHECK (role IN ('owner', 'moderator', 'user'));


/***************************************************************************
    RACES

    Stores playable race options.

    Examples:
    Human, Elf, Dwarf, Dragonborn, or custom homebrew races.
***************************************************************************/

CREATE TABLE races (
    -- Unique race ID
    id SERIAL PRIMARY KEY,

    -- Race name shown in the character creator
    name VARCHAR(100) NOT NULL,

    -- Race description or rules text
    description TEXT,

    -- Base walking speed, if applicable
    speed INTEGER,

    -- Character size, such as Small, Medium, Large
    size VARCHAR(50),

    -- TRUE means this was user-created/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- User who created this race; NULL means official/default content
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Record tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/***************************************************************************
    CLASSES

    Stores playable class options.

    Examples:
    Fighter, Wizard, Cleric, Rogue.
***************************************************************************/

CREATE TABLE classes (
    -- Unique class ID
    id SERIAL PRIMARY KEY,

    -- Class name shown in the character creator
    name VARCHAR(100) NOT NULL,

    -- Class description or rules text
    description TEXT,

    -- Hit die size, such as 6, 8, 10, or 12
    hit_die INTEGER,

    -- Main ability or abilities, such as Strength or Intelligence
    primary_ability VARCHAR(100),

    -- TRUE means this was user-created/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- User who created this class; NULL means official/default content
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Record tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/***************************************************************************
    SUBCLASSES

    Stores subclass options.

    Each subclass belongs to one class.

    Examples:
    Fighter -> Champion
    Wizard  -> School of Evocation
***************************************************************************/

CREATE TABLE subclasses (
    -- Unique subclass ID
    id SERIAL PRIMARY KEY,

    -- Parent class
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,

    -- Subclass name
    name VARCHAR(100) NOT NULL,

    -- Subclass description or rules text
    description TEXT,

    -- TRUE means this was user-created/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- User who created this subclass; NULL means official/default content
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Record tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/***************************************************************************
    CLASS LEVELS

    Stores level-by-level class information.

    Example:
    Fighter level 2 gets Action Surge.
    Wizard level 5 gets 3rd-level spell slots.

    This is reference data, not character data.
***************************************************************************/

CREATE TABLE class_levels (
    id SERIAL PRIMARY KEY,

    class_id INTEGER NOT NULL
        REFERENCES classes(id)
        ON DELETE CASCADE,

    level INTEGER NOT NULL,

    proficiency_bonus INTEGER,

    features TEXT,

    cantrips_known INTEGER,
    spells_known INTEGER,

    spell_slots_1 INTEGER DEFAULT 0,
    spell_slots_2 INTEGER DEFAULT 0,
    spell_slots_3 INTEGER DEFAULT 0,
    spell_slots_4 INTEGER DEFAULT 0,
    spell_slots_5 INTEGER DEFAULT 0,
    spell_slots_6 INTEGER DEFAULT 0,
    spell_slots_7 INTEGER DEFAULT 0,
    spell_slots_8 INTEGER DEFAULT 0,
    spell_slots_9 INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (class_id, level)
);


/***************************************************************************
    SUBCLASS LEVELS

    Stores subclass features gained at specific levels.

    Example:
    Champion Fighter level 3 gets Improved Critical.
***************************************************************************/

CREATE TABLE subclass_levels (
    id SERIAL PRIMARY KEY,

    subclass_id INTEGER NOT NULL
        REFERENCES subclasses(id)
        ON DELETE CASCADE,

    level INTEGER NOT NULL,

    features TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (subclass_id, level)
);

/***************************************************************************
    CLASS RESOURCES

    Stores reusable class-based resources.

    Examples:
    - Sorcery Points
    - Rage Uses
    - Action Surge Uses
    - Ki Points
    - Bardic Inspiration Uses

    This keeps the database flexible so different classes can use the same
    structure for limited-use abilities.
***************************************************************************/

CREATE TABLE class_resources (
    id SERIAL PRIMARY KEY,

    class_id INTEGER NOT NULL
        REFERENCES classes(id)
        ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    -- Generic display category such as Points, Uses, Dice, Charges
    resource_type VARCHAR(50) NOT NULL,

    -- How the resource refreshes
    refresh_type VARCHAR(50),

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/***************************************************************************
    CLASS RESOURCE LEVELS

    Stores how many uses/points/charges a class resource has at each level.

    Example:
    Sorcerer level 2 has 2 Sorcery Points.
    Fighter level 2 has 1 Action Surge use.
***************************************************************************/

CREATE TABLE class_resource_levels (
    id SERIAL PRIMARY KEY,

    class_resource_id INTEGER NOT NULL
        REFERENCES class_resources(id)
        ON DELETE CASCADE,

    level INTEGER NOT NULL,

    max_amount INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (class_resource_id, level)
);


/***************************************************************************
    BACKGROUNDS

    Stores character background options.

    Examples:
    Acolyte, Criminal, Folk Hero, Sage.
***************************************************************************/

CREATE TABLE backgrounds (
    -- Unique background ID
    id SERIAL PRIMARY KEY,

    -- Background name
    name VARCHAR(100) NOT NULL,

    -- Background description
    description TEXT,

    -- Background feature text
    feature TEXT,

    -- TRUE means this was user-created/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- User who created this background; NULL means official/default content
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Record tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/***************************************************************************
    FEATS

    Stores feat options.

    Characters can gain many feats, so chosen feats are stored separately
    in character_feats.
***************************************************************************/

CREATE TABLE feats (
    -- Unique feat ID
    id SERIAL PRIMARY KEY,

    -- Feat name
    name VARCHAR(100) NOT NULL,

    -- Feat rules text
    description TEXT,

    -- Requirements for taking the feat
    prerequisites TEXT,

    -- TRUE means this was user-created/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- User who created this feat; NULL means official/default content
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Record tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/***************************************************************************
    CHARACTERS

    Stores one row per saved character.

    This table stores raw character choices and user-entered values only.

    It intentionally does NOT store calculated values such as:
    - armor class
    - initiative
    - proficiency bonus
    - ability modifiers
    - saving throw bonuses
    - skill bonuses
    - passive perception
    - spell save DC
***************************************************************************/

CREATE TABLE characters (
    -- Unique character ID
    id SERIAL PRIMARY KEY,

    -- Owner of the character
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Basic character name
    name VARCHAR(100) NOT NULL,

    -- Core character-builder selections
    race_id INTEGER REFERENCES races(id) ON DELETE SET NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE SET NULL,
    background_id INTEGER REFERENCES backgrounds(id) ON DELETE SET NULL,

    -- Character progression
    level INTEGER NOT NULL DEFAULT 1,
    experience INTEGER NOT NULL DEFAULT 0,

    -- Raw ability scores
    strength SMALLINT NOT NULL,
    dexterity SMALLINT NOT NULL,
    constitution SMALLINT NOT NULL,
    intelligence SMALLINT NOT NULL,
    wisdom SMALLINT NOT NULL,
    charisma SMALLINT NOT NULL,

    -- Hit points are stored because they change during play
    current_hp INTEGER,
    max_hp INTEGER,
    temporary_hp INTEGER DEFAULT 0,

    -- Hit dice are resources, not calculated display values
    hit_dice_current INTEGER,
    hit_dice_max INTEGER,

    -- Currency values
    copper INTEGER DEFAULT 0,
    silver INTEGER DEFAULT 0,
    electrum INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    platinum INTEGER DEFAULT 0,

    -- Character description fields
    alignment VARCHAR(30),
    age VARCHAR(30),
    height VARCHAR(50),
    weight VARCHAR(50),
    eyes VARCHAR(50),
    hair VARCHAR(50),
    skin VARCHAR(50),

    -- Roleplay fields
    personality_traits TEXT,
    ideals TEXT,
    bonds TEXT,
    flaws TEXT,
    backstory TEXT,
    notes TEXT,

    -- Record tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/***************************************************************************
    CHARACTER ITEMS

    Stores inventory.

    A character can have many items, so items are placed in a child table.

    Example:
    One character may have:
    - Longsword
    - Shield
    - Backpack
    - Potion of Healing
***************************************************************************/

CREATE TABLE character_items (
    -- Unique inventory row ID
    id SERIAL PRIMARY KEY,

    -- Parent character
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,

    -- Item name
    item_name VARCHAR(150) NOT NULL,

    -- Number of this item owned
    quantity INTEGER NOT NULL DEFAULT 1,

    -- Whether the item is currently equipped
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,

    -- TRUE means this item is custom/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- Extra details about the item
    notes TEXT
);


/***************************************************************************
    CHARACTER SPELLS

    Stores spells known, prepared, or available to a character.

    A character can have many spells, so spells are placed in a child table.
***************************************************************************/

CREATE TABLE character_spells (
    -- Unique character spell row ID
    id SERIAL PRIMARY KEY,

    -- Parent character
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,

    -- Spell name
    spell_name VARCHAR(150) NOT NULL,

    -- Spell level; 0 usually means cantrip
    spell_level INTEGER NOT NULL DEFAULT 0,

    -- TRUE if the spell is currently prepared
    is_prepared BOOLEAN NOT NULL DEFAULT FALSE,

    -- TRUE means this spell is custom/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- Extra spell notes
    notes TEXT
);


/***************************************************************************
    CHARACTER PROFICIENCIES

    Stores what a character is proficient in.

    These are stored because they are part of the saved character state.
    They may come from race, class, background, feats, multiclassing,
    or manual user choices.
***************************************************************************/

CREATE TABLE character_proficiencies (
    -- Unique proficiency row ID
    id SERIAL PRIMARY KEY,

    -- Parent character
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,

    -- Type of proficiency:
    -- Skill, Weapon, Armor, Tool, Vehicle, Saving Throw, etc.
    category VARCHAR(50) NOT NULL,

    -- Name of the proficiency:
    -- Stealth, Longsword, Light Armor, Thieves' Tools, etc.
    name VARCHAR(150) NOT NULL,

    -- Where the proficiency came from:
    -- Race, Class, Background, Feat, Manual, etc.
    source VARCHAR(100),

    -- TRUE means this proficiency is custom/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- Extra details
    notes TEXT
);


/***************************************************************************
    CHARACTER LANGUAGES

    Stores languages known by a character.

    Languages are placed in a child table because one character can know
    many languages.
***************************************************************************/

CREATE TABLE character_languages (
    -- Unique language row ID
    id SERIAL PRIMARY KEY,

    -- Parent character
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,

    -- Language name
    language VARCHAR(100) NOT NULL,

    -- TRUE means this language is custom/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- Extra details
    notes TEXT
);


/***************************************************************************
    CHARACTER FEATS

    Stores feats chosen by a character.

    A character can have many feats, so feats are stored in a child table.
***************************************************************************/

CREATE TABLE character_feats (
    -- Unique character feat row ID
    id SERIAL PRIMARY KEY,

    -- Parent character
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,

    -- Feat name
    feat_name VARCHAR(150) NOT NULL,

    -- TRUE means this feat is custom/homebrew
    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    -- Extra feat notes
    notes TEXT
);

/***************************************************************************
    CHARACTER SPELLBOOKS

    Stores spellbooks owned by a character.

    This mainly supports wizards, but it is flexible enough for homebrew
    classes or magic items that use spellbooks.
***************************************************************************/

CREATE TABLE character_spellbooks (
    id SERIAL PRIMARY KEY,

    character_id INTEGER NOT NULL
        REFERENCES characters(id)
        ON DELETE CASCADE,

    name VARCHAR(150) NOT NULL DEFAULT 'Spellbook',

    description TEXT,

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/***************************************************************************
    CHARACTER SPELLBOOK SPELLS

    Stores spells written in a spellbook.

    This is separate from character_spells because a wizard may have a spell
    in their spellbook but not currently prepared.
***************************************************************************/

CREATE TABLE character_spellbook_spells (
    id SERIAL PRIMARY KEY,

    spellbook_id INTEGER NOT NULL
        REFERENCES character_spellbooks(id)
        ON DELETE CASCADE,

    spell_name VARCHAR(150) NOT NULL,

    spell_level INTEGER NOT NULL DEFAULT 0,

    -- Optional tracking fields for copied spells
    copied_from VARCHAR(150),
    copy_cost_gp INTEGER,
    copy_time_hours INTEGER,

    is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/***************************************************************************
    SRD-Compatible Starter Data

    Attribution:
    This project uses material from the SRD 5.1 by Wizards of the Coast LLC,
    licensed under Creative Commons Attribution 4.0 International.

    NOTE:
    This inserts names and short labels only. Do not copy full PHB text.
***************************************************************************/


/***************************************************************************
    RACES
***************************************************************************/

INSERT INTO races (name, description, speed, size, is_homebrew)
VALUES
('Dragonborn', 'SRD playable race.', 30, 'Medium', FALSE),
('Dwarf', 'SRD playable race.', 25, 'Medium', FALSE),
('Elf', 'SRD playable race.', 30, 'Medium', FALSE),
('Gnome', 'SRD playable race.', 25, 'Small', FALSE),
('Half-Elf', 'SRD playable race.', 30, 'Medium', FALSE),
('Half-Orc', 'SRD playable race.', 30, 'Medium', FALSE),
('Halfling', 'SRD playable race.', 25, 'Small', FALSE),
('Human', 'SRD playable race.', 30, 'Medium', FALSE),
('Tiefling', 'SRD playable race.', 30, 'Medium', FALSE);


/***************************************************************************
    CLASSES
***************************************************************************/

INSERT INTO classes (name, description, hit_die, primary_ability, is_homebrew)
VALUES
('Barbarian', 'SRD class.', 12, 'Strength', FALSE),
('Bard', 'SRD class.', 8, 'Charisma', FALSE),
('Cleric', 'SRD class.', 8, 'Wisdom', FALSE),
('Druid', 'SRD class.', 8, 'Wisdom', FALSE),
('Fighter', 'SRD class.', 10, 'Strength or Dexterity', FALSE),
('Monk', 'SRD class.', 8, 'Dexterity and Wisdom', FALSE),
('Paladin', 'SRD class.', 10, 'Strength and Charisma', FALSE),
('Ranger', 'SRD class.', 10, 'Dexterity and Wisdom', FALSE),
('Rogue', 'SRD class.', 8, 'Dexterity', FALSE),
('Sorcerer', 'SRD class.', 6, 'Charisma', FALSE),
('Warlock', 'SRD class.', 8, 'Charisma', FALSE),
('Wizard', 'SRD class.', 6, 'Intelligence', FALSE);


/***************************************************************************
    SUBCLASSES
***************************************************************************/

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Path of the Berserker', 'SRD barbarian subclass.', FALSE
FROM classes WHERE name = 'Barbarian';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'College of Lore', 'SRD bard subclass.', FALSE
FROM classes WHERE name = 'Bard';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Life Domain', 'SRD cleric subclass.', FALSE
FROM classes WHERE name = 'Cleric';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Circle of the Land', 'SRD druid subclass.', FALSE
FROM classes WHERE name = 'Druid';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Champion', 'SRD fighter subclass.', FALSE
FROM classes WHERE name = 'Fighter';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Way of the Open Hand', 'SRD monk subclass.', FALSE
FROM classes WHERE name = 'Monk';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Oath of Devotion', 'SRD paladin subclass.', FALSE
FROM classes WHERE name = 'Paladin';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Hunter', 'SRD ranger subclass.', FALSE
FROM classes WHERE name = 'Ranger';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Thief', 'SRD rogue subclass.', FALSE
FROM classes WHERE name = 'Rogue';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'Draconic Bloodline', 'SRD sorcerer subclass.', FALSE
FROM classes WHERE name = 'Sorcerer';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'The Fiend', 'SRD warlock subclass.', FALSE
FROM classes WHERE name = 'Warlock';

INSERT INTO subclasses (class_id, name, description, is_homebrew)
SELECT id, 'School of Evocation', 'SRD wizard subclass.', FALSE
FROM classes WHERE name = 'Wizard';


/***************************************************************************
    BACKGROUNDS
***************************************************************************/

INSERT INTO backgrounds (name, description, feature, is_homebrew)
VALUES
('Acolyte', 'SRD background.', 'Shelter of the Faithful', FALSE);


/***************************************************************************
    FEATS
***************************************************************************/

INSERT INTO feats (name, description, prerequisites, is_homebrew)
VALUES
('Grappler', 'SRD feat.', 'Strength 13 or higher', FALSE);


/***************************************************************************
    CLASS RESOURCES SEED DATA

    Generic resources used by multiple classes.
***************************************************************************/

INSERT INTO class_resources (class_id, name, resource_type, refresh_type, description)
SELECT id, 'Rage', 'Uses', 'Long Rest', 'Limited-use barbarian combat resource.'
FROM classes WHERE name = 'Barbarian';

INSERT INTO class_resources (class_id, name, resource_type, refresh_type, description)
SELECT id, 'Bardic Inspiration', 'Uses', 'Long Rest', 'Limited-use bard support resource.'
FROM classes WHERE name = 'Bard';

INSERT INTO class_resources (class_id, name, resource_type, refresh_type, description)
SELECT id, 'Channel Divinity', 'Uses', 'Short or Long Rest', 'Limited-use cleric divine resource.'
FROM classes WHERE name = 'Cleric';

INSERT INTO class_resources (class_id, name, resource_type, refresh_type, description)
SELECT id, 'Wild Shape', 'Uses', 'Short or Long Rest', 'Limited-use druid transformation resource.'
FROM classes WHERE name = 'Druid';

INSERT INTO class_resources (class_id, name, resource_type, refresh_type, description)
SELECT id, 'Action Surge', 'Uses', 'Short or Long Rest', 'Limited-use fighter extra action resource.'
FROM classes WHERE name = 'Fighter';

INSERT INTO class_resources (class_id, name, resource_type, refresh_type, description)
SELECT id, 'Ki', 'Points', 'Short or Long Rest', 'Monk class resource.'
FROM classes WHERE name = 'Monk';

INSERT INTO class_resources (class_id, name, resource_type, refresh_type, description)
SELECT id, 'Lay on Hands', 'Points', 'Long Rest', 'Paladin healing resource.'
FROM classes WHERE name = 'Paladin';

INSERT INTO class_resources (class_id, name, resource_type, refresh_type, description)
SELECT id, 'Sorcery Points', 'Points', 'Long Rest', 'Sorcerer metamagic resource.'
FROM classes WHERE name = 'Sorcerer';

/***************************************************************************
    CLASS RESOURCE LEVELS SEED DATA
***************************************************************************/

-- Barbarian Rage Uses
INSERT INTO class_resource_levels (class_resource_id, level, max_amount)
SELECT cr.id, v.level, v.max_amount
FROM class_resources cr
JOIN classes c ON cr.class_id = c.id
JOIN (VALUES
    (1, 2), (2, 2), (3, 3), (4, 3), (5, 3),
    (6, 4), (7, 4), (8, 4), (9, 4), (10, 4),
    (11, 4), (12, 5), (13, 5), (14, 5), (15, 5),
    (16, 5), (17, 6), (18, 6), (19, 6), (20, 999)
) AS v(level, max_amount) ON TRUE
WHERE c.name = 'Barbarian'
  AND cr.name = 'Rage';


-- Fighter Action Surge Uses
INSERT INTO class_resource_levels (class_resource_id, level, max_amount)
SELECT cr.id, v.level, v.max_amount
FROM class_resources cr
JOIN classes c ON cr.class_id = c.id
JOIN (VALUES
    (2, 1), (3, 1), (4, 1), (5, 1),
    (6, 1), (7, 1), (8, 1), (9, 1),
    (10, 1), (11, 1), (12, 1), (13, 1),
    (14, 1), (15, 1), (16, 1),
    (17, 2), (18, 2), (19, 2), (20, 2)
) AS v(level, max_amount) ON TRUE
WHERE c.name = 'Fighter'
  AND cr.name = 'Action Surge';


-- Monk Ki Points
INSERT INTO class_resource_levels (class_resource_id, level, max_amount)
SELECT cr.id, v.level, v.max_amount
FROM class_resources cr
JOIN classes c ON cr.class_id = c.id
JOIN (VALUES
    (2, 2), (3, 3), (4, 4), (5, 5),
    (6, 6), (7, 7), (8, 8), (9, 9),
    (10, 10), (11, 11), (12, 12), (13, 13),
    (14, 14), (15, 15), (16, 16), (17, 17),
    (18, 18), (19, 19), (20, 20)
) AS v(level, max_amount) ON TRUE
WHERE c.name = 'Monk'
  AND cr.name = 'Ki';


-- Sorcerer Sorcery Points
INSERT INTO class_resource_levels (class_resource_id, level, max_amount)
SELECT cr.id, v.level, v.max_amount
FROM class_resources cr
JOIN classes c ON cr.class_id = c.id
JOIN (VALUES
    (2, 2), (3, 3), (4, 4), (5, 5),
    (6, 6), (7, 7), (8, 8), (9, 9),
    (10, 10), (11, 11), (12, 12), (13, 13),
    (14, 14), (15, 15), (16, 16), (17, 17),
    (18, 18), (19, 19), (20, 20)
) AS v(level, max_amount) ON TRUE
WHERE c.name = 'Sorcerer'
  AND cr.name = 'Sorcery Points';

COMMIT;