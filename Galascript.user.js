// ==UserScript==
// @name         Galascript
// @namespace    https://undercards.net
// @version      1.0.2.3
// @description  Galascript adds various features that modify your gameplay experience; whether it be for the better, or for the worse...!
// @author       galadino
// @match        https://*.undercards.net/*
// @icon         https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/iconVirgil.png
// @require      https://raw.githubusercontent.com/UCProjects/UnderScript/master/src/checkerV2.js
// @grant        none
// ==/UserScript==

/* eslint no-multi-spaces: "off" */

const $ = window.$;
const pluginName = GM_info.script.name;
const pluginVersion = GM_info.script.version;
const underscript = window.underscript;
const plugin = underscript.plugin(pluginName, pluginVersion);
const ingame = window.location.pathname === '/Game' || window.location.pathname === '/Spectate';
window.styleGroups = new Map();
function style(group, operation, ...css) {
    if (!window.styleGroups.has(group)) { window.styleGroups.set(group, plugin.addStyle()) }
    css = css.join('').replace(/^\s*[\r\n]/gm, "");
    switch (operation) {
        case 'add': window.styleGroups.get(group).append(css); break;
        case 'remove': window.styleGroups.get(group).remove(); break;
        case 'replace': window.styleGroups.get(group).replace(css); break;
        default: console.error(`Operation for style is invalid; should be "add", "remove", or "replace" (was "${operation}")`);
    }
}
const standardFrames = ["Undertale", "Deltarune", "Time to get serious", "Vaporwave", "Spider Party", "Halloween2020", "Christmas2020"]
const customFrames = ["Staff", "Spamton", "Cyber World", "Hollow Knight", "Grimm Troupe", "Void", "FNAFB", "Outbreak", "Mirror Temple", "VMas", "Steamworks", "Inscrypted", "Its TV Time", "Cold Place", "Slay the Spire", "Pokecard 1996"]
const backgrounds = ["-", "Ruins - UT", "Quiet Water - UT", "Hotland - UT", "Snowdin - UT", "The Surface - UT", "MTT Resort - UT", "Waterfall - UT", "The CORE - UT",
                     "Judgement Hall - UT", "True Lab - UT", "Hometown - DR", "Scarlet Forest - DR", "Home - DR", "Field of Hopes and Dreams - DR", "Castle Town - DR",
                     "Card Castle - DR", "Jevil's Staircase - DR", "Temmie Village - UT", "Home - UT", "Snowy - UT", "Quiet Autumn - DR", "Alphys's Classroom - DR", "Grillby's - UT",
                     "Raining Somewhere Else - UT", "Title Fountain - DR", "Dog Casino - UT", "sans. - UT", "Dog Shrine - UT", "Cyber World - DR", "Cyber City - DR",
                     "Pandora Palace - DR", "Green Room - DR", "New Home - UT", "Lost Girl - DR", "Alphys's Lab - UT", "Acid Tunnel of Love - DR", "Castle Funk - DR",
                     "Spamton Alleyway - DR", "Spamton's World - DR", "Pandora Palace...? - DR", "Basement - DR", "GIGA Queen - DR", "Ruins - UTY", "Snowdin - UTY", "Honeydew Resort Band - UTY",
                     "Dunes - UTY", "East Mines - UTY", "Wild East - UTY", "Steamworks - UTY", "Greenhouse - UTY", "Steamworks Factory - UTY", "Ceroba's House - UTY", "Dalv's House - UTY",
                     "Honeydew Resort - UTY", "Oasis - UTY", "Hotland Ride - UTY", "Waterfall Ride - UTY", "Golden Opportunity - UTY", "New Home - UTY", "Stage - UE",
                     "Adventure Board - DR", "Paradise - DR", "Cold Place - DR", "TV World - DR", "Holiday House - DR", "Dark Sanctuary - DR", "Gerson's Keep - DR", "Third Sanctuary - DR", "Where It Rained - DR",]
const backgroundsMap = new Map(backgrounds.map((bg, i) => [i, { id: i, bg: bg }]));
const preferenceTypes = ["Omit", "Play less often", "Play more often"]
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
`
Quick, tiny patch to fix <i>Breaking fullarts</i> displaying incorrectly when Prettycards is not installed

To make up for such a small update, I have added secret lizard emoji somewhere within Galascript. The first person to encounter and post it gets their own custom intro message when fought against :3

Have fun!
`;

const patchNotesShort =

`
`;

const convertMarkdown = new underscript.lib.showdown.Converter();

function wrapClamp(value, min, max) {
    if (value < min) {
        return max - ((min - value) % (max - min));
    } else {
        return min + ((value - min) % (max - min));
    }
}

const seed = window.gameId
function pullRandom(stat, from, i, raw) {
    if (!raw) {
        switch (obscRandomType?.value()) {
            case 'universal': from = from.fixedId; break;
            case 'independant': from = from.id; break;
            default: from = 1;
        }
    }
    var m = 2**35 - 31
    var a = 185852
    var s = ((seed ^ from ^ i) * 2654435761) >>> 0;
    var roll = (s * a % m) / m
    var rollFinal = Math.floor(roll * maxCardId())
    var newStat = window.getCard(rollFinal)?.[stat]
    return newStat ?? pullRandom(stat, from + 1, i, 1);
}

var maxCard = -Infinity;
function maxCardId() {
    if (maxCard > 0) return maxCard;
        for (const card of window.allCards) {
            if (card.id > maxCard) {
                maxCard = card.id;
            }
        }
      return maxCard;
}

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

const checkCreateCard = setInterval(() => {
    if (typeof createCard === 'function') {
    clearInterval(checkCreateCard);
    function newCreateCard(card) {
    var name, image, cost, attack, hp, maxHp, shiny, hpSquish, maxHpSquish, htmlHp, htmlAtk, rarity, extension;
    var program = "";
    var fauxCost = "";
    var fauxAttack = "";
    var fauxHp = "";
    var fauxStatusId = "";
    var fauxTribesId = "";
    switch (JSON.stringify([obscCardName?.value(), obscActive()])) {
        case '["obfuscate",1]':
            name = obfuscationText?.value();
            break;
        case '["to set card",1]':
            name = $.i18n('card-name-' + window.getCardWithName(obscSetCard?.value()).fixedId, loopNames?.value() && card.loop > 0 ? card.loop + 1 : 1)
            break;
        case '["to random card",1]':
            name = $.i18n('card-name-' + pullRandom('id', card, 1), loopNames?.value() && card.loop > 0 ? card.loop + 1 : 1)
            break;
        default:
            name = $.i18n('card-name-' + card.fixedId, loopNames?.value() && card.loop > 0 ? card.loop + 1 : 1);
            var cardImg = card.image.replaceAll(" Open", "").replace(/(\S)\d+$/, "$1");
            if (cardSkinNames?.value() && cardImg !== card.baseImage) {
                name = card.image.replaceAll("_", " ").replaceAll(" Full", "").replaceAll(" FULL", "").replaceAll("C1225", "1225")
            }
    }
    switch (JSON.stringify([obscCardImage?.value(), obscActive()])) {
        case '["to set card",1]':
            card.image = window.getCardWithName(obscSetCard?.value()).baseImage;
            card.typeSkin = 0;
            break;
        case '["to random card",1]':
            card.image = pullRandom('baseImage', card, 2);
            card.typeSkin = 0;
            break;
    }
    var description = "";
    switch (JSON.stringify([obscCardDesc?.value(), obscActive()])) {
        case '["obfuscate",1]':
            description = obfuscationText?.value();
            break;
        case '["to set card",1]':
            description = $.i18n('card-' + window.getCardWithName(obscSetCard?.value()).fixedId);
            break;
        case '["to random card",1]':
            description = $.i18n('card-' + pullRandom('id', card, 3));
            break;
        default:
            description = $.i18n('card-' + card.fixedId)
    }

    switch (JSON.stringify([obscCardRarity?.value(), obscActive()])) {
        case '["to set card",1]':
            card.rarity = window.getCardWithName(obscSetCard?.value()).rarity;
            card.extension = window.getCardWithName(obscSetCard?.value()).extension;
            break;
        case '["to random card",1]':
            card.rarity = pullRandom('rarity', card, 4);
            card.extension = pullRandom('extension', card, 4);
            break;
        case '["hide",1]':
            card.rarity = 'BASE'
            break;
    }

    switch (JSON.stringify([obscCardPowers?.value(), obscActive()])) {
        case '["to set card",1]':
            program = window.getCardWithName(obscSetCard?.value()).program;
            fauxStatusId = window.getCardWithName(obscSetCard?.value()).id
            break;
        case '["to random card",1]':
            program = pullRandom('program', card, 5);
            fauxStatusId = pullRandom('id', card, 5);
            break;
        default:
            program = card.program;
    }
    if (program === 0) program = "";

    switch (JSON.stringify([obscCardTribes?.value(), obscActive()])) {
        case '["to set card",1]':
            fauxTribesId = window.getCardWithName(obscSetCard?.value()).id
            break;
        case '["to random card",1]':
            fauxTribesId = pullRandom('id', card, 6);
            break;
    }

    cost = card.cost;

    switch (JSON.stringify([obscCardCost?.value(), obscActive()])) {
        case '["obfuscate",1]':
            fauxCost = obfuscationText?.value();
            break;
        case '["to set card",1]':
            fauxCost = window.getCardWithName(obscSetCard?.value()).cost;
            break;
        case '["to random card",1]':
            fauxCost = pullRandom('cost', card, 7);
            break;
    }
    if (card.hasOwnProperty('attack')) {
        attack = card.attack;
        hp = card.hp;
        maxHp = card.maxHp;
        htmlHp = `<span class="currentHP">${hp}</span><span class="maxHP">${maxHp}</span>`;
        htmlAtk = `<span class="currentATK">${attack}</span>`;
        switch (JSON.stringify([obscCardStats?.value(), obscActive()])) {
            case '["obfuscate",1]':
                fauxAttack = obfuscationText?.value();
                fauxHp = obfuscationText?.value();
                break;
            case '["to set card",1]':
                fauxAttack = window.getCardWithName(obscSetCard?.value()).attack;
                fauxHp = window.getCardWithName(obscSetCard?.value()).hp;
                break;
            case '["to random card",1]':
                fauxAttack = pullRandom('attack', card, 8);
                fauxHp = pullRandom('hp', card, 9);
                break;
        }
    }

    shiny = card.shiny ? " shiny" : ""; // i just like ternary operators

    var frameSkinName = 'undertale';

    /*

            if
                - the card has a frame skin name, or frameSpoofBehavior is set to 'force everywhere'
                - the frameSpoof setting is not 'off'
                    and:
                        - in a game
                        ? card is owned by you, and frameSpoofBehavior is 'allies only'
                        ? frameSpoofBehavior is 'allies + enemies'
                        ? frameSpoofBehavior is 'force everywhere'
                    or:
                        - not in a game
    */

    if (((card.hasOwnProperty('frameSkinName') || frameSpoofBehavior?.value() === 'force everywhere') && frameSpoof?.value() !== 'off') && ((ingame && (frameSpoofBehavior?.value() === 'allies only' && card?.ownerId === window.userId || frameSpoofBehavior?.value() === 'allies + enemies' || frameSpoofBehavior?.value() === 'force everywhere')) || !ingame)) {
        card.frameSkinName = frameSpoof?.value()
    }

    if ((card.hasOwnProperty('frameSkinName') || frameSpoofBehavior?.value() === 'force everywhere') && respectiveFrames?.value()) {
        if (card.extension === 'BASE' || card.extension === 'UTY') {card.frameSkinName = 'undertale'}
        if (card.extension === 'DELTARUNE' ) {card.frameSkinName = 'deltarune'}
    }

    if (card.hasOwnProperty('frameSkinName')) {
        frameSkinName = card.frameSkinName.toString().replace(/\s+/g, '-').toLowerCase();
    }

    if (program > 0 && programIndicators?.value()) {
        program = `<div class="cardProgram cardCost">${program + cost}</div>\n`
    } else {
        program = ''
    }

    image = '<div class="cardImage"></div>\n'


    var disableBreaking = '';
    const frames = ['pokecard-1996', 'slay-the-spire', 'balatro']
    if (frames.includes(frameSkinName)) {
        disableBreaking = ' breaking-disabled'
    }
    if (card.typeSkin === 1 && breakingFullarts?.value()) {
        disableBreaking = localStorage.getItem("breakingDisabled") ? ' breaking-skin breaking-disabled' : ' breaking-skin'
    }

    frameSkinName += '-frame';

    var htmlCard =
    `<div id="${card.id}" class="card monster ${frameSkinName}${shiny}${disableBreaking} base${statBase?.value()}" data-rarity="${card.rarity}" data-extension="${card.extension}">
    <div class="shinySlot"></div>
    <div class="cardFrame"></div>
    <div class="cardBackground"></div>
    <div class="cardHeader"></div>
    <div class="faux cardFauxCost">${fauxCost}</div>
    <div class="faux cardFauxATK">${fauxAttack}</div>
    <div class="faux cardFauxHP">${fauxHp}</div>
    <div class="faux cardFauxStatus">${fauxStatusId}</div>
    <div class="faux cardFauxTribes">${fauxTribesId}</div>
    <div class="cardName" data-i18n="[html]card-name-${card.fixedId}"><div>${name}</div></div>
    <div class="cardCost">${cost}</div>
    ${program}
    <div class="cardStatus"></div>
    <div class="cardTribes"></div>
    <div class="cardImage"></div>
    <div class="cardSilence"></div>
    <div class="cardAction"></div>
    <div class="cardSilence"></div>
    <div class="cardDesc"><div data-i18n="[html]card-${card.fixedId}">${description}</div></div>
    <div class="cardFooter"></div>
    <div class="cardATK">${htmlAtk}</div>
    <div class="cardRarity"></div>
    <div class="cardHP">${htmlHp}</div>
    </div>`;

    if (card.typeCard === 1) {

        var cardSoul = card.hasOwnProperty('soul') ? card.soul.name : '';
        htmlCard =
        `<div id="${card.id}" class="card spell ${frameSkinName}${shiny}${disableBreaking}" data-rarity="${card.rarity}" data-extension="${card.extension}">
        <div class="shinySlot"></div>
        <div class="cardFrame"></div>
        <div class="cardBackground"></div>
        <div class="cardHeader"></div>
        <div class="faux cardFauxCost">${fauxCost}</div>
        <div class="faux cardFauxStatus">${fauxStatusId}</div>
        <div class="faux cardFauxTribes">${fauxTribesId}</div>
        <div class="cardName ${cardSoul}"><div data-i18n="[html]card-name-${card.fixedId}">${name}</div></div>
        <div class="cardCost">${cost}</div>
        ${program}
        <div class="cardStatus"></div>
        <div class="cardTribes"></div>
        <div class="cardImage"></div>
        <div class="cardDesc"><div data-i18n="[html]card-${card.fixedId}">${description}</div></div>
        <div class="cardFooter"></div>
        <div class="cardRarity"></div>
        </div>`;
    }

    return htmlCard;
        }
    } window.createCard = newCreateCard
});


const powersStandard = [
    {
        name: 'haste',
        icon: 'haste',
        key: 'haste',
        condition: function(card) {card.haste},
    },
]

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
    var fauxStatusId = monsterContainer.find('.cardFauxStatus').text()
    if (fauxStatusId) {
        let setCard = window.getCard(Number(fauxStatusId))
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
        card.darkspawn = setCard.darkspawn;
    }
    const isPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
    }
    function pushPower(sprite, type, key, args, number){
        if (obscCardPowers?.value() === 'obfuscate' && obscActive()) {
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

    var baseCard = window.getCard(card.fixedId) || nullcard; // SHOULD fix the issue with getCard locking up in an old allCards cache ...

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

        if (card.darkspawn) {
            pushPower('darkspawn', 'base', 'status-darkspawn', [], null);
        }

        if (deadPower?.value() && card.hp < 1) {
            pushPower('dead', 'custom', 'status-dead', [], null);
        }

        if (barrierPower?.value() && card.fixedId === 801) {
            pushPower('smellsLikeLemons', 'custom', 'status-smells-like-lemons', [], null);
            pushPower('immuneToMadjick', 'custom', 'status-immune-to-madjick', [], null);
        }

        if (undereventPower?.value() && card.fixedId === 874) {
            pushPower('underevent2024', 'base', 'status-underevent-2024', [], null);
        }
    }

        if (checkPower?.value()) {
            pushPower('check', 'custom', 'status-check', [cardLog(card)], null);
        }

        if (primePower?.value() && isPrime(card.fixedId)) {
            pushPower('prime', 'custom', 'status-prime', [card.fixedId], null);
        }

        if (newPower?.value() && card.fixedId > 880 && card.fixedId !== 892 && card.fixedId !== 897 && card.fixedId !== 899) {
            pushPower('new', 'custom', 'status-new', [], null);
        }

        if (kittyCatsEnabled?.value() && (catsArray.includes(card.id * -1) || catsArray.includes(card.id)) && !card.playedTurn && card.ownerId === window.userId) {
            pushPower('kittyCat', 'custom', 'status-kitty-cat', [], null);
        }

        if (mikeDropsEnabled?.value() && (mikesArray.includes(card.id * -1) || mikesArray.includes(card.id)) && !card.playedTurn && card.ownerId === window.userId) {
            pushPower('mikeDrop', 'custom', 'status-mike-drop', [], null);
        }

    if (!noGenerated?.value() && card.creatorInfo !== undefined && card.creatorInfo.typeCreator >= 0) {
        var creatorCardTranslated = '';
        if (card.creatorInfo.typeCreator === 0) {creatorCardTranslated = $.i18n('{{CARD:' + card.creatorInfo.id + '|1}}');}
        else if (card.creatorInfo.typeCreator === 1) {creatorCardTranslated = $.i18n('{{ARTIFACT:' + card.creatorInfo.id + '}}');}
        else if (card.creatorInfo.typeCreator === 2) {creatorCardTranslated = $.i18n('{{SOUL:' + card.creatorInfo.name + '}}');}
        pushPower('created', 'base', 'status-created', [creatorCardTranslated], null);
    }

    for (let i = 0; i < powersStringArgs.length; i++) {
        var args = powersStringArgs[i];

        for (let j = 0; j < args.length; j++) {
            args[j] = window.base64EncodeUnicode(args[j]);
        }
    }
    var spacing = !legacyPowers?.value() ? (powersStringKeys.length - 1) * powerSpacing?.value() > powerBounds?.value() ? powerBounds?.value() / (powersStringKeys.length - 1) : powerSpacing?.value() : powerSpacing?.value();
    for (let i = 0; i < powersStringKeys.length; i++) {

        var $cardContainerImage = monsterContainer.find('.cardStatus');
        var url = powersType[i] === 'base' ? `images/powers/${powers[i]}.png` : `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${powers[i]}.png`;
        $cardContainerImage.append(`<img style="right: ${i * spacing}px;" power="${powers[i]}" class="infoPowers helpPointer" src="${url}" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">`);

        if (powersStringNumbers[i] !== null) {
            $cardContainerImage.append(`<span style="right: ${i * spacing}px;" class="infoPowersDetails helpPointer" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">${powersStringNumbers[i]}</span>`);
        }
    }
    var fauxTribesId = monsterContainer.find('.cardFauxTribes').text()
    if (fauxTribesId) {
        let setCard = window.getCard(Number(fauxTribesId))
        card.tribes = setCard?.tribes ?? "";
    }
    var tribes = card.tribes;
    monsterContainer.find('.cardTribes').empty();
    function appendTribe(tribe, i) {
        var $cardContainerImage = monsterContainer.find('.cardTribes');
        if (obscCardTribes?.value() === 'obfuscate' && obscActive()) {
            $cardContainerImage.append(`<img style="right: ${i * 20}px;" class="tribe helpPointer" src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/unknown.png" oncontextmenu="displayStatusStringKey('tribe-unknown');;"/>`);
        } else {
            $cardContainerImage.append(`<img style="right: ${i * 20}px;" class="tribe helpPointer" src="images/tribes/${tribe}.png" oncontextmenu="showTribeCards('${tribe}');"/>`);
        }
    }
    if (tribes.indexOf('ALL') > -1) {
        appendTribe('ALL', 0)
    } else {
        for (var i = 0; i < tribes.length; i++) {
            appendTribe(tribes[i], i)
        }
    }
}} window.setInfoPowers = newSetInfoPowers
});

if (typeof plugin.addFilter === 'function') {
    plugin.addFilter(
        function gsStatFilters (card, removed) {
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
                        case 'moreThanEqualTo': removed = card.attack < atk; break;
                        case 'lessThan': removed = card.attack >= atk; break;
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
            return removed;
        }
    )

    plugin.addFilter(
        function gsAliasSearch(card, removed, results) {
            var removedInSearch = results.search
            if (removed && removedInSearch) {
                var searchValue = $('#searchInput').val().toLowerCase();
                var alias = ""
                if (!$.i18n('card-alias-' + card.fixedId).includes('card-alias')) {
                    alias = $.i18n('card-alias-' + card.fixedId).toLowerCase().replace(/(<.*?>)/g, '');
                    removed = !alias.includes(searchValue)
                }
            }
            return removed;
        }
    )

    plugin.addFilter(
        function gsMoSearch(card, removed) {
            if (!removed) {
                var searchValue = $('#searchInput').val().toLowerCase();

                if (searchValue === 'mo') {
                    removed = card.name !== 'Mo' // Mo
                }
            }
            return removed;
        }
    )

    plugin.addFilter(
        function gsPowerFiltersStandard(card, removed) {
            if (!removed && $('#hasteInput').length) {
                return $('#hasteInput').prop('checked') && !card.haste;
            }
            if (!removed && $('#chargeInput').length) {
                return $('#chargeInput').prop('checked') && !card.charge;
            }
            if (!removed && $('#tauntInput').length) {
                return $('#tauntInput').prop('checked') && !card.taunt;
            }
            if (!removed && $('#armorInput').length) {
                return $('#armorInput').prop('checked') && !card.armor;
            }
            if (!removed && $('#candyInput').length) {
                return $('#candyInput').prop('checked') && !card.candy;
            }
            return removed;
        }
    )

}

const checkUpdateCardVisual = setInterval(() => {
    if (typeof updateCardVisual === 'function'){
        clearInterval(checkUpdateCardVisual);
        function newUpdateCardVisual($htmlCard, card) {
        var cost = card.cost
        var statbase = $htmlCard.hasClass("base1000") ? 1000 : $htmlCard.hasClass("base100") ? 100 : $htmlCard.hasClass("base10") ? 10 : 1;
        var fauxCost = $htmlCard.find('.cardFauxCost').text();
        if (obscActive() && ['obfuscate', 'to set card', 'to random card'].includes(obscCardCost?.value())) {
            cost = fauxCost - (card.originalCost - card.cost)
            if (isNaN(cost)) {cost = fauxCost}
        }
        var attack = card.attack * statbase;
        var baseAttack = card.originalAttack * statbase;
        var hp = card.hp * statbase;
        var maxHp = card.maxHp * statbase;
        var baseHp = card.originalHp * statbase;
        var fauxAttack = $htmlCard.find('.cardFauxATK').text();
        var fauxHp = $htmlCard.find('.cardFauxHP').text();
        var fauxMaxHp = $htmlCard.find('.cardFauxHP').text();
        if (obscActive() && ['obfuscate', 'to set card', 'to random card'].includes(obscCardStats?.value())) {
            attack = fauxAttack - (card.originalAttack - card.attack)
            hp = fauxHp - (card.originalHp - card.hp)
            maxHp = fauxMaxHp
            baseHp = fauxHp
            if (isNaN(attack)) {attack = fauxAttack}
            if (isNaN(hp)) {hp = fauxHp}
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

        var $cardHp = $htmlCard.find('.cardHP');
        var $cardCurrentHp = $htmlCard.find('.currentHP');
        var $cardMaxHp = $htmlCard.find('.maxHP');
        $cardHp.html($cardCurrentHp);
        $cardHp.append($cardMaxHp);
        $cardCurrentHp.html(hp);
        $cardMaxHp.html('');
        var hpSquish, maxHpSquish;
        if (maxHpIndicator?.value() !== 'off' && (maxHpIndicator?.value() === 'always show' || hp < maxHp)) {
            $cardMaxHp.html('/' + (maxHp));
            for (let i = maxHp.toString().length - hp.toString().length; i > 0; i--) {
                $cardCurrentHp.prepend(' ');
            }
            for (let i = hp.toString().length - maxHp.toString().length; i > 0; i--) {
                $cardMaxHp.append(' ');
            }
            switch (hp.toString().length) {
                case 1: hpSquish = 1; break;
                case 2: hpSquish = 0.8; break;
                case 3: hpSquish = 0.7; break;
                case 4: hpSquish = 0.55; break;
                default: hpSquish = 0.45; break;
            }
            switch (maxHp.toString().length) {
                case 1: maxHpSquish = 1; break;
                case 2: maxHpSquish = 0.8; break;
                case 3: maxHpSquish = 0.55; break;                                           // todo: these big ass switch statements could very easily be instead calculated instead of manually
                case 4: maxHpSquish = 0.35; break;                                           // inputted, but i dont care to do that right now, and this works well enough to where the values
                default: maxHpSquish = 0.25; break;                                          // are exactly what i want
            }
            $cardCurrentHp.attr("style", `transform: scaleX(${hpSquish})`);
            $cardMaxHp.attr("style", `transform: scaleX(${maxHpSquish})`);
        } else {
            switch (hp.toString().length) {
                case 1: hpSquish = 1; break;
                case 2: hpSquish = 1; break;
                case 3: hpSquish = 0.9; break;
                case 4: hpSquish = 0.7; break;
                default: hpSquish = 0.55; break;
            }
            $cardCurrentHp.attr("style", `transform: scaleX(${hpSquish}); transform-origin: center`);
        }

        if (hp < maxHp) {
            $cardCurrentHp.removeClass('damaged').addClass('damaged');
        } else {
            $cardCurrentHp.removeClass('damaged');

            if (maxHp > baseHp) {
                $cardCurrentHp.removeClass('hp-buff').addClass('hp-buff');
            } else {
                $cardCurrentHp.removeClass('hp-buff');
            }
        }

        if ($htmlCard.hasClass("pokecard-1996-frame")) {
            $cardHp.append($.i18n('stat-hp', 1));
        }

        var $cardATK = $htmlCard.find('.currentATK');
        $cardATK.html(attack);
        var atkSquish;
        switch (attack.toString().length) {
            case 1: atkSquish = 1; break;
            case 2: atkSquish = 1; break;
            case 3: atkSquish = 0.9; break;
            case 4: atkSquish = 0.7; break;
            default: atkSquish = 0.55; break;
        }
        $cardATK.attr("style", `transform: scaleX(${atkSquish})`);
        $cardATK.removeClass('attack-buff').removeClass('attack-debuff').removeClass('paralyzed');
        if (card.paralyzed !== 0) {
            $htmlCard.addClass('paralyzed');
        } else {
            if (attack > baseAttack) {
                $cardATK.addClass('attack-buff');
            } else if (attack < baseAttack) {
                $cardATK.addClass('attack-debuff');
            }
        }
        if (card.silence) {
            $htmlCard.find('.cardSilence').css('visibility', 'visible');
            if (card.frameSkinName === 'Its TV Time' || card.frameSkinName === 'Cold Place') {
                $htmlCard.find('.cardImage').css('filter', 'grayscale(100%)');
                if (card.frameSkinName === 'Cold Place') {
                    $htmlCard.find('.cardName').css('visibility', 'hidden');
                }
            }
        }
}} window.updateCardVisual = newUpdateCardVisual;
});

function defaultTranslations(language) {
    if (language === 'rawKeys') {
        $.i18n().locale = 'rawKeys';
        $.i18n().options.fallbackLocale = 'rawKeys'
        $('body').i18n();
        return;
    }
    $.i18n().options.fallbackLocale = 'en'
    var languagesObject = {}
    languagesObject[language] = `translation/${language}.json`
    $.i18n().locale = language;
    $.i18n().load(languagesObject).done(function () {
        $('[data-i18n]').each(function () {
            let rawKey = $(this).data('i18n');
            let cleanKey = rawKey.replace(/^\[html\]/, '');
            if (rawKey.startsWith('[html]')) {
                $(this).html($.i18n(cleanKey, 1));
            } else {
                $(this).text($.i18n(cleanKey, 1));
            }
        });
    });
}
window.defaultTranslations = defaultTranslations
function initAliases() {
  if (!$) return;
  $.i18n().load({
    "card-alias-8": "mommy",
    "card-alias-30": "bp",
    "card-alias-32": "memhead",
    "card-alias-38": "rg1",
    "card-alias-39": "rg2",
    "card-alias-60": "paps",
    "card-alias-62": "asdree",
    "card-alias-64": "mttex mtt ex",
    "card-alias-66": "wtf",
    "card-alias-68": "achance",
    "card-alias-69": "sblazing sblaze",
    "card-alias-71": "fenergy",
    "card-alias-82": "merchire",
    "card-alias-88": "btreat bctreat",
    "card-alias-89": "pgas polgas pollgas pollugas",
    "card-alias-92": "fon",
    "card-alias-95": "tow",
    "card-alias-106": "undyne the undying",
    "card-alias-107": "watercooler buble boobie",
    "card-alias-110": "mttneo mtt neo",
    "card-alias-117": "oflowey",
    "card-alias-140": "polibear",
    "card-alias-145": "db1",
    "card-alias-146": "db2",
    "card-alias-150": "ncg",
    "card-alias-183": "pod",
    "card-alias-201": "dmtt",
    "card-alias-203": "aod",
    "card-alias-214": "casdyne",
    "card-alias-237": "phamster moni!!!",
    "card-alias-239": "snowsign ssign",
    "card-alias-254": "cpaps",
    "card-alias-258": "bquiz",
    "card-alias-262": "mmm",
    "card-alias-265": "mr. generosity mr generosity",
    "card-alias-267": "crystomb ctomb",
    "card-alias-288": "groom",
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
    "card-alias-549": "copdyne",
    "card-alias-552": "cow",
    "card-alias-567": "blowbick",
    "card-alias-573": "elimduck elim duck",
    "card-alias-579": "bqueen",
    "card-alias-581": "gmascot",
    "card-alias-642": "pblook poliblook",
    "card-alias-661": "cws cyber sign cybersign",
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
    "card-alias-767": "bdancer baldancer",
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
    "card-alias-853": "duel",
    "card-alias-869": "galadino",
    "card-alias-878": "cero ketsukane",
    "card-alias-883": "plancer",
    "card-alias-884": "psusie",
    "card-alias-885": "zkris",
    "card-alias-888": "wcloak",
    "card-alias-893": "fraudyne",
    "card-alias-893": "tcatcher",
    "card-alias-897": "tspawn titanspawn",
    "card-alias-898": "tserpent",
    "card-alias-902": "sguy",
    "card-alias-903": "zsusie zusie",
    "card-alias-904": "zralsei ralzei zootsei",
    "card-alias-905": "lmower",
    "card-alias-906": "planino planina pelnina pelnino",
    "card-alias-907": "pelnina pelnino planino planina",
    "card-alias-908": "rralsei rocksei",
    "card-alias-909": "rkris",
    "card-alias-912": "jstein jstien jackins your taking too long scairy",
    "card-alias-913": "jstein jstien jackins your taking too long scairy",
    "card-alias-914": "ctower cup tower",
    "card-alias-915": "cposter",
    "card-alias-917": "rposter",
    "card-alias-919": "mposter",
    "card-alias-920": "galadino",
    "card-alias-922": "water cooler watercooler buble boobie",
    "card-alias-923": "pkris",
    "card-alias-926": "homophobia",
    "card-alias-927": "gacha machine gpmachine gmachine",
  }, 'en');
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
        if ($('.bootstrap-dialog-message > .mulligan').length) { // waits for the mulligan message to show up
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
                                  `Well, there is a ${player()} here. They might be happy to see you. What do you think?`,
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
                                  ...it's ${player()}!`,
                                   `This battle is     ${soulColor('Pissing')} me off<br><br>
                                   I am the  original        ${soulColor(enemyUser)}`,];
            function funnyIntro() {
                if (enemyUser === "Crystal") {
                    return `${soulIcon()} Free elo.`; // requested by crystal herself
                }
                if (enemyUser === "Sktima" || enemyUser === "RefractedSktima" || enemyUser === "Diamaincrah") {
                    return `${soulIcon()} You're about to have a bad time.`;
                }
                if (enemyUser === "frogman") {
                    return `Pet the ${player('frog')} :D`;
                }
                if (enemyUser === "Dware") {
                    return `Beware the ${player()}`;
                }
                if (enemyUser === "The Rat") {
                    return `${player('rat')}`;
                }
                if (enemyUser === "galadino") {
                    return `${player()} wanted her own entrance message. Here it is!<br>Oh, and you're probably gonna win. I should mention that.`;
                }
                if (enemyUser === "StellarSting") {
                    return `meme deck user pray they dont highroll`;
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
    $.i18n().load({
        "status-dummy": "$1",
        "status-unknown": "Hmmm... there's a power here, but you can't exactly make it out.",
        "status-unknown-stacked": "Hmmm...  there's a power here, but you can't exactly make it out.",
        "tribe-unknown": "Hmmm... this monster has a tribe, but which one?",
        "status-program": "This card's {{KW:PROGRAM}} subeffect will trigger if $1 {{GOLD}} is spent.",
        "status-target": "This card has a target effect. It can target $1.",
        "status-turn": "This card was played on turn $1. It has lived for $2 {{PLURAL:$2|turn|turns}}.",
        "status-shiny": "This card is shiny.",
        "status-dead": "This monster dead as hell.",
        "status-legend": "This card's owner got {{DIVISION:LEGEND}} last season.",
        "status-immune-to-madjick": "This card is imune to {{CARD:16|1}}.",
        "status-smells-like-lemons": "This card smells like lemons.",
        "status-totem": "This card is compatible with {{CARD:545|1}}.",
        "status-prime": "This card's ID, $1, is a prime number! The more you know.",
        "status-new": "This card is new! Wowie. I bet it's really cool.",
        "status-trap": "TBD",
        "status-kitty-cat": "This card is secretly possessed by a kitty and will do something random when played.",
        "status-mike-drop": "This card ends your turn immediately when played.",
        "status-check": "$1",
        "status-loop-stacked": "This card can trigger its {{KW:LOOP}} effect an additional time.",
        "status-program-stacked": "This card's {{KW:PROGRAM}} subeffect will trigger if an additional {{GOLD}} is spent. It can also be copied by {{CARD:661|1}}.",
        "status-turn-stacked": "This card was played an additional turn.",
        "status-dodge-stacked": "This monster will negate an additional instance of {{DMG}} to itself.",
    }, 'en');
}

function staticStyles() {
    style('static', 'add',
    `.faux {visibility: hidden;}
    .cardImage > img {visibility: hidden;}
    .cardName div[style*="font-size: 7px;"] {white-space: nowrap;}
    #gsFlashlight {position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; pointer-events: none; z-index: 100; image-rendering: pixelated;}
    .cardHP:not(.pokecard-1996-frame .cardHP) {overflow-x: visible; white-space: nowrap; display: flex; justify-content: center; align-items: baseline; white-space: pre;}
    .cardATK:not(.pokecard-1996-frame .cardATK) {overflow-x: visible; white-space: nowrap; display: flex; justify-content: center; align-items: baseline; white-space: pre;}
    .currentHP:not(.pokecard-1996-frame .currentHP) {text-align: right; transform-origin: right; display: inline-block;}
    .maxHP:not(.pokecard-1996-frame .maxHP) {text-align: left; font-size: 12px; color: gray; transform-origin: left; display: inline-block;}
    .currentATK:not(.pokecard-1996-frame .currentATK) {text-align: center; transform-origin: center; display: inline-block;}
    #costInput, #atkInput, #hpInput {width: 33.33%; display: inline; padding-right: 0px; position: relative; z-index: 2; height: 28px;}
    #costInput {color: #00d0ff}
    #atkInput {color: #f0003c}
    #hpInput {color: #0dd000}
    .statMode {background-color: rgba(0, 0, 0, 0.5) !important; border-top: none; border-radius: 0px 0px 5px 5px; margin-left: 1%; margin-right: 1%; width: 31.33%; position: relative; z-index: 1; top: -20px; opacity: 0; transition: top 0.3s ease-out, opacity 0.3s ease-out;}
    #costInput:hover ~ #costMode {top: -2px; opacity: 1}
    #costMode:hover {top: -2px; opacity: 1}
    #atkInput:hover ~ #atkMode {top: -2px; opacity: 1}
    #atkMode:hover {top: -2px; opacity: 1}
    #hpInput:hover ~ #hpMode {top: -2px; opacity: 1}
    #hpMode:hover {top: -2px; opacity: 1}
    .equals:not(.form-control), .equals::placeholder {color: #ccc}
    .moreThan:not(.form-control), .moreThan::placeholder {color: #ff99ff}
    .moreThanEqualTo:not(.form-control), .moreThanEqualTo::placeholder {color: #ff69ff}
    .lessThan:not(.form-control), .lessThan::placeholder {color: #ffaa99}
    .lessThanEqualTo:not(.form-control), .lessThanEqualTo::placeholder {color: #ffaa69}
    .equals:not(.statMode) {border: 1px solid #ccc}
    .moreThan:not(.statMode) {border: 1px solid #ff99ff}
    .moreThanEqualTo:not(.statMode) {border: 1px solid #ff69ff}
    .lessThan:not(.statMode) {border: 1px solid #ffaa99}
    .lessThanEqualTo:not(.statMode) {border: 1px solid #ffaa69}
    .cardCost:not(.cardProgram) {opacity: 1}
    .cardProgram {color: gold; opacity: 0}
    .cardCost {transition: opacity 0.2s ease;}
    .card:hover .cardProgram {opacity: 1}
    .card:has(.cardProgram):hover .cardCost:not(.cardProgram) {opacity: 0}
    .cardImageText { top: 42px; width: 160px; height: 80px; text-align: center; font-size: 12px; position: absolute; left: 8px; display: table; z-index: 5}
    .cardImageText > div {display: table-cell; vertical-align: middle}
    .setting-advancedMap_Galascript-keybind_select {width: 350px; border-bottom: none !important;}
    .setting-advancedMap_Galascript-keybind_select .gsKeybind {width: 30%}
    .setting-advancedMap_Galascript-keybind_select select {width: 50%}
    .setting-advancedMap_select:has(#underscript\\.plugin\\.Galascript\\.bgMixtape) {width: 350px; border-bottom: none !important;}
    .setting-advancedMap_select:has(#underscript\\.plugin\\.Galascript\\.bgMixtape) select {width: 40%; height: 40px; text-wrap: auto; text-align: center; background-repeat: no-repeat; background-size: cover; background-position: center;}
    .card.breaking-skin.breaking-disabled .cardDesc,.cardName,.cardATK,.cardHP,.cardCost,.cardRarity {background-color: rgba(0, 0, 0, 0);}
    .breaking-skin:not(.breaking-disabled):hover .cardDesc, .breaking-skin:not(.breaking-disabled):hover .cardName, .breaking-skin:not(.breaking-disabled):hover .cardATK, .breaking-skin:not(.breaking-disabled):hover .cardHP, .breaking-skin:not(.breaking-disabled):hover .cardCost, .breaking-skin:not(.breaking-disabled):hover .cardRarity {background-color: rgba(0, 0, 0, 0.7);}
    .setting-Galascript-button {max-width: 380px;}
    .setting-Galascript-button h4 {font-size: 16px; font-weight: bold; width: 380px; text-align: center;}
    .setting-Galascript-button h5 {font-size: 16px; font-weight: bold; width: 380px;}
    .setting-Galascript-button .coolguy {float: right; color: thistle;}
    #underscript\\.plugin\\.Galascript\\.kittyCatsChance, #underscript\\.plugin\\.Galascript\\.mikeDropsChance {width: 32px;}
    .setting-advancedMap:has(#underscript\\.plugin\\.Galascript\\.customTranslations) {width: 350px; border-bottom: none !important;}
    .setting-advancedMap:has(#underscript\\.plugin\\.Galascript\\.customTranslations) input {width: 40%; height: 40px; text-wrap: auto; text-align: center; background-repeat: no-repeat; background-size: cover; background-position: center;}
    .gsTransHelperOption {display: block; background-color: black; border: none; margin: 0px 5px;}
    .card.full-skin.breaking-skin .cardImage {background-size: auto !important; background-position: center !important}
    `)
}

const observer = new MutationObserver((mutations, obs) => {
    document.querySelectorAll('[id^="underscript.plugin.Galascript.bgMixtape."]:not([id$="value"])').forEach(el => { // dynamic backgrounds for playlist setting
        function updateBackground (value) {
            el.style.setProperty('background-image', `url('/images/backgrounds/${value}.png')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onmouseover = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsBgLoaded) {
            el.dataset.gsBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('[id^="underscript.plugin.Galascript.emoteKeybinds."][id$="value"]').forEach(el => { // dynamic backgrounds for emote map
        function updateBackground (value) {
            const emoteImg = window.chatEmotes.find(emote => emote.id === Number(value)).image
            el.style.setProperty('background-image', `url('/images/emotes/${emoteImg}.png')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-repeat', 'no-repeat');
            el.style.setProperty('background-position', '85%');
            el.style.setProperty('background-size', '32px');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onmouseover = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('[id^="underscript.plugin.Galascript.customTranslations."]:not([id$="value"])').forEach(el => { // dynamic backgrounds for custom translation setting
        function updateBackground (value) {
            const card = window.getCard(Number(value.replace(/\D/g,'')))
            const image = card?.baseImage ?? "Blank"
            el.style.setProperty('background-image', `url('/images/cards/${image}.png')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onmouseover = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('[id="underscript.plugin.Galascript.frameSpoof"]').forEach(el => { // dynamic backgrounds for frame skins option
        function updateBackground (value) {
            var underscored = value.toString().replace(/\s+/g, '_');
            var dashed = value.toString().replace(/\s+/g, '-');
            var url;
            if (standardFrames.includes(value)) {
                url = `images/frameSkins/${underscored}/frame_monster.png`
            } else if (value === "Pokecard 1996") {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-common.png`
            } else if (value === "Slay the Spire") {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/slay-the-spire-frame-monster-common.png`
            } else {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/${dashed.toLowerCase()}-frame-monster.png`
            }
            el.style.setProperty('background-image', `url('${url}')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-repeat', 'no-repeat');
            el.style.setProperty('background-position', '85% -2%');
            el.style.setProperty('background-size', '64px');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onmouseover = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('[id="underscript.plugin.Galascript.raritySkins"]').forEach(el => { // dynamic backgrounds for rarity skins option
        function updateBackground (value) {
            var url;
            switch (value) {
                case "off": url = 'images/rarity/BASE_DETERMINATION.png'; break;
                case "match frame": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/rarity-match.gif'; break;
                case "Hollow Knight": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/hk-determination.png'; break;
                case "FNAFB": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-ut-determination.png'; break;
            }
            el.style.setProperty('background-image', `url('${url}')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-repeat', 'no-repeat');
            el.style.setProperty('background-position', '85%');
            el.style.setProperty('background-size', '32px');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onmouseover = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('.card.balatro-frame').forEach(el => { // random anim delay for balatro swaying anim
        function transforms(x, y, el) {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = (x - centerX) / rect.width;
            const dy = (y - centerY) / rect.height;

            const maxTilt = 40; // degrees
            const rotateX = -dy * maxTilt;
            const rotateY = dx * maxTilt;

            return `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        function cardHover(e) {
            const el = e.currentTarget;
            const transform = transforms(e.clientX, e.clientY, el);
            el.style.transform = transform;
            el.style.animation = 'none';
        }

        function cardLeave(e) {
            const el = e.currentTarget
            el.style.transform = '';
            el.style.animation = 'sway 6s ease-in-out infinite';
        }

        if (!el.dataset.gsBalatroAnims) {
            el.dataset.gsBalatroAnims = 'true';
            const delay = Math.random() * 6;
            el.style.animationDelay = `-${delay}s`;
            el.onmousemove = e => {
                cardHover(e);
            }
            el.onmouseout = e => {
                cardLeave(e);
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

function shinyDisplayToggle(val) {
    val = val === "cover" ? 1 : 0
    style('shinyDisplay', val ? 'add' : 'remove', '.shinySlot {z-index: 7}')
}
function updateFlashlightRadius(num) {
    style('flashlightRadius', 'replace', `#gsFlashlight {background-size: ${4098 * num}px}`)
};
function updateFlashlightImg(f) {
    style('flashlightRadiusImg', 'replace', `#gsFlashlight {background-image:url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/flashlightEffect${f === 'diffused' ? 'Alt' : ''}.png);}`)
};
function statsOnTopToggle(val) {
    style('statsOnTop', val ? 'add' : 'remove', '.cardCost, .cardATK, .cardHP { z-index: 7 }')
}
function hide(element, visibility) {
    style(`${element}Visibility`, 'replace', `.${element} {visibility: ${visibility ? "hidden" : "visible"}}`)
}
function obscure(element, type) {
    style(`${element}Obscurity`, 'remove')
    if (!obscActive()) { refreshCards(); return; }
    standardFrames.forEach(f => {
        const fclass = f.toString().replace(/\s+/g, '-').toLowerCase();
        const fimage = f.toString().replace(/\s+/g, '_');
        style(`${fclass}UseSpellGraphic`, 'remove')
    });
    customFrames.forEach(f => {
        f = f.toString().replace(/\s+/g, '-').toLowerCase();
        if (f !== 'pokecard-1996') {
            style(`${f}UseSpellGraphic`, 'remove')
        }
    });
    switch (type) {
        case 'blur':
            style(`${element}Obscurity`, 'replace', `.${element} {filter: blur(${obscBlurStrength.value()}px)}`)
            break;
        case 'hide':
            style(`${element}Obscurity`, 'replace', `.${element} {visibility: hidden}`)
            break;
        case 'hide, use spell frame':
            style(`${element}Obscurity`, 'replace', `.${element} {visibility: hidden}`)
            standardFrames.forEach(f => {
                const fclass = f.toString().replace(/\s+/g, '-').toLowerCase();
                const fimage = f.toString().replace(/\s+/g, '_');
                style(`${fclass}UseSpellGraphic`, 'add', `.${fclass}-frame.monster .cardFrame {background-image: url("/images/frameSkins/${fimage}/frame_spell.png");}`)
            });
            customFrames.forEach(f => {
                f = f.toString().replace(/\s+/g, '-').toLowerCase();
                if (f !== 'pokecard-1996') {
                    style(`${f}UseSpellGraphic`, 'add', `.${f}-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/${f}-frame-spell.png");}`)
                }
            });
            break;
    }
    refreshCards();
}
function imgPixelToggle(val) {
    style('imgPixel', val ? 'add' : 'remove', '* {image-rendering: pixelated;}')
}
function siteFilter(l, i, z, a) { // lizard
    style('sitefilter', 'replace', `html {filter: contrast(${l}%) blur(${i}px) grayscale(${z}%) invert(${a ? 100 : 0}%) !important}`)
}
function statsWhiteToggle(val) {
    style('statsWhite', val ? 'add' : 'remove', '.cardATK, .cardHP {color: white;}')
}
function frameStyles() {
    style('static', 'add', `
    .cardSilence {background: transparent url("images/cardAssets/silence.png") no-repeat; visibility: hidden;}
    @keyframes float { 0% { transform: translatey(-4px); } 50% { transform: translatey(2px); } 100% { transform: translatey(-4px); } }
    @keyframes sway {
        0%   { transform: rotateX(0deg) rotateY(0deg) translateZ(0px); }
        25%  { transform: rotateX(3deg) rotateY(-2deg) translateZ(2px); }
        50%  { transform: rotateX(-3deg) rotateY(1deg) translateZ(-1px); }
        75%  { transform: rotateX(1deg) rotateY(-1deg) translateZ(3px); }
        100% { transform: rotateX(0deg) rotateY(0deg) translateZ(0px); }
    }

    .spamton-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-shiny.png"); opacity: 0.4; mix-blend-mode: color-burn;}
    .spamton-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-shiny-animated.gif"); opacity: 0.4; mix-blend-mode: color-burn;}
    .spamton-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-spell.png");}
    .spamton-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/spamton-frame-monster.png");}
    .spamton-frame .cardName, .spamton-frame .cardCost {top: 9px;}
    .spamton-frame .cardDesc, .spamton-frame .cardSilence {top: 129px;}
    .spamton-frame .cardATK, .spamton-frame .cardHP, .spamton-frame .cardRarity {top: 213px;}
    .spamton-frame .cardQuantity, .spamton-frame .cardUCPCost {top: 240px;}

    .steamworks-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/steamworks-frame-shiny.png");}
    .steamworks-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/steamworks-frame-shiny-animated.gif");}
    .steamworks-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/steamworks-frame-spell.png");}
    .steamworks-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/steamworks-frame-monster.png");}
    .steamworks-frame .cardName, .steamworks-frame .cardCost {top: 9px;}
    .steamworks-frame .cardName {left: 11px;}
    .steamworks-frame .cardDesc, .steamworks-frame .cardSilence {top: 129px;}
    .steamworks-frame .cardATK, .steamworks-frame .cardHP, .steamworks-frame .cardRarity {top: 215px;}
    .steamworks-frame .cardQuantity, .steamworks-frame .cardUCPCost {top: 240px;}

    .inscrypted-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/inscrypted-frame-shiny.png");}
    .inscrypted-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/inscrypted-frame-shiny-animated.gif");}
    .inscrypted-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/inscrypted-frame-spell.png");}
    .inscrypted-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/inscrypted-frame-monster.png");}
    .inscrypted-frame .cardName, .inscrypted-frame .cardCost {top: 9px;}
    .inscrypted-frame .cardDesc, .inscrypted-frame .cardSilence {top: 129px;}
    .inscrypted-frame .cardATK, .inscrypted-frame .cardHP, .inscrypted-frame .cardRarity {top: 213px;}
    .inscrypted-frame .cardQuantity, .inscrypted-frame .cardUCPCost {top: 240px;}

    .cyber-world-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-shiny.png"); opacity: 0.5; mix-blend-mode: soft-light;}
    .cyber-world-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-shiny-animated.gif"); opacity: 0.5; mix-blend-mode: soft-light;}
    .cyber-world-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-spell.png");}
    .cyber-world-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cyber-world-frame-monster.png");}
    .cyber-world-frame .cardName, .cyber-world-frame .cardCost {top: 9px;}
    .cyber-world-frame .cardDesc, .cyber-world-frame .cardSilence {top: 129px;}
    .cyber-world-frame .cardATK, .cyber-world-frame .cardHP, .cyber-world-frame .cardRarity {top: 213px;}
    .cyber-world-frame .cardQuantity, .cyber-world-frame .cardUCPCost {top: 240px;}

    .its-tv-time-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/its-tv-time-frame-shiny.png"); opacity: 0.4; mix-blend-mode: color-burn;}
    .its-tv-time-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/its-tv-time-frame-shiny-animated.gif"); opacity: 0.4; mix-blend-mode: color-burn;}
    .its-tv-time-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/its-tv-time-frame-spell.png");}
    .its-tv-time-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/its-tv-time-frame-monster.png");}
    .its-tv-time-frame .cardName, .its-tv-time-frame .cardCost {top: 9px;}
    .its-tv-time-frame .cardDesc {top: 129px;}
    .its-tv-time-frame .cardSilence {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/tv-KILLED.png"); background-repeat: no-repeat; background-position: center; width: 90px; height: 30px; top: 69px; left: 45px; z-index: 7}
    .its-tv-time-frame .cardATK, .its-tv-time-frame .cardHP, .its-tv-time-frame .cardRarity {top: 213px;}
    .its-tv-time-frame .cardTribes {right: 20px;}
    .its-tv-time-frame .cardQuantity, .its-tv-time-frame .cardUCPCost {top: 240px;}

    .cold-place-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cold-place-frame-shiny.png"); opacity: 0.5; mix-blend-mode: hard-light;}
    .cold-place-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cold-place-frame-shiny-animated.gif"); opacity: 0.5; mix-blend-mode: overlay;}
    .cold-place-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cold-place-frame-spell.png");}
    .cold-place-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/cold-place-frame-monster.png");}
    .cold-place-frame .cardName {top: 120px; height: 10px; width: 160px; display: flex; justify-content: center; text-transform: uppercase; font-family: "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;}
    .cold-place-frame .cardName > div {background-color: black; line-height: 10px;}
    .cold-place-frame.standard-skin .cardImage {top: 55px; height: 80px}
    .cold-place-frame.breaking-skin .cardImage {height: 210px; z-index: 0 !important}
    .cold-place-frame.monster .cardDesc {top: 144px; left: 24px; width: 144px; transform-origin: left; transform: scale(0.7); text-align: left;}
    .cold-place-frame .cardSilence {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/tv-KILLED.png"); background-repeat: no-repeat; background-position: center; width: 90px; height: 30px; top: 86px; left: 45px;}
    .cold-place-frame.spell .cardDesc {top: 144px; transform: scale(0.7);}
    .cold-place-frame .cardCost {top: 24px;}
    .cold-place-frame .cardATK {top: 159px;}
    .cold-place-frame .cardHP {top: 190px;}
    .cold-place-frame .cardCost, .cold-place-frame .cardATK, .cold-place-frame .cardHP {left: 119px; transform: scale(0.7);}
    .cold-place-frame .cardRarity {top: 222px; left: 82px; height: 16px;}
    .cold-place-frame .cardQuantity, .cold-place-frame .cardUCPCost {top: 238px;}
    .cold-place-frame .cardUCPDiscount {top: 130px;}
    .cold-place-frame .cardFooter {background-color: rgba(0, 0, 0, 0);}
    .cold-place-frame .cardTribes {right: 140px; top: 32px}
    .cold-place-frame .cardTribes > img:nth-child(2) {left: -1px; top: -3px;}
    .cold-place-frame .cardStatus {left: 150px; top: 68px; transform-origin: right; transform: scale(0.8);}
    .cold-place-frame .PrettyCards_CardBottomLeftInfo {left: 28px; top: 68px; transform-origin: left; transform: scale(0.8);}

    .pokecard-1996-frame {font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif; text-shadow: 0 0 black !important;}
    .pokecard-1996-frame .shinySlot {background-image: url("");}
    .pokecard-1996-frame .cardFrame {background-size: 100%;}
    .pokecard-1996-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-trainer.png");}
    .pokecard-1996-frame .cardName, .pokecard-1996-frame .cardDesc, .pokecard-1996-frame .cardCost, .pokecard-1996-frame .cardATK {color: black;}
    .pokecard-1996-frame .cardName {width: 130px; font-weight: 700; transform-origin: left; transform: scale(0.8, 1);}
    .pokecard-1996-frame .cardHeader, .pokecard-1996-frame .cardFooter {background-color: rgba(0, 0, 0, 0);}
    .pokecard-1996-frame.monster .cardName {top: 10px; left: 13px;}
    .pokecard-1996-frame.spell .cardName {top: 37px; left: 14px;}
    .pokecard-1996-frame.monster .cardCost {top: 201px; left: 125px; transform: scale(1, 0.5);}
    .pokecard-1996-frame.spell .cardCost {top: 37px; left: 119px; text-align: right; transform: scale(1, 0.5);}
    .pokecard-1996-frame.monster.standard-skin .cardImage {top: 28px; left: 0px; width: 175px; height: 105px}
    .pokecard-1996-frame.spell.standard-skin .cardImage {top: 50px;}
    .pokecard-1996-frame.breaking-skin .cardImage {height: 210px !important; top: 0px !important; z-index: 0 !important}
    .pokecard-1996-frame.monster .cardDesc {top: 130px; line-height: 1.2; left: 18px; transform-origin: left; transform: scale(0.7); text-align: left;}
    .pokecard-1996-frame.spell .cardDesc {top: 144px; width: 140px; left: 18px; line-height: 1;}
    .pokecard-1996-frame .cardDesc, .pokecard-1996-frame .cardSilence {top: 129px;}
    .pokecard-1996-frame .cardDesc > div span {font-weight: 700; color: black;}
    .pokecard-1996-frame .cardATK {top: 158px; left: 130px;}
    .pokecard-1996-frame .cardHP {top: 9px; left: -3px; font-weight: 700; width: 150px; transform-origin: right; transform: scale(0.6); text-align: right; color: red !important}
    .pokecard-1996-frame .currentHP {color: red !important}
    .pokecard-1996-frame .maxHP {color: maroon !important}
    .pokecard-1996-frame .cardRarity {visibility: hidden}
    .pokecard-1996-frame.monster .cardStatus {left: 91px; top: 207px;}
    .pokecard-1996-frame.monster .cardStatus > img {max-width: 10px; width: 10px; max-height: 10px; height: 10px}
    .pokecard-1996-frame.monster .cardTribes {left: 156px; top: 130px; filter: grayscale(100%)}
    .pokecard-1996-frame.spell .cardTribes {right: 32px; top: 208px; filter: grayscale(100%)}
    .pokecard-1996-frame.spell .cardStatus {left: 46px; top: 208px; filter: grayscale(100%)}
    .pokecard-1996-frame.spell .cardStatus > img:nth-child(2) {left: 2px;}
    .pokecard-1996-frame.spell .cardStatus > img:nth-child(3) {left: 20px;}
    .pokecard-1996-frame.spell .cardStatus > img:nth-child(4) {left: 38px;}
    .pokecard-1996-frame.spell .cardStatus > img:nth-child(5) {left: 56px;}
    .pokecard-1996-frame.monster .cardTribes > img {max-width: 12px; width: 12px; max-height: 12px; height: 12px}
    .pokecard-1996-frame.monster .cardTribes > img:not(:first-child) {visibility: hidden}
    .pokecard-1996-frame.monster .PrettyCards_CardBottomLeftInfo > img {max-width: 12px; width: 12px; max-height: 12px; height: 12px}
    .pokecard-1996-frame.monster .PrettyCards_CardBottomLeftInfo {left: 12px; top: 130px; filter: grayscale(100%)}
    .pokecard-1996-frame.spell .PrettyCards_CardBottomLeftInfo {left: 30px; top: 145px; filter: grayscale(100%)}
    .pokecard-1996-frame .cardQuantity, .pokecard-1996-frame .cardUCPCost {top: 244px;}
    .pokecard-1996-frame .cardUCPDiscount {top: 122px;}
    .pokecard-1996-frame .cardQuantity, .pokecard-1996-frame .cardUCPCost, .pokecard-1996-frame .friendship-xp {text-shadow: -1px -1px black, 1px 1px black, -1px 1px black, 1px -1px black !important;}

    .slay-the-spire-frame {font-family: Candara,Calibri,Segoe,Segoe UI,Optima,Arial,sans-serif; }
    .slay-the-spire-frame .cardName {top: 18px; text-align: center !important; left: 31px; transform: scale(1.1); width: 120px;}
    .slay-the-spire-frame .cardHeader, .slay-the-spire-frame .cardFooter {background-color: rgba(0, 0, 0, 0);}
    .slay-the-spire-frame .cardCost {top: 6px; left: -1px;}
    .slay-the-spire-frame .cardImage {background-color: black !important;}
    .slay-the-spire-frame.monster.standard-skin .cardImage {top: 39px; left: 15px; width: 150px; height: 100px; background-size: cover !important;}
    .slay-the-spire-frame.spell.standard-skin .cardImage {top: 39px; left: 15px; width: 150px; height: 100px; background-size: cover !important;}
    .slay-the-spire-frame.breaking-skin .cardImage, .slay-the-spire-frame.full-skin .cardImage {top: 39px; left: 15px; width: 150px; height: 100px; background-size: cover !important; background-position-y: 26% !important; z-index: 0 !important}
    .slay-the-spire-frame .cardDesc {left: 21.5px; width: 136px;}
    .slay-the-spire-frame .cardSilence {left: 52px;}
    .slay-the-spire-frame .cardDesc > div span {color: revert;}
    .slay-the-spire-frame .cardDesc > div .helpPointer, .slay-the-spire-frame .cardDesc .PATIENCE {text-decoration: none; font-weight: 700; color: #f0c441 !important;}
    .slay-the-spire-frame .cardStatus {left: 150px; top: 44px;}
    .slay-the-spire-frame.monster .cardTribes {right: 25px;}
    .slay-the-spire-frame.monster .cardTribes > img:nth-child(2) {top: 5px;}
    .slay-the-spire-frame.spell .cardTribes {right: 25px; top: 116px;}
    .slay-the-spire-frame.monster .cardDesc, .slay-the-spire-frame.monster .cardSilence {top: 140px;}
    .slay-the-spire-frame.spell .cardDesc, .slay-the-spire-frame.spell .cardSilence {top: 150px;}
    .slay-the-spire-frame .cardATK, .slay-the-spire-frame .cardHP {top: 211px;}
    .slay-the-spire-frame .cardATK {left: 45px;}
    .slay-the-spire-frame .cardHP {left: 99px;}
    .slay-the-spire-frame .cardQuantity, .slay-the-spire-frame .cardUCPCost {top: 240px; left: 29px;}
    .slay-the-spire-frame .cardUCPDiscount {top: 120px;}
    .slay-the-spire-frame .cardRarity {visibility: hidden}
    .slay-the-spire-frame .cardBackground {visibility: hidden}

    *:has(> .balatro-frame) {perspective: 800px;}
    .balatro-frame { animation: sway 6s ease-in-out infinite; height: 236px !important;}
    .balatro-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-shiny.png"); opacity: 0.3; mix-blend-mode: hard-light;}
    .balatro-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-shiny-animated.gif"); opacity: 0.3; mix-blend-mode: hard-light;}
    .balatro-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-spell.png");}
    .balatro-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-monster.png");}
    .balatro-frame .cardHeader, .balatro-frame .cardFooter {background-color: rgba(0, 0, 0, 0);}
    .balatro-frame .cardFrame {background-size: 100%; image-rendering: pixelated;}
    .balatro-frame .cardName, .balatro-frame .cardDesc {visibility: hidden}
    .balatro-frame .cardCost, .balatro-frame .cardATK, .balatro-frame .cardHP {visibility: hidden}
    .balatro-frame .cardBackground {visibility: hidden}
    .balatro-frame .cardRarity {visibility: hidden}
    .balatro-frame .cardImage {background-color: black !important;}
    .balatro-frame.monster.standard-skin .cardImage {top: 5px; left: 5px; width: 165px; height: 225px; background-size: cover !important; image-rendering: pixelated;}
    .balatro-frame.breaking-skin .cardImage, .balatro-frame.full-skin .cardImage {top: 5px; left: 5px; width: 165px; height: 225px; background-size: 132% !important; background-position-y: 50% !important; z-index: 0 !important}
    .balatro-frame .cardRarity {visibility: hidden}
    .balatro-frame .cardQuantity, .balatro-frame .cardUCPCost {top: 240px;}

    .vmas-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/vmas-frame-shiny.png"); opacity: 0.3; mix-blend-mode: hard-light;}
    .vmas-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/vmas-frame-shiny-animated.gif"); opacity: 0.3; mix-blend-mode: hard-light;}
    .vmas-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/vmas-frame-spell.png");}
    .vmas-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/vmas-frame-monster.png");}
    .vmas-frame .cardName, .vmas-frame .cardCost {top: 9px;}
    .vmas-frame .cardDesc, .vmas-frame .cardSilence {top: 129px;}
    .vmas-frame .cardATK, .vmas-frame .cardHP, .vmas-frame .cardRarity {top: 214px;}
    .vmas-frame .cardQuantity, .vmas-frame .cardUCPCost {top: 240px;}

    .grimm-troupe-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .grimm-troupe-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .grimm-troupe-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/grimm-troupe-frame-spell.png");}
    .grimm-troupe-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/grimm-troupe-frame-monster.png");}
    .grimm-troupe-frame .cardName, .grimm-troupe-frame .cardCost {top: 9px;}
    .grimm-troupe-frame .cardDesc, .grimm-troupe-frame .cardSilence {top: 129px;}
    .grimm-troupe-frame .cardATK, .grimm-troupe-frame .cardHP, .grimm-troupe-frame .cardRarity {top: 213px;}
    .grimm-troupe-frame .cardQuantity, .grimm-troupe-frame .cardUCPCost {top: 240px;}

    .void-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .void-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .void-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/void-frame-spell.png");}
    .void-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/void-frame-monster.png");}
    .void-frame .cardName, .void-frame .cardCost {top: 9px;}
    .void-frame .cardDesc, .void-frame .cardSilence {top: 129px;}
    .void-frame .cardATK, .void-frame .cardHP, .void-frame .cardRarity {top: 213px;}
    .void-frame .cardQuantity, .void-frame .cardUCPCost {top: 240px;}

    .hollow-knight-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .hollow-knight-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .hollow-knight-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/hollow-knight-frame-spell.png");}
    .hollow-knight-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/hollow-knight-frame-monster.png");}
    .hollow-knight-frame .cardName, .hollow-knight-frame .cardCost {top: 9px;}
    .hollow-knight-frame .cardDesc, .hollow-knight-frame .cardSilence {top: 129px;}
    .hollow-knight-frame .cardATK, .hollow-knight-frame .cardHP, .hollow-knight-frame .cardRarity {top: 213px;}
    .hollow-knight-frame .cardQuantity, .hollow-knight-frame .cardUCPCost {top: 240px;}

    .fnafb-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .fnafb-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .fnafb-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/fnafb-frame-spell.png");}
    .fnafb-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/fnafb-frame-monster.png");}
    .fnafb-frame .cardName, .fnafb-frame .cardCost {top: 9px;}
    .fnafb-frame .cardDesc, .fnafb-frame .cardSilence {top: 129px;}
    .fnafb-frame .cardATK, .fnafb-frame .cardHP, .fnafb-frame .cardRarity {top: 213px;}
    .fnafb-frame .cardQuantity, .fnafb-frame .cardUCPCost {top: 240px;}

    .outbreak-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/outbreak-frame-shiny.png");}
    .outbreak-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/outbreak-frame-shiny-animated.gif");}
    .outbreak-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/outbreak-frame-spell.png");}
    .outbreak-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/outbreak-frame-monster.png");}
    .outbreak-frame .cardName, .outbreak-frame .cardCost {top: 9px;}
    .outbreak-frame .cardDesc, .outbreak-frame .cardSilence {top: 129px;}
    .outbreak-frame .cardATK, .outbreak-frame .cardHP, .outbreak-frame .cardRarity {top: 213px;}
    .outbreak-frame .cardQuantity, .outbreak-frame .cardUCPCost {top: 240px;}

    .staff-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .staff-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .staff-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/staff-frame-spell.png");}
    .staff-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/staff-frame-monster.png");}
    .staff-frame .cardName, .staff-frame .cardCost {top: 9px;}
    .staff-frame .cardDesc, .staff-frame .cardSilence {top: 129px;}
    .staff-frame .cardATK, .staff-frame .cardHP, .staff-frame .cardRarity {top: 213px;}
    .staff-frame .cardQuantity, .staff-frame .cardUCPCost {top: 240px;}

    .mirror-temple-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .mirror-temple-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .mirror-temple-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/mirror-temple-frame-spell.png");}
    .mirror-temple-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/mirror-temple-frame-monster.png"); height: 252px;}
    .mirror-temple-frame .cardName, .mirror-temple-frame .cardCost {top: 9px;}
    .mirror-temple-frame .cardDesc, .mirror-temple-frame .cardSilence {top: 129px;}
    .mirror-temple-frame .cardATK, .mirror-temple-frame .cardHP, .mirror-temple-frame .cardRarity {top: 213px;}
    .mirror-temple-frame .cardATK {animation: float 6s ease-in-out infinite;}
    .mirror-temple-frame .cardHP {animation: float 6s ease-in-out infinite; animation-delay: -1s;}
    .mirror-temple-frame .cardQuantity, .mirror-temple-frame .cardUCPCost {top: 240px;}
    `)
}

function rarityStyles(type) {
    const rarities = ['TOKEN', 'BASE', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'DETERMINATION'];
    style('rarityStyle', 'remove');
    rarities.forEach(r => {
        style('rarityStyle', 'add', `.pokecard-1996-frame.monster[data-rarity="${r}"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-${r.toLowerCase()}.png");}`);
        style('rarityStyle', 'add', `.slay-the-spire-frame.monster[data-rarity="${r}"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/slay-the-spire-frame-monster-${r.toLowerCase()}.png");}`);
        style('rarityStyle', 'add', `.slay-the-spire-frame.spell[data-rarity="${r}"] .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/slay-the-spire-frame-spell-${r.toLowerCase()}.png");}`);
        switch (type) {
            case "off": break;
            case "match frame":
                style('rarityStyle', 'add', `
                .hollow-knight-frame[data-rarity="${r}"] .cardRarity, .grimm-troupe-frame[data-rarity="${r}"] .cardRarity, .void-frame[data-rarity="${r}"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/hk-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .fnafb-frame[data-rarity="${r}"][data-extension="BASE"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-ut-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .fnafb-frame[data-rarity="${r}"][data-extension="DELTARUNE"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-dr-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .fnafb-frame[data-rarity="${r}"][data-extension="UTY"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-uty-${r.toLowerCase()}.png) no-repeat transparent !important;}
                `);
                break;
            case "Hollow Knight":
                style('rarityStyle', 'add', `.card[data-rarity="${r}"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/hk-${r.toLowerCase()}.png) no-repeat transparent !important;}`);
                break;
            case "FNAFB":
                style('rarityStyle', 'add', `
                .card[data-rarity="${r}"][data-extension="BASE"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-ut-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .card[data-rarity="${r}"][data-extension="DELTARUNE"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-dr-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .card[data-rarity="${r}"][data-extension="UTY"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-uty-${r.toLowerCase()}.png) no-repeat transparent !important;}
                `);
                break;
        }
    });
}

function tablessToggle(val) {
    style('tabless', val ? 'add' : 'remove', `
    .cardsList .card, .cardSkinList .card {height: 246px;}
    .cardsList .card:has(.cardQuantity) .cardRarity, .cardSkinList .card:has(.cardQuantity) .cardRarity {opacity: 0.4;}
    .cardsList .card:has(.cardUCPCost) .cardRarity, .cardSkinList .card:has(.cardUCPCost) .cardRarity {opacity: 0.4;}
    .card .cardQuantity, .card .cardUCPCost {top: 210px; z-index: 8; border: none; background-color: unset}
    .slay-the-spire-frame .cardQuantity, .slay-the-spire-frame .cardUCPCost {top: 222px;}
    .pokecard-1996-frame .cardQuantity, .pokecard-1996-frame .cardUCPCost {top: 212px;}
    .halloween2020-frame .cardQuantity, .halloween2020-frame .cardUCPCost {top: 216px;}
    .card .cardUCPCost:has(*) {visibility: hidden}
    .card .cardUCPCost > * {visibility: visible; position: absolute; left: 35px; width: 55px;}
    `)
}

function cardModifier(val) {
    style('cardModifier', 'remove')
    if (!obscActive()) { refreshCards(); return; }
    const rarities = ['TOKEN', 'BASE', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'DETERMINATION'];
    style('static', 'add', `
    @keyframes spin {
        0%  {transform: rotate(0deg);}
        100% {transform: rotate(360deg);}
    }
    @keyframes treadmill {
        0% {transform: translateX(1200px);}
        100% {transform: translateX(-1200px);}
    }
    `)
    var modifier = ``;
    switch (val) {
        case "none": modifier = ``; break;
        case "thin": modifier = `.card {transform: scaleX(0.5)}`; break;
        case "wide": modifier = `.card {transform: scaleX(1.5)}`; break;
        case "wee": modifier = `.card {transform: scale(0.5)}`; break;
        case "large": modifier = `.card {transform: scale(1.5)}`; break;
        case "offset": modifier = `.card {transform: translate(-100px)}`; break;
        case "upsidedown": modifier = `.card {transform: rotate(180deg)}`; break;
        case "flipped":
            rarities.forEach(r => {
                function link(ext) {
                    if (r === 'BASE' || r === 'TOKEN') {
                        return `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/cardBacks/${ext}Card${r}.png`;
                    } else {
                        return `images/cardBacks/${ext}Card${r}.png`;
                    }
                }
                modifier += `.card[data-rarity="${r}"][data-extension="BASE"] .cardFrame {background-image: url(${link('BASE')})}
                `;
                modifier += `.card[data-rarity="${r}"][data-extension="DELTARUNE"] .cardFrame {background-image: url(${link('DELTARUNE')})}
                `;
                modifier += `.card[data-rarity="${r}"][data-extension="UTY"] .cardFrame {background-image: url(${link('UTY')})}
                `;
            });
            modifier += `.card *:not(.cardFrame) {visibility: hidden;}
            `;
            if (obscCardRarity?.value() === 'blur') {
                modifier += `.card .cardFrame {filter: blur(${obscBlurStrength.value()}px)}`
            }
            break;
        case "spin": modifier = `.card {animation: spin 4s infinite linear;}`; break;
        case "treadmill": modifier = `.card {animation: treadmill 15s infinite linear;} .card:hover {animation-play-state: paused;}`; break;
    }
    console.log(modifier)
    style('cardModifier', 'add', modifier)
}

function updateSoulColor(soul, color) {
    style(`soulColor${soul}`, 'replace', `
        ${color === soulColors[soul] ? `
            img[src*="images/souls/${soul}.png"] {filter: drop-shadow(0px); transform: translateY(0px);}
            img[src*="images/souls/big/${soul}.png"] {filter: drop-shadow(0px); transform: translateY(0px);}
            div:not(.breaking-skin):has(.cardName.${soul}) > .cardImage {background-color: pebis; background-blend-mode: unset;}
            .${soul}:not(li span):not([onmouseover]):not(.pokecard-1996-frame .${soul}):not(#deckCardsCanvas *) {color: ${color}; text-shadow: revert}
        ` : `
            img[src*="images/souls/${soul}.png"] {filter: drop-shadow(5000px 5000px 0 ${color}); transform: translate(-5000px, -5000px);}
            img[src*="images/souls/big/${soul}.png"] {filter: drop-shadow(5000px 5000px 0 ${color}); transform: translate(-5000px, -5000px);}
            div:not(.breaking-skin):has(.cardName.${soul}) > .cardImage {background-color: ${color} !important; background-blend-mode: luminosity;}
            .${soul}:not(li span):not([onmouseover]):not(.pokecard-1996-frame .${soul}):not(#deckCardsCanvas *) {color: ${color}}
            ${color === "#000000" ? `
                .${soul}:not(li span):not([onmouseover]):not(#deckCardsCanvas *) {text-shadow: 0px 0px 10px #fff, 0px 0px 10px #fff;}
            ` : `
                .${soul}:not(li span):not([onmouseover]):not(#deckCardsCanvas *) {text-shadow: revert}
            `}
        `}
    `)
}
function shuffleSouls(dontSet) {
    var souls = [dtColor.value(), integColor.value(), kindnessColor.value(), justiceColor.value(), pvColor.value(), braveryColor.value(), patienceColor.value()]
    for (let i = souls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // fisher-yates shuffle
        [souls[i], souls[j]] = [souls[j], souls[i]];
    }

    function colorSet(soul, color) {
        updateSoulColor(soul, color)
        if (!dontSet) {
            switch (soul) {
                case 'DETERMINATION': return dtColor.set(color);
                case 'INTEGRITY': return integColor.set(color);
                case 'KINDNESS': return kindnessColor.set(color);
                case 'JUSTICE': return justiceColor.set(color);
                case 'PERSEVERANCE': return pvColor.set(color);
                case 'BRAVERY': return braveryColor.set(color);
                case 'PATIENCE': return patienceColor.set(color);
                default: console.error(`Invalid soul: ${soul} (setting color)`);
            }
        }
    }

    souls.forEach((soul, i) => colorSet(Object.keys(soulColors)[i], souls[i]) );
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
}

function setBg(bg, music, detachMusic) {
    $('body').css('background', '#000 url(\'images/backgrounds/' + bg + '.png\') no-repeat');
    $('body').css('background-size', 'cover');
    if (plugin.settings().value('underscript.persist.bgm')) {
        sessionStorage.setItem(`underscript.bgm.${window.gameId}`, bg);
    }
    if (music) {
        window.music.pause();
        if (detachMusic) {
            window.playBackgroundMusic(rollBgSmart(music, true));
        } else {
            window.playBackgroundMusic(bg);
        }
    }
}

function rollBgSmart(music, returnNum) {
    var newBg = window.randomInt(1, backgrounds.length - 1);
    for (let [key, value] of bgMixtape.value()) {
        key = Number(key)
        if (newBg === key) {
            switch (value) {
                case 'Omit': rollBgSmart(); break;
                case 'Play less often': if (window.randomInt(0, 1)) rollBgSmart(); break;
            }
        };
        if (value === 'Play more often' && window.randomInt(0, 5) === 5) {
            newBg = key;
        }
    }
    if (returnNum) {
        return newBg;
    }
    setBg(newBg, music);
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

function refreshCards() { if (typeof window.showPage === 'function' && window.pages.length) window.showPage(window.currentPage); }

const cardAliases = plugin.settings().add({
    key: 'cardAliases',
    name: 'Card alias lookup',
    note: 'Cards can be searched in your collection by well-known aliases and shorthands<br>For example, searching "casdyne" will have Casual Undyne as a result<br><br><span style="color:thistle;">Change applies on reload</span>',
    category: 'QoL',
    default: true,
});

const mulliganInfo = plugin.settings().add({
    key: 'mulliganInfo',
    name: 'Mulligan information',
    note: 'Displays turn order and opponent\'s name and SOUL on the Mulligan at the start of the game',
    category: 'QoL',
    default: true,
});

const autoStartMusic = plugin.settings().add({
    key: 'autoStartMusic',
    name: 'Automatically start music',
    note: 'Normally, the game requires that you first click the page to play the background music<br>With this on, it\'ll attempt to immediately start playing, with no user input<br><br><span style="color:thistle;">Do note, however, that some browsers still aren\'t able to play audio without user input</span>',
    category: 'QoL',
    default: false,
});

const programIndicators = plugin.settings().add({
    key: 'programIndicators',
    name: 'Program indicator',
    note: 'Program cards, when hovered, display their cost as their cost + the Program\'s cost<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'QoL',
    default: false,
    onChange: (val) => refreshCards()
});

const statFilters = plugin.settings().add({
    key: 'statFilters',
    name: 'Stat filters',
    note: 'Adds cost, ATK, and HP filters in your collection to better find specific cards',
    category: 'QoL',
    default: true,
    onChange: (val) => {if (val) {createStatFilters()} else {destroyStatFilters()}}
});

const statsOnTop = plugin.settings().add({
    key: 'statsOnTop',
    name: 'Stats on top',
    note: 'Displays card stats over obstructing skins',
    category: 'QoL',
    default: false,
    onChange: (val) => statsOnTopToggle(val)
});

const maxHpIndicator = plugin.settings().add({
    key: 'maxHpIndicator',
    name: 'Max HP indicator',
    note: 'Adds an indicator that shows the monster\'s HP out of its max. (ex. 5/6)<br><span style="color:thistle;">hide when full</span>: Doesn\'t display if the monster\'s HP is full.<br><span style="color:thistle;">always show</span>: Still displays if the monster\'s HP is full.',
    category: 'QoL',
    type: "select", options: ["off", "hide when full", "always show"],
    default: 'hide when full',
    onChange: (val) => refreshCards()
});

const cardSkinNames = plugin.settings().add({
    key: 'cardSkinNames',
    name: 'Card skin names',
    note: 'Card names will match applied skins<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const loopNames = plugin.settings().add({
    key: 'loopNames',
    name: 'Loop names',
    note: 'When a card has 1 or more Loop, its name will be changed to its plural form<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const breakingFullarts = plugin.settings().add({
    key: 'breakingFullarts',
    name: 'Breaking fullarts',
    note: 'Makes the "Full art" skin type instead<br>behave like a Breaking skin<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const respectiveFrames = plugin.settings().add({
    key: 'respectiveFrames',
    name: 'Respective frames',
    note: 'UT and UTY cards use the Undertale frame, and DR cards use the Deltarune frame<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const frameSpoof = plugin.settings().add({
    key: 'frameSpoof',
    name: 'Card frame',
    note: 'Changes cards to use any frame, including some custom ones!<br><br>Some frames change the below settings when applied.<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    type: "select", options: allFrames.toSpliced(0, 0, "off"),
    default: "off",
    onChange: (val, oldVal) => {
        switch (oldVal) {
            case 'Pokecard 1996':
                statBase.set('1');
                powerSpacing.set(20);
                powerBounds.set(135);
                numStack.set(false);
                break;
            case 'Slay the Spire':
                powerBounds.set(135);
                break;
        }
        switch (val) {
            case 'Pokecard 1996':
                statBase.set('10');
                powerSpacing.set(135);
                powerBounds.set(58);
                numStack.set(true);
                break;
            case 'Slay the Spire':
                powerBounds.set(102);
                break;
        }
      refreshCards();
    }
});

const frameSpoofBehavior = plugin.settings().add({
    key: 'frameSpoofBehavior',
    name: 'Ingame display behavior',
    note: 'Decides when the chosen frame should display itself<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    type: "select", options: ["allies only", "allies + enemies", "force everywhere"],
    default: "allies + enemies",
});

const raritySkins = plugin.settings().add({
    key: 'raritySkins',
    name: 'Rarity skin',
    note: 'Use a selection of custom rarity icons<br>"match frame" uses the custom rarity icon associated with the frame, if any',
    category: 'Cardpaint',
    type: "select", options: ["off", "match frame", "Hollow Knight", "FNAFB"],
    default: "match frame",
    onChange: (val) => rarityStyles(val)
});

const shinyDisplay = plugin.settings().add({
    key: 'shinyDisplay',
    name: 'Shiny display',
    note: 'Modifies how a card\'s shiny form is displayed',
    category: 'Cardpaint',
    type: "select", options: ["default", "cover"],
    default: "default",
    onChange: (val) => shinyDisplayToggle(val)
});

const statBase = plugin.settings().add({
    key: 'statBase',
    name: 'Stat base',
    note: 'Displays ATK and HP stats in different base number multiples<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    type: "select", options: ["1", "10", "100", "1000"],
    default: "1",
    onChange: (val) => refreshCards()
});

const powerSpacing = plugin.settings().add({
    key: 'powerSpacing',
    name: 'Power spacing',
    note: 'Changes how close together or far powers are spaced from eachother<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    type: "slider",
    min: 0,
    max: 135,
    step: 5,
    default: 20,
    reset: true,
    onChange: (val) => refreshCards()
});

const powerBounds = plugin.settings().add({
    key: 'powerBounds',
    name: 'Power bounds',
    note: 'Changes how far powers can go up to<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    type: "text",
    default: 135,
    reset: true,
    onChange: (val) => refreshCards()
});

const legacyPowers = plugin.settings().add({
    key: 'legacyPowers',
    name: 'No power fitting',
    note: 'Do you prefer the powers hanging off the card, you sick freak?<br>Here you go :3<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const numStack = plugin.settings().add({
    key: 'numStack',
    name: 'Powers iterate',
    note: 'Instead of numbers, powers iterate themselves<br><span style="color:thistle;">ex:</span> 3 Loop would appear as 3 seperate Loop icons,<br>not one Loop icon with a 3 on it.<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const tabless = plugin.settings().add({
    key: 'tabless',
    name: 'Tabless',
    note: 'Compacts the weird tab things for Quantity and UCP Cost<br>into the rarity box',
    category: 'Cardpaint',
    default: true,
    onChange: (val) => tablessToggle(val)
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
    note: 'Set the key used to reroll the background',
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
    note: 'Sets the key used to open chatroom 0 -- an ominous unused chat<br>Somewhat useful for writing notes!<br><br><span style="color:salmon;">Chats in this room are still logged by Undercards Chat Log, so<br>don\'t try anything stupid (:</span>',
    category: 'Keybinds',
    type: keybind,
    default: '["unbound", "unbound"]',
});

const emoteKeybinds = plugin.settings().add({
    key: 'emoteKeybinds',
    name: 'Emotes',
    note: 'Use ingame emotes with keypresses',
    category: 'Keybinds',
    type: 'advancedMap',
    default: [['["Digit1", "1"]', 'you know what i HATE?      that\'s BEPIS       the taste... the smell... the texture...        hey.... your drooling......']],
    type: {
        key: keybind,
        value: 'select',
    },
    data: () => ({
        value: window.chatEmotes?.map(emote => [emote.name, emote.id])
    }),
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
    name: 'Pixel-perfect image rendering',
    note: 'why',
    category: 'Filters',
    default: false,
    onChange: (val) => imgPixelToggle(val)
});

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
    note: 'Changes how big or small the light radius is',
    category: 'Filters',
    type: "slider",
    min: 1,
    max: 12,
    step: 1,
    default: 10,
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

const dtColor = plugin.settings().add({
    key: 'dtColor',
    name: 'Determination color',
    note: 'Recolors anything Determination!',
    category: 'To your liking',
    type: "color",
    default: soulColors.DETERMINATION,
    reset: true,
    onChange: (val) => updateSoulColor('DETERMINATION', val)
});

const integColor = plugin.settings().add({
    key: 'integColor',
    name: 'Integrity color',
    note: 'Recolors anything Integrity!',
    category: 'To your liking',
    type: "color",
    default: soulColors.INTEGRITY,
    reset: true,
    onChange: (val) => updateSoulColor('INTEGRITY', val)
});

const kindnessColor = plugin.settings().add({
    key: 'kindnessColor',
    name: 'Kindness color',
    note: 'Recolors anything Kindness!',
    category: 'To your liking',
    type: "color",
    default: soulColors.KINDNESS,
    reset: true,
    onChange: (val) => updateSoulColor('KINDNESS', val)
});

const justiceColor = plugin.settings().add({
    key: 'justiceColor',
    name: 'Justice color',
    note: 'Recolors anything Justice!',
    category: 'To your liking',
    type: "color",
    default: soulColors.JUSTICE,
    reset: true,
    onChange: (val) => updateSoulColor('JUSTICE', val)
});

const pvColor = plugin.settings().add({
    key: 'pvColor',
    name: 'Perseverance color',
    note: 'Recolors anything Perseverance!',
    category: 'To your liking',
    type: "color",
    default: soulColors.PERSEVERANCE,
    reset: true,
    onChange: (val) => updateSoulColor('PERSEVERANCE', val)
});

const braveryColor = plugin.settings().add({
    key: 'braveryColor',
    name: 'Bravery color',
    note: 'Recolors anything Bravery!',
    category: 'To your liking',
    type: "color",
    default: soulColors.BRAVERY,
    reset: true,
    onChange: (val) => updateSoulColor('BRAVERY', val)
});

const patienceColor = plugin.settings().add({
    key: 'patienceColor',
    name: 'Patience color',
    note: 'Recolors anything Patience!',
    category: 'To your liking',
    type: "color",
    default: soulColors.PATIENCE,
    reset: true,
    onChange: (val) => updateSoulColor('PATIENCE', val)
});

const shuffleSoulColors = plugin.settings().add({
    key: 'shuffleSoulColors',
    name: 'Shuffle',
    note: 'Shuffles all the soul colors!?<br><br><span style="color:thistle;">Closes this menu</span>',
    category: 'To your liking',
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
    category: 'To your liking',
    type: button,
    data: {
        text: 'Reset',
        onclick() {defaultSouls()}
    }
});

const bgMixtape = plugin.settings().add({
    key: 'bgMixtape',
    name: 'Playlist',
    note: 'Take control of the cruel, cruel RNG that is background randomization',
    category: 'To your liking',
    type: 'advancedMap',
    default: [[]],
    type: {
        key: 'select',
        value: 'select',
    },
    data: () => ({
        key: backgrounds.map((bg, i) => [bg, i]),
        value: preferenceTypes
    }),
});

const customTranslations = plugin.settings().add({
    key: 'customTranslations',
    name: 'Custom translations',
    note: 'Use custom translations for UC',
    category: 'To your liking',
    type: 'advancedMap',
    default: [["card-15", ";)"]],
    hidden: true // eek! im not ready yet
});

const obscurityInfo = plugin.settings().add({
    key: 'obscurityInfo',
    name: 'ⓘ Obscurity info',
    note: `The following options describe what will happen to the original content of the card.<br>
         <span style="color:thistle;">obfuscate</span>: Set to "Obfuscation text" setting<br>
         <span style="color:thistle;">blur</span>: Visually blurred<br>
         <span style="color:thistle;">to set card</span>: Set to the same content as the card in "Set card"<br>
         <span style="color:thistle;">to random card</span>: Set to the same content as a completely random card<br>
         <span style="color:thistle;">hide</span>: Hidden`,
    category: 'Cardsludge',
    type: plaintext,
});

const obscCardName = plugin.settings().add({
    key: 'obscCardName',
    name: 'Obscure name',
    category: 'Cardsludge',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card", "hide"],
    default: "off",
    onChange: (val) => obscure('cardName', val)
});

const obscCardCost = plugin.settings().add({
    key: 'obscCardCost',
    name: 'Obscure cost',
    category: 'Cardsludge',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card", "hide"],
    default: "off",
    onChange: (val) => obscure('cardCost', val)
});

const obscCardImage = plugin.settings().add({
    key: 'obscCardImage',
    name: 'Obscure image',
    category: 'Cardsludge',
    type: "select", options: ["off", "blur", "to set card", "to random card", "hide"],
    default: "off",
    onChange: (val) => obscure('cardImage', val)
});

const obscCardPowers = plugin.settings().add({
    key: 'obscCardPowers',
    name: 'Obscure powers',
    category: 'Cardsludge',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card", "hide"],
    default: "off",
    onChange: (val) => obscure('cardStatus', val)
});

const obscCardTribes = plugin.settings().add({
    key: 'obscCardTribes',
    name: 'Obscure tribes',
    category: 'Cardsludge',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card", "hide"],
    default: "off",
    onChange: (val) => obscure('cardTribes', val)
});

const obscCardDesc = plugin.settings().add({
    key: 'obscCardDesc',
    name: 'Obscure descriptions',
    category: 'Cardsludge',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card", "hide"],
    default: "off",
    onChange: (val) => obscure('cardDesc', val)
});

const obscCardStats = plugin.settings().add({
    key: 'obscCardStats',
    name: 'Obscure stats',
    note: '("Stats" is both ATK and HP.)',
    category: 'Cardsludge',
    type: "select", options: ["off", "obfuscate", "blur", "to set card", "to random card", "hide", "hide, use spell frame"],
    default: "off",
    onChange: (val) => {obscure('cardATK', val); obscure('cardHP', val)}
});

const obscCardRarity = plugin.settings().add({
    key: 'obscCardRarity',
    name: 'Obscure rarity',
    category: 'Cardsludge',
    type: "select", options: ["off", "blur", "to set card", "to random card", "hide"],
    default: "off",
    onChange: (val) => { obscure('cardRarity', val); cardModifier(visualModifier?.value()); }
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
    category: 'Cardsludge',
    type: "text",
    default: "?",
    onChange: (val) => refreshCards()
});

const obscBlurStrength = plugin.settings().add({
    key: 'obscBlurStrength',
    name: 'Blur strength',
    note: 'Sets the strength of the blur effect used by the "blur" option',
    category: 'Cardsludge',
    type: "slider",
    min: 1,
    max: 10,
    step: 1,
    default: 2,
    reset: true,
    onChange: () => {
        for (var i in obscSettings) {
            obscSettings[i].elements.forEach(k => obscure(k, obscSettings[i].value))
        };
        cardModifier(visualModifier?.value());
    }
});

var cardNames = [];

plugin.events.on('allCardsReady', (c) => {
    c.forEach(card => {cardNames.push(card.name)})
    cardNames.sort();
})

const obscSetCard = plugin.settings().add({
    key: 'obscSetCard',
    name: 'Set card',
    note: () => cardNames.length === 0 ? 'allCards isn\'t loaded.<br><span style="color: gray;">uhh somethin wrong. idk. try coming back</span>' : 'Sets the card used by the "to set card" option',
    category: 'Cardsludge',
    type: "select", options: cardNames,
    default: "Sans",
    disabled: () => cardNames.length === 0,
    onChange: (val) => refreshCards()
});

const obscRandomType = plugin.settings().add({
    key: 'obscRandomType',
    name: 'Randomization type',
    note: `I struggle to explain this aptly, so bear with me here.<br>
    TL;DR: Universal is more grounded, Independant is more chaotic.<br><br>
    Whereas X is the original element, and other letters are unspecified different results:<br><br>
    <span style="color:thistle;">Universal means all X will be Y. Every time you see X, it will be randomized to Y.</span><br>
    Note that for cases of more general values, like, for example, an ATK of 6,<br>
    <i>not all cases of 6 ATK will be the same,</i> since this specific case of ATK = 6 is<br>
     unique to the original card, e.g. Toriel.<br><br>
    <span style="color:thistle;">Independant means X could be W, Y, Z... that is, it could be anything.</span><br>
    Future X won't always be what you got from that last X.`,
    category: 'Cardsludge',
    type: "select", options: ["universal", "independant"],
    default: "universal",
    onChange: (val) => refreshCards()
});

const visualModifier = plugin.settings().add({
    key: 'visualModifier',
    name: 'Modifier',
    note: 'Visually changes cards in dumb ways',
    category: 'Cardsludge',
    type: "select", options: ["none", "thin", "wide", "large", "wee", "offset", "upsidedown", "flipped", "spin", "treadmill"],
    onChange: (val) => cardModifier(val)
});

const noGenerated = plugin.settings().add({
    key: 'noGenerated',
    name: 'No Generated',
    note: 'Hides generated power<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardsludge',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/createdUnknown.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const noSilence = plugin.settings().add({
    key: 'noSilence',
    name: 'No silence',
    note: 'Hides silence power and background<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardsludge',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/silencedUnknown.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => {hide('cardSilence', val); refreshCards()}
});

const noCostBuffs = plugin.settings().add({
    key: 'noCostBuffs',
    name: 'No cost buffs',
    note: 'Hides cost buff and debuff power<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardsludge',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/costUnknown.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const noStatBuffs = plugin.settings().add({
    key: 'noStatBuffs',
    name: 'No ATK / HP buffs',
    note: 'Hides ATK / HP buff and debuff powers<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardsludge',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/statsUnknown.gif' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const obscApply = plugin.settings().add({
    key: 'obscApply',
    name: 'Apply sludge',
    note: 'Changes where exactly Cardsludge settings will be applied, in case you want to<br>let the chaos loose, or bottle it up, never to be seen again...<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Cardsludge',
    type: "select", options: ['nowhere', 'ingame only', 'everywhere!!!'],
    default: "ingame only",
    onChange: (val) => {
        for (var i in obscSettings) {
            obscSettings[i].elements.forEach(k => obscure(k, obscSettings[i].value))
        };
        cardModifier(visualModifier?.value());
    }
});

function obscActive() {
    switch (obscApply?.value()) {
        case 'nowhere': return 0;
        case 'ingame only': return window.gameId ? 1 : 0;
        case 'everywhere!!!': return 1;
    }
}

window.obscActive = obscActive;

const baseStatChangePower = plugin.settings().add({
    key: 'baseStatChangePower',
    name: 'Base stat change',
    note: 'Brings back the base stat change power!<br>...Should be slightly more stable. Reset your allCards cache frequently, folks!',
    category: 'Too many powers!!!',
    data: { src: 'images/powers/baseStatChange.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const undereventPower = plugin.settings().add({
    key: 'undereventPower',
    name: 'Underevent 2024',
    note: 'Displays on El Undercardio!',
    category: 'Too many powers!!!',
    data: { src: 'images/powers/underevent2024.png' },
    type: powerCheckbox,
    default: true,
    onChange: (val) => refreshCards()
});

const newPower = plugin.settings().add({
    key: 'newPower',
    name: 'New',
    note: 'Displays if the card is... new!!! Yay!!!',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/new.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const programPower = plugin.settings().add({
    key: 'programPower',
    name: 'Program',
    note: 'Displays the program value',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/program.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const targetPower = plugin.settings().add({
    key: 'targetPower',
    name: 'Target',
    note: 'Displays the card\'s valid board targets',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/target.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const turnsPower = plugin.settings().add({
    key: 'turnsPower',
    name: 'Turn played',
    note: 'Displays the turn a card was played',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/turn.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const shinyPower = plugin.settings().add({
    key: 'shinyPower',
    name: 'Shiny',
    note: 'Displays when card is shiny',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/shiny.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const deadPower = plugin.settings().add({
    key: 'deadPower',
    name: 'Dead',
    note: 'Displays if the card has 0 or less HP',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/dead.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const legendPower = plugin.settings().add({
    key: 'legendPower',
    name: 'Legendmaker',
    note: 'Displays if the card\'s owner got LEGEND last season',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/legendmaker.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const totemPower = plugin.settings().add({
    key: 'totemPower',
    name: 'Totem drop',
    note: 'Displays if the card has base 7 cost or HP',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/totem.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const barrierPower = plugin.settings().add({
    key: 'barrierPower',
    name: 'The Barrier',
    note: 'How else would you know such <i>crucial</i> information about The Barrier?',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/barrierPowers.gif' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const primePower = plugin.settings().add({
    key: 'primePower',
    name: 'Prime',
    note: 'Displays if the monster\'s card ID is a prime number',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/prime.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const checkPower = plugin.settings().add({
    key: 'checkPower',
    name: 'Check',
    note: 'Always displays, giving all of a card\'s currently stored information<br>For use in debugging :P<br><br><span style="color:thistle;">Change applies on card update</span>',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/check.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const actionPowersInfo = plugin.settings().add({
    key: 'actionPowersInfo',
    name: '<span style="color: thistle;">Below are <i>action powers</i>. They appear on<br>a set % of cards and can affect the way you<br>play the game.</span>',
    category: 'Too many powers!!!',
    type: plaintext,
});

const kittyCatsEnabled = plugin.settings().add({
    key: 'kittyCatsEnabled',
    name: 'Kitty cats',
    note: 'Ingame, a random amount of cards have a <i>Kitty cat</i>.<br>When played, a <i>Kitty cat</i> card will do something random! :3',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/kittyCat.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => { rollEventArrays(); refreshCards(); }
});

const kittyCatsChance = plugin.settings().add({
    key: 'kittyCatsChance',
    name: 'Kitty cats %',
    note: 'The % chance that a card will have a <i>Kitty cat</i><br>(assuming <i>Kitty cats</i> are enabled)',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(); refreshCards(); }
});

const mikeDropsEnabled = plugin.settings().add({
    key: 'mikeDropsEnabled',
    name: 'Mike drops',
    note: 'Ingame, a random amount of cards have a <i>Mike drop</i>.<br>When played, a <i>Mike drop</i> card will end your turn!',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/mikeDrop.png' },
    type: powerCheckbox,
    default: false,
    onChange: (val) => { rollEventArrays(); refreshCards(); }
});

const mikeDropsChance = plugin.settings().add({
    key: 'mikeDropsChance',
    name: 'Mike drops %',
    note: 'The % chance that a card will have a <i>Mike drop</i><br>(assuming <i>Mike drops</i> are enabled)',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(); refreshCards(); }
});

const actionNotifications = plugin.settings().add({
    key: 'actionNotifications',
    name: 'Action power notifications',
    note: 'Gives Underscript notifications for when an <i>action power</i> triggers',
    category: 'Too many powers!!!',
    type: "select", options: ['on', 'off']
});

const versionInfo = plugin.settings().add({
    key: 'versionInfo',
    name: `Version ${pluginVersion}`,
    type: plaintext,
    category: 'Galascript',
});

const readPatchNotes = plugin.settings().add({
    key: 'readPatchNotes',
    name: 'Patch notes',
    category: 'Galascript',
    type: button,
    data: {
        text: 'Patch notes',
        onclick() {$("#underscript\\.plugin\\.Galascript\\.readPatchNotes").replaceWith(convertMarkdown.makeHtml(patchNotes));}
    }
});

const readCredits = plugin.settings().add({
    key: 'readCredits',
    name: 'Credits',
    category: 'Galascript',
    type: button,
    data: {
        text: 'Credits',
        onclick() {$("#underscript\\.plugin\\.Galascript\\.readCredits").replaceWith(credits);}
    }
});

const gsVersion = plugin.settings().add({
    key: 'version',
    name: 'Version',
    type: 'text',
    category: 'Galascript',
    hidden: true,
});

window.gsShowPatchNotes = function() {
    plugin.toast({
        title: `Galascript: Update ${pluginVersion}`,
        text: convertMarkdown.makeHtml(patchNotes),
    });
}

function processBinds(e) {
    if (e.target.getAttribute("type") !== 'text' && e.target.className !== 'gsKeybind') { // if not in a text field or setting a keybind
        switch ('button' in e ? e.button : e.code) {
            case bgKeybind?.value()[0]:
                if (!ingame) {
                    break;
                }
                rollBgSmart(true);
                break;
            case resetFiltersKeybind?.value()[0]:
                crispiness.set(100);
                blurriness.set(0);
                greyscale.set(0);
                invert.set(false);
                lightsOff.set(false);
                break;
            case openGalascriptKeybind?.value()[0]:
                gsVersion.show();
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
                    plugin.toast({title: "🦎 You can't surrender before turn 5!", text: "You pressed the set key for <i>Surrender</i>."})
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

var awaitingMike = false;
var awaitingKitty = false;
var lastCard;
plugin.events.on('GameEvent', (data) => {
    var cardPlayed = (data.action === 'getMonsterPlayed' || data.action === 'getSpellPlayed');
    if (cardPlayed) {
        var card = JSON.parse(data.card);
        lastCard = card;
    }
    if (data.action === 'getPlayableCards') {
        var cardIds = JSON.parse(data.playableCards)
        cardIds.forEach((cid) => {
            if (mikesArray.includes(cid)) {
                mikesArray[mikesArray.indexOf(cid)] *= -1
            }
            if (catsArray.includes(cid)) {
                catsArray[catsArray.indexOf(cid)] *= -1
            }
        });
    }
    if (cardPlayed && mikesArray.includes(card.id * -1 || card.id) && (card.ownerId === window.selfId) && mikeDropsEnabled?.value()) {
        awaitingMike = true;
        mikesArray[mikesArray.indexOf(card.id)] *= -1;
    }
    if (cardPlayed && catsArray.includes(card.id * -1) && (card.ownerId === window.selfId) && kittyCatsEnabled?.value()) {
        awaitingKitty = true;
        catsArray[catsArray.indexOf(card.id)] *= -1;
    }
    if (data.action === 'getPlayableCards') {
        if (awaitingMike) {
            window.socketGame.send(JSON.stringify({action: "endTurn"}));
            actionNotification('mikeDrop', 'mike', 'A played <i>Mike drop</i> card ended your turn prematurely.')
            awaitingMike = false;
        }
        if (awaitingKitty) {
            kittytime(lastCard);
            awaitingKitty = false;
        }
    }
});

function actionNotification(icon, type, text) {
    if (actionNotifications?.value() === 'off') { return; }
    const kitty = [ `Mrrp`, `Mrow`, `Meow`, `Nyaw`, `Mrrrrow`, `Prrrrrr`, `Mrorw`, `Mroooooow`, `Mew`, `Waoow` ]
    const mike = [ `Truth nuke`, `Final act`, `That's all, folks`, `Yep, I went there`, `I'll see ya next time`, `Thank you all for coming`, `*cue applause*`, `Like and subscribe for part 2` ]
    var title = `<img src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${icon}.png"> `;
    switch (type) {
        case 'kitty': title += kitty[Math.floor(Math.random() * kitty.length)]; break;
        case 'mike': title += mike[Math.floor(Math.random() * mike.length)]; break;
    }
    plugin.toast({
        title: title,
        text: text,
        timeout: 5000,
    })
}

var reroll;
var evilKittyLanguage;
function kittytime(card) {
    reroll = false;
    const kittymind = [
        `${evilForeignKitty()}`,                                    // 0 loads default translations for random language out of most supported languages, doesnt actually change the setting
        `This kitty is asleep...`,                                  // 1 nothing; a break
        `Kitty got out all the chats to play!`,                     // 2 opens first 17 chat ids randomly across the screen
        `Kitty found the emote control panel!`,                     // 3 searches for emotes, if none, reroll, if found, use a random one
        `A kitty fell off the counter ;(`,                          // 4 triggers big damage animation and sound
        `This kitty wants you to meet her family!`,                 // 5 opens tribe menu for tribe
        `A kitty bapped the light switch.`,                         // 6 toggles on/off dark mode
        `A kitty messed with the color pallete.`,                   // 7 shuffles soul colors
    ]
    var kittypoll = Math.floor(Math.random() * kittymind.length);
    switch (kittypoll) {
        case 0: defaultTranslations(evilKittyLanguage); break;
        case 1: break;
        case 2: chattyKitty(); break;
        case 3: emotingKitty(); break;
        case 4: window.shakeScreen(); break;
        case 5: familyKitty(card); break;
        case 6: if ($("#gsFlashlight").length) { removeFlashlight(); } else { createFlashlight(); }; break;
        case 7: shuffleSouls(1); break;
        default: actionNotification('kittyCat', 'kitty', "Uh oh! Kitty broke the space-time continuum and returned an error. Please report this to Gala!"); return;
    }
    if (reroll) {kittytime(card); return;}
    actionNotification('kittyCat', 'kitty', kittymind[kittypoll])
}

window.kittytime = kittytime

function evilForeignKitty() {
    const langs = ['en', 'es', 'ru', 'it', 'de', 'cn'];
    const langsfrom = ['English', 'Spaniard', 'Russian', 'Italian', 'German', 'Chinese'];
    var langpoll = langs.indexOf($.i18n().locale)
    while (langs[langpoll] === $.i18n().locale) {
        langpoll = Math.floor(Math.random() * langs.length);
    }
    evilKittyLanguage = langs[langpoll];
    return `An evil ${langsfrom[langpoll]} kitty changed your language!`
}

function chattyKitty() {
    for (let i = 1; i <= 16; i++) { openRoomRandom(i); };
}

function openRoomRandom(id) {
    window.openRoom(id)
    const $chat = $(`#chat-public-${id}`)
    $chat.css('top', window.randInt(50, 400));
    $chat.css('left', window.randInt(0, 1000));
}

window.chattyKitty = chattyKitty

function emotingKitty() {
    const emotes = window.chatEmotes.map(emote => emote.id) ?? [];
    const emotepoll = Math.floor(Math.random() * emotes.length);
    console.log(emotes, emotepoll, emotes[emotepoll])
    const id = emotes[emotepoll].toString();
    if (id) {
        window.socketGame.send(JSON.stringify({action: "emote", id: id}));
    } else {
        reroll = true;
    }
}

function familyKitty(card) {
    const cardMainTribe = card.tribes[0] || null;
    const tribes = ['SNAILS', 'TEMMIE', 'ARACHNID', 'DOG']
    const tribepoll = Math.floor(Math.random() * tribes.length);
    window.showTribeCards(cardMainTribe || tribes[tribepoll])
}

const flashlight = document.createElement("div");
function createFlashlight() {
    flashlight.id = "gsFlashlight";
    document.body.appendChild(flashlight);
    window.addEventListener("mousemove", function(e) {
        var flashlight = document.getElementById("gsFlashlight");
        if (flashlight) {
            flashlight.style.backgroundPosition = `${e.pageX - flashlightRadiusInput?.value() * 4098 / 2}px ${(e.pageY - flashlightRadiusInput?.value() * 4098 / 2) - window.scrollY}px`;
        }
    });
}
function removeFlashlight() { // very intricate function right here
    flashlight.remove()
}

plugin.events.on(':preload', () => {
    staticStyles();
    frameStyles();
    rarityStyles(raritySkins?.value());
    cardModifier(visualModifier?.value());
    siteFilter(crispiness?.value(), blurriness?.value(), greyscale?.value(), invert?.value());
    updateFlashlightRadius(flashlightRadiusInput?.value());
    updateFlashlightImg(flashlightStyle?.value());
    imgPixelToggle(pixelImageRendering?.value());
    for (var i in obscSettings) { obscSettings[i].elements.forEach(k => obscure(k, obscSettings[i].value)) };
    if (noSilence?.value()) {hide('cardSilence', true)};
    if (lightsOff?.value()) {createFlashlight()};
    shinyDisplayToggle(shinyDisplay?.value());
    statsOnTopToggle(statsOnTop?.value());
    tablessToggle(tabless?.value());
    if (mulliganInfo?.value()) {initMulliganInfo()}
    updateSoulColor('DETERMINATION', dtColor?.value());
    updateSoulColor('INTEGRITY', integColor?.value());
    updateSoulColor('KINDNESS', kindnessColor?.value());
    updateSoulColor('JUSTICE', justiceColor?.value());
    updateSoulColor('PERSEVERANCE', pvColor?.value());
    updateSoulColor('BRAVERY', braveryColor?.value());
    updateSoulColor('PATIENCE', patienceColor?.value());
    if (gsVersion.value() != pluginVersion) {
        gsVersion.set(pluginVersion);
        plugin.toast({
            title: `Galascript: Update ${pluginVersion}`,
            text: convertMarkdown.makeHtml(patchNotes),
        });
    }
});

plugin.events.on('translation:loaded', () => {
    if (cardAliases?.value()) {initAliases();};
    initCustomPower();
});

function setProfileSkin(profileSkin, music) {
    var profileSkinBackgrounds = ['Vaporwave', 'Sans Bar', 'Holy War', 'Spider Party', 'Halloween2020', 'Memories of the Snow', 'Smartopia Arrived'];
    var profileSkinMusics = ['Vaporwave', 'Spider Party', 'Memories of the Snow', 'Smartopia Arrived'];

    if (profileSkinBackgrounds.includes(profileSkin.name)) {
        setBg(profileSkin.image, music, profileSkinMusics.includes(profileSkin.name))
    }
}

var catsArray = [];
var mikesArray = [];
plugin.events.on('GameStart', () => {
    plugin.events.on('connect', (data) => {
        const profileSkin = JSON.parse(data.yourProfileSkin)
        const savedBg = sessionStorage.getItem(`underscript.bgm.${window.gameId}`);
        const underscriptPersistBg = plugin.settings().value('underscript.persist.bgm');

        function loadBg(music) {
            if (savedBg && underscriptPersistBg) {
                setBg(savedBg, music);
            } else {
                rollBgSmart(music);
                setProfileSkin(profileSkin, music)
            }
        }

        if (autoStartMusic?.value()) {
            loadBg(true)
            $('html').unbind('click');
        } else {
            loadBg(false)
        };
        rollEventArrays();
    });
});

function rollEventArrays() {
    const seed = window.gameId
    function rollChance(i) {
        var m = 2**35 - 31
        var a = 185852
        var s = ((seed ^ i) * 2654435761) >>> 0;
        var roll = (s * a % m) / m
        return Math.floor(roll * 100) + 1;
    }
    const kittyCatsChancer = Math.min(Math.max(kittyCatsChance.value(), 0), 100);
    const mikeDropsChancer = Math.min(Math.max(mikeDropsChance.value(), 0), 100);
    for (let i = 10000; i <= 20000; i++) {
        if (kittyCatsChancer >= rollChance(i)) {
            catsArray.push(i)
        }
    }
    for (let i = 10000; i <= 20000; i++) {
        if (mikeDropsChancer >= rollChance(i * 6)) {
            mikesArray.push(i)
        }
    }
    window.catsArray = catsArray
    window.mikesArray = mikesArray
}

plugin.events.on(':load', () => {
    if (statFilters?.value()) {createStatFilters()}
});

function destroyStatFilters() {
    style('statFilterSpacing', 'remove', `
        td[style*="width: 200px"] {display: table; margin-bottom: -20px;}
        td[style*="width: 200px"] {display: table; margin-bottom: -20px;}
    `)
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
    style('statFilterSpacing', 'replace', `
        td[style*="width: 200px"] {display: table; margin-bottom: -20px;}
        td[style*="width: 200px"] {display: table; margin-bottom: -20px;}
    `)
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

function createPowerFiltersStandard() {
    const includePaths = ['/Crafting', '/Decks', '/DecksAdmin'];
    if (!includePaths.includes(window.location.pathname)) { return; }

    const hasteInput = $('<label>')
    hasteInput.append($('<input>', {
        id: 'hasteInput',
        type: 'checkbox',
        class: 'powerInput',
        onchange: 'applyFilters(); showPage(0);'
    }))
    hasteInput.append($('<img>', {
        src: 'images/powers/haste.png',
        width: '24px',
    }))

    const chargeInput = $('<label>')
    chargeInput.append($('<input>', {
        id: 'chargeInput',
        type: 'checkbox',
        class: 'powerInput',
        onchange: 'applyFilters(); showPage(0);'
    }))
    chargeInput.append($('<img>', {
        src: 'images/powers/charge.png',
        width: '24px',
    }))

    const newFilter = $('<p>', {
        style: 'text-align: center; font-size: 16px;',
        class: 'filter'
    })

    newFilter.append(hasteInput)
    newFilter.append(chargeInput)

    $('.filter:last').after(newFilter)
}

window.beppy = createPowerFiltersNormal

plugin.events.on('Settings:open', () => createTransHelper());

let selectedEl = null;
function createTransHelper() {
    const transHelper = $('<div>', {
        id: 'gsTransHelper',
        css: {display: 'none',
              position: 'absolute',
              background: '#000',
              padding: '10px',
              border: '1px solid #aaa',
              zIndex: '1800'
             }
    });
    const transHelperOptions = [
    $('<p>', {
        class: 'gsTransHelperOption',
    }),
    $('<input>', {
        class: 'gsTransHelperOption',
        type: 'button',
        value: 'Card name',
    }),
    $('<input>', {
        class: 'gsTransHelperOption',
        type: 'button',
        value: 'Card description',
    }),
    ]

    transHelperOptions.forEach(opt => transHelper.append(opt));

    $('body').append(transHelper);

    $('p.gsTransHelperOption').text('Replace with...');

    $(document).on('click contextmenu', function (e) {
        const $target = $(e.target);
        if (!$target.closest(selectedEl).length) {
            transHelper.hide();
        }
    });

    const observer = new MutationObserver((mutations, obs) => {
        document.querySelectorAll('[id^="underscript.plugin.Galascript.customTranslations"]').forEach(el => {
            if (!el.dataset.gsMenuLoaded) {
                el.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    selectedEl = el;
                    transHelper.css({
                        display: 'block',
                        left: `${e.pageX}px`,
                        top: `${e.pageY}px`
                    });
                });
                el.dataset.gsMenuLoaded = 'true';
            }
        })
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function creditTitle(title) {
    return `<h4>${title}</h4>`
}

function creditRow(contribution, creator) {
    return `<h5>${contribution}<span class="coolguy">${creator}</span></h5>`
}
function creatorRow(creator) {
    return `<h5 style="text-align: center; color: thistle;">${creator}</h5>`
}
function link(display, link, icon) {
    return `<a target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;" href="${link}"><img style="width: 14px;" src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/${icon}.png">${display}</a>`
}

const credits = `
Galascript wouldn't be possible without all of your contributions and epic gamerness. Especially...
${creditRow("Underscript developer", "feildmaster")}
feild made this whole thing possible! It's him who set the groundwork for people like me to easily craft their silly schemes (not to mention the heavy help along the way!). I can't thank him enough :D
${creditTitle("Frames")}
${creditRow("Staff", "Diamaincrah")}
${creditRow("Spamton", "Dylan Hall")}
${creditRow("Cyber World", "Dylan Hall")}
${creditRow("Hollow Knight", "Valaar")}
${creditRow("Void", "Crystal & Acid")}
${creditRow("Grimm Troupe", "Crystal & Acid")}
${creditRow("FNAFB", "Crystal")}
${creditRow("Outbreak", "Jaku")}
${creditRow("Mirror Temple", "Emerald")}
${creditRow("VMas", "StellarSting")}
${creditRow("Steamworks", "Shyren")}
${creditRow("Inscrypted", "Dylan Hall")}
${creditRow("It's TV Time!", "Dylan Hall")}
${creditRow("Cold Place", "Dylan Hall")}
${creditRow("Slay the Spire", "Bartwk")}
${creditTitle("Rarity icons")}
${creditRow("Hollow Knight", "Jaku")}
${creditRow("FNAFB", "JaimeezNuts")}
${creditTitle("Free-to-use Frame assets")}
${creditRow("Pokecard 1996 - Monster, Shiny", link("ILKCMP", "https://www.deviantart.com/ilkcmp", "deviantart_thistle"))}
${creditRow("Pokecard 1996 - Spell", link("icycatelf", "https://www.deviantart.com/icycatelf", "deviantart_thistle"))}
${creditTitle("Special Thanks")}
${creatorRow("feildmaster (again)")}
${creatorRow("Onutrem")}
${creatorRow("Galascript's early supporters and testers")}
${creatorRow("And you. Thank you <3")}
i am... so happy to have this out you have no fucking idea oh my g
`