/**
 * D&D Character Sheet Calculation Utilities
 * Stores math only. No database code here.
 */

const toNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isNaN(number) ? fallback : number;
};

export const formatModifier = (value) => {
    const number = toNumber(value);
    return number >= 0 ? `+${number}` : `${number}`;
};

export const getAbilityModifier = (score) => {
    return Math.floor((toNumber(score, 10) - 10) / 2);
};

export const getProficiencyBonus = (level) => {
    const characterLevel = toNumber(level, 1);

    if (characterLevel >= 17) return 6;
    if (characterLevel >= 13) return 5;
    if (characterLevel >= 9) return 4;
    if (characterLevel >= 5) return 3;

    return 2;
};

export const getProficientBonus = (level, isProficient = false, hasExpertise = false) => {
    if (!isProficient) return 0;

    const proficiencyBonus = getProficiencyBonus(level);
    return hasExpertise ? proficiencyBonus * 2 : proficiencyBonus;
};

export const getSavingThrowBonus = (abilityScore, level, isProficient = false) => {
    return getAbilityModifier(abilityScore) + getProficientBonus(level, isProficient);
};

export const getSkillBonus = (abilityScore, level, isProficient = false, hasExpertise = false) => {
    return getAbilityModifier(abilityScore) + getProficientBonus(level, isProficient, hasExpertise);
};

export const getInitiative = (dexterity, bonus = 0) => {
    return getAbilityModifier(dexterity) + toNumber(bonus);
};

export const getPassiveScore = (skillBonus, extraBonus = 0) => {
    return 10 + toNumber(skillBonus) + toNumber(extraBonus);
};

export const getSpellSaveDC = (spellcastingAbilityScore, level, extraBonus = 0) => {
    return 8 + getAbilityModifier(spellcastingAbilityScore) + getProficiencyBonus(level) + toNumber(extraBonus);
};

export const getSpellAttackBonus = (spellcastingAbilityScore, level, extraBonus = 0) => {
    return getAbilityModifier(spellcastingAbilityScore) + getProficiencyBonus(level) + toNumber(extraBonus);
};

/**
 * Basic armor class calculator.
 *
 * armorType examples:
 * - "none"
 * - "light"
 * - "medium"
 * - "heavy"
 *
 * baseArmor examples:
 * - no armor: 10
 * - leather: 11
 * - studded leather: 12
 * - chain shirt: 13
 * - breastplate: 14
 * - half plate: 15
 * - chain mail: 16
 * - plate: 18
 */
export const getArmorClass = ({
    dexterity = 10,
    armorType = 'none',
    baseArmor = 10,
    hasShield = false,
    magicBonus = 0,
    miscBonus = 0
} = {}) => {
    const dexMod = getAbilityModifier(dexterity);
    let ac = toNumber(baseArmor, 10);

    if (armorType === 'none' || armorType === 'light') {
        ac += dexMod;
    }

    if (armorType === 'medium') {
        ac += Math.min(dexMod, 2);
    }

    if (armorType === 'heavy') {
        ac += 0;
    }

    if (hasShield) {
        ac += 2;
    }

    ac += toNumber(magicBonus);
    ac += toNumber(miscBonus);

    return ac;
};

export const getCarryingCapacity = (strength, sizeMultiplier = 1) => {
    return toNumber(strength) * 15 * toNumber(sizeMultiplier, 1);
};

export const getPushDragLift = (strength, sizeMultiplier = 1) => {
    return toNumber(strength) * 30 * toNumber(sizeMultiplier, 1);
};

export const getLongJumpDistance = (strength) => {
    return toNumber(strength);
};

export const getHighJumpDistance = (strength) => {
    return 3 + getAbilityModifier(strength);
};

export const getCoinWeight = ({ copper = 0, silver = 0, electrum = 0, gold = 0, platinum = 0 } = {}) => {
    const totalCoins =
        toNumber(copper) +
        toNumber(silver) +
        toNumber(electrum) +
        toNumber(gold) +
        toNumber(platinum);

    return totalCoins / 50;
};

export const getTotalInventoryWeight = (items = []) => {
    return items.reduce((total, item) => {
        const quantity = toNumber(item.quantity, 1);
        const weight = toNumber(item.weight, 0);

        return total + quantity * weight;
    }, 0);
};

export const getTotalCarriedWeight = (items = [], coins = {}) => {
    return getTotalInventoryWeight(items) + getCoinWeight(coins);
};

export const getEncumbranceStatus = (strength, carriedWeight) => {
    const str = toNumber(strength);
    const weight = toNumber(carriedWeight);

    if (weight > str * 10) return 'Heavily Encumbered';
    if (weight > str * 5) return 'Encumbered';

    return 'Normal';
};

export const getXPNeededForLevel = (level) => {
    const xpTable = {
        1: 0,
        2: 300,
        3: 900,
        4: 2700,
        5: 6500,
        6: 14000,
        7: 23000,
        8: 34000,
        9: 48000,
        10: 64000,
        11: 85000,
        12: 100000,
        13: 120000,
        14: 140000,
        15: 165000,
        16: 195000,
        17: 225000,
        18: 265000,
        19: 305000,
        20: 355000
    };

    return xpTable[toNumber(level, 1)] ?? 0;
};

export const getLevelFromXP = (xp) => {
    const currentXP = toNumber(xp);

    if (currentXP >= 355000) return 20;
    if (currentXP >= 305000) return 19;
    if (currentXP >= 265000) return 18;
    if (currentXP >= 225000) return 17;
    if (currentXP >= 195000) return 16;
    if (currentXP >= 165000) return 15;
    if (currentXP >= 140000) return 14;
    if (currentXP >= 120000) return 13;
    if (currentXP >= 100000) return 12;
    if (currentXP >= 85000) return 11;
    if (currentXP >= 64000) return 10;
    if (currentXP >= 48000) return 9;
    if (currentXP >= 34000) return 8;
    if (currentXP >= 23000) return 7;
    if (currentXP >= 14000) return 6;
    if (currentXP >= 6500) return 5;
    if (currentXP >= 2700) return 4;
    if (currentXP >= 900) return 3;
    if (currentXP >= 300) return 2;

    return 1;
};

export const calculateCharacterSheet = (character, options = {}) => {
    const level = toNumber(character.level, 1);

    const abilities = {
        strength: {
            score: toNumber(character.strength, 10),
            modifier: getAbilityModifier(character.strength)
        },
        dexterity: {
            score: toNumber(character.dexterity, 10),
            modifier: getAbilityModifier(character.dexterity)
        },
        constitution: {
            score: toNumber(character.constitution, 10),
            modifier: getAbilityModifier(character.constitution)
        },
        intelligence: {
            score: toNumber(character.intelligence, 10),
            modifier: getAbilityModifier(character.intelligence)
        },
        wisdom: {
            score: toNumber(character.wisdom, 10),
            modifier: getAbilityModifier(character.wisdom)
        },
        charisma: {
            score: toNumber(character.charisma, 10),
            modifier: getAbilityModifier(character.charisma)
        }
    };

    const proficiencyBonus = getProficiencyBonus(level);

    const ac = getArmorClass({
        dexterity: character.dexterity,
        armorType: options.armorType,
        baseArmor: options.baseArmor,
        hasShield: options.hasShield,
        magicBonus: options.magicBonus,
        miscBonus: options.miscBonus
    });

    return {
        abilities,
        proficiencyBonus,
        formattedProficiencyBonus: formatModifier(proficiencyBonus),
        initiative: getInitiative(character.dexterity, options.initiativeBonus),
        formattedInitiative: formatModifier(getInitiative(character.dexterity, options.initiativeBonus)),
        armorClass: ac,
        carryingCapacity: getCarryingCapacity(character.strength, options.sizeMultiplier),
        pushDragLift: getPushDragLift(character.strength, options.sizeMultiplier),
        longJump: getLongJumpDistance(character.strength),
        highJump: getHighJumpDistance(character.strength),
        levelFromXP: getLevelFromXP(character.experience),
        xpForCurrentLevel: getXPNeededForLevel(level),
        xpForNextLevel: level < 20 ? getXPNeededForLevel(level + 1) : null
    };
};