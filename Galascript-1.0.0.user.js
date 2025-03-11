// ==UserScript==
// @name         Galascript
// @namespace    https://undercards.net
// @version      1.0.0
// @description  Galascript adds stuff. :3
// @author       galadino
// @match        https://*.undercards.net/*
// @icon         https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/gsVirgil/iconVirgil.png
// @require      https://raw.githubusercontent.com/UCProjects/UnderScript/master/src/checkerV2.js
// @grant        none
// ==/UserScript==
const $ = window.$;
const pluginName = GM_info.script.name;
const pluginVersion = GM_info.script.version;
const underscript = window.underscript;
const plugin = underscript.plugin(pluginName, pluginVersion);
const style = plugin.addStyle();
const ingame = window.location.pathname === '/Game' || window.location.pathname === '/Spectate';


const patchNotes =


`Release version!`;


var nvcsSoftDeactivate;
function nvcsCards(card) {
    return {
        0: {
            key: 'boneBox',
            name: 'Bone Box',
            info: 'Displays Certificate\'s card pool',
            pool: [[allCards, ['typeCard', 'cost'], ['===', '<='], [1, 3]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        1: {
            key: 'certificate',
            name: 'Certificate',
            info: 'Displays Certificate\'s card pool',
            pool: [[allCards, ['taunt', 'rarity'], ['===', '!=='], [true, 'DETERMINATION']]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        2: {
            key: 'editor2',
            name: 'Editor 2',
            info: 'Displays Editor 2\'s card pool',
            pool: [[allCards, ['typeCard'], ['==='], [0]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        3: {
            key: 'mausHole',
            name: 'Maus Hole',
            info: 'Displays Maus Hole\'s card pool',
            pool: [[allCards, ['cost'], ['==='], [1]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        4: {
            key: 'noellecoaster',
            name: 'Noellecoaster',
            info: 'Displays Noellecoaster\'s current spell pulls',
            pool: [[allCards, ['typeCard', 'cost'], ['===', '==='], [1, card?.cost]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-noellecoaster-info',
            failSprite: 'NVCSinactive',
            failKey: 'status-nvcs-noellecoaster-failed',
        },
        5: {
            key: 'recycleBin',
            name: 'Recycle Bin',
            info: 'Displays Recycle Bin\'s current spell pulls',
            pool: [[allCards, ['typeCard', 'cost'], ['===', '==='], [1, card?.hp]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-recyclebin-info-hp',
            pool2: [[allCards, ['typeCard', 'cost'], ['===', '==='], [1, card?.attack]]],
            sprite2: 'NVCSactive',
            transKey2: 'status-nvcs-recyclebin-info-atk',
        },
        6: {
            key: 'snowdinSign',
            name: 'Snowdin Sign',
            info: 'Displays Snowdin Sign\'s card pool',
            pool: [[allCards, ['rarity', 'typeCard'], ['===', '==='], ['RARE', 1]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
    }
}

//     if (activeFor('Recruitment')) {
//         setupPoolDisplay([allCards, ['rarity', 'cost', 'typeCard'], ['includes', 'includes', '==='], [['BASE', 'COMMON', 'RARE', 'EPIC'], [4, 5], 0]]);
//         pushPower('NVCSactive', 'custom', 'status-nvcs-pool', [printPool], null);
//     }

//     if (activeFor('Draft')) {
//         setupPoolDisplay([allCards, ['rarity', 'cost', 'typeCard'], ['includes', 'includes', '==='], [['BASE', 'COMMON', 'RARE', 'EPIC'], [5, 6], 0]]);
//         pushPower('NVCSactive', 'custom', 'status-nvcs-pool', [printPool], null);
//     }

//     if (activeFor('DT Extractor')) {
//         setupPoolDisplay([allCards, ['rarity'], ['==='], ['DETERMINATION']]);
//         pushPower('NVCSactive', 'custom', 'status-nvcs-pool', [printPool], null);
//     }

//     if (activeFor('Junk for Sale')) {
//         setupPoolDisplay([allCards, ['rarity', 'cost', 'typeCard'], ['includes', '===', '==='], [['BASE', 'COMMON', 'RARE', 'EPIC'], 3, 0]]);
//         pushPower('NVCSactive', 'custom', 'status-nvcs-pool', [printPool], null);
//     }

//     if (activeFor('Casino Sans')) {
//         setupPoolDisplay([allCards, ['rarity'], ['==='], ['TOKEN']]);
//         pushPower('NVCSactive', 'custom', 'status-nvcs-pool', [printPool], null);
//     }

const nvcs = {}

function wrapClamp(value, min, max) {if (value < min) {return max - ((min - value) % (max - min));} else {return min + ((value - min) % (max - min));}}

function cardLog(obj) {
    let result = '';
    function objCrawl(innerObj, prefix = '') {
        for (let key in innerObj) {
            if (innerObj.hasOwnProperty(key)) {
                const value = innerObj[key];
                if (typeof value === 'object' && value !== null) {
                    objCrawl(value, `${prefix}${key}.`);
                } else {
                    result += `<span style='color: cyan'>${prefix}${key}:</span> ${value}<br>`;
                }
            }
        }
    }
    objCrawl(obj);
    return result;
}
function getNestedProperty(obj, property) {
    return property.split('.').reduce((o, p) => (o && o[p] !== undefined) ? o[p] : undefined, obj);
}

function matchesValue(cardValue, operand, value) {
    switch (operand) {
        case '===':
            return cardValue === value;
        case '!==':
            return cardValue !== value;
        case '<':
            return cardValue < value;
        case '<=':
            return cardValue <= value;
        case '>':
            return cardValue > value;
        case '>=':
            return cardValue >= value;
        case 'includes':
            return Array.isArray(value) ? value.includes(cardValue) : false;
        case 'excludes':
            return Array.isArray(value) ? !value.includes(cardValue) : false;
        default:
            return false;
    }
}
function getCardsWithStats(pool, stats, operands, values, returnProp, list) {
    var result = [];
    function append(a, b) {
        nvcsSoftDeactivate = 1;
        var appended = appendCard(a, b);
        nvcsSoftDeactivate = 0;
        appended.addClass('listed');
        appended.removeClass('pointer');
        result += appended.prop('outerHTML');
    }
    if (!values.includes('TOKEN')) {
        stats.push('rarity');
        operands.push('!==');
        values.push('TOKEN');
    }
    const filteredPool = pool.filter(card => {
        return stats.every((stat, index) => {
            const cardValue = getNestedProperty(card, stat);
            return matchesValue(cardValue, operands[index], values[index]);
        });
    });

    if (list) {
        filteredPool.forEach((card) => append(card, null));
        return `<div id="cardsPreviewCompact" class="container cardsPreviewCompact no-hover">${result}</div>`;
    } else if (returnProp) {
        return filteredPool.map(card => getNestedProperty(card, returnProp));
    }

    return filteredPool;
}

window.getCardsWithStats = getCardsWithStats; // usable in console and by anyone else as a utility :3

const checkCreateCard = setInterval(() => {
    if (typeof createCard === 'function') {
    clearInterval(checkCreateCard);
    function newCreateCard(card) {
    const randomLimit = allCards.length;
    if (wrongCardNames?.value() !== 'off' || wrongCardImages?.value() !== 'off' || wrongCardDescriptions?.value() !== 'off' || wrongCardRarity?.value() !== 'off') {
        card.randId = card.fixedId; // only add this property if randomization is being used
    }
    if (wrongCardNames?.value() !== 'off' && ingame) {
        card.fixedId *= wrongCardNames?.value() === 'random universal' ? gameId : card.id + gameId;
        card.fixedId = wrapClamp(card.fixedId, 0, randomLimit);
        card.randId = card.fixedId;
    }
    var name;
    if (loopNames?.value()) {
        if (card.loop > 0) { // compatiable with any language! simply sets the plural to the loop + 1, if loop is seen
            name = $.i18n('card-name-' + card.fixedId, card.loop + 1);} else {name = $.i18n('card-name-' + card.fixedId, 1);}}
        else {
            name = $.i18n('card-name-' + card.fixedId, 1)
        };

    if (wrongCardImages?.value() !== 'off' && ingame) {
        card.fixedId *= wrongCardImages?.value() === 'random universal' ? gameId : card.id + gameId;
        card.fixedId = wrapClamp(card.fixedId, 0, randomLimit);
        card.fixedId = wrongCardImages?.value() === 'inherit' ? card.randId : card.fixedId;
        card.baseImage = $.i18n('card-name-' + card.fixedId, 1).toString().replace(/\s+/g, '_');
        card.image = card.baseImage;
        card.typeSkin = 0;
    };

    if (wrongCardDescriptions?.value() !== 'off' && ingame) {
        card.fixedId *= wrongCardDescriptions?.value() === 'random universal' ? gameId : card.id + gameId;
        card.fixedId = wrapClamp(card.fixedId, 0, randomLimit);
        card.fixedId = wrongCardDescriptions?.value() === 'inherit' ? card.randId : card.fixedId;
    };

    var description = $.i18n('card-' + card.fixedId);
    var cost = ""
    var attack = "";
    var hp = "";
    var maxHp = "";
    var hpSquish = 1;
    var maxHpSquish = 1;
    var shiny = "";
    var htmlHp = "";

    if (wrongCardRarity?.value() !== 'off' && ingame) {
        card.fixedId *= wrongCardRarity?.value() === 'random universal' ? gameId : card.id + gameId;
        card.fixedId = wrapClamp(card.fixedId, 0, randomLimit);
        card.fixedId = wrongCardRarity?.value() === 'inherit' ? card.randId : card.fixedId;
        card.extension = getCard(card.fixedId) ? getCard(card.fixedId).extension : card.extension;
        card.rarity = getCard(card.fixedId) ? getCard(card.fixedId).rarity : card.rarity;
    };
    cost = card.cost;
    if (card.hasOwnProperty('attack')) {
        attack = card.attack;
        hp = card.hp;
        maxHp = card.maxHp;
        htmlHp = `<span class="currentHP">${hp}</span><span class="maxHP">${maxHp}</span>`;
    }

    shiny = card.shiny ? " shiny" : ""; // onu didnt do this i just like ternary operators

    var frameSkinName = 'undertale';

    /*
        if statement breakdown:

            if:
                - the card has a frame skin name
                - the frameSpoof setting is not 'off'
                    and:
                        - in a game
                        - the card is owned by you
                    or:
                        - not in a game
    */

    if ((card.hasOwnProperty('frameSkinName') && frameSpoof?.value() !== 'off') && ((ingame && card?.ownerId === userId) || !ingame)) {
        card.frameSkinName = frameSpoof?.value()
    }

    if (card.hasOwnProperty('frameSkinName') && respectiveFrames?.value()) {
        if (card.extension === 'BASE' || card.extension === 'UTY') {card.frameSkinName = 'undertale'}
        if (card.extension === 'DELTARUNE' ) {card.frameSkinName = 'deltarune'}
    }

    if (card.hasOwnProperty('frameSkinName')) {
        frameSkinName = card.frameSkinName.toString().replace(/\s+/g, '-').toLowerCase();
    }

    frameSkinName += '-frame';

    var htmlCard = '<div id="' + card.id + '" class="card monster ' + frameSkinName + shiny + '" data-rarity="' + card.rarity + '">\n\
    <div class="shinySlot"></div>\n\
    <div class="cardFrame"></div>\n\
    <div class="cardBackground"></div>\n\
    <div class="cardHeader"></div>\n\
    <div class="cardName"><div>' + name + '</div></div>\n\
    <div class="cardCost">' + cost + '</div>\n\
    <div class="cardStatus"></div>\n\
    <div class="cardTribes"></div>\n\
    <div class="cardImage"></div>\n\
    <div class="cardSilence"></div>\n\
    <div class="cardAction"></div>\n\
    <div class="cardSilence"></div>\n\
    <div class="cardDesc"><div>' + description + '</div></div>\n\
    <div class="cardFooter"></div>\n\
    <div class="cardATK">' + attack + '</div>\n\
    <div class="cardRarity"></div>\n\
    <div class="cardHP">' + htmlHp + '</div>\n\
    </div>';

    if (card.typeCard === 1) {

        var cardSoul = card.hasOwnProperty('soul') ? card.soul.name : '';
        htmlCard = '<div id="' + card.id + '" class="card spell ' + frameSkinName + ' ' + shiny + '" data-rarity="' + card.rarity + '">\n\
        <div class="shinySlot"></div>\n\
        <div class="cardFrame"></div>\n\
        <div class="cardBackground"></div>\n\
        <div class="cardHeader"></div>\n\
        <div class="cardName ' + cardSoul + '"><div>' + name + '</div></div>\n\
        <div class="cardCost">' + cost + '</div>\n\
        <div class="cardStatus"></div>\n\
        <div class="cardTribes"></div>\n\
        <div class="cardImage"></div>\n\
        <div class="cardDesc"><div>' + description + '</div></div>\n\
        <div class="cardFooter"></div>\n\
        <div class="cardRarity"></div>\n\
        </div>';
    }
        if (noName?.value() && noCost?.value() && noImage?.value() && noPowers?.value() && noTribes?.value() && noDesc?.value() && noStats?.value() && noRarity?.value() && whar?.value() !== "off") {
        var ext = card.extension.toUpperCase()
        var rar = card.rarity.toUpperCase()
        if (rar === "BASE") {rar = "NORMAL"};
        if (rar === "TOKEN") {rar = "NORMAL"};
        if (whar?.value() === "card back, no rarity") {rar = "NORMAL"};
        var link = "images\/cardBacks\/" + ext + "Card" + rar + ".png";
        htmlCard = '<div id="' + card.id + '" class="card ' + frameSkinName + '" data-rarity="' + card.rarity + '">\n\
        <div class="shinySlot" style="visibility: hidden;"></div>\n\
        <div class="cardFrame" style="background: url(' + link + ') no-repeat center;"></div>\n\
        <div class="cardBackground"></div>\n\
        <div class="cardHeader"></div>\n\
        <div class="cardName ' + cardSoul + '"><div>' + name + '</div></div>\n\
        <div class="cardCost">' + cost + '</div>\n\
        <div class="cardStatus"></div>\n\
        <div class="cardTribes"></div>\n\
        <div class="cardImage"></div>\n\
        <div class="cardDesc"><div>' + description + '</div></div>\n\
        <div class="cardFooter"></div>\n\
        <div class="cardRarity"></div>\n\
        </div>';
    }
    return htmlCard;
        }
    } createCard = newCreateCard
});

const checkSetInfoPowers = setInterval(() => {
 if (typeof setInfoPowers === 'function'){
    clearInterval(checkSetInfoPowers);
    function newSetInfoPowers(monsterContainer, card) {
    monsterContainer.find('.cardStatus').empty();
    if (card.typeCard === 0) {
        var $cardMaxHP = monsterContainer.find('.cardMaxHP');
        $cardMaxHP.html('/' + card.maxHp);
    }
    var powers = [];
    var powersType = [];
    var powersStringKeys = [];
    var powersStringArgs = [];
    var powersStringNumbers = [];
    var pool, printPool, poolArgs;
    const isPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
    }
    function pushPower(sprite, type, key, args, number){
        if (numStack?.value() && number){
            for (var i = 0; i < number; i++) {
                powers.push(sprite);
                powersType.push(type);
                powersStringKeys.push(key + '-stacked');
                powersStringArgs.push([]);
                powersStringNumbers.push(null);
            }
        } else {
            powers.push(sprite);
            powersType.push(type);
            powersStringKeys.push(key);
            powersStringArgs.push(args);
            powersStringNumbers.push(number);
        }
    };
    function setupPoolDisplay(args) {
        poolArgs = args
        pool = getCardsWithStats(...poolArgs);
        printPool = getCardsWithStats(...poolArgs, 'id', 1);
    }

    function activeFor(cardName) {
        var matchCard = getCardWithName(cardName).id;
        return !nvcsSoftDeactivate && card.id === matchCard && nvcs[card.baseImage+'Enabled']?.value();
    }
    for (const key in Object.values(nvcsCards(card))) {
        var c = nvcsCards(card)[key]
        if (!nvcsSoftDeactivate && card.id === getCardWithName(c.name).id && nvcs[c.key+'Enabled']?.value()) {
            setupPoolDisplay(...c.pool);
            pushPower(c.sprite, 'custom', c.transKey, [printPool], null);
            if (c.hasOwnProperty('pool2')) {
                setupPoolDisplay(...c.pool2);
                pushPower(c.sprite2, 'custom', c.transKey2, [printPool], null);
            }
        }
    }

    if (activeFor('Noellecoaster') && getCardsWithStats(allCards, ['typeCard', 'cost'], ['===', '==='], [1, card.cost])) {
        setupPoolDisplay([allCards, ['typeCard', 'cost'], ['===', '==='], [1, card.cost]]);
        pushPower('NVCSactive', 'custom', 'status-nvcs-noellecoaster-info', [printPool], null);
    } else if (activeFor('Noellecoaster')) {
        pushPower('NVCSinactive', 'custom', 'status-nvcs-noellecoaster-failed', [card.cost], null);
    }

    if (activeFor('Recycle Bin')) {
        setupPoolDisplay([allCards, ['typeCard', 'cost'], ['===', '==='], [1, card.hp]]);
        pushPower('NVCSactive', 'custom', 'status-nvcs-recyclebin-info-hp', [printPool], null);
        setupPoolDisplay([allCards, ['typeCard', 'cost'], ['===', '==='], [1, card.attack]]);
        pushPower('NVCSactive', 'custom', 'status-nvcs-recyclebin-info-atk', [printPool], null);
    }

    if (activeFor('Teacher Alphys') && typeof dustpile !== 'undefined') {
        function costCheck(cost) {
            if (Array.isArray(getCardsWithStats(dustpile, ['owner.id', 'cost'], [card.owner.id, cost])))
            { getCardsWithStats(dustpile, ['owner.id', 'cost'], [card.owner.id, cost]).length; }
        }
        pushPower('NVCSactive', 'custom', 'status-nvcs-talphys-info', [costCheck(1), costCheck(2), costCheck(3), costCheck(4), costCheck(5), costCheck(6), costCheck(7), costCheck(8), costCheck(9), costCheck(10)], null);
    }

    if (turnsPower?.value() && card.playedTurn > 0) {
        pushPower('turn', 'custom', 'status-turn', [Math.floor(card.playedTurn / 2), turn - Math.floor(card.playedTurn / 2)], Math.floor(card.playedTurn / 2));
    }

    if (!noCostBuffs?.value() && card.cost < card.originalCost) {
        pushPower('bonusCost', 'base', 'status-cost-debuff', [card.originalCost], null);
    }

    if (!noCostBuffs?.value() && card.cost > card.originalCost) {
        pushPower('malusCost', 'base', 'status-cost-buff', [card.originalCost], null);
    }

    if (card.rarity === "DETERMINATION") {
        pushPower('determination', 'base', 'status-determination', [], null);
    }

    if (card.loop > 0) {
        pushPower('loop', 'base', 'status-loop', [card.loop], card.loop);
    }

    if (programPower?.value() && card.program > 0) {
        pushPower('program', 'custom', 'status-program', [card.program], card.program);
    }

    if (targetPower?.value() && card.target != undefined) {
        pushPower('target', 'custom', 'status-target', [card.target], null);
    }

    if (shinyPower?.value() && card.shiny) {
        pushPower('shiny', 'custom', 'status-shiny', [], null);
    }

    if (fullartPower?.value() && card.typeSkin === 2) {
        pushPower('fullart', 'custom', 'status-fullart', [], null);
    }

    if (legendPower?.value() && card.owner?.oldDivision === 'LEGEND') {
        pushPower('legendmaker', 'custom', 'status-legend', [], null);
    }

    if (card.typeCard === 0) {

        if (totemPower?.value() && (card.originalHp === 7 || card.originalCost === 7)) {
            pushPower('totem', 'custom', 'status-totem', [], null);
        }

        if (card.taunt) {
            pushPower('taunt', 'base', 'status-taunt', [], null);
        }

        if (card.charge) {
            pushPower('charge', 'base', 'status-charge', [], null);
        }

        if (card.haste) {
            pushPower('haste', 'base', 'status-haste', [], null);
        }

        if (!noStatBuffs?.value() && card.attack > card.originalAttack) {
            pushPower('bonusAtk', 'base', 'status-atk-buff', [card.originalAttack], null);
        }

        if (!noStatBuffs?.value() && card.attack < card.originalAttack) {
            pushPower('malusAtk', 'base', 'status-atk-debuff', [card.originalAttack], null);
        }

        if (!noStatBuffs?.value() && card.maxHp > card.originalHp) {
            pushPower('bonusHp', 'base', 'status-hp-buff', [card.originalHp], null);
        }

        if (!noStatBuffs?.value() && card.maxHp < card.originalHp) {
            pushPower('malusHp', 'base', 'status-hp-debuff', [card.originalHp], null);
        }

        var baseCard = getCard(card.fixedId);

        if (!noBaseStats?.value() && (baseCard.hp !== card.originalHp || baseCard.attack !== card.originalAttack || baseCard.cost !== card.originalCost)) {
            var baseCardTranslated = $.i18n('{{CARD:' + card.fixedId + '|1}}');
            pushPower('baseStatChange', 'base', 'status-base-stat-change', [baseCardTranslated, baseCard.cost, baseCard.attack, baseCard.hp, card.originalCost, card.originalAttack, card.originalHp], null);
        }

        if (card.paralyzed) {
            pushPower('paralyzed', 'base', 'status-paralyzed', [], null);
        }

        if (card.candy) {
            pushPower('candy', 'base', 'status-candy', [], null);
        }

        if (card.kr) {
            pushPower('poison', 'base', 'status-kr', [], null);
        }

        if (card.armor) {
            pushPower('armor', 'base', 'status-armor', [], null);
        }

        if (card.dodge > 0) {
            pushPower('dodge', 'base', 'status-dodge', [card.dodge], card.dodge);
        }

        if (card.burn > 0) {
            pushPower('burn', 'base', 'status-burn', [card.burn], card.burn);
        }

        if (card.cantAttack) {
            pushPower('cantAttack', 'base', 'status-disarmed', [], null);
        }

        if (card.anotherChance) {
            pushPower('anotherChance', 'custom', 'status-another-chance', [], null);
        }

        if (card.invulnerable) {
            pushPower('invulnerable', 'base', 'status-invulnerable', [], null);
        }

        if (card.transparency) {
            pushPower('transparency', 'base', 'status-transparency', [], null);
        }

        if (!noSilence?.value() && card.silence) {
            pushPower('silenced', 'base', 'status-silenced', [], null);
        }

        if (card.caughtMonster !== undefined) {
            var caughtCardTranslated = $.i18n('{{CARD:' + card.caughtMonster.fixedId + '|1}}');
            pushPower('box', 'base', 'status-caught', [caughtCardTranslated, card.caughtMonster.owner.username], null);
        }

        if (card.shockEnabled) {
            pushPower('shock', 'base', 'status-shock', [], null);
        }

        if (card.supportEnabled) {
            pushPower('support', 'base', 'status-support', [], null);
        }

        if (card.bullseyeEnabled) {
            pushPower('bullseye', 'base', 'status-bullseye', [], null);
        }

        if (card.wanted) {
            pushPower('wanted', 'base', 'status-wanted', [], null);
        }

        if (deadPower?.value() && card.hp < 1) {
            pushPower('dead', 'custom', 'status-dead', [], null);
        }

        if (barrierPower?.value() && card.fixedId === 801) {
            pushPower('smellsLikeLemons', 'custom', 'status-smells-like-lemons', [], null);
            pushPower('immuneToMadjick', 'custom', 'status-immune-to-madjick', [], null);
        }
    }

        if (backgroundCheck?.value()) {
            pushPower('check', 'custom', 'status-check', [cardLog(card)], null);
        }

        if (primePower?.value() && isPrime(card.fixedId)) {
            pushPower('prime', 'custom', 'status-prime', [card.fixedId], null);
        }

    if (!noGenerated?.value() && card.creatorInfo !== undefined && card.creatorInfo.typeCreator >= 0) {
        var creatorCardTranslated = '';
        if (card.creatorInfo.typeCreator === 0) {creatorCardTranslated = $.i18n('{{CARD:' + card.creatorInfo.id + '|1}}');}
        else if (card.creatorInfo.typeCreator === 1) {creatorCardTranslated = $.i18n('{{ARTIFACT:' + card.creatorInfo.id + '}}');}
        else if (card.creatorInfo.typeCreator === 2) {creatorCardTranslated = $.i18n('{{SOUL:' + card.creatorInfo.name + '}}');}
        pushPower('created', 'base', 'status-created', [creatorCardTranslated], null);
    }

    for (var i = 0; i < powersStringArgs.length; i++) {
        var args = powersStringArgs[i];

        for (var j = 0; j < args.length; j++) {
            args[j] = base64EncodeUnicode(args[j]);
        }
    }
    var spacing = !legacyPowers?.value() ? (powersStringKeys.length - 1) * powerSpacing?.value() > powerBounds?.value() ? powerBounds?.value() / (powersStringKeys.length - 1) : powerSpacing?.value() : powerSpacing?.value();
    for (var i = 0; i < powersStringKeys.length; i++) {

        var $cardContainerImage = monsterContainer.find('.cardStatus');
        var url = powersType[i] === 'base' ? 'images/powers/' + powers[i] + '.png' : 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/' + powers[i] + '.png';
        $cardContainerImage.append('<img style="right: ' + (i * spacing) + 'px;" power="' + powers[i] + '" class="infoPowers helpPointer" src="' + url + '" oncontextmenu="displayStatusStringKey(' + formatArgs(powersStringKeys[i], powersStringArgs[i]) + ');">');

        if (powersStringNumbers[i] !== null) {
            $cardContainerImage.append('<span style="right: ' + (i * spacing) + 'px;" class="infoPowersDetails helpPointer" oncontextmenu="displayStatusStringKey(' + formatArgs(powersStringKeys[i], powersStringArgs[i]) + ');">' + powersStringNumbers[i] + '</span>');
        }
    }

    var tribes = card.tribes;

    if (tribes.indexOf('ALL') > -1) {
        var $cardContainerImage = monsterContainer.find('.cardTribes');
        $cardContainerImage.append('<img style="right: 4px;" class="tribe helpPointer" src="images/tribes/ALL.png" oncontextmenu="showTribeCards(\'ALL\');"/>');
    } else {
        for (var i = 0; i < tribes.length; i++) {
            var cardContainerImage = monsterContainer.find('.cardTribes');
            cardContainerImage.append('<img style="right: ' + (i * 20) + 'px;" class="tribe helpPointer" src="images/tribes/' + tribes[i] + '.png" oncontextmenu="showTribeCards(\'' + tribes[i] + '\');"/>');
        }
    }
}} setInfoPowers = newSetInfoPowers
});
const checkIsRemoved = setInterval(() => {
    const ignorePaths = ['/CardSkinsShop', '/Translate']
    if (ignorePaths.includes(window.location.pathname)){
        console.log('isRemoved: page ignored.');
        clearInterval(checkIsRemoved);
        return;
    }
    if (typeof isRemoved === 'function'){
        clearInterval(checkIsRemoved);
        function newIsRemoved(card) {
        var removed = false;
        if (window.location.pathname === '/Crafting') {
            removed = card.shiny !== $('#shinyInput').prop('checked');
        }
        if (!removed) {
        var rarities = [];
            $(".rarityInput").each(function (index) {
                if ($(this).prop('checked')) {
                    rarities.push($(this).attr('rarity'));
                }
            });

            if (rarities.length > 0) {
                removed = !rarities.includes(card.rarity);
            }
        }
        if (!removed) {
            var base = $('#baseRarityInput').prop('checked');
            var gen = $('#tokenRarityInput').prop('checked');
            if ($('#baseGenInput').prop('checked') && !$('#baseGenInput').is(':disabled')) {
                base = true
                gen = true
            }
            if (!base) {
                removed = card.rarity === "BASE";
            }
            if (!gen && !removed) {
                removed = card.rarity === "TOKEN";
            }
        }

        if (!removed) {
            var monster = $('#monsterInput').prop('checked');
            var spell = $('#spellInput').prop('checked');

            if (monster && !spell) {
                removed = card.typeCard !== 0;
            } else if (!monster && spell) {
                removed = card.typeCard !== 1;
            }
        }

        if (!removed && $('#costInput').length) {
            var cost = $('#costInput').val();
            var atk = $('#atkInput').val();
            var hp = $('#hpInput').val();

            if (card.typeCard == 1) {
                removed = atk.length > 0 || hp.length > 0;
            }

            if (cost.length > 0 && !removed) {
            removed = card.cost != cost;
            }

            if (atk.length > 0 && !removed) {
            removed = card.attack != atk;
            }

            if (hp.length > 0 && !removed) {
            removed = card.hp != hp;
            }
        }
        if (!removed) {

            var undertale = $('#undertaleInput').prop('checked');
            var deltarune = $('#deltaruneInput').prop('checked');
            var uty = $('#utyInput').prop('checked');
            var checkedExtensions = [];

            if (undertale) {
                checkedExtensions.push("BASE");
            }

            if (deltarune) {
                checkedExtensions.push("DELTARUNE");
            }

            if (uty) {
                checkedExtensions.push("UTY")
            }

            if (checkedExtensions.length > 0) {
                removed = checkedExtensions.indexOf(card.extension) === -1;
            }
        }

        //Search
        if (!removed) {
            var searchValue = $('#searchInput').val().toLowerCase();

            if (searchValue.length > 0) {

                var findableString = "";

                findableString += $.i18n('card-name-' + card.id, 1);
                findableString += $.i18n('card-' + card.id);

                for (var i = 0; i < card.tribes.length; i++) {
                    var tribe = card.tribes[i];
                    findableString += $.i18n('tribe-' + tribe.toLowerCase().replace(/_/g, '-'));
                }

                if (card.hasOwnProperty('soul')) {
                    findableString += $.i18n('soul-' + card.soul.name.toLowerCase().replace(/_/g, '-'));
                }
                if (!$.i18n('card-alias-' + card.fixedId).includes("card-alias")) {
                    findableString += $.i18n('card-alias-' + card.fixedId);
                }
                var finalString = findableString.toLowerCase().replace(/(<.*?>)/g, '');

                removed = !finalString.includes(searchValue);
            }
        }
    return removed;
}} isRemoved = newIsRemoved;
});

const checkUpdateCardVisual = setInterval(() => {
    if (typeof updateCardVisual === 'function'){
        clearInterval(checkUpdateCardVisual);
        function newUpdateCardVisual($htmlCard, card) {
        var $cardCost = $htmlCard.find('.cardCost');
        $cardCost.html(card.cost);
        $cardCost.removeClass('cost-buff').removeClass('cost-debuff');

        if (card.cost > card.originalCost) {
            $cardCost.addClass('cost-debuff');
        } else if (card.cost < card.originalCost) {
            $cardCost.addClass('cost-buff');
        }
        if (card.typeCard === 1) {return;}

        var $cardHP = $htmlCard.find('.currentHP');
        var $cardMaxHP = $htmlCard.find('.maxHP');
        $cardHP.html(statBase?.value() * card.hp);
        $cardMaxHP.html('');
        var hpSquish, maxHpSquish;
        if (maxHpIndicator?.value() !== 'off' && (maxHpIndicator?.value() === 'always show' || card.hp < card.maxHp)) {
            $cardMaxHP.html('/' + (statBase?.value() * card.maxHp));
            for (let i = card.maxHp.toString().length - card.hp.toString().length; i > 0; i--) {
                $cardHP.prepend(' ');
            }
            for (let i = card.hp.toString().length - card.maxHp.toString().length; i > 0; i--) {
                $cardMaxHP.append(' ');
            }
            switch (card.hp.toString().length) {
                case 1: hpSquish = 1; break;
                case 2: hpSquish = 0.8; break;
                case 3: hpSquish = 0.7; break;
                case 4: hpSquish = 0.55; break;
                default: maxHpSquish = 0.3; break;
            }
            switch (card.maxHp.toString().length) {
                case 1: maxHpSquish = 1; break;
                case 2: maxHpSquish = 0.8; break;
                case 3: maxHpSquish = 0.55; break;
                case 4: maxHpSquish = 0.35; break;
                default: maxHpSquish = 0.25; break;
            }
            $cardHP.attr("style", `transform: scaleX(${hpSquish})`);
            $cardMaxHP.attr("style", `transform: scaleX(${maxHpSquish})`);
        }

        if (card.hp < card.maxHp) {
            $cardHP.removeClass('damaged').addClass('damaged');
        } else {
            $cardHP.removeClass('damaged');

            if (card.maxHp > card.originalHp) {
                $cardHP.removeClass('hp-buff').addClass('hp-buff');
            } else {
                $cardHP.removeClass('hp-buff');
            }
        }

        var $cardATK = $htmlCard.find('.cardATK');
        $cardATK.html(frameSpoof?.value() === 'Pokecard 1996' ? 10 : 1 * card.attack);

        if (card.paralyzed > 0) {
            $htmlCard.removeClass('paralyzed').addClass('paralyzed');
        } else {
            $htmlCard.removeClass('paralyzed');

            $cardATK.removeClass('attack-buff').removeClass('attack-debuff');

            if (card.attack > card.originalAttack) {
                $cardATK.addClass('attack-buff');
            } else if (card.attack < card.originalAttack) {
                $cardATK.addClass('attack-debuff');
            }
        }

        if (card.silence) {
            $htmlCard.find('.cardSilence').css('background', 'transparent url("images/cardAssets/silence.png") no-repeat');
        }
}} updateCardVisual = newUpdateCardVisual;
});




function initSpice() {
  var divisions = ["COPPER", "IRON", "GOLD", "EMERALD", "SAPPHIRE", "AMETHYST", "RUBY", "DIAMOND", "ONYX", "MASTER", "LEGEND",
                  "FREE CSGO SKINS", "ඞ", "SKIM MILK", "BRONZE", "WOOD", "PLATINUM", "FEATHER FALLING", "DEPTH STRIDER", "☟︎⚐︎❄︎ ☹︎✌︎❄︎✋︎☠︎✌︎💧︎",
                  "MAFIA BOSS", "NOVICE", "EXPERT", "PUSSY SHIT", "VBUCKS", "RACIST", "timothy", "KING CHARLES", "MISCHEVIOUS LITTLE FELLOW",
                  "SHARPNESS", "𝕾𝖔𝖕𝖍𝖎𝖘𝖙𝖎𝖈𝖆𝖙𝖊𝖉 𝕱𝖊𝖑𝖑𝖔𝖜", ":3", "SEX", "AMERICAN", "uhhh green ?", "MALE", "FEMALE", "GENDER NONCONFORMING"];
    function randDivision() {
        var result = divisions[Math.floor(Math.random() * divisions.length)];
        divisions.splice(divisions.indexOf(result), 1);
        return result;
    }
    if (!$) return;
    $.i18n().load({
        "chat-unknown-command": "fuck kinda spells u casting",
        "chat-not-connected": "they left u. they think u lame as hell",
        "chat-disconnected": "it burns",
        "chat-spam-protection": "calm the fuck down",
        "chat-message-deleted": "#### ### ## # ###### ####### #####",
        "play-disabled-cards": "$1 is asleep right now. You can't wake them up.",
        "chat-link-outside": "ip grabber",
        "chat-new-legend": "$1 is pregnant. Wish them luck on this tough and difficult journey.",
        "chat-user-ws": "$1 is on an edging streak! Duration: $2 minutes",
        "chat-user-ws-stop": "$1 is making out sloppily with $2!",
        "chat-legendary-notification": "$2 has breached containment.",
        "chat-legendary-shiny-notification": "$1 and $2 are now happily married!",
        "game-mulligan-information": "does this shit even work",
        "game-promotion": "Demotion",
        "game-promotion-message": "You have been demoted to {{DIVISION:$1}}. Stay determined.",
        "game-demotion": "Promotion",
        "game-demotion-message": "Congratulations! You have reached {{DIVISION:$1}}!",
        "dialog-confirm": "Yeah",
        "game-results-title": "GRAHAG DSHSGSGA AHAG",
        "game-results-text": "I guess the real Undercards were the friends we made along the way.",
        "division-copper": randDivision(),
        "division-iron": randDivision(),
        "division-gold": randDivision(),
        "division-emerald": randDivision(),
        "division-sapphire": randDivision(),
        "division-amethyst": randDivision(),
        "division-ruby": randDivision(),
        "division-diamond": randDivision(),
        "division-onyx": randDivision(),
        "division-master": randDivision(),
        "division-legend": randDivision(),
    }, 'en');
}
function initUnusedCards() {
  if (!$) return;
  $.i18n().load({
    "card-name-0": "{{PLURAL:$1|Onutrem|Onutrems}}", "card-0": "\"The REAL fight finally begins.\"",
    "card-name-189": "{{PLURAL:$1|Same Fate|Same Fates}}", "card-189": "Change the {{HP}} of all monsters to 1.",
    "card-name-190": "{{PLURAL:$1|Brain Freeze|Brain Freezes}}", "card-190": "Trigger all ally {{KW:TURN_START}} and {{KW:TURN_END}} effects. Draw a card. End your turn.",
    "card-name-204": "{{PLURAL:$1|Break|Breaks}}", "card-204": "Return an ally monster to your hand and you get 20% of its {{COST}}.",
    "card-name-205": "{{PLURAL:$1|Dispatch|Dispatches}}", "card-205": "{{KW:ERASE}} two {{KW:GENERATED}} cards in your hand. Deal 3 {{DMG}} to a random enemy monster for each card erased.",
    "card-name-206": "{{PLURAL:$1|Explosion|Explosions}}", "card-206": "Deal 4 {{DMG}} to a monster. If this kills the monster, deal 3 {{DMG}} to adjacent monsters.",
    "card-name-207": "{{PLURAL:$1|Heal Delivery|Heal Deliveries}}", "card-207": "Restore 25 {{HP}} to you, remove all negative effects from your monsters and fully heal them.",
    "card-name-208": "{{PLURAL:$1|Sacrifice|Sacrifices}}", "card-208": "Kill an ally monster. Heal yourself by 4 {{HP}} and add a random {{KW:GENERATED}} {{TRIBE:LOST_SOUL|1}} to your hand with -2 {{COST}}.",
    "card-name-209": "{{PLURAL:$1|Blank|Blanks}}", "card-209": " ",
    "card-name-210": "{{PLURAL:$1|Bone Dog|Bone Dogs}}", "card-210": "Woof woof!",
    "card-name-211": "King's Gold", "card-211": "{{KW:DUST}}: Earn 99 {{GOLD}}.",
    "card-name-212": "{{PLURAL:$1|Long Sink Opened|Link Sinks Opened}}", "card-212": "...!",
    "card-name-213": "Teddy Bears", "card-213": "{{KW:TAUNT}}. {{KW:HASTE}}. {{KW:CANDY}}.",
    "card-name-230": "Mr Pipis", "card-230": "{{KW:DISARMED}}. {{KW:TURN_START}}: Die to give all monsters in your hand and board {{STATS:+1|+1}}.",
    "card-name-231": "Original Pipis", "card-231": "{{KW:DISARMED}}. {{KW:TURN_START}}: Die to turn all monsters in your hand and board into {{CARD:274|2}}.",
    "card-name-232": "{{PLURAL:$1|Stripped Bird|Stripped Birds}}", "card-232": ";)",
    "card-name-233": "{{PLURAL:$1|New Cut Flowey|New Cut Floweys}}", "card-233": "{{KW:HASTE}}. {{KW:MAGIC}}: Summon a {{CARD:54|1}} on EVERY empty board space.",
    "card-name-234": "{{PLURAL:$1|Spider Hanger|Spider Hangers}}", "card-234": "{{KW:DELAY}}: If this is dead, add 2 {{CARD:475|2}} to your hand and 2 {{CARD:476|2}} to your deck.",
    "card-name-268": "{{PLURAL:$1|Lava NPC|Lava NPCs}}", "card-268": " ",
    "card-name-269": "{{PLURAL:$1|Lava Creature|Lava Creatures}}", "card-269": "{{KW:FUTURE}} (6): Summon 2 {{STATS:2|2}} {{CARD:268|2}} on adjacent slots. {{KW:SHOCK}}: Trigger its {{KW:FUTURE}} effect 1 turn earlier (min. 1).",
    "card-name-319": "{{PLURAL:$1|Bridge Seed Open|Bridge Seeds Open}}", "card-319": "You failed the puzzle!",
    "card-name-320": "{{PLURAL:$1|Starwalker Bird.png|Starwalker Birds.png}}", "card-320": "Big boner down the lane.",
    "card-name-321": "{{PLURAL:$1|Timer2|Timers2}}", "card-321": "{{KW:MAGIC}}: Set the turn time to 20 seconds for the rest of the game.",
    "card-name-322": "{{PLURAL:$1|Timer1|Timers1}}", "card-322": "{{KW:MAGIC}}: Set the turn time to 10 seconds for the rest of the game.",
    "card-name-323": "{{PLURAL:$1|Timer0|Timers0}}", "card-323": "{{KW:TURN_END}}: Skip the enemy turn.",
    "card-name-324": "Building Bricks", "card-324": "{{KW:HASTE}}. {{KW:TAUNT}}. {{KW:MAGIC}}: {{KW:ERASE}} 5 {{CARD:324|1}}.",
    "card-name-325": "The Runaway", "card-325": "Return all ally monsters to your hand.",
    "card-name-326": "Light the Way", "card-326": "Reveal the next 5 cards in your deck to you. Give them -1 {{COST}}.",
    "card-name-327": "The Perfect Mix", "card-327": "Add 16 {{CARD:429|16}}, {{CARD:428|16}}, and {{CARD:430|16}} to your deck.",
    "card-name-328": "Bootleg Figurine", "card-328": "Add a {{CARD:688|1}} to your hand with the {{COST}}, {{ATK}}, {{HP}}, and static keywords of a random monster.",
    "card-name-329": "Pancakes!", "card-329": "Add 7 {{CARD:868}} to your hand.",
    "card-name-330": "Unknown Power", "card-330": "Promote to {{DIVISION:LEGEND}}!",
    "card-name-331": "Encoded Knowledge", "card-331": "{{KW:MAGIC|override=📕}}{{KW:DUST|override=📗}}{{KW:CHARGE|override=📘}}{{KW:HASTE|override=📙}}{{KW:ARMOR|override=📕}}{{KW:DISARMED|override=📗}}{{KW:CANDY|override=📘}}{{KW:TURN_START|override=📙}}<br>{{KW:TURN_END|override=📕}}{{KW:FUTURE|override=📗}}{{KW:FATIGUE|override=📘}}{{KW:TURBO|override=📙}}{{KW:SUPPORT|override=📕}}{{KW:PARALYZE|override=📗}}{{KW:SILENCE|override=📘}}{{KW:TRANSPARENCY|override=📙}}<br>{{KW:INVULNERABLE|override=📕}}{{KW:TAUNT|override=📗}}{{KW:DODGE|override=📘}}{{KW:THORNS|override=📙}}{{KW:BURN|override=📕}}{{KW:SYNERGY|override=📗}}{{KW:SHOCK|override=📘}}{{KW:DELAY|override=📙}}<br>{{KW:GENERATED|override=📕}}{{KW:NEED|override=📗}}{{KW:LOOP|override=📘}}{{KW:PROGRAM|override=📙}}{{KW:SWITCH|override=📕}}{{KW:CATCH|override=📗}}{{KW:BULLSEYE|override=📘}}{{KW:WANTED|override=📙}}",
    "card-name-332": '<iframe width="560" height="315" src="https://www.youtube.com/embed/Sg5m-BaILnA?si=k0g9545mt9PHYGR3" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>', "card-332": "one of the card names is just a dougdoug video idk i thought it was funny",
    "card-name-333": "TEST", "card-333": "TEST",
    "card-name-334": "TEST", "card-334": "TEST",
    "card-name-335": "TEST", "card-335": "TEST",
    "card-name-336": "TEST", "card-336": "TEST",
    "card-name-348": "TEST", "card-348": "TEST",
  }, 'en');
}

function initAliases() {
  if (!$) return;
  $.i18n().load({
    "card-alias-8": "mommy",
    "card-alias-30": "bp",
    "card-alias-38": "rg1",
    "card-alias-39": "rg2",
    "card-alias-60": "paps",
    "card-alias-62": "asdree",
    "card-alias-64": "mttex mtt ex",
    "card-alias-66": "wtf",
    "card-alias-68": "achance",
    "card-alias-69": "fmemory",
    "card-alias-71": "fenergy",
    "card-alias-82": "merchire",
    "card-alias-88": "btreat",
    "card-alias-89": "pgas polgas pollgas pollugas",
    "card-alias-92": "fon",
    "card-alias-95": "tow",
    "card-alias-106": "undyne the undying",
    "card-alias-110": "mttneo mtt neo",
    "card-alias-117": "of",
    "card-alias-140": "polibear",
    "card-alias-145": "db1",
    "card-alias-146": "db2",
    "card-alias-150": "ncg",
    "card-alias-183": "pod",
    "card-alias-201": "dmtt",
    "card-alias-203": "aod",
    "card-alias-214": "casdyne",
    "card-alias-239": "snowsign",
    "card-alias-254": "cpaps",
    "card-alias-258": "bq",
    "card-alias-262": "mmm",
    "card-alias-267": "crystomb ctomb",
    "card-alias-296": "wormjar wormsjar jow",
    "card-alias-299": "polibear",
    "card-alias-315": "rg3",
    "card-alias-316": "rg4",
    "card-alias-318": "falvin",
    "card-alias-414": "pmascot",
    "card-alias-421": "astruck asstruck",
    "card-alias-437": "shyagent sagent ralsei neo",
    "card-alias-453": "cotg",
    "card-alias-455": "phouse",
    "card-alias-471": "cblaster",
    "card-alias-490": "pod",
    "card-alias-503": "libloox",
    "card-alias-504": "blancer",
    "card-alias-505": "skris",
    "card-alias-508": "hoodsei hsei",
    "card-alias-515": "hhathy",
    "card-alias-520": "absart abs art",
    "card-alias-531": "ttoriel",
    "card-alias-532": "etdb",
    "card-alias-533": "gertomb gtomb",
    "card-alias-573": "elimduck elim duck",
    "card-alias-579": "bqueen",
    "card-alias-581": "gmascot",
    "card-alias-642": "pblook",
    "card-alias-661": "cws cyber sign",
    "card-alias-673": "bplush",
    "card-alias-700": "vb",
    "card-alias-707": "captn rouxl",
    "card-alias-714": "cjester",
    "card-alias-716": "rpaps",
    "card-alias-717": "sneo",
    "card-alias-726": "pkris",
    "card-alias-734": "cwire",
    "card-alias-742": "cg1",
    "card-alias-743": "cg2",
    "card-alias-754": "fheads",
    "card-alias-756": "spamshop sshop",
    "card-alias-758": "bneo",
    "card-alias-760": "butsei",
    "card-alias-761": "bstatue",
    "card-alias-763": "cpanel",
    "card-alias-767": "bdancer baldancer balancer",
    "card-alias-772": "jfs",
    "card-alias-773": "shytomb stomb",
    "card-alias-774": "dlancer dancer",
    "card-alias-775": "galadino",
    "card-alias-776": "tlights",
    "card-alias-782": "talphys",
    "card-alias-794": "gq",
    "card-alias-815": "dalvdrobe",
    "card-alias-828": "mommy",
    "card-alias-838": "zmartlet",
    "card-alias-848": "sansino csans",
    "card-alias-853": "chutomb ctomb",
    "card-alias-869": "galadino",
  }, 'en');
}

function initMulliganInfo() {
    if (!ingame) return;
    const waitForMulligan = setInterval(() => {
    if ($('.bootstrap-dialog-message > p').length) { // waits for the mulligan message to show up
        clearInterval(waitForMulligan);
        var enemySoul = $('.soul:first').children().attr('class');
        var enemyUser = $('#enemyUsername').text();
        var player = `<img src="/images/souls/${enemySoul}.png"> <span class="${enemySoul}">${enemyUser}</span>`
        const introductions = [`${player} challenges you to a Dual!`,
                              `Fighting ${player}!`,
                              `${player} enters through a graceful misty fog...`,
                              `${player} enters the scene!`,
                              `${player} approaches!`,
                              `${player} sniped you.`,
                              `${player} wants to win! Are you just gonna let that happen?`,
                              `C-could it be? It's the one and only ${player}...`,
                              `...It's ${player}? Sorry, you're cooked.`,
                              `${player} gracefully flops onto the battlefield like a fish.`,
                              `${player} releases a disgusting battle cry before charging at you.`,
                              `${player} tags along with the entire circus.`,
                              `${player} is looking at you funny.`,
                              `A wild ${player} appeared!`,
                              `You can smell ${player}'s rancid stench from here.`,
                              `${player} glares at you. You hear boss music.`,
                              `Well, you didn't expect ${player} to be here.`,
                              `Seventeen <img src="/images/souls/${enemySoul}.png"> <span class="${enemySoul}">${enemyUser}s</span> exit the clown car.`];
        function funnyIntro() {
            if (enemyUser === "Crystal") {
                return `<img src="/images/souls/${enemySoul}.png"> Free elo.`; // requested by crystal herself
            }
            if (enemyUser === "Sktima" || enemyUser === "Ahab" || enemyUser === "Diamaincrah") {
                return `<img src="/images/souls/${enemySoul}.png"> You're about to have a bad time.`;
            }
            if (enemyUser === "frogman") {
                return `Pet the <img src="/images/souls/${enemySoul}.png"> <span class="${enemySoul}">frog</span> :D`;
            }
            if (enemyUser === "Dware") {
                return `Beware the ${player}`;
            }
            if (enemyUser === "JaimeezNuts") {
                return `<img src="/images/souls/${enemySoul}.png"> <span class="${enemySoul}">rat</span>`;
            }
            if (enemyUser === "galadino") {
                return `${player} wanted his own entrance message. Here it is!`;
            }
            var result = introductions[Math.floor(Math.random() * introductions.length)];
            introductions.splice(introductions.indexOf(result), 1);
            return result;
        }
        var info = `${funnyIntro()}<br><br>
                    ${$('.golds:last').text() == 1 ? 'You go first.' : 'You go second.'}`;
        $('.bootstrap-dialog-message > p').html(info)
     }
    });
}

function initCustomPower() {
  if (!$) return;
  $.i18n().load({
    "status-dummy": "$1",
    "status-unsure": "You're unsure what this is.",
    "status-program": "This card's {{KW:PROGRAM}} subeffect will trigger if $1 {{GOLD}} is spent. It can also be copied by {{CARD:661|1}}.",
    "status-target": "This card's effect targets $1.",
    "status-turn": "This card was played on turn $1. It has lived for $2 {{PLURAL:$2|turn|turns}}.",
    "status-shiny": "This card is shiny.",
    "status-fullart": "This card has a border-breaking card skin on.",
    "status-dead": "This monster dead as hell.",
    "status-legend": "This card's owner got {{DIVISION:LEGEND}} last season.",
    "status-immune-to-madjick": "This card is imune to {{CARD:16|1}}.",
    "status-smells-like-lemons": "This card smells like lemons.",
    "status-totem": "This card is compatiable with {{CARD:545|1}}.",
    "status-prime": "This card's ID, $1, is a prime number! The more you know.",
    "status-check": "$1",
    "status-nvcs-pool": "This card currently pulls from the following cards: $1",
    "status-nvcs-barrier-info": "Barrier's {{DMG}} to the opponent: $1<br>$2",
    "status-nvcs-noellecoaster-info": "Noellecoaster's spell pulls currently include: $1",
    "status-nvcs-noellecoaster-failed": "There are no $1 {{COST}} spells. As such, Noellecoaster won't gain {{ATK}} or {{HP}}.",
    "status-nvcs-recyclebin-info-atk": "Recycle Bin's {{ATK}} spell pulls currently include:<br><br>$1",
    "status-nvcs-recyclebin-info-hp": "Recycle Bin's {{HP}} spell pulls currently include:<br><br>$1",
    "status-nvcs-recyclebin-failed": "There are no $1 {{COST}} spells. As such, the copy cannot transform.",
    "status-nvcs-talphys-info": "Teacher Alphys progress:<br>1-costs: $1<br>2-costs: $2<br>3-costs: $3<br>4-costs: $4<br>5-costs: $5<br>6-costs: $6<br>7-costs: $7<br>8-costs: $8<br>9-costs: $9<br>10-costs: $10<br>",
    "status-document": "It appears this monster has a missing Document in its mouth.<br><br>\"$1\"",
    "status-loop-stacked": "This card can trigger its {{KW:LOOP}} effect an additional time.",
    "status-program-stacked": "This card's {{KW:PROGRAM}} subeffect will trigger if an additional {{GOLD}} is spent. It can also be copied by {{CARD:661|1}}.",
    "status-turn-stacked": "This card was played an additional turn.",
    "status-dodge-stacked": "This monster will negate an additional instance of {{DMG}} to itself.",
  }, 'en');
}
function globalStyles() {
    style.append('.cardImage > img {visibility: hidden;}');
    style.append('#flashlight {position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; pointer-events:none; z-index: 100; image-rendering: pixelated;}');
    style.append('.cardsPreviewCompact {overflow-x: auto; display: flex; height: auto; width: 100%;}');
    style.append('.cardsPreviewCompact div {flex: 0 0 auto; box-sizing: border-box;}');
    style.append('.cardHP {overflow-x: visible; white-space: nowrap; display: flex; justify-content: center; align-items: baseline; white-space: pre;}');
    style.append('.currentHP {text-align: right; transform-origin: right; display: inline-block;}');
    style.append('.maxHP {text-align: left; font-size: 12px; color: gray; transform-origin: left; display: inline-block;}');
    style.append('#costInput, #atkInput, #hpInput {width: 33.33%; display: inline; padding-right: 0px;}');
    style.append('#costInput {color: #00d0ff}');
    style.append('#atkInput {color: #f0003c}');
    style.append('#hpInput {color: #0dd000}');
    style.append('input[disabled] {opacity: 0.3}');
}

var flashlightRadius;
function updateFlashlightRadius(f) {
    flashlightRadius = 4098 * f
    style.append(`#flashlight {background-size: ${flashlightRadius}px}`);
};

function updateFlashlightImg(f) {
    style.append(`#flashlight {background-image:url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/flashlightEffect${f === 'diffused' ? 'Alt' : ''}.png);}`);
};
function cardElBgFixOn() {
    style.append('.card.breaking-skin:hover .cardDesc,.cardName,.cardATK,.cardHP,.cardCost,.cardRarity {background-color: rgba(0, 0, 0, 0);}');
    style.append('.card.breaking-skin:hover .cardDesc, .breaking-skin:hover .cardName, .breaking-skin:hover .cardATK, .breaking-skin:hover .cardHP, .breaking-skin:hover .cardCost, .breaking-skin:hover .cardRarity {background-color: rgba(0, 0, 0, 0.7);}');
}
function cardElBgFixOff() {
    style.append('.card.breaking-skin:hover .cardDesc,.cardName,.cardATK,.cardHP,.cardCost,.cardRarity {background-color: rgba(0, 0, 0, 0.7);}');
    style.append('.card.breaking-skin:hover .cardDesc, .breaking-skin:hover .cardName, .breaking-skin:hover .cardATK, .breaking-skin:hover .cardHP, .breaking-skin:hover .cardCost, .breaking-skin:hover .cardRarity {background-color: rgba(0, 0, 0, 0);}');
}
function hide(element, visibility) {
    style.append(`.${element} {visibility: ${visibility ? "hidden" : "visible"}}`)
}
function imgPixel() {
    style.append('* {image-rendering: pixelated;}');
}
function imgUnpixel() {
    style.append('* {image-rendering: auto;}');
}
function barrierDark() {
    style.append('.vfx[src*="/images/vfx/BarrierBreak.png"] {filter: invert(100%)}');
}
function barrierUndark() {
    style.append('.vfx[src*="/images/vfx/BarrierBreak.png"] {filter: invert(0%)}');
}
function framesColorationOff() {
    style.append('.canPlay .cardFrame          {-webkit-filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(900%) contrast(1.5); filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(900%) contrast(1.5);}');
    style.append('.craftable .cardFrame        {-webkit-filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(900%) contrast(1.5); filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(900%) contrast(1.5);}');
    style.append('.fight .cardFrame            {-webkit-filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(310deg) saturate(1000%) contrast(1.5); filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(310deg) saturate(1000%) contrast(1.5);}');
    style.append('.doingEffect .cardFrame      {-webkit-filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(170deg) saturate(1000%) contrast(1.5); filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(170deg) saturate(1000%) contrast(1.5)}');
    style.append('.affected .cardFrame         {-webkit-filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(10deg) saturate(1000%) contrast(1.5); filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(10deg) saturate(1000%) contrast(1.5);}');
    style.append('.target .cardFrame           {-webkit-filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(250deg) saturate(1000%) contrast(1.5); filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(250deg) saturate(1000%) contrast(1.5);}');
}
function framesColorationOn() {
    style.append('.vfx[src*="/images/vfx/BarrierBreak.png"] {filter: invert(0%)}');
}
function siteFilter(l, i, z, a) { // lizard
    style.append(`html {filter: contrast(${l}%) blur(${i}px) grayscale(${z}%) invert(${a ? 100 : 0}%)}`);
}
function statsWhite() {
    style.append('.cardATK, .cardHP {color: white;}');
}
function statsUnwhite() {
    style.append('.cardATK {color: #f0003c;}');
    style.append('.cardHP {color: #0dd000;}');
}
function statsHide() {
    style.append('.cardATK, .cardHP {visibility: hidden;}');
    style.append('.undertale-frame.monster .cardFrame {background-image: url("/images/frameSkins/Undertale/frame_spell.png");}')
    style.append('.deltarune-frame.monster .cardFrame {background-image: url("/images/frameSkins/Deltarune/frame_spell.png");}')
    style.append('.time-to-get-serious-frame.monster .cardFrame {background-image: url("/images/frameSkins/Time_to_get_serious/frame_spell.png");}')
    style.append('.golden-frame.monster .cardFrame {background-image: url("/images/frameSkins/Golden/frame_spell.png");}')
    style.append('.vaporwave-frame.monster .cardFrame {background-image: url("/images/frameSkins/Vaporwave/frame_spell.png");}')
    style.append('.spider-party-frame.monster .cardFrame {background-image: url("/images/frameSkins/Spider_Party/frame_spell.png");}')
    style.append('.halloween2020-frame.monster .cardFrame {background-image: url("/images/frameSkins/Halloween2020/frame_spell.png");}')
    style.append('.christmas2020-frame.monster .cardFrame {background-image: url("/images/frameSkins/Christmas2020/frame_spell.png");}')
    style.append('.spamton-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-spell.png");}')
    style.append('.cyber-world-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-spell.png");}')
}
function statsShow() {
    style.append('.cardATK, .cardHP {visibility: visible;}');
    style.append('.undertale-frame.monster .cardFrame {background-image: url("/images/frameSkins/Undertale/frame_monster.png");}')
    style.append('.deltarune-frame.monster .cardFrame {background-image: url("/images/frameSkins/Deltarune/frame_monster.png");}')
    style.append('.time-to-get-serious-frame.monster .cardFrame {background-image: url("/images/frameSkins/Time_to_get_serious/frame_monster.png");}')
    style.append('.golden-frame.monster .cardFrame {background-image: url("/images/frameSkins/Golden/frame_monster.png");}')
    style.append('.vaporwave-frame.monster .cardFrame {background-image: url("/images/frameSkins/Vaporwave/frame_monster.png");}')
    style.append('.spider-party-frame.monster .cardFrame {background-image: url("/images/frameSkins/Spider_Party/frame_monster.png");}')
    style.append('.halloween2020-frame.monster .cardFrame {background-image: url("/images/frameSkins/Halloween2020/frame_monster.png");}')
    style.append('.christmas2020-frame.monster .cardFrame {background-image: url("/images/frameSkins/Christmas2020/frame_monster.png");}')
    style.append('.spamton-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-monster.png");}')
    style.append('.cyber-world-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-monster.png");}')
}
function initCustomFrames() {
    style.append('.spamton-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-shiny.gif");}');
    style.append('.spamton-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-spell.png");}');
    style.append('.spamton-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-monster.png");}');
    style.append('.spamton-frame .cardName, .spamton-frame .cardCost {top: 9px;}');
    style.append('.spamton-frame .cardDesc, .spamton-frame .cardSilence {top: 129px;}');
    style.append('.spamton-frame .cardATK, .spamton-frame .cardHP, .spamton-frame .cardRarity {top: 213px;}');
    style.append('.spamton-frame .cardQuantity, .spamton-frame .cardUCPCost {top: 240px;}');
    style.append('.cyber-world-frame .shinySlot {background-image: url("");}');
    style.append('.cyber-world-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-spell.png");}');
    style.append('.cyber-world-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-monster.png");}');
    style.append('.cyber-world-frame .cardName, .cyber-world-frame .cardCost {top: 9px;}');
    style.append('.cyber-world-frame .cardDesc, .cyber-world-frame .cardSilence {top: 129px;}');
    style.append('.cyber-world-frame .cardATK, .cyber-world-frame .cardHP, .cyber-world-frame .cardRarity {top: 213px;}');
    style.append('.cyber-world-frame .cardQuantity, .cyber-world-frame .cardUCPCost {top: 240px;}');
    style.append('.pokecard-1996-frame {font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;}');
    style.append('.pokecard-1996-frame .shinySlot {background-image: url("");}');
    style.append('.pokecard-1996-frame .cardFrame {background-size: 100%;}');
    style.append('.pokecard-1996-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-trainer.png");}');
    style.append('.pokecard-1996-frame.monster[data-rarity="BASE"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-base.png");}');
    style.append('.pokecard-1996-frame.monster[data-rarity="TOKEN"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-token.png");}');
    style.append('.pokecard-1996-frame.monster[data-rarity="COMMON"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-common.png");}');
    style.append('.pokecard-1996-frame.monster[data-rarity="RARE"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-rare.png");}');
    style.append('.pokecard-1996-frame.monster[data-rarity="EPIC"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-epic.png");}');
    style.append('.pokecard-1996-frame.monster[data-rarity="LEGENDARY"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-legendary.png");}');
    style.append('.pokecard-1996-frame.monster[data-rarity="DETERMINATION"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-determination.png");}');
    style.append('.pokecard-1996-frame .cardName, .pokecard-1996-frame .cardDesc, .pokecard-1996-frame .cardCost, .pokecard-1996-frame .cardATK {color: black;}');
    style.append('.pokecard-1996-frame .cardName {font-weight: 700; transform-origin: left; transform: scale(0.8, 1);}');
    style.append('.pokecard-1996-frame .cardHeader, .pokecard-1996-frame .cardFooter {background-color: rgba(0, 0, 0, 0);}');
    style.append('.pokecard-1996-frame.monster .cardName {top: 10px; left: 13px;}');
    style.append('.pokecard-1996-frame.spell .cardName {top: 37px; left: 14px;}');
    style.append('.pokecard-1996-frame.monster .cardCost {top: 201px; left: 125px; transform: scale(1, 0.5);}');
    style.append('.pokecard-1996-frame.spell .cardCost {top: 37px; left: 119px; text-align: right; transform: scale(1, 0.5);}');
    style.append('.pokecard-1996-frame.monster.standard-skin .cardImage {top: 28px; left: 0px; width: 175px; height: 105px}');
    style.append('.pokecard-1996-frame.spell.standard-skin .cardImage {top: 50px;}');
    style.append('.pokecard-1996-frame.monster .cardDesc {top: 130px; line-height: 1.2; left: 18px; transform-origin: left; transform: scale(0.7); text-align: left;}');
    style.append('.pokecard-1996-frame.spell .cardDesc {top: 144px; width: 140px; left: 18px; line-height: 1;}');
    style.append('.pokecard-1996-frame .cardDesc, .pokecard-1996-frame .cardSilence {top: 129px;}');
    style.append('.pokecard-1996-frame .cardDesc > div > span {font-weight: 700; color: black;}');
    style.append('.pokecard-1996-frame .cardATK {top: 158px; left: 130px;}');
    style.append('.pokecard-1996-frame .cardHP {top: 9px; left: 45px; font-weight: 700; color: red; width: 100px; transform-origin: right; transform: scale(0.6); text-align: right;}');
    style.append('.pokecard-1996-frame .cardHP:after {content: " HP"; font-size: 16px}');
    style.append('.pokecard-1996-frame .cardRarity {visibility: hidden}');
    style.append('.pokecard-1996-frame .cardQuantity, .pokecard-1996-frame .cardUCPCost {top: 238px; color: black; background-color: #FCD705; border: solid #FCD705; border-width: 0 2px 2px; border-radius:0 0 10px 10px; z-index: 12;}');
    style.append('.pokecard-1996-frame.monster .cardStatus {left: 91px; top: 207px;}');
    style.append('.pokecard-1996-frame.monster .cardStatus > img {max-width: 10px; width: 10px; max-height: 10px; height: 10px}');
    style.append('.pokecard-1996-frame.monster .cardTribes {left: 156px; top: 130px; filter: grayscale(100%)}');
    style.append('.pokecard-1996-frame.spell .cardTribes {right: 32px; top: 208px; filter: grayscale(100%)}');
    style.append('.pokecard-1996-frame.spell .cardStatus {left: 46px; top: 208px; filter: grayscale(100%)}');
    style.append('.pokecard-1996-frame.spell .cardStatus > img:nth-child(2) {left: 2px;}');
    style.append('.pokecard-1996-frame.spell .cardStatus > img:nth-child(3) {left: 20px;}');
    style.append('.pokecard-1996-frame.spell .cardStatus > img:nth-child(4) {left: 38px;}');
    style.append('.pokecard-1996-frame.spell .cardStatus > img:nth-child(5) {left: 56px;}');
    style.append('.pokecard-1996-frame.monster .cardTribes > img {max-width: 12px; width: 12px; max-height: 12px; height: 12px}');
    style.append('.pokecard-1996-frame.monster .cardTribes > img:not(:first-child) {visibility: hidden}');
    style.append('.vmas-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/vmas-frame-shiny.png"); opacity: 0.3; mix-blend-mode: hard-light;}');
    style.append('.vmas-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/vmas-frame-shiny-animated.gif"); opacity: 0.3; mix-blend-mode: hard-light;}');
    style.append('.vmas-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/vmas-frame-spell.png");}');
    style.append('.vmas-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/vmas-frame-monster.png");}');
    style.append('.vmas-frame .cardName, .vmas-frame .cardCost {top: 9px;}');
    style.append('.vmas-frame .cardDesc, .vmas-frame .cardSilence {top: 129px;}');
    style.append('.vmas-frame .cardATK, .vmas-frame .cardHP, .vmas-frame .cardRarity {top: 214px;}');
    style.append('.vmas-frame .cardQuantity, .vmas-frame .cardUCPCost {top: 240px;}');
}

function getValue(el, remove = false) {
  if (el.checked) {
    return 1;
  }
  return remove ? undefined : 0;
}

class plaintextSetting extends underscript.utils.SettingType {
  constructor() {
    super('plaintext');
  }
  element(value) {
    return document.createElement('span');
  }
}

const plaintext = new plaintextSetting();

class powerCheckboxSetting extends underscript.utils.SettingType {
  constructor() {
    super('powerCheckbox');
  }
  value(val) {
    if (typeof val === 'boolean') return val;
    return val === '1' || val === 'true';
  }
  default() {
    return false;
  }
  labelFirst() {
    return false;
  }
  element(value, update, {
    remove = false,
    data = {},
  }) {
    return $(`<input type="checkbox" class="powerCheckbox" style="position: relative; background: none; background-image: url(${data.src}); background-size: cover; border: none; width: 20px; height: 20px;">`)
      .prop('checked', value)
      .on('change.script', (e) => update(getValue(e.target, remove)))
  }
  styles() {
    return [
      ".powerCheckbox { opacity: 0.3; }",
      ".powerCheckbox:checked { opacity: 1 }",
      ".powerCheckbox:focus { outline: none; box-shadow: none; }",
      ];
    }
}

const powerCheckbox = new powerCheckboxSetting();
plugin.settings().addType(powerCheckbox);

class emoteBindsArraySetting extends window.underscript.utils.SettingType {
    constructor() {
        super('emoteBindsArray');
    }
    areDupesPresent(key = "", parent) {
        var rows = parent.children;
        var count = 0;
        for (var i=0; i < rows.length; i++) {
            var row = rows[i];
            count += (row.firstChild.firstChild.value === key);
        }
        return count > 1;
    }
    addRow(parent, key = "", value = "", prepend = false, valueUpdate, updateFn) {
        var row = document.createElement("DIV");
        row.className = "editableListRow";
        var keyCell = document.createElement("DIV");
        var separatorCell = document.createElement("DIV");
        var valueCell = document.createElement("DIV");
        var deleteCell = document.createElement("DIV");

        var error_popup = document.createElement("DIV");

        var prev_key = key;
        var keyInput = document.createElement("SELECT");
        keyInput.className = "form-control";
        keyInput.value = key;
        keyInput.oninput = (e) => {
            if (this.areDupesPresent(keyInput.value, parent)) {
                error_popup.classList.remove("hidden");
                keyInput.value = prev_key;
                return;
            }
            error_popup.classList.add("hidden");
            delete valueUpdate[prev_key];
            valueUpdate[keyInput.value] = valueInput.value;
            updateFn(valueUpdate);
            prev_key = key;
        };
        keyCell.appendChild(keyInput);
        $(keyInput).append(binds.map(bind => $('<option>').prop('selected', `${bind}` === key).attr('value', bind).text(bind)));
        error_popup.innerHTML = "no bind same thing that bad";
        error_popup.className = "red hidden editableListText";
        keyCell.appendChild(error_popup);

        separatorCell.innerHTML = `<div style="width: 1.2em; text-align: center; user-select: none;">→</div>`;

        var valueInput = document.createElement("SELECT");
        valueInput.className = "form-control";
        valueInput.value = value;
        valueInput.onblur = () => {
            valueUpdate[keyInput.value] = valueInput.value;
            updateFn(valueUpdate);
        };
        valueCell.appendChild(valueInput);
        $(valueInput).append(chatEmotes.map(emote => $('<option>').prop('selected', `${emote.id}` === value).attr('value', emote.id).text(emote.name)));

        var deleteButton = document.createElement("BUTTON");
        deleteButton.innerHTML = "-";
        deleteButton.onclick = () => {
            delete valueUpdate[keyInput.value];
            updateFn(valueUpdate);
            row.remove();
        }
        deleteButton.className = "btn btn-danger editableListTableButton";
        deleteCell.appendChild(deleteButton);

        row.appendChild(keyCell);
        row.appendChild(separatorCell);
        row.appendChild(valueCell);
        row.appendChild(deleteCell);

        if (prepend) {
            parent.prepend(row);
        } else {
            parent.appendChild(row);
        }
    }
    element(value, update, {
        data = undefined,
        remove = false,
        container,
        key = '',
    }) {
        var myValue = {...value};
        var myContainer = document.createElement("DIV");
        var table = document.createElement("DIV");
        table.className = "editableListTable";
        myContainer.appendChild(table);

        for (var key in myValue) {
            this.addRow(table, key, myValue[key], false, myValue, update);
        }

        container[0].appendChild(myContainer);

        var addButton = document.createElement("BUTTON");
        addButton.onclick = () => {this.addRow(table, "", "", true, myValue, update)};
        addButton.className = "btn btn-success editableListTableButton";
        addButton.innerHTML = "+";
        return addButton;
    }

    default() {
        return {};
    }

    value(val, data = undefined) {
        if (typeof(val) !== "object") {
            val = JSON.parse(val);
        }
        return val;
    }

    labelFirst() {
        return true;
    }
    styles() {
        return [
            ".editableListRow { display: flex; width: 292px; }",
            ".editableListRow div { padding: 0.2em; }",
            ".editableListRow select { padding: 3px 8px; height: 24px; width: 150px; color: white;}",
            ".editableListTable { width: 260px; margin: 2px 0 10px 0; padding: 10px 0; }",
            ".editableListTableButton.btn { padding: 0px 6px; }",
            ".editableListText { font-size: 0.8em; width: 100px }"
        ];
    }
}

const emoteBindsArray = new emoteBindsArraySetting();
plugin.settings().addType(emoteBindsArray);

const binds = ["unbound", "CapsLock", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "AltLeft", "AltRight", "Backslash", "Backspace", "Delete", "Backquote",
              "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0"];

const spice = plugin.settings().add({
  key: 'spice',
  name: '\"Spice\"',
  note: 'Adds a few dumb messages<br><br><span style="color:thistle;">Change applies on refresh</span>',
  default: false,
});

const cardAliases = plugin.settings().add({
  key: 'cardAliases',
  name: 'Card aliases',
  note: 'Cards can now be searched by popular aliases and shorthands<br>Examples: bneo, casdyne, and skris, when entered, show their respective cards<br>Doesn\'t currently work in card skins shop because I don\'t feel like torturing myself right now<br><br><span style="color:thistle;">Change applies on reload</span>',
  category: 'QoL',
  default: true,
});

const mulliganInfo = plugin.settings().add({
  key: 'mulliganInfo',
  name: 'Easy mulligan information',
  note: 'Displays turn order and opponent\'s name, SOUL, and artifacts on the Mulligan.',
  category: 'QoL',
  default: true,
});

const darkModeBarrier = plugin.settings().add({
  key: 'darkModeBarrier',
  name: 'Dark mode barrier animation',
  note: 'Fear not, for the eyeballs are saved...',
  category: 'QoL',
  default: true,
  onChange: (val) => {if (val) {barrierDark()} else {barrierUndark()}}
});

const statFilters = plugin.settings().add({
  key: 'statFilters',
  name: 'Stat filters',
  note: 'Adds custom cost, ATK, and HP filters on the Crafting and Decks pages.<br><br><span style="color:thistle;">Change applies on reload</span>',
  category: 'QoL',
  default: true,
});

const removeElementBackgrounds = plugin.settings().add({
  key: 'removeElementBackgrounds',
  name: 'Card element background fix',
  note: 'Fixes card element backgrounds to only show when<br>hovering over a fullart skin.',
  category: 'QoL',
  default: true,
  onChange: (val) => {if (val) {cardElBgFixOn()} else {cardElBgFixOff()}}
});

const loopNames = plugin.settings().add({
  key: 'loopNames',
  name: 'Loop gives cards plural names',
  note: 'When a card has 1 or more Loop, its name will be changed to its plural form<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Card rendering',
  default: false,
});

const maxHpIndicator = plugin.settings().add({
  key: 'maxHpIndicator',
  name: 'Max HP indicator',
  note: 'Adds an indicator in games that shows the monster\'s HP out of its max.<br><span style="color:thistle;">hide when full</span>: Doesn\'t display if the monster\'s HP is full.<br><span style="color:thistle;">always show</span>: Still displays if the monster\'s HP is full.',
  category: 'Card rendering',
  type: "select", options: ["off", "hide when full", "always show"],
  default: 'off',
});

const respectiveFrames = plugin.settings().add({
  key: 'respectiveFrames',
  name: 'Respective frames',
  note: 'UT and UTY cards use the Undertale frame, and DR cards use the Deltarune frame<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Card rendering',
  default: false,
});

const frameSpoof = plugin.settings().add({
  key: 'frameSpoof',
  name: 'Frame spoof',
  note: 'Changes ally cards to have any frame, including some custom ones!<br><br><span style="color:salmon;">Changing this setting will automatically refresh the page!</span>',
  category: 'Card rendering',
  type: "select", options: ["off", "Undertale", "Deltarune", "Time to get serious", "Golden", "Vaporwave", "Spider Party", "Halloween2020", "Christmas2020", "Spamton", "Cyber World", "VMas", "Pokecard 1996"],
  default: "off",
  onChange: (val) => {
      if (val === 'Pokecard 1996') {
          statBase.set('10')
          powerSpacing.set(135)
          powerBounds.set(53)
          legacyPowers.set(false)
          numStack.set(true)
      } else {
          statBase.set('1')
          powerSpacing.set(20)
          powerBounds.set(135)
          legacyPowers.set(false)
          numStack.set(false)
      } $('.underscript-dialog').modal('hide'); window.location.reload();
  }
});

const statBase = plugin.settings().add({
  key: 'statBase',
  name: 'Stat base numbers',
  note: 'Displays stats in multiples of 1, 10, or 100.<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Card rendering',
  type: "select", options: ["1", "10", "100"],
  default: "1",
  disabled: frameSpoof?.value() === 'Pokecard 1996'
});

const powerSpacing = plugin.settings().add({
  key: 'powerSpacing',
  name: 'Power spacing',
  note: 'Changes how close together or far powers are spaced from eachother<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Card rendering',
  type: "slider",
  min: 0,
  max: 135,
  step: 5,
  default: 20,
  reset: !frameSpoof?.value() === 'Pokecard 1996',
  disabled: frameSpoof?.value() === 'Pokecard 1996'
});

const powerBounds = plugin.settings().add({
  key: 'powerBounds',
  name: 'Power bounds',
  note: 'Changes how far powers can go up to<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Card rendering',
  type: "text",
  default: 135,
  reset: !frameSpoof?.value() === 'Pokecard 1996',
  disabled: frameSpoof?.value() === 'Pokecard 1996'
});

const legacyPowers = plugin.settings().add({
  key: 'legacyPowers',
  name: 'No power fitting',
  note: 'Do you prefer the powers hanging off the card, you sick freak?<br>Here you go :3<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Card rendering',
  default: false,
  disabled: frameSpoof?.value() === 'Pokecard 1996'
});

const numStack = plugin.settings().add({
  key: 'numStack',
  name: 'Powers iterate',
  note: 'Instead of numbers, powers iterate themselves<br><span style="color:thistle;">ex:</span> 3 Loop would appear as 3 seperate Loop icons,<br>not one Loop icon with a 3 on it.<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Card rendering',
  default: false,
  disabled: frameSpoof?.value() === 'Pokecard 1996'
});

const betterPowerNumbers = plugin.settings().add({
  key: 'betterPowerNumbers',
  name: 'Better power numbers',
  note: 'Styles power numbers to look... better<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Card rendering',
  default: true,
});

const keybindsInfo = plugin.settings().add({
  key: 'keybindsInfo',
  name: '<span style="color:thistle;">Keys cannot be bound to multiple actions.<br>If they are, the highest setting takes priority.</span>',
  category: 'Keybinds',
  type: plaintext,
});

const bgKeybind = plugin.settings().add({
  key: 'bgKeybind',
  name: 'Background reroll',
  note: 'Set the key used for rerolling the background<br><br><span style="color:salmon;">Holding the key down flashes the screen!<br>Not recommended :(</span>',
  category: 'Keybinds',
  type: "select", options: binds,
  default: "ShiftLeft",
});

const surrenderKeybind = plugin.settings().add({
  key: 'surrenderKeybind',
  name: 'Surrender',
  note: 'Sets the key used to surrender instantly<br><br>( Still can\'t surrender before the first player\'s t5 )',
  category: 'Keybinds',
  type: "select", options: binds,
  default: "unbound",
});

const openGalascriptKeybind = plugin.settings().add({
  key: 'openGalascriptKeybind',
  name: 'Open Galascript settings',
  note: 'Sets the key used to instantly open the Galascript settings!',
  category: 'Keybinds',
  type: "select", options: binds,
  default: "Backslash",
});

const resetFiltersKeybind = plugin.settings().add({
  key: 'resetFiltersKeybind',
  name: 'Reset filters',
  note: 'Sets the key used to reset filters,<br>in case you can\'t find your way back to the settings.<br>Also reloads the page!<br><br>feild this is a cry for help<br>please fix the set function',
  category: 'Keybinds',
  type: "select", options: binds,
  default: "Delete",
});

const emoteKeybinds = plugin.settings().add({
  key: 'emoteKeybinds',
  name: 'Emotes',
  note: 'Do emotes with keypresses',
  category: 'Keybinds',
  type: emoteBindsArray,
  default: {'Digit1':'1'},
});

const filtersInfo = plugin.settings().add({
  key: 'filtersInfo',
  name: '<span style="color:thistle;">Don\'t get lost! By default, pressing Delete will<br>turn off all filters.</span>',
  category: 'Filters',
  type: plaintext,
});

const crispiness = plugin.settings().add({
  key: 'crispiness',
  name: 'Crispiness',
  note: 'Changes how... <i>crispy</i> everything is.',
  category: 'Filters',
  type: "slider",
  min: 100,
  max: 500,
  step: 20,
  default: 100,
  reset: true,
  onChange: (val) => siteFilter(val, blurriness?.value(), greyscale?.value(), invert?.value())
});

const blurriness = plugin.settings().add({
  key: 'blurriness',
  name: 'Blurriness',
  note: 'It appears you have dropped your glasses...',
  category: 'Filters',
  type: "slider",
  min: 0,
  max: 5,
  step: 1,
  default: 0.1,
  reset: true,
  onChange: (val) => siteFilter(crispiness?.value(), val, greyscale?.value(), invert?.value())
});

const greyscale = plugin.settings().add({
  key: 'greyscale',
  name: 'Greyscale',
  note: 'companies after pride month',
  category: 'Filters',
  type: "slider",
  min: 0,
  max: 100,
  step: 10,
  default: 0.1,
  reset: true,
  onChange: (val) => siteFilter(crispiness?.value(), blurriness?.value(), val, invert?.value())
});

const invert = plugin.settings().add({
  key: 'invert',
  name: 'Invert',
  note: 'Its like were in some sort of... <b>Distorsion World</b>',
  category: 'Filters',
  onChange: (val) => siteFilter(crispiness?.value(), blurriness?.value(), greyscale?.value(), val)
});

const pixelImageRendering = plugin.settings().add({
  key: 'pixelImageRendering',
  name: 'Slightly shittier image rendering',
  note: 'Seen better on transparent images',
  category: 'Filters',
  default: false,
  onChange: (val) => {if (val) {imgPixel()} else {imgUnpixel()}
}});

const lightsOff = plugin.settings().add({
  key: 'lightsOff',
  name: '\"Dark\" mode',
  note: 'Makes the site dark, with your cursor being the only beacon of light...',
  category: 'Filters',
  default: false,
  onChange: (val) => {if (val) {createFlashlight()} else {removeFlashlight()}
}});

const flashlightRadiusInput = plugin.settings().add({
  key: 'flashlightRadiusInput',
  name: 'Flashlight radius',
  note: 'Changes how big or small the light radius is.',
  category: 'Filters',
  type: "slider",
  min: 1,
  max: 11,
  step: 1,
  default: 4,
  reset: true,
  onChange: (val) => updateFlashlightRadius(val)
});

const flashlightStyle = plugin.settings().add({
  key: 'flashlightStyle',
  name: 'Flashlight style',
  note: 'Changes how the light of the flashlight looks',
  category: 'Filters',
  type: "select", options: ["spotlight", "diffused"],
  default: "spotlight",
  onChange: (val) => updateFlashlightImg(val)
});


const noName = plugin.settings().add({
  key: 'noName',
  name: 'No names',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => hide('cardName', val)
});

const noCost = plugin.settings().add({
  key: 'noCost',
  name: 'No cost',
  note: 'too great',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => hide('cardCost', val)
});

const noImage = plugin.settings().add({
  key: 'noImage',
  name: 'No images',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => hide('cardImage', val)
});

const noPowers = plugin.settings().add({
  key: 'noPowers',
  name: 'No power icons',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => hide('cardStatus', val)
});

const noTribes = plugin.settings().add({
  key: 'noTribes',
  name: 'No tribe icons',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => hide('cardTribes', val)
});

const noDesc = plugin.settings().add({
  key: 'noDesc',
  name: 'No descriptions',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => hide('cardDesc', val)
});

const whiteStats = plugin.settings().add({
  key: 'whiteStats',
  name: 'White ATK / HP',
  note: 'Y\'know, back in my day...<br><br>i am now being notified the cost was white back then, not the other stats',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => {if (val) {statsWhite()} else {statsUnwhite()}
}});

const noStats = plugin.settings().add({
  key: 'noStats',
  name: 'No ATK / HP',
  note: 'Also forces the spell frame for monsters<br>breaks redirected frames if u have those on sorry',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => {if (val) {statsHide()} else {statsShow()}
}});

const noRarity = plugin.settings().add({
  key: 'noRarity',
  name: 'No rarities',
  category: 'Who needs information?',
  default: false,
  onChange: (val) => hide('cardRarity', val)
});

const whar = plugin.settings().add({
  key: 'whar',
  name: 'WHAR??????',
  note: 'If every element on the card is hidden, the card will<br>display as the back of the card instead of a blank frame<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Who needs information?',
  type: "select", options: ["off", "card back", "card back, no rarity"],
  default: "card back",
});

const wrongCardsInfo = plugin.settings().add({
  key: 'wrongCardsInfo',
  name: '<span style="color:thistle;">The following settings only work in games<br>or while spectating. Randomization is determined<br> by the gameId.</span>',
  type: plaintext,
  category: 'Who needs accurate information?',
});

const randomizationInfo = plugin.settings().add({
  key: 'randomizationInfo',
  name: 'ⓘ Randomization types',
  note: '<span style="color:thistle;">inheret:</span> Whatever the name randomizes to, this element will match it<br><span style="color:thistle;">random universal:</span> Same cards will randomize to the same thing (every X will be Y)<br><span style="color:thistle;">random unique:</span> Same cards randomize to different things (X may be Y, but all X aren\'t Y)',
  type: plaintext,
  category: 'Who needs accurate information?',
});

const wrongCardNames = plugin.settings().add({
  key: 'wrongCardNames',
  name: 'Wrong card names',
  note: 'Randomizes card names<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Who needs accurate information?',
  type: "select", options: ["off", "random universal", "random unique"],
  default: "off",
});

const wrongCardDescriptions = plugin.settings().add({
  key: 'wrongCardDescriptions',
  name: 'Wrong card descriptions',
  note: 'Changes card descriptions<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Who needs accurate information?',
  type: "select", options: ["off", "inherit", "random universal", "random unique"],
  default: "off",
});

const wrongCardImages = plugin.settings().add({
  key: 'wrongCardImages',
  name: 'Wrong card images',
  note: 'Changes card images<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Who needs accurate information?',
  type: "select", options: ["off", "inherit", "random universal", "random unique"],
  default: "off",
});

const wrongCardRarity = plugin.settings().add({
  key: 'wrongCardRarity',
  name: 'Wrong card rarity',
  note: 'Changes card rarity<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Who needs accurate information?',
  type: "select", options: ["off", "inherit", "random universal", "random unique"],
  default: "off",
});

const fillCardGaps = plugin.settings().add({
  key: 'fillCardGaps',
  name: 'Fill card gaps',
  note: 'Certain ranges of card IDs are completely missing.<br>This fills in those ranges with fun old or unused cards :D<br><br><span style="color:thistle;">Change applies on reload</span>',
  category: 'Who needs accurate information?',
  default: false,
});

const noGenerated = plugin.settings().add({
  key: 'noGenerated',
  name: 'No Generated',
  note: 'Hides generated power<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'I ate the information actually',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/createdUnknown.png' },
  type: powerCheckbox,
  default: false,
});

const noSilence = plugin.settings().add({
  key: 'noSilence',
  name: 'No silence',
  note: 'Hides silence power and background<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'I ate the information actually',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/silencedUnknown.png' },
  type: powerCheckbox,
  default: false,
  onChange: (val) => hide('cardSilence', val)
});

const noCostBuffs = plugin.settings().add({
  key: 'noCostBuffs',
  name: 'No cost buffs',
  note: 'Hides cost buff and debuff power<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'I ate the information actually',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/costUnknown.png' },
  type: powerCheckbox,
  default: false,
});

const noStatBuffs = plugin.settings().add({
  key: 'noStatBuffs',
  name: 'No ATK / HP buffs',
  note: 'Hides ATK / HP buff and debuff powers<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'I ate the information actually',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/statsUnknown.gif' },
  type: powerCheckbox,
  default: false,
});

const noBaseStats = plugin.settings().add({
  key: 'noBaseStats',
  name: 'No base stat change',
  note: 'Hides base stat change power<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'I ate the information actually',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/baseStatChangeUnknown.png' },
  type: powerCheckbox,
  default: false,
});

const programPower = plugin.settings().add({
  key: 'programPower',
  name: 'Program',
  note: 'Displays the program value<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/program.png' },
  type: powerCheckbox,
  default: false,
});

const targetPower = plugin.settings().add({
  key: 'targetPower',
  name: 'Target',
  note: 'Displays the card\'s valid board targets<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/target.png' },
  type: powerCheckbox,
  default: false,
});

const turnsPower = plugin.settings().add({
  key: 'turnsPower',
  name: 'Turn played',
  note: 'Displays the turn a card was played<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/turn.png' },
  type: powerCheckbox,
  default: false,
});

const shinyPower = plugin.settings().add({
  key: 'shinyPower',
  name: 'Shiny',
  note: 'Displays when card is shiny<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/shiny.png' },
  type: powerCheckbox,
  default: false,
});

const fullartPower = plugin.settings().add({
  key: 'fullartPower',
  name: 'Fullart skin',
  note: 'Displays if the card has a breaking skin<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/fullart.png' },
  type: powerCheckbox,
  default: false,
});

const deadPower = plugin.settings().add({
  key: 'deadPower',
  name: 'Dead',
  note: 'Displays if the card has 0 or less HP<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/dead.png' },
  type: powerCheckbox,
  default: false,
});

const legendPower = plugin.settings().add({
  key: 'legendPower',
  name: 'Legendmaker',
  note: 'Displays if the card\'s owner got LEGEND last season<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/legendmaker.png' },
  type: powerCheckbox,
  default: false,
});

const totemPower = plugin.settings().add({
  key: 'totemPower',
  name: 'Totem drop',
  note: 'Displays if the card has base 7 cost or HP<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/totem.png' },
  type: powerCheckbox,
  default: false,
});

const barrierPower = plugin.settings().add({
  key: 'barrierPower',
  name: 'The Barrier',
  note: 'How else would you know such <i>crucial</i> information about The Barrier?<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/barrierPowers.gif' },
  type: powerCheckbox,
  default: false,
});

const primePower = plugin.settings().add({
  key: 'primePower',
  name: 'Prime',
  note: 'Displays if the monster\'s card ID is a prime number<br><br><span style="color:thistle;">Change applies on card update</span>',
  category: 'Too many powers!!!',
  data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/prime.png' },
  type: powerCheckbox,
  default: false,
});

const backgroundCheck = plugin.settings().add({
    key: 'backgroundCheck',
    name: 'Check',
    note: 'Always displays, giving all of a card\'s currently stored information<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/check.png' },
    type: powerCheckbox,
    default: false,
});

const nvcsInfo = plugin.settings().add({
    key: 'nvcsInfo',
    name: `
    Here, you can turn on specific information about
    <br>cards! <span style="color:salmon;">Fair warning: The bigger the pool, the
    <br>more the card will bog the game down!</span>
    `,
    category: 'NVCS',
    type: plaintext,
});

for (const key in Object.values(nvcsCards())) {
    card = nvcsCards()[key]
    nvcs[`${card.key}Enabled`] = plugin.settings().add({
        key: `${card.key}Enabled`,
        name: card.name,
        note: card.info,
        category: 'NVCS',
        data: { src: `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${card.sprite}.png` },
        type: powerCheckbox,
        default: false,
    });
}

const versionInfo = plugin.settings().add({
    key: 'versionInfo',
    name: `Version ${pluginVersion}`,
    note: patchNotes,
    type: plaintext,
    category: 'Galascript',
});

document.addEventListener("keydown", function(event) { // process keybinds
  if (event.target.getAttribute("type") !== 'text') { // if not in a text field
    switch (event.code) {
      case bgKeybind?.value():
        if (!ingame) break;
        numBackground = randomInt(1, 59);
        $('body').css('background', '#000 url(\'images/backgrounds/' + numBackground + '.png\') no-repeat');
        $('body').css('background-size', 'cover');
        music.pause();
        playBackgroundMusic(numBackground);
        break;
      case resetFiltersKeybind?.value():
        crispiness.set(100);
        blurriness.set(0);
        greyscale.set(0);
        invert.set(false);
        lightsOff.set(false);
        $('.underscript-dialog').modal('hide');
        break;
      case openGalascriptKeybind?.value():
        newInstall.show();
        break;
      case surrenderKeybind?.value():
        if (!ingame) break;
        socketGame.send(JSON.stringify({action: "surrender"}));
        break;
      case Object.keys(emoteKeybinds?.value()).includes(event.code) ? event.code : null:
        if (!ingame) break;
        socketGame.send(JSON.stringify({action: "emote", id: `${emoteKeybinds.value()[event.code]}`}));
        break;
    }
  }
});


window.addEventListener("wheel", function (e) {
    const cardsPreview = document.getElementById("cardsPreviewCompact")
    if (cardsPreview) cardsPreview.scrollLeft += e.deltaY;
});

const flashlight = document.createElement("div");
function createFlashlight(){
    flashlight.id = "flashlight";
    document.body.appendChild(flashlight);
    window.addEventListener("mousemove", function(e) {
        var flashlight = document.getElementById("flashlight");
        if (flashlight) { flashlight.style.backgroundPosition = (e.pageX - flashlightRadius / 2) + 'px ' + ((e.pageY - flashlightRadius / 2) - window.scrollY) + 'px'; }
    });
}
function removeFlashlight(){
    flashlight.remove()
}

plugin.events.on(':loaded', () => {
    globalStyles();
    initCustomFrames();
    siteFilter(crispiness?.value(), blurriness?.value(), greyscale?.value(), invert?.value());
    updateFlashlightRadius(flashlightRadiusInput?.value());
    updateFlashlightImg(flashlightStyle?.value());
    if (pixelImageRendering?.value()) {imgPixel()}
    if (darkModeBarrier?.value()) {barrierDark()}
    if (noName?.value()) {hide('cardName', true)}
    if (noCost?.value()) {hide('cardCost', true)}
    if (noImage?.value()) {hide('cardImage', true)}
    if (noPowers?.value()) {hide('cardStatus', true)}
    if (noTribes?.value()) {hide('cardTribes', true)}
    if (noSilence?.value()) {hide('cardSilence', true)}
    if (noDesc?.value()) {hide('cardDesc', true)}
    if (whiteStats?.value()) {statsWhite()}
    if (noStats?.value()) {statsHide()}
    if (noRarity?.value()) {hide('cardRarity', true)}
    if (lightsOff?.value()) {createFlashlight()}
    if (removeElementBackgrounds?.value()) {cardElBgFixOn()}
    if (mulliganInfo?.value()) {initMulliganInfo()}
    framesColorationOff()
    if (newInstall.value()) {
      gsVersion.set(pluginVersion);
      newInstall.set(false);
        plugin.toast({
          title: `${pluginName} successfully installed!`,
          text: `Thank you for downloading ${pluginName}! Please make sure to report any bugs or issues to the #galascript channel.`,
        });
      }
    if (gsVersion.value() != pluginVersion) {
      gsVersion.set(pluginVersion);
        plugin.toast({
          title: `Galascript: Update ${pluginVersion}`,
          text: patchNotes,
        });
      }
});

plugin.events.on('translation:loaded', () => {
    if (spice?.value()) {initSpice();}
    if (fillCardGaps?.value()) {initUnusedCards();}
    if (cardAliases?.value()) {initAliases();}
    initCustomPower();
});

if (document.readyState !== 'loading') {
    initCoolFilters()
} else {
    document.addEventListener('DOMContentLoaded', initCoolFilters());
}


function initCoolFilters() {
    const includePaths = ['/Crafting', '/Decks', '/DecksAdmin'];
    if (!includePaths.includes(window.location.pathname) || !statFilters?.value()) { return; }

    var costInput = document.createElement('input');
    costInput.id = 'costInput';
    costInput.type = 'number';
    costInput.min = 0;
    costInput.className = 'form-control';
    costInput.placeholder = 'cost';
    costInput.setAttribute('data-i18n-placeholder', 'stat-cost');

    var atkInput = document.createElement('input');
    atkInput.id = 'atkInput';
    atkInput.type = 'number';
    atkInput.min = 0;
    atkInput.className = 'form-control';
    atkInput.placeholder = 'ATK';
    atkInput.setAttribute('data-i18n-placeholder', 'stat-atk');

    var hpInput = document.createElement('input');
    hpInput.id = 'hpInput';
    hpInput.type = 'number';
    hpInput.min = 0;
    hpInput.className = 'form-control';
    hpInput.placeholder = 'HP';
    hpInput.setAttribute('data-i18n-placeholder', 'stat-hp');

    var searchBar = document.getElementById("searchInput")
    searchBar.after(hpInput);
    searchBar.after(atkInput);
    searchBar.after(costInput);

    var oldCost, oldAtk, oldHp;

    $('#costInput').keyup(function () {
        applyFilters();
        showPage(0);
    });
    $('#atkInput').keyup(function () {
        applyFilters();
        showPage(0);
    });
    $('#hpInput').keyup(function () {
        applyFilters();
        showPage(0);
    });
    $('#costInput').mouseup(function () {
        applyFilters();
        showPage(0);
        if ($('#costInput').val() == 0 && oldCost === '0') {
            $('#costInput').val('')
            applyFilters();
            showPage(0);
        }
        oldCost = $('#costInput').val();
    });
    $('#atkInput').mouseup(function () {
        applyFilters();
        showPage(0);
        if ($('#atkInput').val() == 0 && oldAtk === '0') {
            $('#atkInput').val('')
            applyFilters();
            showPage(0);
        }
        oldAtk = $('#atkInput').val();
    });
    $('#hpInput').mouseup(function () {
        applyFilters();
        showPage(0);
        if ($('#hpInput').val() == 0 && oldHp === '0') {
            $('#hpInput').val('')
            applyFilters();
            showPage(0);
        }
        oldHp = $('#hpInput').val();
    });
}

const newInstall = plugin.settings().add({
    key: 'newInstall',
    default: true,
    hidden: true
});

const gsVersion = plugin.settings().add({
    key: 'gsVersion',
    type: 'text',
    default: '0',
    hidden: true
});