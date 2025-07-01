// ==UserScript==
// @name         Galascript
// @namespace    https://undercards.net
// @version      1.0.0-beta
// @description  Galascript adds stuff. :3
// @author       galadino
// @match        https://*.undercards.net/*
// @icon         https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/iconVirgil.png
// @require      https://raw.githubusercontent.com/UCProjects/UnderScript/master/src/checkerV2.js
// @grant        none
// ==/UserScript==
//
//
//
//                 this code is super messy please  peep the horrors
//
const $ = window.$;
const pluginName = GM_info.script.name;
const pluginVersion = GM_info.script.version;
const underscript = window.underscript;
const plugin = underscript.plugin(pluginName, pluginVersion);
const style = plugin.addStyle();
const ingame = window.location.pathname === '/Game' || window.location.pathname === '/Spectate';
const standardFrames = ["Undertale", "Deltarune", "Time to get serious", "Golden", "Vaporwave", "Spider Party", "Halloween2020", "Christmas2020"]
const customFrames = ["Staff", "Spamton", "Cyber World", "Hollow Knight", "Grimm Troupe", "Void", "FNAFB", "Outbreak", "Mirror Temple", "VMas", "Its TV Time", "Cold Place", "Pokecard 1996"]
const allFrames = standardFrames.concat(customFrames)
const soulColors = {
    DETERMINATION: '#ff0000',
    INTEGRITY: '#0064ff',
    KINDNESS: '#00c000',
    JUSTICE: '#ffff00',
    PERSEVERANCE: '#d535d9',
    BRAVERY: '#fca500',
    PATIENCE: '#41fcff',
}
var defaultColor;
const baseStyle = {
  border: '',
  height: '',
  background: '',
  'font-size': '',
  margin: '',
  'border-radius': '',
};
const nullcard = {
    "attack": '?',
    "hp": '?',
    "maxHp": '?',
    "originalAttack": '?',
    "originalHp": '?',
    "dodge": 0,
    "armor": false,
    "paralyzed": 0,
    "silence": false,
    "kr": false,
    "burn": 0,
    "cantAttack": false,
    "charge": false,
    "taunt": false,
    "invulnerable": false,
    "haste": false,
    "transparency": false,
    "candy": false,
    "shockEnabled": false,
    "supportEnabled": false,
    "wanted": false,
    "id": 0,
    "fixedId": 0,
    "typeCard": 0,
    "name": "Unknown",
    "image": "Blank",
    "baseImage": "Blank",
    "cost": '?',
    "rarity": "COMMON",
    "originalCost": '?',
    "shiny": false,
    "quantity": 1,
    "extension": "BASE",
    "tribes": [],
    "selectCards": [],
    "typeSkin": 0,
    "playedTurn": 0,
    "ownerId": 0,
    "bullseyeEnabled": false,
    "loop": 0,
    "program": 0
}
plugin.updater?.('https://github.com/galadinowo/galascript/raw/refs/heads/main/Galascript.user.js');
const patchNotes =


`Test update`;



function wrapClamp(value, min, max) {if (value < min) {return max - ((min - value) % (max - min));} else {return min + ((value - min) % (max - min));}}

// for Check power

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
function getNestedProperty(obj, property) {return property.split('.').reduce((o, p) => (o && o[p] !== undefined) ? o[p] : undefined, obj);}

// for old nvcs shit... still a somewhat useful function outside of it i guess so im keeping it ?

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
        var appended = window.appendCard(a, b);
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
// usable in console and by anyone else as a utility :3
window.getCardsWithStats = getCardsWithStats;

const checkCreateCard = setInterval(() => {
    if (typeof createCard === 'function') {
    clearInterval(checkCreateCard);
    function newCreateCard(card) {
    const randomLimit = window.allCards.length;
    var name;
    switch (obscCardName?.value()) {
        case 'obfuscate':
            name = obfuscationText?.value();
            break;
        case 'to set card':
            name = $.i18n('card-name-' + window.getCardWithName(obscSetCard?.value()).fixedId, loopNames?.value() && card.loop > 0 ? card.loop + 1 : 1)
            card.name = name;
            break;
        default:
            name = $.i18n('card-name-' + card.fixedId, loopNames?.value() && card.loop > 0 ? card.loop + 1 : 1)
            if (cardSkinNames?.value() && card.image !== card.baseImage) {
                name = card.image.replaceAll("_", " ").replaceAll(" Full", "").replaceAll(" FULL", "")
            }
    }
    switch (obscCardImage?.value()) {
        case 'obfuscate':
            card.textImage = obfuscationText?.value();
            break;
        case 'to set card':
            card.image = window.getCardWithName(obscSetCard?.value()).baseImage;
            card.typeSkin = 0;
    }
    var description = "";
    switch (obscCardDesc?.value()) {
        case 'obfuscate':
            description = obfuscationText?.value();
            break;
        case 'to set card':
            description = $.i18n('card-' + window.getCardWithName(obscSetCard?.value()).fixedId);
            break;
        default:
            description = $.i18n('card-' + card.fixedId)
    }
    var image = "";
    var cost = "";
    var program = "";
    var attack = "";
    var hp = "";
    var maxHp = "";
    var hpSquish = 1;
    var maxHpSquish = 1;
    var shiny = "";
    var htmlHp = "";

    switch (obscCardRarity?.value()) {
        case 'to set card':
            card.rarity = window.getCardWithName(obscSetCard?.value()).rarity;
            card.extension = window.getCardWithName(obscSetCard?.value()).extension;
            break;
    }

    switch (obscCardPowers?.value()) {
        case 'to set card':
            card.program = window.getCardWithName(obscSetCard?.value()).program;
            break;
    }

    switch (obscCardCost?.value()) {
        case 'obfuscate':
            card.fakeCost = obfuscationText?.value();
            cost = card.fakeCost - (card.originalCost - card.cost)
            break;
        case 'to set card':
            card.fakeCost = window.getCardWithName(obscSetCard?.value()).cost;
            cost = card.fakeCost - (card.originalCost - card.cost);
            break;
        default:
            cost = card.cost;
    }
    if (card.hasOwnProperty('attack')) {
        attack = card.attack;
        hp = card.hp;
        maxHp = card.maxHp;
        htmlHp = `<span class="currentHP">${hp}</span><span class="maxHP">${maxHp}</span>`;
    }

    shiny = card.shiny ? " shiny" : ""; // i just like ternary operators

    var frameSkinName = 'undertale';

    /*
        if statement breakdown:

            if:
                - the card has a frame skin name
                - the frameSpoof setting is not 'off'
                    and:
                        - in a game
                        - the card is owned by you (in the case of frameSpoofBehavior being set to ally cards only)
                    or:
                        - not in a game
    */

    if ((card.hasOwnProperty('frameSkinName') && frameSpoof?.value() !== 'off') && ((ingame && (frameSpoofBehavior?.value() === 'ally cards only' && card?.ownerId === window.userId || frameSpoofBehavior?.value() === 'all cards')) || !ingame)) {
        card.frameSkinName = frameSpoof?.value()
    }

    if (card.hasOwnProperty('frameSkinName') && respectiveFrames?.value()) {
        if (card.extension === 'BASE' || card.extension === 'UTY') {card.frameSkinName = 'undertale'}
        if (card.extension === 'DELTARUNE' ) {card.frameSkinName = 'deltarune'}
    }

    if (card.hasOwnProperty('frameSkinName')) {
        frameSkinName = card.frameSkinName.toString().replace(/\s+/g, '-').toLowerCase();
    }

    if (card.program > 0 && programIndicators?.value()) {
        card.programAdded = card.program + cost
        program = '<div class="cardProgram cardCost">' + card.programAdded + '</div>\n'
    }

    if (card.hasOwnProperty('textImage')) {
        image = '<div class="cardImageText"><div>' + description + '</div></div>\n'
    } else {
        image = '<div class="cardImage"></div>\n'
    }

    var statbase = statBase?.value();

    frameSkinName += '-frame';

    var htmlCard = '<div id="' + card.id + '" class="card monster ' + frameSkinName + shiny + ' base' + statBase?.value() + '" data-rarity="' + card.rarity + '">\n\
    <div class="shinySlot"></div>\n\
    <div class="cardFrame"></div>\n\
    <div class="cardBackground"></div>\n\
    <div class="cardHeader"></div>\n\
    <div class="cardName"><div>' + name + '</div></div>\n\
    <div class="cardCost">' + cost + '</div>\n'
    + program +
    '<div class="cardStatus"></div>\n\
    <div class="cardTribes"></div>\n'
    + image +
    '<div class="cardSilence"></div>\n\
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
        htmlCard = '<div id="' + card.id + '" class="card spell ' + frameSkinName + shiny + '" data-rarity="' + card.rarity + '">\n\
        <div class="shinySlot"></div>\n\
        <div class="cardFrame"></div>\n\
        <div class="cardBackground"></div>\n\
        <div class="cardHeader"></div>\n\
        <div class="cardName ' + cardSoul + '"><div>' + name + '</div></div>\n\
        <div class="cardCost">' + cost + '</div>\n'
        + program +
        '<div class="cardStatus"></div>\n\
        <div class="cardTribes"></div>\n'
        + image +
        '<div class="cardDesc"><div>' + description + '</div></div>\n\
        <div class="cardFooter"></div>\n\
        <div class="cardRarity"></div>\n\
        </div>';
    }
    if (trueObscurity?.value() !== "off") {
        var ext = card.extension.toUpperCase()
        var rar = card.rarity.toUpperCase()
        var link;
        if (whar?.value() === "on, obscure rarity") {rar = "NORMAL"};
        if (rar === 'BASE' || rar === 'TOKEN') {
            link = "https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/cardBacks/" + ext + "Card" + rar + ".png";
        } else {
            link = "images/cardBacks/" + ext + "Card" + rar + ".png";
        }
        htmlCard = '<div id="' + card.id + '" class="card ' + frameSkinName + '" data-rarity="' + card.rarity + '">\n\
        <div class="shinySlot" style="visibility: hidden;"></div>\n\
        <div class="cardFrame" style="background: url(' + link + ') no-repeat center;"></div>\n\
        </div>';
    }

    return htmlCard;
        }
    } window.createCard = newCreateCard
});

const checkSetInfoPowers = setInterval(() => {
 if (typeof setInfoPowers === 'function'){
    clearInterval(checkSetInfoPowers);
    function newSetInfoPowers(monsterContainer, card) {
    monsterContainer.find('.cardStatus').empty();
    var powers = [];
    var powersType = [];
    var powersStringKeys = [];
    var powersStringArgs = [];
    var powersStringNumbers = [];
    var pool, printPool, poolArgs;
    switch (obscCardPowers?.value()) {
        case 'to set card':
            var setCard = window.getCardWithName(obscSetCard?.value())
            card.rarity = setCard.rarity;
            card.loop = setCard.loop;
            card.program = setCard.program;
            card.target = setCard.target;
            card.taunt = setCard.taunt;
            card.charge = setCard.charge;
            card.haste = setCard.haste;
            card.candy = setCard.candy;
            card.armor = setCard.armor;
            card.dodge = setCard.dodge;
            card.cantAttack = setCard.cantAttack;
            card.transparency = setCard.transparency;
            card.shockEnabled = setCard.shockEnabled;
            card.supportEnabled = setCard.supportEnabled;
            card.bullseyeEnabled = setCard.bullseyeEnabled;
            card.wanted = setCard.wanted;
    }
    const isPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
    }
    function pushPower(sprite, type, key, args, number){
        if (obscCardPowers?.value() === 'obfuscate') {
            sprite = 'unknown'
            type = 'custom'
            key = 'status-unknown'
            args = []
            number = null
        }
        if (numStack?.value() && number) {
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
//     function setupPoolDisplay(args) {
//         poolArgs = args
//         pool = getCardsWithStats(...poolArgs);
//         printPool = getCardsWithStats(...poolArgs, 'id', 1);
//     }

//     function activeFor(cardName) {
//         var matchCard = getCardWithName(cardName).id;
//         return card.id === matchCard && nvcs[card.baseImage+'Enabled']?.value();
//     }
//     if (window.nvcsCards.length > 1) {
//         for (const key in window.nvcsCards(card)) {
//             var a = window.nvcsCards(card)
//             var c = a[key]
//             if (!nvcsSoftDeactivate && card.id === getCardWithName(c.name).id && nvcs[c.key+'Enabled']?.value()) {
//                 console.log(...c.pool[0])
//                 setupPoolDisplay(...c.pool);
//                 pushPower(c.sprite, 'custom', c.transKey, [printPool], null);
//                 if (c.hasOwnProperty('pool2')) {
//                     setupPoolDisplay(...c.pool2);
//                     pushPower(c.sprite2, 'custom', c.transKey2, [printPool], null);
//                 }
//             }
//         }
//     }

//                                   OUTTA MY WAY 💥💥💥💥💥💥💥

//     if (activeFor('Teacher Alphys') && typeof dustpile !== 'undefined') {
//         function costCheck(cost) {
//             if (Array.isArray(getCardsWithStats([dustpile], ['owner.id', 'cost'], [card.owner.id, cost])))
//             { getCardsWithStats([dustpile], ['owner.id', 'cost'], [card.owner.id, cost]).length; }
//         }
//         pushPower('NVCSactive', 'custom', 'status-nvcs-talphys-info', [costCheck(1), costCheck(2), costCheck(3), costCheck(4), costCheck(5), costCheck(6), costCheck(7), costCheck(8), costCheck(9), costCheck(10)], null);
//     }

    var baseCard = window.getCard(card.fixedId) || nullcard; // SHOULD fix the issue with getCard locking up in an unupdated allCards cache ...

    if (turnsPower?.value() && card.playedTurn > 0) {
        pushPower('turn', 'custom', 'status-turn', [Math.floor(card.playedTurn / 2), window.turn - Math.floor(card.playedTurn / 2)], Math.floor(card.playedTurn / 2));
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

    var cardTarget;

    if (targetPower?.value() && card.target != undefined) {
        switch (card.target) {
            case 'MONSTER': cardTarget = 'any monster'; break;
            case 'ALLY_MONSTER': cardTarget = 'an ally monster'; break;
            case 'ENEMY_MONSTER': cardTarget = 'an enemy monster'; break;
            case 'ALL': cardTarget = 'anything'; break;
            default: cardTarget = card.target;
        }
        pushPower('target', 'custom', 'status-target', [cardTarget], null);
    }

    if (shinyPower?.value() && card.shiny) {
        pushPower('shiny', 'custom', 'status-shiny', [], null);
    }

//                       i kinda deleted fullart power cuz i felt it was too lame even for this plugin

    if (legendPower?.value() && card.owner?.oldDivision === 'LEGEND') {
        pushPower('legendmaker', 'custom', 'status-legend', [], null);
    }

    if (card.typeCard === 0) {

        if (totemPower?.value() && (baseCard.hp === 7 || baseCard.cost === 7)) {
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

        if (baseStatChangePower?.value() && (baseCard.hp !== card.originalHp || baseCard.attack !== card.originalAttack || baseCard.cost !== card.originalCost)) {
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

        if (deadPower?.value() && card.hp < 1) { // shoould this show in dustpile? probably
            pushPower('dead', 'custom', 'status-dead', [], null); // do i care? not really
        }

        if (barrierPower?.value() && card.fixedId === 801) {
            pushPower('smellsLikeLemons', 'custom', 'status-smells-like-lemons', [], null);
            pushPower('immuneToMadjick', 'custom', 'status-immune-to-madjick', [], null);
        }

        if (undereventPower?.value() && card.fixedId === 874) {
            pushPower('underevent2024', 'base', 'status-underevent-2024', [], null);
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
            args[j] = window.base64EncodeUnicode(args[j]);
        }
    }
    var spacing = !legacyPowers?.value() ? (powersStringKeys.length - 1) * powerSpacing?.value() > powerBounds?.value() ? powerBounds?.value() / (powersStringKeys.length - 1) : powerSpacing?.value() : powerSpacing?.value();
    for (var i = 0; i < powersStringKeys.length; i++) {

        var $cardContainerImage = monsterContainer.find('.cardStatus');
        var url = obscCardPowers?.value() === 'obfuscate' ? 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/unknown.png' : powersType[i] === 'base' ? 'images/powers/' + powers[i] + '.png' : 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/' + powers[i] + '.png';
        $cardContainerImage.append('<img style="right: ' + (i * spacing) + 'px;" power="' + powers[i] + '" class="infoPowers helpPointer" src="' + url + '" oncontextmenu="displayStatusStringKey(' + window.formatArgs(powersStringKeys[i], powersStringArgs[i]) + ');">');

        if (powersStringNumbers[i] !== null) {
            $cardContainerImage.append('<span style="right: ' + (i * spacing) + 'px;" class="infoPowersDetails helpPointer" oncontextmenu="displayStatusStringKey(' + window.formatArgs(powersStringKeys[i], powersStringArgs[i]) + ');">' + powersStringNumbers[i] + '</span>');
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
}} window.setInfoPowers = newSetInfoPowers
});
const checkIsRemoved = setInterval(() => {
    const ignorePaths = ['/CardSkinsShop', '/Translate']
    if (ignorePaths.includes(window.location.pathname)){
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
        if (!removed && window.location.pathname === '/Crafting') {
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
                switch ($('#costInput').attr('class').split(' ')[1]) {
                    case 'equals': removed = card.cost != cost; break;
                    case 'moreThan': removed = card.cost <= cost; break;
                    case 'moreThanEqualTo': removed = card.cost < cost; break;
                    case 'lessThan': removed = card.cost >= cost; break;
                    case 'lessThanEqualTo': removed = card.cost > cost; break;
                }
            }

            if (atk.length > 0 && !removed) {
                switch ($('#atkInput').attr('class').split(' ')[1]) {
                    case 'equals': removed = card.attack != atk; break;
                    case 'moreThan': removed = card.attack <= atk; break;
                    case 'moreThanEqualTo': removed = card.attack < atk; break;//                                    oh theres definitely a better way to do this
                    case 'lessThan': removed = card.attack >= atk; break;//                                                                                                        ....if i cared enoug
                    case 'lessThanEqualTo': removed = card.attack > atk; break;
                }
            }

            if (hp.length > 0 && !removed) {
                switch ($('#hpInput').attr('class').split(' ')[1]) {
                    case 'equals': removed = card.hp != hp; break;
                    case 'moreThan': removed = card.hp <= hp; break;
                    case 'moreThanEqualTo': removed = card.hp < hp; break;
                    case 'lessThan': removed = card.hp >= hp; break;
                    case 'lessThanEqualTo': removed = card.hp > hp; break;
                }
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

            if (searchValue === 'mo') {
                removed = card.name !== 'Mo' // Mo.
            }

            if (searchValue.length > 0 && !removed) {

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
}} window.isRemoved = newIsRemoved;
});

const checkUpdateCardVisual = setInterval(() => {
    if (typeof updateCardVisual === 'function'){
        clearInterval(checkUpdateCardVisual);
        function newUpdateCardVisual($htmlCard, card) {
        var cost = card.cost
        if (!isNaN(card.fakeCost) && ingame && ['to set card', 'to random card, unique', 'to random card, universal'].contains(obscCardCost?.value())) {
            cost = card.fakeCost - (card.originalCost - card.cost)
        }
        var $cardCost = $htmlCard.find('.cardCost').not('.cardProgram');
        $cardCost.html(cost);
        $cardCost.removeClass('cost-buff').removeClass('cost-debuff');

        if (cost > card.originalCost) {
            $cardCost.addClass('cost-debuff');
        } else if (cost < card.originalCost) {
            $cardCost.addClass('cost-buff');
        }
        if (card.typeCard === 1) {return;}

        var $cardHP = $htmlCard.find('.currentHP');
        var $cardMaxHP = $htmlCard.find('.maxHP');
        var statbase = $htmlCard.hasClass("base1000") ? 1000 : $htmlCard.hasClass("base100") ? 100 : $htmlCard.hasClass("base10") ? 10 : 1;
        $cardHP.html(statbase * card.hp);
        $cardMaxHP.html('');
        var hpSquish, maxHpSquish;
        if (maxHpIndicator?.value() !== 'off' && (maxHpIndicator?.value() === 'always show' || card.hp < card.maxHp)) {
            $cardMaxHP.html('/' + (statbase * card.maxHp));
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

        if ($htmlCard.hasClass("pokecard-1996-frame")) {
            $cardHP.append(' ');
            $cardHP.append($.i18n('stat-hp', 1));
        }

        var $cardATK = $htmlCard.find('.cardATK');
        $cardATK.html(statbase * card.attack);

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
            $htmlCard.find('.cardSilence').css('visibility', 'visible');
        }
}} window.updateCardVisual = newUpdateCardVisual;
});




function initSpice() {
  var divisions = ["COPPER", "IRON", "GOLD", "EMERALD", "SAPPHIRE", "AMETHYST", "RUBY", "DIAMOND", "ONYX", "MASTER", "LEGEND"];
    function randDivision() {
        var result = divisions[Math.floor(Math.random() * divisions.length)];
        divisions.splice(divisions.indexOf(result), 1);
        return result;
    }
    if (!$) return;
    $.i18n().load({
        "card-15": ";)",
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
    "card-alias-237": "phamster moni!!!",
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

function antennaSplit(str) {
    if (str.length < 5) return `${str}`;
    const ant = str.slice(0, 3);
    const tenna = ant.slice(-1) + str.slice(3);
    return `(${ant}) ${tenna}`;
}

function veryImportantActiveVerbFormOf(str) {
    const lowerStr = str.toLowerCase();
    const rouxl1 = /(s|sh|ch|x|z|o)$/.test(lowerStr);
    const rouxl2 = /[^aeiou]y$/.test(lowerStr);
    if (rouxl1) {
        return `${str}es`;
    } else if (rouxl2) {
        return `${str.slice(0, -1)}ies`;
    } else {
        return `${str}s`;
    }
}


function initMulliganInfo() {
    if (!ingame) return;
    const waitForMulligan = setInterval(() => {
    if ($('.bootstrap-dialog-message > p').length) { // waits for the mulligan message to show up
        clearInterval(waitForMulligan);
        var enemySoul = $('.soul:first').children().attr('class');
        var enemyUser = $('#enemyUsername').text();
        var yourSoul = $('.soul:last').children().attr('class');
        var yourUser = $('#yourUsername').text();
        function soulIcon(replace) {return `<img src="/images/souls/${replace ? replace : enemySoul}.png">`};
        function soulColor(text, soul) {return `<span class="${soul ? soul : enemySoul}">${text}</span>`};
        function player(replace) {return `${soulIcon()} ${soulColor(replace ? replace : enemyUser)}`};
        const introductions = [`${player()} challenges you to a Dual!`,
                              `Fighting ${player()}!`,
                              `${player()} enters through a graceful misty fog...`,
                              `${player()} enters the scene!`,
                              `${player()} approaches!`,
                              `${player()} attacks!`,
                              `${player()} sniped you.`,
                              `${player()} wants to win! Are you just gonna let that happen?`,
                              `C-could it be? It's the one and only ${player()}...`,
                              `...It's ${player()}? Sorry, you're cooked.`,
                              `${player()} gracefully flops onto the battlefield like a fish.`,
                              `A wild ${player()} appeared!`,
                              `${player()} glares at you. You hear boss music.`,
                              `Well, you didn't expect ${player()} to be here.`,
                              `There is a ${player()} here. Are they happy to see you?`,
                              `Say it with him, folks!<br>
                              Mr. ${player(antennaSplit(enemyUser))}'s TV tiiiiime...!`,
                              `> enters ${player(enemyUser.toLowerCase())}-less queue<br>
                              > looks inside<br>
                              > ${player(enemyUser.toLowerCase())}`,
                              `Okay, so, a ${player()} walks into a bar`,
                              `You are not fighting ${player()}. Trust.`,
                              `ITS FUCKING ${player(enemyUser.toUpperCase())} RUN`,
                              `My money's on ${player()}. No pressure.`,
                              `${player()} ${veryImportantActiveVerbFormOf(enemyUser)} ${soulColor(`${enemyUser}ingly`)}.`,
                              `EPIC RAP BATTLES OF HISTORY<br>
                              ${player()}<br>
                              VERSUS!<br>
                              ${soulIcon(yourSoul)} ${soulColor(yourUser, yourSoul)}`,
                              `Fighting ${soulIcon(yourSoul)} ${soulColor(yourUser, yourSoul)}!<br>
                              Wait, no, no...<br>
                              ...it's ${player()}!`,];
        function funnyIntro() {
            if (enemyUser === "Crystal") {
                return `${soulIcon()} Free elo.`; // requested by crystal herself
            }
            if (enemyUser === "Sktima" || enemyUser === "Ahab" || enemyUser === "Diamaincrah") {
                return `${soulIcon()} You're about to have a bad time.`;
            }
            if (enemyUser === "frogman") {
                return `Pet the ${player('frog')} :D`;
            }
            if (enemyUser === "Dware") {
                return `Beware the ${player()}`;
            }
            if (enemyUser === "JaimeezNuts") {
                return `${player('rat')}`;
            }
            if (enemyUser === "galadino") {
                return `${player()} wanted her own entrance message. Here it is!`; // FIAT
            }
            var result = introductions[Math.floor(Math.random() * introductions.length)];
            introductions.splice(introductions.indexOf(result), 1);
            return result;
        }
        var info = `${funnyIntro()}<br><br>
                    ${window.userTurn === window.userId ? 'You go first.' : 'You go second.'}`;
        $('.bootstrap-dialog-message > p').html(info)
     }
    });
}

function initCustomPower() {
  if (!$) return;
  $.i18n().load({
    "status-dummy": "$1",
    "status-unknown": "Hmmm... you don't exactly know what this is.",
    "status-unknown-stacked": "Hmmm... you don't exactly know what this is.",
    "status-program": "This card's {{KW:PROGRAM}} subeffect will trigger if $1 {{GOLD}} is spent. It can also be copied by {{CARD:661|1}}.",
    "status-target": "This card has a target effect. It can target $1.",
    "status-turn": "This card was played on turn $1. It has lived for $2 {{PLURAL:$2|turn|turns}}.",
    "status-shiny": "This card is shiny.",
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
    style.append('.cardName div[style*="font-size: 7px;"] {white-space: nowrap;}');
    style.append('#gsFlashlight {position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; pointer-events:none; z-index: 100; image-rendering: pixelated;}');
    style.append('.cardsPreviewCompact {overflow-x: auto; display: flex; height: auto; width: 100%;}');
    style.append('.cardsPreviewCompact div {flex: 0 0 auto; box-sizing: border-box;}');
    style.append('.cardHP:not(.pokecard-1996-frame .cardHP) {overflow-x: visible; white-space: nowrap; display: flex; justify-content: center; align-items: baseline; white-space: pre;}');
    style.append('.currentHP:not(.pokecard-1996-frame .currentHP) {text-align: right; transform-origin: right; display: inline-block;}');
    style.append('.maxHP:not(.pokecard-1996-frame .maxHP) {text-align: left; font-size: 12px; color: gray; transform-origin: left; display: inline-block;}');
    style.append('#costInput, #atkInput, #hpInput {width: 33.33%; display: inline; padding-right: 0px; position: relative; z-index: 2;}');
    style.append('#costInput {color: #00d0ff}');
    style.append('#atkInput {color: #f0003c}');
    style.append('#hpInput {color: #0dd000}');
    style.append('.statMode {background-color: rgba(0, 0, 0, 0.5) !important; border-top: none; border-radius: 0px 0px 5px 5px; margin-left: 1%; margin-right: 1%; width: 31.33%; position: relative; z-index: 1; top: -20px; opacity: 0; transition: top 0.3s ease-out, opacity 0.3s ease-out;}');
    style.append('#costInput:hover ~ #costMode {top: -2px; opacity: 1}');
    style.append('#costMode:hover {top: -2px; opacity: 1}');
    style.append('#atkInput:hover ~ #atkMode {top: -2px; opacity: 1}');
    style.append('#atkMode:hover {top: -2px; opacity: 1}');
    style.append('#hpInput:hover ~ #hpMode {top: -2px; opacity: 1}');
    style.append('#hpMode:hover {top: -2px; opacity: 1}');
    style.append('.equals:not(.form-control), .equals::placeholder {color: #ccc}');
    style.append('.moreThan:not(.form-control), .moreThan::placeholder {color: #ff99ff}');
    style.append('.moreThanEqualTo:not(.form-control), .moreThanEqualTo::placeholder {color: #ff69ff}');
    style.append('.lessThan:not(.form-control), .lessThan::placeholder {color: #ffaa99}');
    style.append('.lessThanEqualTo:not(.form-control), .lessThanEqualTo::placeholder {color: #ffaa69}');
    style.append('.equals:not(.statMode) {border: 1px solid #ccc}');
    style.append('.moreThan:not(.statMode) {border: 1px solid #ff99ff}');
    style.append('.moreThanEqualTo:not(.statMode) {border: 1px solid #ff69ff}');
    style.append('.lessThan:not(.statMode) {border: 1px solid #ffaa99}');
    style.append('.lessThanEqualTo:not(.statMode) {border: 1px solid #ffaa69}');
    style.append('input[disabled] {opacity: 0.3}');
    style.append('.cardCost:not(.cardProgram) {opacity: 1}');
    style.append('.cardProgram {color: gold; opacity: 0}');
    style.append('.cardCost {transition: opacity 0.2s ease;}');
    style.append('.card:hover .cardProgram {opacity: 1}');
    style.append('.card:has(.cardProgram):hover .cardCost:not(.cardProgram) {opacity: 0}');
    style.append('.cardImageText { top: 42px; width: 160px; height: 80px; text-align: center; font-size: 12px; position: absolute; left: 8px; display: table; z-index: 5}');
    style.append('.cardImageText > div {display: table-cell; vertical-align: middle}');
    style.append('.setting-advancedMap_Galascript-keybind_select {width: 350px; border-bottom: none !important;}');
    style.append('.setting-advancedMap_Galascript-keybind_select .gsKeybind {width: 30%}');
    style.append('.setting-advancedMap_Galascript-keybind_select select {width: 50%}');
}

var flashlightRadius;
function updateFlashlightRadius(f) {
    flashlightRadius = 4098 * f
    style.append(`#gsFlashlight {background-size: ${flashlightRadius}px}`);
};

function updateFlashlightImg(f) {
    style.append(`#gsFlashlight {background-image:url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/flashlightEffect${f === 'diffused' ? 'Alt' : ''}.png);}`);
};
function cardElBgFix() {
    style.append('.card.breaking-skin.breaking-disabled .cardDesc,.cardName,.cardATK,.cardHP,.cardCost,.cardRarity {background-color: rgba(0, 0, 0, 0);}');
    style.append('.card.breaking-skin:not(.breaking-disabled):hover .cardDesc, .breaking-skin:hover .cardName, .breaking-skin:hover .cardATK, .breaking-skin:hover .cardHP, .breaking-skin:hover .cardCost, .breaking-skin:hover .cardRarity {background-color: rgba(0, 0, 0, 0.7);}');
}
function statsTopOn() {
    style.append('.cardCost, .cardATK, .cardHP { z-index: 7 }')
}
function statsTopOff() {
    style.append('.cardCost, .cardATK, .cardHP { z-index: 5 }')
}
function hide(element, visibility) {
    style.append(`.${element} {visibility: ${visibility ? "hidden" : "visible"}}`)
}
function obscure(element, type) {
    style.append(`.${element} {visibility: visible}`);
    style.append(`.${element} {filter: blur(0px)}`);
    standardFrames.forEach(f => {
        const fclass = f.toString().replace(/\s+/g, '-').toLowerCase();
        const fimage = f.toString().replace(/\s+/g, '_');
        style.append(`.${fclass}-frame.monster .cardFrame {background-image: url("/images/frameSkins/${fimage}/frame_monster.png");}`)
    });
    customFrames.forEach(f => {
        f = f.toString().replace(/\s+/g, '-').toLowerCase();
        if (f !== 'pokecard-1996') {
            style.append(`.${f}-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/${f}-frame-monster.png");}`)
        }
    });
    switch (type) {
        case 'blur':
            style.append(`.${element} {filter: blur(2px)}`);
            break;
        case 'hide':
            style.append(`.${element} {visibility: hidden}`);
            break;
        case 'hide, use spell frame':
            style.append(`.${element} {visibility: hidden}`);
            standardFrames.forEach(f => {
                const fclass = f.toString().replace(/\s+/g, '-').toLowerCase();
                const fimage = f.toString().replace(/\s+/g, '_');
                style.append(`.${fclass}-frame.monster .cardFrame {background-image: url("/images/frameSkins/${fimage}/frame_spell.png");}`)
            });
            customFrames.forEach(f => {
                f = f.toString().replace(/\s+/g, '-').toLowerCase();
                if (f !== 'pokecard-1996') {
                    style.append(`.${f}-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/${f}-frame-spell.png");}`)
                }
            });
            break;
    }
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
function siteFilter(l, i, z, a) { // lizard
    style.append(`html {filter: contrast(${l}%) blur(${i}px) grayscale(${z}%) invert(${a ? 100 : 0}%) !important}`);
}
function statsWhite() {
    style.append('.cardATK, .cardHP {color: white;}');
}
function statsUnwhite() {
    style.append('.cardATK {color: #f0003c;}');
    style.append('.cardHP {color: #0dd000;}');
}
function statsHide(type) {
    if (!type.includes('hide')) return;
    style.append('.cardATK, .cardHP {visibility: hidden;}');
    if (!type === 'hide, use spell frame') return;
    standardFrames.forEach(f => {
        const fclass = f.toString().replace(/\s+/g, '-').toLowerCase();
        const fimage = f.toString().replace(/\s+/g, '_');
        style.append(`.${fclass}-frame.monster .cardFrame {background-image: url("/images/frameSkins/${fimage}/frame_spell.png");}`)
    });
    customFrames.forEach(f => {
        f = f.toString().replace(/\s+/g, '-').toLowerCase();
        if (f !== 'pokecard-1996') {
            style.append(`.${f}-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/${f}-frame-spell.png");}`)
        }
    });
}
function statsShow() {
    style.append('.cardATK, .cardHP {visibility: visible;}');
    standardFrames.forEach(f => {
        const fclass = f.toString().replace(/\s+/g, '-').toLowerCase();
        const fimage = f.toString().replace(/\s+/g, '_');
        style.append(`.${fclass}-frame.monster .cardFrame {background-image: url("/images/frameSkins/${fimage}/frame_monster.png");}`)
    });
    customFrames.forEach(f => {
        f = f.toString().replace(/\s+/g, '-').toLowerCase();
        if (f !== 'pokecard-1996') {
            style.append(`.${f}-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/${f}-frame-monster.png");}`)
        }
    });
}
function initCustomFrames() {
    const rarities = ['TOKEN', 'BASE', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'DETERMINATION'];
    style.append('.cardSilence {background: transparent url("images/cardAssets/silence.png") no-repeat; visibility: hidden;}');
    style.append('@keyframes float { 0% { transform: translatey(-4px); } 50% { transform: translatey(2px); } 100% { transform: translatey(-4px); } }');
    style.append('.spamton-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-shiny.png"); opacity: 0.4; mix-blend-mode: color-burn;}');
    style.append('.spamton-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-shiny-animated.gif"); opacity: 0.4; mix-blend-mode: color-burn;}');
    style.append('.spamton-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-spell.png");}');
    style.append('.spamton-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-monster.png");}');
    style.append('.spamton-frame .cardName, .spamton-frame .cardCost {top: 9px;}');
    style.append('.spamton-frame .cardDesc, .spamton-frame .cardSilence {top: 129px;}');
    style.append('.spamton-frame .cardATK, .spamton-frame .cardHP, .spamton-frame .cardRarity {top: 213px;}');
    style.append('.spamton-frame .cardQuantity, .spamton-frame .cardUCPCost {top: 240px;}');
    style.append('.cyber-world-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-shiny.png"); opacity: 0.5; mix-blend-mode: soft-light;}');
    style.append('.cyber-world-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-shiny-animated.gif"); opacity: 0.5; mix-blend-mode: soft-light;}');
    style.append('.cyber-world-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-spell.png");}');
    style.append('.cyber-world-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-monster.png");}');
    style.append('.cyber-world-frame .cardName, .cyber-world-frame .cardCost {top: 9px;}');
    style.append('.cyber-world-frame .cardDesc, .cyber-world-frame .cardSilence {top: 129px;}');
    style.append('.cyber-world-frame .cardATK, .cyber-world-frame .cardHP, .cyber-world-frame .cardRarity {top: 213px;}');
    style.append('.cyber-world-frame .cardQuantity, .cyber-world-frame .cardUCPCost {top: 240px;}');
    style.append('.its-tv-time-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/its-tv-time-frame-shiny.png"); opacity: 0.4; mix-blend-mode: color-burn;}');
    style.append('.its-tv-time-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/its-tv-time-frame-shiny-animated.gif"); opacity: 0.4; mix-blend-mode: color-burn;}');
    style.append('.its-tv-time-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/its-tv-time-frame-spell.png");}');
    style.append('.its-tv-time-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/its-tv-time-frame-monster.png");}');
    style.append('.its-tv-time-frame .cardName, .its-tv-time-frame .cardCost {top: 9px;}');
    style.append('.its-tv-time-frame .cardDesc {top: 129px;}');
    style.append('.its-tv-time-frame .cardSilence {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/tv-KILLED.png"); background-repeat: no-repeat; background-position: center; width: 90px; height: 30px; top: 69px; left: 45px;}');
    style.append('.its-tv-time-frame .cardATK, .its-tv-time-frame .cardHP, .its-tv-time-frame .cardRarity {top: 213px;}');
    style.append('.its-tv-time-frame .cardQuantity, .its-tv-time-frame .cardUCPCost {top: 240px;}');
    style.append('.cold-place-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cold-place-frame-shiny.png"); opacity: 0.5; mix-blend-mode: hard-light;}');
    style.append('.cold-place-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cold-place-frame-shiny-animated.gif"); opacity: 0.5; mix-blend-mode: overlay;}');
    style.append('.cold-place-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cold-place-frame-spell.png");}');
    style.append('.cold-place-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cold-place-frame-monster.png");}');
    style.append('.cold-place-frame .cardName {height: 10px; width: 160px; display: flex; justify-content: center; text-transform: uppercase; font-family: "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;}');
    style.append('.cold-place-frame .cardName > div {background-color: black; line-height: 10px;}');
    style.append('.cold-place-frame.standard-skin .cardImage {top: 55px; height: 80px}');
    style.append('.cold-place-frame.breaking-skin .cardImage {height: 210px; z-index: 0 !important}');
    style.append('.cold-place-frame.monster .cardDesc {top: 144px; left: 24px; width: 144px; transform-origin: left; transform: scale(0.7); text-align: left;}');
    style.append('.cold-place-frame .cardSilence {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/tv-KILLED.png"); background-repeat: no-repeat; background-position: center; width: 90px; height: 30px; top: 86px; left: 45px;}');
    style.append('.cold-place-frame.spell .cardDesc {top: 144px; transform: scale(0.7);}');
    style.append('.cold-place-frame .cardCost {top: 24px;}');
    style.append('.cold-place-frame .cardATK {top: 159px;}');
    style.append('.cold-place-frame .cardHP {top: 190px;}');
    style.append('.cold-place-frame .cardCost, .cold-place-frame .cardATK, .cold-place-frame .cardHP {left: 119px; transform: scale(0.7);}');
    style.append('.cold-place-frame .cardRarity {top: 222px; left: 82px; height: 16px;}');
    style.append('.cold-place-frame .cardQuantity, .cold-place-frame .cardUCPCost {top: 238px;}');
    style.append('.cold-place-frame .cardFooter {background-color: rgba(0, 0, 0, 0);}');
    style.append('.cold-place-frame .cardTribes {right: 140px; top: 32px}');
    style.append('.cold-place-frame .cardTribes > img:nth-child(2) {left: -1px; top: -3px;}');
    style.append('.cold-place-frame .cardStatus {left: 150px; top: 68px; transform-origin: right; transform: scale(0.8);}');
    style.append('.cold-place-frame .PrettyCards_CardBottomLeftInfo {left: 28px; top: 68px; transform-origin: left; transform: scale(0.8);}');



    style.append('.pokecard-1996-frame {font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif; text-shadow: 0 0 black !important;}');
    style.append('.pokecard-1996-frame .shinySlot {background-image: url("");}');
    style.append('.pokecard-1996-frame .cardFrame {background-size: 100%;}');
    style.append('.pokecard-1996-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-trainer.png");}');
    rarities.forEach(r => {
        style.append(`.pokecard-1996-frame.monster[data-rarity="${r}"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-${r.toLowerCase()}.png");}`);
    });
    style.append('.pokecard-1996-frame .cardName, .pokecard-1996-frame .cardDesc, .pokecard-1996-frame .cardCost, .pokecard-1996-frame .cardATK {color: black;}');
    style.append('.pokecard-1996-frame .cardName {width: 130px; font-weight: 700; transform-origin: left; transform: scale(0.8, 1);}');
    style.append('.pokecard-1996-frame .cardHeader, .pokecard-1996-frame .cardFooter {background-color: rgba(0, 0, 0, 0);}');
    style.append('.pokecard-1996-frame.monster .cardName {top: 10px; left: 13px;}');
    style.append('.pokecard-1996-frame.spell .cardName {top: 37px; left: 14px;}');
    style.append('.pokecard-1996-frame.monster .cardCost {top: 201px; left: 125px; transform: scale(1, 0.5);}');
    style.append('.pokecard-1996-frame.spell .cardCost {top: 37px; left: 119px; text-align: right; transform: scale(1, 0.5);}');
    style.append('.pokecard-1996-frame.monster.standard-skin .cardImage {top: 28px; left: 0px; width: 175px; height: 105px}');
    style.append('.pokecard-1996-frame.spell.standard-skin .cardImage {top: 50px;}');
    style.append('.pokecard-1996-frame.breaking-skin .cardImage {height: 210px; z-index: 0 !important}');
    style.append('.pokecard-1996-frame.monster .cardDesc {top: 130px; line-height: 1.2; left: 18px; transform-origin: left; transform: scale(0.7); text-align: left;}');
    style.append('.pokecard-1996-frame.spell .cardDesc {top: 144px; width: 140px; left: 18px; line-height: 1;}');
    style.append('.pokecard-1996-frame .cardDesc, .pokecard-1996-frame .cardSilence {top: 129px;}');
    style.append('.pokecard-1996-frame .cardDesc > div span {font-weight: 700; color: black;}');
    style.append('.pokecard-1996-frame .cardATK {top: 158px; left: 130px;}');
    style.append('.pokecard-1996-frame .cardHP {top: 9px; left: -3px; font-weight: 700; width: 150px; transform-origin: right; transform: scale(0.6); text-align: right;}');
    style.append('.pokecard-1996-frame .currentHP {color: red !important}');
    style.append('.pokecard-1996-frame .maxHP {color: red !important}');
    style.append('.pokecard-1996-frame .cardRarity {visibility: hidden}');
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
    style.append('.grimm-troupe-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/grimm-troupe-frame-shiny.gif");}');
    style.append('.grimm-troupe-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/grimm-troupe-frame-spell.png");}');
    style.append('.grimm-troupe-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/grimm-troupe-frame-monster.png");}');
    style.append('.grimm-troupe-frame .cardName, .grimm-troupe-frame .cardCost {top: 9px;}');
    style.append('.grimm-troupe-frame .cardDesc, .grimm-troupe-frame .cardSilence {top: 129px;}');
    style.append('.grimm-troupe-frame .cardATK, .grimm-troupe-frame .cardHP, .grimm-troupe-frame .cardRarity {top: 213px;}');
    style.append('.grimm-troupe-frame .cardQuantity, .grimm-troupe-frame .cardUCPCost {top: 240px;}');
    style.append('.void-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/void-frame-shiny.gif");}');
    style.append('.void-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/void-frame-spell.png");}');
    style.append('.void-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/void-frame-monster.png");}');
    style.append('.void-frame .cardName, .void-frame .cardCost {top: 9px;}');
    style.append('.void-frame .cardDesc, .void-frame .cardSilence {top: 129px;}');
    style.append('.void-frame .cardATK, .void-frame .cardHP, .void-frame .cardRarity {top: 213px;}');
    style.append('.void-frame .cardQuantity, .void-frame .cardUCPCost {top: 240px;}');
    style.append('.hollow-knight-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/hollow-knight-frame-spell.png");}');
    style.append('.hollow-knight-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/hollow-knight-frame-monster.png");}');
    style.append('.hollow-knight-frame .cardName, .hollow-knight-frame .cardCost {top: 9px;}');
    style.append('.hollow-knight-frame .cardDesc, .hollow-knight-frame .cardSilence {top: 129px;}');
    style.append('.hollow-knight-frame .cardATK, .hollow-knight-frame .cardHP, .hollow-knight-frame .cardRarity {top: 213px;}');
    style.append('.hollow-knight-frame .cardQuantity, .hollow-knight-frame .cardUCPCost {top: 240px;}');
    rarities.forEach(r => {
        style.append(`.hollow-knight-frame[data-rarity="${r}"] .cardRarity, .grimm-troupe-frame[data-rarity="${r}"] .cardRarity, .void-frame[data-rarity="${r}"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/hk-${r.toLowerCase()}.png) no-repeat transparent !important;}`);
    });
    style.append('.fnafb-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/fnafb-frame-spell.png");}');
    style.append('.fnafb-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/fnafb-frame-monster.png");}');
    style.append('.fnafb-frame .cardName, .fnafb-frame .cardCost {top: 9px;}');
    style.append('.fnafb-frame .cardDesc, .fnafb-frame .cardSilence {top: 129px;}');
    style.append('.fnafb-frame .cardATK, .fnafb-frame .cardHP, .fnafb-frame .cardRarity {top: 213px;}');
    style.append('.fnafb-frame .cardQuantity, .fnafb-frame .cardUCPCost {top: 240px;}');
        style.append('.fnafb-frame .cardRarity[style*="background: url(&quot;images/rarity/BASE_COMMON.png&quot;) no-repeat transparent;"] {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-ut-common.png) no-repeat transparent !important;}');
    rarities.forEach(r => {
        style.append(`.fnafb-frame .cardRarity[style*='background: url("images/rarity/BASE_${r}.png") no-repeat transparent;'] {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-ut-${r.toLowerCase()}.png) no-repeat transparent !important;}`);
        style.append(`.fnafb-frame .cardRarity[style*='background: url("images/rarity/DELTARUNE_${r}.png") no-repeat transparent;'] {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-dr-${r.toLowerCase()}.png) no-repeat transparent !important;}`);
        style.append(`.fnafb-frame .cardRarity[style*='background: url("images/rarity/UTY_${r}.png") no-repeat transparent;'] {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-uty-${r.toLowerCase()}.png) no-repeat transparent !important;}`);
    });
    style.append('.outbreak-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/outbreak-frame-shiny.png");}');
    style.append('.outbreak-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/outbreak-frame-shiny-animated.gif");}');
    style.append('.outbreak-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/outbreak-frame-spell.png");}');
    style.append('.outbreak-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/outbreak-frame-monster.png");}');
    style.append('.outbreak-frame .cardName, .outbreak-frame .cardCost {top: 9px;}');
    style.append('.outbreak-frame .cardDesc, .outbreak-frame .cardSilence {top: 129px;}');
    style.append('.outbreak-frame .cardATK, .outbreak-frame .cardHP, .outbreak-frame .cardRarity {top: 213px;}');
    style.append('.outbreak-frame .cardQuantity, .outbreak-frame .cardUCPCost {top: 240px;}');
    style.append('.staff-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}');
    style.append('.staff-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}');
    style.append('.staff-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/staff-frame-spell.png");}');
    style.append('.staff-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/staff-frame-monster.png");}');
    style.append('.staff-frame .cardName, .staff-frame .cardCost {top: 9px;}');
    style.append('.staff-frame .cardDesc, .staff-frame .cardSilence {top: 129px;}');
    style.append('.staff-frame .cardATK, .staff-frame .cardHP, .staff-frame .cardRarity {top: 213px;}');
    style.append('.staff-frame .cardQuantity, .staff-frame .cardUCPCost {top: 240px;}');
    style.append('.mirror-temple-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}');
    style.append('.mirror-temple-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}');
    style.append('.mirror-temple-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/mirror-temple-frame-spell.png");}');
    style.append('.mirror-temple-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/mirror-temple-frame-monster.png"); height: 252px;}');
    style.append('.mirror-temple-frame .cardName, .mirror-temple-frame .cardCost {top: 9px;}');
    style.append('.mirror-temple-frame .cardDesc, .mirror-temple-frame .cardSilence {top: 129px;}');
    style.append('.mirror-temple-frame .cardATK, .mirror-temple-frame .cardHP, .mirror-temple-frame .cardRarity {top: 213px;}');
    style.append('.mirror-temple-frame .cardATK {animation: float 6s ease-in-out infinite;}');
    style.append('.mirror-temple-frame .cardHP {animation: float 6s ease-in-out infinite; animation-delay: -1s;}');
    style.append('.mirror-temple-frame .cardQuantity, .mirror-temple-frame .cardUCPCost {top: 240px;}');
}

function styleTabsOn() {
    style.append('.undertale-frame .cardQuantity, undertale-frame .cardUCPCost {}')
    style.append('.deltarune-frame .cardQuantity, deltarune-frame .cardUCPCost {}')
    style.append('.time-to-get-serious-frame .cardQuantity, time-to-get-serious-frame .cardUCPCost {border: solid #C0C0C0; border-width: 0 6px 2px}')
    style.append('.golden-frame .cardQuantity, golden-frame .cardUCPCost {border: solid gold; border-width: 0 2px 2px}')
    style.append('.vaporwave-frame .cardQuantity, vaporwave-frame .cardUCPCost {}')
    style.append('.spider-party-frame .cardQuantity, spider-party-frame .cardUCPCost {}')
    style.append('.halloween2020-frame .cardQuantity, halloween2020-frame .cardUCPCost {}')
    style.append('.christmas2020-frame .cardQuantity, christmas2020-frame .cardUCPCost {}')
    style.append('.spamton-frame .cardQuantity, spamton-frame .cardUCPCost {}')
    style.append('.cyber-world-frame .cardQuantity, cyber-world-frame .cardUCPCost {}')
    style.append('.pokecard-1996-frame .cardQuantity, .pokecard-1996-frame .cardUCPCost {top: 238px; color: black; background-color: #FCD705; border: solid #FCD705; border-width: 0 2px 2px; border-radius:0 0 10px 10px; z-index: 12;}');
    style.append('.vmas-frame .cardQuantity, vmas-frame .cardUCPCost {}')
    style.append('.grimm-troupe-frame .cardQuantity, grimm-troupe-frame .cardUCPCost {border: solid #9F1414; border-width: 0 2px 2px}')
    style.append('.void-frame .cardQuantity, void-frame .cardUCPCost {}')
    style.append('.hollow-knight-frame .cardQuantity, hollow-knight-frame .cardUCPCost {border: none;}')
    style.append('.fnafb-frame .cardQuantity, fnafb-frame .cardUCPCost {border: solid #8160C1; border-width: 0 2px 2px}')
    style.append('.outbreak-frame .cardQuantity, outbreak-frame .cardUCPCost {}')
    style.append('.staff-frame .cardQuantity, staff-frame .cardUCPCost {}')
    style.append('.mirror-temple-frame .cardQuantity, mirror-temple-frame .cardUCPCost {}')
}

function styleTabsOff() {
    style.append('.cardQuantity, .cardUCPCost {width: 124px; height: 30px; text-align: center; font-size: 20px; color: #fff; position: absolute; left: 26px; background-color: #000; border: solid #fff; border-width: 0 2px 2px}')
}

function updateSoulColor(soul, color) {
    if (color === soulColors[soul]) {
        style.append(`img[src*="images/souls/${soul}.png"] {filter: drop-shadow(0px); transform: translateY(0px);}`);
        style.append(`img[src*="images/souls/big/${soul}.png"] {filter: drop-shadow(0px); transform: translateY(0px);}`);
        style.append(`div:not(.breaking-skin):has(.cardName.${soul}) > .cardImage {background-color: pebis; background-blend-mode: unset;}`);
        style.append(`.${soul}:not(li span):not([onmouseover]):not(.pokecard-1996-frame .${soul}) {color: ${color}; text-shadow: revert}`);
    } else {
        style.append(`img[src*="images/souls/${soul}.png"] {filter: drop-shadow(5000px 5000px 0 ${color}); transform: translate(-5000px, -5000px);}`);
        style.append(`img[src*="images/souls/big/${soul}.png"] {filter: drop-shadow(5000px 5000px 0 ${color}); transform: translate(-5000px, -5000px);}`);
        style.append(`div:not(.breaking-skin):has(.cardName.${soul}) > .cardImage {background-color: ${color} !important; background-blend-mode: luminosity;}`);
        style.append(`.${soul}:not(li span):not([onmouseover]):not(.pokecard-1996-frame .${soul}) {color: ${color}}`);
        if (color === "#000000") {
            style.append(`.${soul}:not(li span):not([onmouseover]) {text-shadow: 0px 0px 10px #fff, 0px 0px 10px #fff;}`)
        } else {
            style.append(`.${soul}:not(li span):not([onmouseover]) {text-shadow: revert}`);
        }
    }
}

function shuffleSouls() {
    var souls = [dtColor.value(), integColor.value(), kindnessColor.value(), justiceColor.value(), pvColor.value(), braveryColor.value(), patienceColor.value()]
    for (let i = souls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // fisher-yates shuffle
        [souls[i], souls[j]] = [souls[j], souls[i]];
    }
    updateSoulColor('DETERMINATION', souls[0]);
    dtColor.set(souls[0]);

    updateSoulColor('INTEGRITY', souls[1]);
    integColor.set(souls[1]);

    updateSoulColor('KINDNESS', souls[2]);
    kindnessColor.set(souls[2]);

    updateSoulColor('JUSTICE', souls[3]);
    justiceColor.set(souls[3]);

    updateSoulColor('PERSEVERANCE', souls[4]);
    pvColor.set(souls[4]);

    updateSoulColor('BRAVERY', souls[5]);
    braveryColor.set(souls[5]);

    updateSoulColor('PATIENCE', souls[6]);
    patienceColor.set(souls[6]);

    $('.underscript-dialog').modal('hide');
}

function defaultSouls() {
    updateSoulColor('DETERMINATION', soulColors.DETERMINATION);
    dtColor.set(soulColors.DETERMINATION);

    updateSoulColor('INTEGRITY', soulColors.INTEGRITY);
    integColor.set(soulColors.INTEGRITY);

    updateSoulColor('KINDNESS', soulColors.KINDNESS);
    kindnessColor.set(soulColors.KINDNESS);

    updateSoulColor('JUSTICE', soulColors.JUSTICE);
    justiceColor.set(soulColors.JUSTICE);

    updateSoulColor('PERSEVERANCE', soulColors.PERSEVERANCE);
    pvColor.set(soulColors.PERSEVERANCE);

    updateSoulColor('BRAVERY', soulColors.BRAVERY);
    braveryColor.set(soulColors.BRAVERY);

    updateSoulColor('PATIENCE', soulColors.PATIENCE);
    patienceColor.set(soulColors.PATIENCE);

    $('.underscript-dialog').modal('hide');
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

class buttonSetting extends underscript.utils.SettingType {
    constructor() {
        super('button');
    }

    element(value, update, {
        data = {},
    }) {
        return $(`<input type="button">`)
            .on('click', (e) => data.onclick())
            .val(data.text)
    }

    labelFirst() {
        return null;
    }

    styles() {
        return [
            'input[type=button] { background: black; color: white; }',
        ];
    }
}
const button = new buttonSetting();
plugin.settings().addType(button);

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

class keybindSetting extends underscript.utils.SettingType {
    constructor() {
        super('keybind');
    }
    value(val) {
        if (typeof val !== 'string') return val;
        return JSON.parse(val);
    }
    default() {
        return ["unbound", "unbound"];
    }
  element(value, update, {
    remove = false,
  }) {
    return $(`<input type="button" class="gsKeybind">`)
        .val(value[1])
        .on('focus', function () {
            const $kbd = $(this);
            var setblur;
            $kbd.addClass("listening");
            $kbd.val('...?');
            const action = (e) => {
                e.preventDefault();
                e = e.originalEvent;
                var display, code;
                if ('button' in e) {
                    display = e.button;
                    code = display;
                    switch (e.button) { //                                                     Is it wreckless and ignorant to allow you to bind such actions to simply clicking the mouse?
                        case 0: display = 'Left Click'; break;
                        case 1: display = 'Middle Click'; break;
                        case 2: display = 'Right Click'; break;
                        default: display = `Mouse Button ${e.button}`; break; //                                                        Yes! :D
                    }
                } else if (e.key === 'Escape') {
                    display = 'unbound'
                    code = 'unbound'
                } else {
                    display = e.key.length === 1 ? e.key.toUpperCase() : e.key;
                    if (display === ' ') display = 'Space'
                    code = e.code;
                    switch (e.location) {
                        case 0: break;
                        case 1: display += ' (Left)'; break;
                        case 2: display += ' (Right)'; break;
                        case 3: display += ' (Numpad)'; break;
                        default: display += ' (Somewhere?)'; //  i wanna see a sc of someone getting this. like dude what keyboard do you have
                    }
                }
                $kbd.val(display);
                update([code, display])
                $(document).off('keydown', action);
                $(document).off('mousedown', action);
                setblur = 1;
                $kbd.blur();
            };
            $(document).on('keydown', action);
            $(document).on('mousedown', action);
            $kbd.on('blur', function () {
                $kbd.removeClass("listening");
                if (setblur) return;
                $(document).off('keydown', action);
                $(document).off('mousedown', action);
                $kbd.val(value[1]);
            })
        })

  }
  styles() {
    return [
      ".gsKeybind { font-size: 11px; height: 18px; background-color: black; border-radius: 3px; border: 1px solid #b4b4b4; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7); }",
      ".listening { border: 1px solid #afeeee; box-shadow: 0 1px 1px #40E0D0, 0 2px 0 0 #40E0D0;}",
      ];
    }
}

const keybind = new keybindSetting();
plugin.settings().addType(keybind);

const cardAliases = plugin.settings().add({
    key: 'cardAliases',
    name: 'Card aliases',
    note: 'Cards can be searched by popular aliases and shorthands<br>Examples: bneo, casdyne, and skris, when entered, show their respective cards<br><br><span style="color:thistle;">Change applies on reload</span>',
    category: 'QoL',
    default: true,
});

const mulliganInfo = plugin.settings().add({
    key: 'mulliganInfo',
    name: 'Mulligan information',
    note: 'Displays turn order and opponent\'s name and SOUL on the Mulligan at the start of the game.',
    category: 'QoL',
    default: true,
});

const autoStartMusic = plugin.settings().add({
    key: 'autoStartMusic',
    name: 'Automatically start music',
    note: 'Normally, the game requires that you first click the page to play the background music.<br>With this on, it\'ll attempt to immediately start playing, with no user input<br><br><span style="color:thistle;">Do note, however, that some browsers still aren\'t able to play audio without user input.</span><br><br><span style="color:thistle;">unfinishe dkinda</span>',
    category: 'QoL',
    default: false,
});

const darkModeBarrier = plugin.settings().add({
    key: 'darkModeBarrier',
    name: 'Dark mode barrier animation',
    note: 'Fear not, for the eyeballs are saved...',
    category: 'QoL',
    default: true,
    onChange: (val) => {if (val) {barrierDark()} else {barrierUndark()}}
});

const programIndicators = plugin.settings().add({
    key: 'programIndicators',
    name: 'Program indicator',
    note: 'Program cards, when hovered, display their cost as their cost + the Program\'s cost<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'QoL',
    default: true,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const statFilters = plugin.settings().add({
    key: 'statFilters',
    name: 'Stat filters',
    note: 'Adds custom cost, ATK, and HP filters on the Crafting and Decks pages.',
    category: 'QoL',
    default: true,
    onChange: (val) => {if (val) {createStatFilters()} else {destroyStatFilters()}}
});

const statsOnTop = plugin.settings().add({
    key: 'statsOnTop',
    name: 'Stats on top',
    note: 'Renders card stats to be always over full skins',
    category: 'QoL',
    default: false,
    onChange: (val) => {if (val) {statsTopOn()} else {statsTopOff()}}
});

const maxHpIndicator = plugin.settings().add({
    key: 'maxHpIndicator',
    name: 'Max HP indicator',
    note: 'Adds an indicator that shows the monster\'s HP out of its max.<br><span style="color:thistle;">hide when full</span>: Doesn\'t display if the monster\'s HP is full.<br><span style="color:thistle;">always show</span>: Still displays if the monster\'s HP is full.',
    category: 'QoL',
    type: "select", options: ["off", "hide when full", "always show"],
    default: 'hide when full',
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const cardSkinNames = plugin.settings().add({
    key: 'cardSkinNames',
    name: 'Card skin names',
    note: 'When a card has a card skin, the card\'s name will be changed to match the skin\'s name.<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const loopNames = plugin.settings().add({
    key: 'loopNames',
    name: 'Loop names',
    note: 'When a card has 1 or more Loop, its name will be changed to its plural form<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const respectiveFrames = plugin.settings().add({
    key: 'respectiveFrames',
    name: 'Respective frames',
    note: 'UT and UTY cards use the Undertale frame, and DR cards use the Deltarune frame<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const frameSpoof = plugin.settings().add({
    key: 'frameSpoof',
    name: 'Change frame',
    note: 'Changes cards to use any frame, including some custom ones!<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    type: "select", options: allFrames.toSpliced(0, 0, "off"),
    default: "off",
    onChange: (val) => {
        if (val === 'Pokecard 1996') {
            statBase.set('10')
            powerSpacing.set(135)
            powerBounds.set(58)
            legacyPowers.set(false)
            numStack.set(true)
        } else {
            statBase.set('1')
            powerSpacing.set(20)
            powerBounds.set(135)
            legacyPowers.set(false)
            numStack.set(false)
        }
      $('.underscript-dialog').modal('hide');
      if (typeof window.showPage === 'function') window.showPage(window.currentPage);
    }
});

const frameSpoofBehavior = plugin.settings().add({
    key: 'frameSpoofBehavior',
    name: 'Ingame display behavior',
    note: 'Decides when the chosen frame should display itself<br><br>Side note: Ally cards are cards owned by <i>you</i> specifically,<br>so they won\'t show up while spectating</span><br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    type: "select", options: ["ally cards only", "all cards"],
    default: "ally cards only",
});

const statBase = plugin.settings().add({
    key: 'statBase',
    name: 'Stat base numbers',
    note: 'Displays stats in multiples of 1, 10, or 100.<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    type: "select", options: ["1", "10", "100"],
    default: "1",
    disabled: frameSpoof?.value() === 'Pokecard 1996',
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
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
    disabled: frameSpoof?.value() === 'Pokecard 1996',
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const powerBounds = plugin.settings().add({
    key: 'powerBounds',
    name: 'Power bounds',
    note: 'Changes how far powers can go up to<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    type: "text",
    default: 135,
    reset: !frameSpoof?.value() === 'Pokecard 1996',
    disabled: frameSpoof?.value() === 'Pokecard 1996',
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const legacyPowers = plugin.settings().add({
    key: 'legacyPowers',
    name: 'No power fitting',
    note: 'Do you prefer the powers hanging off the card, you sick freak?<br>Here you go :3<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    default: false,
    disabled: frameSpoof?.value() === 'Pokecard 1996',
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const numStack = plugin.settings().add({
    key: 'numStack',
    name: 'Powers iterate',
    note: 'Instead of numbers, powers iterate themselves<br><span style="color:thistle;">ex:</span> 3 Loop would appear as 3 seperate Loop icons,<br>not one Loop icon with a 3 on it.<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Card rendering',
    default: false,
    disabled: frameSpoof?.value() === 'Pokecard 1996',
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const styleTabs = plugin.settings().add({
  key: 'styleTabs',
  name: 'Style tabs',
  note: 'Makes the tabs at the bottom of cards better fit<br>with the style of its frame.',
  category: 'Card rendering',
  default: true,
  onChange: (val) => {if (val) {styleTabsOn()} else {styleTabsOff()}}
});

const keybindsInfo = plugin.settings().add({
  key: 'keybindsInfo',
  name: '<span style="color:thistle;">Keys cannot be bound to multiple actions.<br>If they are, the highest setting takes priority.<br><br>Press Escape while binding to unbind.</span>',
  category: 'Keybinds',
  type: plaintext,
});

const bgKeybind = plugin.settings().add({
  key: 'bgKeybind',
  name: 'Background reroll',
  note: 'Set the key used for rerolling the background',
  category: 'Keybinds',
  type: keybind,
  default: '["unbound", "unbound"]',
});

const surrenderKeybind = plugin.settings().add({
  key: 'surrenderKeybind',
  name: 'Surrender',
  note: 'Sets the key used to surrender instantly<br><br>( Can\'t surrender before the first player\'s t5 )',
  category: 'Keybinds',
  type: keybind,
  default: '["unbound", "unbound"]',
});

const openGalascriptKeybind = plugin.settings().add({
  key: 'openGalascriptKeybind',
  name: 'Open Galascript settings',
  note: 'Sets the key used to instantly open the Galascript settings',
  category: 'Keybinds',
  type: keybind,
  default: '["BracketRight", "]"]',
});

const resetFiltersKeybind = plugin.settings().add({
  key: 'resetFiltersKeybind',
  name: 'Reset filters',
  note: 'Sets the key used to reset filters,<br>in case you can\'t find your way back to the settings',
  category: 'Keybinds',
  type: keybind,
  default: '["Delete", "Delete"]',
});

const switchPerspectivesKeybind = plugin.settings().add({
  key: 'switchPerspectivesKeybind',
  name: 'Switch perspectives',
  note: 'Sets the key used to switch the spectation perspective to the other player',
  category: 'Keybinds',
  type: keybind,
  default: '["unbound", "unbound"]',
});

const chatroomZeroKeybind = plugin.settings().add({
  key: 'chatroomZeroKeybind',
  name: 'Open OOB chatroom',
  note: 'Sets the key used to open chatroom 0 -- an ominous unused chat<br>Somewhat useful for writing notes!<br><br><span style="color:salmon;">Chats in this room are still logged by Undercards Chat Log, so...<br>...don\'t try anything stupid, okay?</span>',
  category: 'Keybinds',
  type: keybind,
  default: '["unbound", "unbound"]',
});

var emoteKeybinds
plugin.events.on('Chat:Connected', () => {
    emoteKeybinds = plugin.settings().add({
        key: 'emoteKeybinds',
        name: 'Emotes',
        note: 'Do emotes with keypresses',
        category: 'Keybinds',
        type: 'advancedMap',
        default: [['["Digit1", "1"]', 'you know what i HATE?      that\'s BEPIS       the taste... the smell... the texture...        hey.... your drooling......']],
        type: {
            key: keybind,
            value: 'select',
        },
        data: () => ({
            value: window.chatEmotes.map(emote => [emote.name, emote.id])
        }),
    });
});

const filtersInfo = plugin.settings().add({
  key: 'filtersInfo',
  name: '<span style="color:thistle;">Don\'t get lost! By default, pressing Delete<br>will turn off all filters.</span>',
  category: 'Filters',
  type: plaintext,
});

const crispiness = plugin.settings().add({
  key: 'crispiness',
  name: 'Crispiness',
  note: 'Changes how... <i>crispy</i> everything is',
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

const spice = plugin.settings().add({
  key: 'spice',
  name: '\"Spice\"',
  note: 'Adds a few dumb messages<br><br><span style="color:thistle;">Change applies on refresh</span>',
  category: 'Sillies',
  default: false,
});

const dtColor = plugin.settings().add({
    key: 'dtColor',
    name: 'Determination color',
    note: 'Recolors anything Determination!',
    category: 'Sillies',
    type: "color",
    default: soulColors.DETERMINATION,
    reset: true,
    onChange: (val) => {updateSoulColor('DETERMINATION', val)}
});

const integColor = plugin.settings().add({
    key: 'integColor',
    name: 'Integrity color',
    note: 'Recolors anything Integrity!',
    category: 'Sillies',
    type: "color",
    default: soulColors.INTEGRITY,
    reset: true,
    onChange: (val) => {updateSoulColor('INTEGRITY', val)}
});

const kindnessColor = plugin.settings().add({
    key: 'kindnessColor',
    name: 'Kindness color',
    note: 'Recolors anything Kindness!',
    category: 'Sillies',
    type: "color",
    default: soulColors.KINDNESS,
    reset: true,
    onChange: (val) => {updateSoulColor('KINDNESS', val)}
});

const justiceColor = plugin.settings().add({
    key: 'justiceColor',
    name: 'Justice color',
    note: 'Recolors anything Justice!',
    category: 'Sillies',
    type: "color",
    default: soulColors.JUSTICE,
    reset: true,
    onChange: (val) => {updateSoulColor('JUSTICE', val)}
});

const pvColor = plugin.settings().add({
    key: 'pvColor',
    name: 'Perseverance color',
    note: 'Recolors anything Perseverance!',
    category: 'Sillies',
    type: "color",
    default: soulColors.PERSEVERANCE,
    reset: true,
    onChange: (val) => {updateSoulColor('PERSEVERANCE', val)}
});

const braveryColor = plugin.settings().add({
    key: 'braveryColor',
    name: 'Bravery color',
    note: 'Recolors anything Bravery!',
    category: 'Sillies',
    type: "color",
    default: soulColors.BRAVERY,
    reset: true,
    onChange: (val) => {updateSoulColor('BRAVERY', val)}
});

const patienceColor = plugin.settings().add({
    key: 'patienceColor',
    name: 'Patience color',
    note: 'Recolors anything Patience!',
    category: 'Sillies',
    type: "color",
    default: soulColors.PATIENCE,
    reset: true,
    onChange: (val) => {updateSoulColor('PATIENCE', val)}
});

const shuffleSoulColors = plugin.settings().add({
    key: 'shuffleSoulColors',
    name: 'Shuffle',
    note: 'Shuffles all the soul colors!?<br><br><span style="color:thistle;">Closes this menu</span>',
    category: 'Sillies',
    type: button,
    data: {
        text: 'Shuffle',
        onclick() {shuffleSouls()}
    }
});

const resetSoulColors = plugin.settings().add({
    key: 'resetSoulColors',
    name: 'Reset',
    note: 'Resets all the soul colors to their default values<br><br><span style="color:thistle;">Closes this menu</span>',
    category: 'Sillies',
    type: button,
    data: {
        text: 'Reset',
        onclick() {defaultSouls()}
    }
});

const obscurityInfo = plugin.settings().add({
    key: 'obscurityInfo',
    name: 'ⓘ Obscurity info',
    note: `<span style="color:thistle;">obfuscate</span>: Sets the text of the element<br>
         <span style="color:thistle;">blur</span>: Visually blurs the element<br>
         <span style="color:thistle;">to set card</span>: Sets the content to the usual content of any given card<br>
         <span style="color:thistle;">to random card, universal</span>: Maps the content to that of a random card<br>
         <span style="color:thistle;">to random card, unique</span>: Maps the content to that of a random card<br>
         <span style="color:thistle;">hide</span>: Hides the element<br>`,
    category: 'Obscurity',
    type: plaintext,
});

const obscCardName = plugin.settings().add({
    key: 'obscCardName',
    name: 'Obscure name',
    category: 'Obscurity',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card, universal", "to random card, unique", "hide"],
    default: "off",
    onChange: (val) => {obscure('cardName', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const obscCardCost = plugin.settings().add({
    key: 'obscCardCost',
    name: 'Obscure cost',
    category: 'Obscurity',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card, universal", "to random card, unique", "hide"],
    default: "off",
    onChange: (val) => {obscure('cardCost', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const obscCardImage = plugin.settings().add({
    key: 'obscCardImage',
    name: 'Obscure image',
    category: 'Obscurity',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card, universal", "to random card, unique", "hide"],
    default: "off",
    onChange: (val) => {obscure('cardImage', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const obscCardPowers = plugin.settings().add({
    key: 'obscCardPowers',
    name: 'Obscure powers',
    category: 'Obscurity',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card, universal", "to random card, unique", "hide"],
    default: "off",
    onChange: (val) => {obscure('cardStatus', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const obscCardTribes = plugin.settings().add({
    key: 'obscCardTribes',
    name: 'Obscure tribes',
    category: 'Obscurity',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card, universal", "to random card, unique", "hide"],
    default: "off",
    onChange: (val) => {obscure('cardTribes', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const obscCardDesc = plugin.settings().add({
    key: 'obscCardDesc',
    name: 'Obscure descriptions',
    category: 'Obscurity',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card, universal", "to random card, unique", "hide"],
    default: "off",
    onChange: (val) => {obscure('cardDesc', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const obscCardStats = plugin.settings().add({
    key: 'obscCardStats',
    name: 'Obscure stats',
    category: 'Obscurity',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card, universal", "to random card, unique", "hide", "hide, use spell frame"],
    default: "off",
    onChange: (val) => {obscure('cardATK', val); obscure('cardHP', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const obscCardRarity = plugin.settings().add({
    key: 'obscCardRarity',
    name: 'Obscure rarity',
    category: 'Obscurity',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card, universal", "to random card, unique", "hide"],
    default: "off",
    onChange: (val) => {obscure('cardRarity', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const obscSettings = {
    obscCardName: {
        value: obscCardName.value(),
        elements: ['cardName']
    },
    obscCardCost: {
        value: obscCardCost.value(),
        elements: ['cardCost']
    },
    obscCardImage: {
        value: obscCardImage.value(),
        elements: ['cardImage']
    },
    obscCardPowers: {
        value: obscCardPowers.value(),
        elements: ['cardStatus']
    },
    obscCardTribes: {
        value: obscCardTribes.value(),
        elements: ['cardTribes']
    },
    obscCardDesc: {
        value: obscCardDesc.value(),
        elements: ['cardDesc']
    },
    obscCardStats: {
        value: obscCardStats.value(),
        elements: ['cardATK', 'cardHP']
    },
    obscCardRarity: {
        value: obscCardRarity.value(),
        elements: ['cardRarity']
    }
};

const obfuscationText = plugin.settings().add({
    key: 'obfuscationText',
    name: 'Obfuscation text',
    note: 'Sets the text used by the "obfuscate" option',
    category: 'Obscurity',
    type: "text",
    default: "?",
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

var cardNames = [];

plugin.events.on('allCardsReady', (c) => {
    c.forEach(card => {cardNames.push(card.name)})
    cardNames.sort();
})

const obscSetCard = plugin.settings().add({
    key: 'obscSetCard',
    name: 'Set card',
    note: () => cardNames.length === 0 ? 'allCards isn\'t loaded. Try reopening this menu.' : 'Sets the card used by the "to set card" option',
    category: 'Obscurity',
    type: "select", options: cardNames,
    default: "Sans",
    disabled: () => cardNames.length === 0,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const trueObscurity = plugin.settings().add({
    key: 'trueObscurity',
    name: 'True obscurity',
    note: 'I think your deck was shuffled the wrong way...?<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Obscurity',
    type: "select", options: ["off", "on", "on, obscure rarity"],
    default: "off",
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});
const fillCardGaps = plugin.settings().add({
    key: 'fillCardGaps',
    name: 'Fill card gaps',
    note: 'Certain ranges of card IDs are completely missing.<br>This fills in those ranges with fun old or unused cards :D<br><br><span style="color:thistle;">Change applies on reload</span>',
    category: 'Obscurity',
    default: false,
});

const noGenerated = plugin.settings().add({
    key: 'noGenerated',
    name: 'No Generated',
    note: 'Hides generated power<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Obscurity',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/createdUnknown.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const noSilence = plugin.settings().add({
    key: 'noSilence',
    name: 'No silence',
    note: 'Hides silence power and background<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Obscurity',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/silencedUnknown.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {hide('cardSilence', val); if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const noCostBuffs = plugin.settings().add({
    key: 'noCostBuffs',
    name: 'No cost buffs',
    note: 'Hides cost buff and debuff power<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Obscurity',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/costUnknown.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const noStatBuffs = plugin.settings().add({
    key: 'noStatBuffs',
    name: 'No ATK / HP buffs',
    note: 'Hides ATK / HP buff and debuff powers<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Obscurity',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/statsUnknown.gif' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const baseStatChangePower = plugin.settings().add({
    key: 'baseStatChangePower',
    name: 'Base stat change',
    note: 'Brings back the base stat change power!<br>...Should be slightly more stable. Reset your cache frequently, folks!<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'images/powers/baseStatChange.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const undereventPower = plugin.settings().add({
    key: 'undereventPower',
    name: 'Underevent 2024',
    note: 'Displays on El Undercardio!<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'images/powers/underevent2024.png' },
    type: powerCheckbox,
    default: true,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const programPower = plugin.settings().add({
    key: 'programPower',
    name: 'Program',
    note: 'Displays the program value<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/program.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const targetPower = plugin.settings().add({
    key: 'targetPower',
    name: 'Target',
    note: 'Displays the card\'s valid board targets<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/target.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const turnsPower = plugin.settings().add({
    key: 'turnsPower',
    name: 'Turn played',
    note: 'Displays the turn a card was played<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/turn.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const shinyPower = plugin.settings().add({
    key: 'shinyPower',
    name: 'Shiny',
    note: 'Displays when card is shiny<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/shiny.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const deadPower = plugin.settings().add({
    key: 'deadPower',
    name: 'Dead',
    note: 'Displays if the card has 0 or less HP<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/dead.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const legendPower = plugin.settings().add({
    key: 'legendPower',
    name: 'Legendmaker',
    note: 'Displays if the card\'s owner got LEGEND last season<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/legendmaker.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const totemPower = plugin.settings().add({
    key: 'totemPower',
    name: 'Totem drop',
    note: 'Displays if the card has base 7 cost or HP<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/totem.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const barrierPower = plugin.settings().add({
    key: 'barrierPower',
    name: 'The Barrier',
    note: 'How else would you know such <i>crucial</i> information about The Barrier?<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/barrierPowers.gif' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const primePower = plugin.settings().add({
    key: 'primePower',
    name: 'Prime',
    note: 'Displays if the monster\'s card ID is a prime number<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/prime.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

const backgroundCheck = plugin.settings().add({
    key: 'backgroundCheck',
    name: 'Check',
    note: 'Always displays, giving all of a card\'s currently stored information<br>For use in debugging :P<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/check.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {if (typeof window.showPage === 'function') window.showPage(window.currentPage);}
});

// const nvcsInfo = plugin.settings().add({
//     key: 'nvcsInfo',
//     name: `
//     Here, you can turn on specific information about
//     <br>cards! <span style="color:salmon;">Fair warning: The bigger the pool, the
//     <br>more the card will bog the game down!</span>
//     `,
//     category: 'NVCS',
//     type: plaintext,
// });

// function nvcsCardsSort() {
//     const cards = window.nvcsCards();
//     let cardArray = Object.values(cards);
//     cardArray.sort((a, b) => a.name.localeCompare(b.name));
//     let cardNames = {};
//     cardArray.forEach((card, index) => {
//         cardNames[index] = card;
//     });
//     return cardNames;
// }

// (async() => {
//     while(!window.nvcsCards)
//     { await new Promise(resolve => setTimeout(resolve, 100)); } // kill me, why is this the only solution that works
//     for (const key in window.nvcsCards()) {
//         var a = nvcsCardsSort()
//         var c = a[key]
//         nvcs[`${c.key}Enabled`] = plugin.settings().add({
//             key: `${c.key}Enabled`,
//             name: c.name,
//             note: c.info,
//             category: 'NVCS',
//             data: { src: `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${c.sprite}.png` },
//             type: powerCheckbox,
//             default: false,
//         });
//     }
// })();

const versionInfo = plugin.settings().add({
    key: 'versionInfo',
    name: `Version ${pluginVersion}`,
    note: patchNotes,
    type: plaintext,
    category: 'Galascript',
});

function processBinds(e) {
    if (e.target.getAttribute("type") !== 'text' && e.target.className !== 'gsKeybind') { // if not in a text field or setting a keybind
        switch ('button' in e ? e.button : e.code) {
            case bgKeybind?.value()[0]:
                if (!ingame) {
                    break;
                }
                var newBg = window.randomInt(1, 60); // remember to always update when new bgs get added, dummy :p
                $('body').css('background', '#000 url(\'images/backgrounds/' + newBg + '.png\') no-repeat');
                $('body').css('background-size', 'cover');
                sessionStorage.setItem(`underscript.bgm.${window.gameId}`, newBg); // fixes interactions with underscript's persist bg system
                window.music.pause();
                window.playBackgroundMusic(newBg);
                break;
            case resetFiltersKeybind?.value()[0]:
                crispiness.set(100);
                blurriness.set(0);
                greyscale.set(0);
                invert.set(false);
                lightsOff.set(false);
                $('.underscript-dialog').modal('hide');
                break;
            case openGalascriptKeybind?.value()[0]:
                newInstall.show();
                break;
            case switchPerspectivesKeybind?.value()[0]:
                if (!ingame) {
                    break;
                }
                if (!window.spectate) {
                    break;
                }
                window.location.href = `https://undercards.net/Spectate?gameId=${window.gameId}&playerId=${window.opponentId}`
                break;
            case surrenderKeybind?.value()[0]:
                if (!ingame) {
                    break;
                }
                if (window.spectate) {
                    break;
                }
                if (window.turn < 5) {
                    plugin.toast({title: "You can't surrender before turn 5.", text: "You pressed the set key for <i>Surrender</i>."})
                    break;
                }
                window.socketGame.send(JSON.stringify({action: "surrender"}));
                break;
            case chatroomZeroKeybind?.value()[0]:
                window.openRoom(0);
                break;
            case [...emoteKeybinds?.value().keys()].map(key => JSON.parse(key)[0]).includes(e.code) ? e.code : null:
                if (!ingame) {
                    break;
                }
                if (window.spectate) {
                    break;
                }
                var id = Object.fromEntries([...emoteKeybinds?.value()].map(([key, value]) => [JSON.parse(key)[0], value]))[e.code]
                window.socketGame.send(JSON.stringify({action: "emote", id: id}));
                break;
        }
    }
}

document.addEventListener("keyup", e => processBinds(e));
document.addEventListener("mouseup", e => processBinds(e));


window.addEventListener("wheel", function (e) {
    const cardsPreview = document.getElementById("cardsPreviewCompact") // again nvcs leftover mostly
    if (cardsPreview) cardsPreview.scrollLeft += e.deltaY;
});

const flashlight = document.createElement("div");
function createFlashlight() {
    flashlight.id = "gsFlashlight";
    document.body.appendChild(flashlight);
    window.addEventListener("mousemove", function(e) {
        var flashlight = document.getElementById("gsFlashlight");
        flashlight.style.backgroundPosition = `${e.pageX - flashlightRadius / 2}px ${(e.pageY - flashlightRadius / 2) - window.scrollY}px`;
    });
}
function removeFlashlight() { // very intricate function right here
    flashlight.remove()
}

plugin.events.on(':preload', () => {
    globalStyles();
    initCustomFrames();
    siteFilter(crispiness?.value(), blurriness?.value(), greyscale?.value(), invert?.value());
    updateFlashlightRadius(flashlightRadiusInput?.value());
    updateFlashlightImg(flashlightStyle?.value());
    if (pixelImageRendering?.value()) {imgPixel()}
    if (darkModeBarrier?.value()) {barrierDark()}
    for (var i in obscSettings) {
        obscSettings[i].elements.forEach(k => obscure(k, obscSettings[i].value))
    }
    if (noSilence?.value()) {hide('cardSilence', true)}
    if (lightsOff?.value()) {createFlashlight()}
    cardElBgFix()
    if (statsOnTop?.value()) {statsTopOn()}
    if (styleTabs?.value()) {styleTabsOn()}
    if (mulliganInfo?.value()) {initMulliganInfo()}
    updateSoulColor('DETERMINATION', dtColor?.value());
    updateSoulColor('INTEGRITY', integColor?.value());
    updateSoulColor('KINDNESS', kindnessColor?.value());
    updateSoulColor('JUSTICE', justiceColor?.value());
    updateSoulColor('PERSEVERANCE', pvColor?.value());
    updateSoulColor('BRAVERY', braveryColor?.value());
    updateSoulColor('PATIENCE', patienceColor?.value());
});

plugin.events.on('translation:loaded', () => {
    if (spice?.value()) {initSpice();}
    if (fillCardGaps?.value()) {initUnusedCards();}
    if (cardAliases?.value()) {initAliases();};
    initCustomPower();
});

plugin.events.on(':load', () => {
    if (statFilters?.value()) {createStatFilters()}
});

plugin.events.on('connect', () => {
    if (autoStartMusic?.value()) {
        window.playBackgroundMusic(window.numBackground);
        $('html').unbind('click');
    };
});

// i am very proud of the stat filters. they make me feel cool

function destroyStatFilters() {
    $('#costInput').remove();
    $('#atkInput').remove();
    $('#hpInput').remove();
    $('#costMode').remove();
    $('#atkMode').remove();
    $('#hpMode').remove();
}

function createStatFilters() {
    const includePaths = ['/Crafting', '/Decks', '/DecksAdmin'];
    if (!includePaths.includes(window.location.pathname)) { return; }

    const costInput = $('<input>', {
        id: 'costInput',
        type: 'number',
        min: 0,
        class: 'form-control equals',
        placeholder: 'cost',
        'data-i18n-placeholder': 'stat-cost'
    });

    const atkInput = $('<input>', {
        id: 'atkInput',
        type: 'number',
        min: 0,
        class: 'form-control equals',
        placeholder: 'ATK',
        'data-i18n-placeholder': 'stat-atk'
    });

    const hpInput = $('<input>', {
        id: 'hpInput',
        type: 'number',
        min: 0,
        class: 'form-control equals',
        placeholder: 'HP',
        'data-i18n-placeholder': 'stat-hp'
    });

    const modes = [
        { value: 'moreThanEqualTo', class: 'moreThanEqualTo', text: '>=' },
        { value: 'moreThan', class: 'moreThan', text: '>' },
        { value: 'equals', class: 'equals', text: '=' },
        { value: 'lessThan', class: 'lessThan', text: '<' },
        { value: 'lessThanEqualTo', class: 'lessThanEqualTo', text: '<=' }
    ];

    const costMode = $('<select>', {
        id: 'costMode',
        class: 'statMode'
    });

    const atkMode = $('<select>', {
        id: 'atkMode',
        class: 'statMode'
    });

    const hpMode = $('<select>', {
        id: 'hpMode',
        class: 'statMode'
    });

    modes.forEach(option => {
        const newMode = $('<option>', {
            class: option.class,
            value: option.value,
            text: option.text,
            selected: option.text === '='
        });
        costMode.append(newMode.clone());
        atkMode.append(newMode.clone());
        hpMode.append(newMode.clone());
    });

    var searchBar = $('#searchInput');

    searchBar.after(hpMode);
    searchBar.after(atkMode);
    searchBar.after(costMode);
    searchBar.after(hpInput);
    searchBar.after(atkInput);
    searchBar.after(costInput);

    var oldCost, oldAtk, oldHp;

    costInput.keyup(function (e) {
        window.applyFilters();
        window.showPage(0);
    });
    atkInput.keyup(function (e) {
        window.applyFilters();
        window.showPage(0);
    });
    hpInput.keyup(function (e) {
        window.applyFilters();
        window.showPage(0);
    });
    costInput.mouseup(function () {
        if (costInput.val() == 0 && oldCost === '0') {
            costInput.val('')
        }
        window.applyFilters();
        window.showPage(0);
        oldCost = costInput.val();
    });
    atkInput.mouseup(function () {
        if (atkInput.val() == 0 && oldAtk === '0') {
            atkInput.val('')
        }
        window.applyFilters();
        window.showPage(0);
        oldAtk = atkInput.val();
    });
    hpInput.mouseup(function () {
        if (hpInput.val() == 0 && oldHp === '0') {
            hpInput.val('')
        }
        window.applyFilters();
        window.showPage(0);
        oldHp = hpInput.val();
    });
    costMode.on('input', function() {
        const value = $(this).val();
        $(this).attr('class', 'statMode');
        $(this).addClass(value);
        costInput.attr('class', 'form-control');
        costInput.addClass(value);
        window.applyFilters();
        window.showPage(0);
    });
    atkMode.on('input', function() {
        const value = $(this).val();
        $(this).attr('class', 'statMode');
        $(this).addClass(value);
        atkInput.attr('class', 'form-control');
        atkInput.addClass(value);
        window.applyFilters();
        window.showPage(0);
    });
    hpMode.on('input', function() {
        const value = $(this).val();
        $(this).attr('class', 'statMode');
        $(this).addClass(value);
        hpInput.attr('class', 'form-control');
        hpInput.addClass(value);
        window.applyFilters();
        window.showPage(0);
    });
}

// wasnt that so cool. enable it ingame. install my virus

// that was a joke

// i am not a cookie logger uwu :3

const newInstall = plugin.settings().add({
    key: 'newInstall',
    default: true,
    hidden: true
});
