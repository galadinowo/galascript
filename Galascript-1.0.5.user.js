// ==UserScript==
// @name         Galascript
// @namespace    https://undercards.net
// @version      1.0.5
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
const customFrames = ["Respective", "Staff", "Spamton", "Cyber World", "Hollow Knight", "Grimm Troupe", "Void", "FNAFB", "Outbreak", "Mirror Temple", "Snails", "Waterfall", "Yet Darker", "VMas", "Steamworks", "Bone", "Furry Sans", "OvenBreak", "Inscrypted", "Its TV Time", "Cold Place", "brat", "Slay the Spire", "Balatro", "Pokecard 1996"]
const backgrounds = ["-", "Ruins - UT", "Quiet Water - UT", "Hotland - UT", "Snowdin - UT", "The Surface - UT", "MTT Resort - UT", "Waterfall - UT", "The CORE - UT",
                     "Judgement Hall - UT", "True Lab - UT", "Hometown - DR", "Scarlet Forest - DR", "Home - DR", "Field of Hopes and Dreams - DR", "Castle Town - DR",
                     "Card Castle - DR", "Jevil's Staircase - DR", "Temmie Village - UT", "Home - UT", "Snowy - UT", "Quiet Autumn - DR", "Alphys's Classroom - DR", "Grillby's - UT",
                     "Raining Somewhere Else - UT", "Title Fountain - DR", "Dog Casino - UT", "sans. - UT", "Dog Shrine - UT", "Cyber World - DR", "Cyber City - DR",
                     "Pandora Palace - DR", "Green Room - DR", "New Home - UT", "Lost Girl - DR", "Alphys's Lab - UT", "Acid Tunnel of Love - DR", "Castle Funk - DR",
                     "Spamton Alleyway - DR", "Spamton's World - DR", "Pandora Palace...? - DR", "Basement - DR", "GIGA Queen - DR", "Ruins - UTY", "Snowdin - UTY", "Honeydew Resort Band - UTY",
                     "Dunes - UTY", "East Mines - UTY", "Wild East - UTY", "Steamworks - UTY", "Greenhouse - UTY", "Steamworks Factory - UTY", "Ceroba's House - UTY", "Dalv's House - UTY",
                     "Honeydew Resort - UTY", "Oasis - UTY", "Hotland Ride - UTY", "Waterfall Ride - UTY", "Golden Opportunity - UTY", "New Home Balcony - UTY", "Stage - UE",
                     "Adventure Board - DR", "Paradise - DR", "Cold Place - DR", "TV World - DR", "Holiday House - DR", "Dark Sanctuary - DR", "Gerson's Study - DR", "Third Sanctuary - DR", "Where It Rained - DR",
                     "UG Apartments - UTY", "New Home - UTY", "Second Sanctuary - DR", "Hotland High - UT", "Doghole - UT", "Underwater Town - UT", "Abandoned Town - UT", "Church - DR"]
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
    "statuses": [],
    "typeSkin": 0,
    "playedTurn": 0,
    "ownerId": 0,
}

plugin.updater?.('https://github.com/galadinowo/galascript/raw/refs/heads/main/Galascript.user.js');

const patchNotes =
`
- New frame, <i>brat</i>
- New category, <i>Cosmetics</i>, adding new control over randomizing avatars and profile skins
- <i>Keybinds</i> added for randomizing cosmetics
- Added feature to visually collapse any Underscript or Plugin category by clicking its title
- Added <i>Translation guide</i>, giving some useful information so you can understand how Translations work!
- Added "New row" and "Translation guide" options to the Translation Helper menu
`;

const convertMarkdown = new underscript.lib.showdown.Converter();

const seed = window.gameId
function pullRandom(stat, from = 1, i = 1, raw) {
    if (!raw) {
        switch (obscRandomType?.value()) {
            case 'universal': from = from.fixedId; break;
            case 'independant': from = from.id; break;
        }
    }
    var m = 2**35 - 31
    var a = 185852
    var s = ((seed ^ from ^ i) * 2654435761) >>> 0;
    var roll = (s * a % m) / m
    var rollFinal = Math.floor(roll * maxCardId())
    var newStat;
    if (stat === 'program') {
        var index = window.getCard(rollFinal)?.statuses.findIndex(status => status.name === stat)
        newStat = window.getCard(rollFinal)?.statuses[index]?.counter
    } else {
        newStat = window.getCard(rollFinal)?.[stat]
    }
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

Array.prototype.gs_random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const checkCreateCard = setInterval(() => {
    if (typeof createCard === 'function') {
        clearInterval(checkCreateCard);
        function newCreateCard(card, $htmlCard) {
            var name, image, cost, attack, hp, maxHp, shiny, hpSquish, maxHpSquish, htmlHp, htmlAtk, rarity, extension;
            var program = "";
            var fauxCost = "";
            var fauxAttack = "";
            var fauxHp = "";
            var fauxStatusId = "";
            var fauxTribesId = "";
            const obsc = obscActive(card);
            var cardLoop = findStatus(card, 'loop');
            switch (JSON.stringify([obscCardName?.value(), obsc])) {
                case '["obfuscate",1]':
                    name = obfuscationText?.value();
                    break;
                case '["to set card",1]':
                    name = $.i18n('card-name-' + window.getCardWithName(obscSetCard?.value()).fixedId, loopNames?.value() && cardLoop > 0 ? cardLoop + 1 : 1)
                    break;
                case '["to random card",1]':
                    name = $.i18n('card-name-' + pullRandom('id', card, 1), loopNames?.value() && cardLoop > 0 ? cardLoop + 1 : 1)
                    break;
                default:
                    name = $.i18n('card-name-' + card.fixedId, loopNames?.value() && cardLoop > 0 ? cardLoop + 1 : 1);
                    var cardImg = card.image.replaceAll(" Open", "").replace(/(\S)\d+$/, "$1");
                    if (cardSkinNames?.value() && cardImg !== card.baseImage) {
                        name = card.image.replaceAll("_", " ").replaceAll(" Full", "").replaceAll(" FULL", "").replaceAll("C1225", "1225")
                    }
            }
            switch (JSON.stringify([obscCardImage?.value(), obsc])) {
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
            switch (JSON.stringify([obscCardDesc?.value(), obsc])) {
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

            switch (JSON.stringify([obscCardRarity?.value(), obsc])) {
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

            switch (JSON.stringify([obscCardPowers?.value(), obsc])) {
                case '["to set card",1]':
                    program = findStatus(window.getCardWithName(obscSetCard?.value()), 'program');
                    fauxStatusId = window.getCardWithName(obscSetCard?.value()).id
                    break;
                case '["to random card",1]':
                    program = pullRandom('program', card, 5);
                    fauxStatusId = pullRandom('id', card, 5);
                    break;
                default:
                    program = findStatus(card, 'program');
            }
            if (program === 0) program = "";

            switch (JSON.stringify([obscCardTribes?.value(), obsc])) {
                case '["to set card",1]':
                    fauxTribesId = window.getCardWithName(obscSetCard?.value()).id
                    break;
                case '["to random card",1]':
                    fauxTribesId = pullRandom('id', card, 6);
                    break;
            }

            cost = card.cost;

            switch (JSON.stringify([obscCardCost?.value(), obsc])) {
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
                switch (JSON.stringify([obscCardStats?.value(), obsc])) {
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

            shiny = card.shiny ? " shiny" : "";

            var frameSkinName = 'undertale';


            const canBeApplied = card.hasOwnProperty('frameSkinName') || frameSpoofBehavior?.value() === 'force everywhere'
            const enableCustomFrame = canBeApplied && frameSpoof?.value() !== 'off'
            const appliedToAllies = frameSpoofBehavior?.value() === 'allies only' && card?.ownerId === window.userId
            const appliedToEnemies = frameSpoofBehavior?.value() === 'enemies only' && card?.ownerId === window.opponentId
            const appliedToAll = frameSpoofBehavior?.value() === 'allies + enemies' || frameSpoofBehavior?.value() === 'force everywhere'
            const ingameDisplay = ingame && (appliedToAllies || appliedToEnemies || appliedToAll)

            if (enableCustomFrame && (ingameDisplay || !ingame)) {
                card.frameSkinName = frameSpoof?.value()
            }

            if (card.hasOwnProperty('frameSkinName')) {
                frameSkinName = card.frameSkinName.toString().replace(/\s+/g, '-').toLowerCase();
            }

            if (program > 0 && programIndicators?.value()) {
                program = `<div class="cardProgram cardCost">${program + cost}</div>\n`
            } else {
                program = ''
            }

            if (frameSkinName === 'showdown') {
                var pokedex = card.fixedId;
                if (card.shiny) {
                    pokedex = `shiny/${pokedex}`
                }
                image = `<div class="cardImageShowdown" style="background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/home/${pokedex}.png'); background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/showdown/${pokedex}.gif')"></div>
                <progress class="cardHealthbar"></progress>`
            } else {
                image = `<div class="cardImage"></div>`
            }


            var disableBreaking = '';
            const frames = ['pokecard-1996', 'slay-the-spire', 'balatro', 'showdown', 'brat']
            if (frames.includes(frameSkinName)) {
                disableBreaking = ' breaking-disabled'
            }
            if (card.typeSkin === 1 && breakingFullarts?.value()) {
                disableBreaking = localStorage.getItem("breakingDisabled") ? ' breaking-skin breaking-disabled' : ' breaking-skin'
            }

            frameSkinName += '-frame';

            const obscClass = obsc ? ' gsObscured' : ''

            if ($htmlCard) {
                $.fn.removeClassContaining = function(str) {
                    var classes = $(this).attr('class');
                    if (!classes || !str) return false;
                    var classArray = [];
                    classes = classes.split(' ');
                    for (var i = 0, len = classes.length; i < len; i++) {
                        if (!classes[i].includes(str)) {
                            classArray.push(classes[i])
                        };
                    }
                    $(this).attr('class', classArray.join(' '));
                };
                $htmlCard.removeClass('shiny gsObscured breaking-disabled')
                $htmlCard.removeClassContaining('-frame')
                $htmlCard.removeClassContaining('base')
                $htmlCard.off('mousemove');
                $htmlCard.off('mouseleave');
                $htmlCard.attr('id', card.id)
                $htmlCard.removeAttr('data-gs-random-delay');
                $htmlCard.addClass(`${frameSkinName}${shiny}${disableBreaking}${obscClass} base${statBase?.value()}`)
                $htmlCard.attr('data-rarity', card.rarity)
                $htmlCard.attr('data-extension', card.extension)
                $htmlCard.find('.cardObject').html(JSON.stringify(card).replaceAll('"', '&quot;'))
                $htmlCard.find('.cardFauxCost').html(fauxCost)
                $htmlCard.find('.cardFauxATK').html(fauxAttack)
                $htmlCard.find('.cardFauxHP').html(fauxHp)
                $htmlCard.find('.cardFauxStatus').html(fauxStatusId)
                $htmlCard.find('.cardFauxTribes').html(fauxTribesId)
                $htmlCard.find('.cardName').html(`<div data-i18n="[html]card-name-${card.fixedId}">${name}</div>`)
                $htmlCard.find('.cardCost').html(cost)
                $htmlCard.find('.cardProgram').remove()
                $(program).appendTo($htmlCard);
                const bgi = $htmlCard.find('.cardImage').attr('style');
                $htmlCard.find('.cardImage').remove()
                $htmlCard.find('.cardImageShowdown').remove()
                $htmlCard.find('.cardHealthbar').remove()
                $(image).appendTo($htmlCard);
                $htmlCard.find('.cardImage').attr('style', bgi);
                if (!['/CardSkinsShop', '/Quests'].includes(window.location.pathname)) {
                    $htmlCard.find('.cardDesc').html(`<div data-i18n="[html]card-${card.fixedId}">${description}</div>`);
                    $htmlCard.find('.cardImage').css('background', 'transparent url(\'images/cards/' + card.image + '.png\') no-repeat');
                }
                if (card.typeCard === 0) {
                    $htmlCard.find('.cardATK').html(htmlAtk)
                    $htmlCard.find('.cardHP').html(htmlHp)
                }
                $htmlCard.find('.cardRarity').css('background', 'transparent url(\'images/rarity/' + card.extension + '_' + card.rarity + '.png\') no-repeat');
                var $cardNameDiv = $htmlCard.find('.cardName div');
                var $cardDescDiv = $htmlCard.find('.cardDesc div');
                $cardNameDiv.css('font-size', window.getResizedFontSize($cardNameDiv, 25));
                $cardDescDiv.css('font-size', window.getResizedFontSize($cardDescDiv, 81));
            } else {
                var htmlCard =
                `<div id="${card.id}" class="card monster ${frameSkinName}${shiny}${disableBreaking}${obscClass} base${statBase?.value()}" data-rarity="${card.rarity}" data-extension="${card.extension}">
                <div class="cardObject">${JSON.stringify(card).replaceAll('"', '&quot;')}</div>
                <div class="shinySlot"></div>
                <div class="cardFrame"></div>
                <div class="cardBackground"></div>
                <div class="cardHeader"></div>
                <div class="cardFauxElement cardFauxCost">${fauxCost}</div>
                <div class="cardFauxElement cardFauxATK">${fauxAttack}</div>
                <div class="cardFauxElement cardFauxHP">${fauxHp}</div>
                <div class="cardFauxElement cardFauxStatus">${fauxStatusId}</div>
                <div class="cardFauxElement cardFauxTribes">${fauxTribesId}</div>
                <div class="cardName"><div data-i18n="[html]card-name-${card.fixedId}">${name}</div></div>
                <div class="cardCost">${cost}</div>
                ${program}
                <div class="cardStatus"></div>
                <div class="cardTribes"></div>
                ${image}
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
                    `<div id="${card.id}" class="card spell ${frameSkinName}${shiny}${disableBreaking}${obscClass}" data-rarity="${card.rarity}" data-extension="${card.extension}">
                    <div class="cardObject">${JSON.stringify(card).replaceAll('"', '&quot;')}</div>
                    <div class="shinySlot"></div>
                    <div class="cardFrame"></div>
                    <div class="cardBackground"></div>
                    <div class="cardHeader"></div>
                    <div class="cardFauxElement cardFauxCost">${fauxCost}</div>
                    <div class="cardFauxElement cardFauxStatus">${fauxStatusId}</div>
                    <div class="cardFauxElement cardFauxTribes">${fauxTribesId}</div>
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
        }
    } window.createCard = newCreateCard
});

function findStatus(card, statusName) {
    const statuses = card.statuses
    const foundStatus = statuses?.find(status => status.name === statusName)
    if (foundStatus) {
        return foundStatus.counter ?? true
    } else {
        return false
    }
}
const filterPowersStandard = [
    {
        name: 'haste',
        icon: 'haste',
        condition: function(card) {return findStatus(card, 'haste')},
    },
    {
        name: 'charge',
        icon: 'charge',
        condition: function(card) {return findStatus(card, 'charge')},
    },
    {
        name: 'taunt',
        icon: 'taunt',
        condition: function(card) {return findStatus(card, 'taunt')},
    },
    {
        name: 'armor',
        icon: 'armor',
        condition: function(card) {return findStatus(card, 'armor')},
    },
    {
        name: 'candy',
        icon: 'candy',
        condition: function(card) {return findStatus(card, 'candy')},
    },
    {
        name: 'dodge',
        icon: 'dodge',
        condition: function(card) {return findStatus(card, 'dodge')},
    },
    {
        name: 'transparency',
        icon: 'transparency',
        condition: function(card) {return findStatus(card, 'transparency')},
    },
    {
        name: 'disarmed',
        icon: 'disarmed',
        condition: function(card) {return findStatus(card, 'disarmed')},
    },
    {
        name: 'loop',
        icon: 'loop',
        condition: function(card) {return findStatus(card, 'loop')},
    },
    {
        name: 'program',
        icon: 'program',
        condition: function(card) {return findStatus(card, 'program')},
    },
    {
        name: 'shock',
        icon: 'shock',
        condition: function(card) {return findStatus(card, 'shock')},
    },
    {
        name: 'support',
        icon: 'support',
        condition: function(card) {return findStatus(card, 'support')},
    },
    {
        name: 'bullseye',
        icon: 'bullseye',
        condition: function(card) {return findStatus(card, 'bullseye')},
    },
    {
        name: 'wanted',
        icon: 'wanted',
        condition: function(card) {return findStatus(card, 'wanted')},
    },
    {
        name: 'darkspawn',
        icon: 'darkspawn',
        condition: function(card) {return findStatus(card, 'darkspawn')},
    },
]
const filterPowersGalascript = [
    {
        name: 'target',
        icon: 'target',
        condition: function(card) {return card.target != undefined},
    },
    {
        name: 'new',
        icon: 'new',
        condition: function(card) {return card.fixedId == 80},
    },
]

const isPrime = num => {
for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if(num % i === 0) return false;
}
return num > 1;
}

const checkSetInfoPowers = setInterval(() => {
 if (typeof setInfoPowers === 'function'){
    clearInterval(checkSetInfoPowers);
    function newSetInfoPowers(monsterContainer, card) {
    monsterContainer.find('.cardStatus').empty();
    var powers = [];
    var powersStringKeys = [];
    var powersStringArgs = [];
    var powersStringNumbers = [];
    var powersTypes = [];
    var pool, printPool, poolArgs;
    var fauxStatusId = monsterContainer.find('.cardFauxStatus').text()
    var selfId = card.fixedId
    if (fauxStatusId) {
        let setCard = window.getCard(Number(fauxStatusId))
        card.target = setCard.target;
        card.statuses = setCard.statuses;
        selfId = setCard.fixedId;
    }
    function pushPower(sprite, key, args, number, type = "NEUTRAL"){
        if (obscCardPowers?.value() === 'obfuscate' && obscActive(card)) {
            sprite = 'unknown'
            key = 'gs.status-unknown'
            args = []
            number = null
            type = 'NEUTRAL'
        }
        if (numStack?.value() && number > 1) {
            for (var i = 0; i < number; i++) {
                powers.push(sprite);
                powersStringKeys.push((key.startsWith('gs.') ? '' : 'gs.') + key + '-stacked');
                powersStringArgs.push([]);
                powersStringNumbers.push(null);
                powersTypes.push(type);
            }
        } else {
            powers.push(sprite);
            powersStringKeys.push(key);
            powersStringArgs.push(args);
            powersStringNumbers.push(number);
            powersTypes.push(type);
        }
    };

    const baseCard = window.getCard(selfId) || nullcard; // SHOULD fix the issue with getCard locking up in an old allCards cache ...

    if (turnsPower?.value() && card.playedTurn > 0) {
        pushPower('turn', 'gs.status-turn', [Math.floor(card.playedTurn / 2), window.turn - Math.floor(card.playedTurn / 2)], Math.floor(card.playedTurn / 2), 'NEUTRAL');
    }

    if (!noCostBuffs?.value() && card.cost < card.originalCost) {
        pushPower('bonusCost', 'status-cost-debuff', [card.originalCost], null, 'POSITIVE');
    }

    if (!noCostBuffs?.value() && card.cost > card.originalCost) {
        pushPower('malusCost', 'status-cost-buff', [card.originalCost], null, 'NEGATIVE');
    }

    if (card.rarity === "DETERMINATION") {
        pushPower('determination', 'status-determination', [], null, 'POSITIVE');
    }

    var cardTarget;

    if (targetPower?.value() && card.target != undefined) {
        switch (card.target) {
            case 'MONSTER': cardTarget = 'any monster'; break;
            case 'ALLY_MONSTER': cardTarget = 'an ally monster'; break;
            case 'ENEMY_MONSTER': cardTarget = 'an enemy monster'; break;
            case 'ALLY': cardTarget = 'an ally'; break;
            case 'ENEMY': cardTarget = 'an enemy'; break;
            case 'ALL': cardTarget = 'anything'; break;
            default: cardTarget = card.target;
        }
        pushPower('target', 'gs.status-target', [cardTarget], null, 'NEUTRAL');
    }

    if (shinyPower?.value() && card.shiny) {
        pushPower('shiny', 'gs.status-shiny', [], null, 'NEUTRAL');
    }

    if (legendPower?.value() && card.owner?.oldDivision === 'T') {
        pushPower('legendmaker', 'gs.status-legend', [], null, 'NEUTRAL');
    }

    if (card.typeCard === 0) {

        if (totemPower?.value() && (baseCard.hp === 7 || baseCard.cost === 7)) {
            pushPower('totem', 'gs.status-totem', [], null, 'NEUTRAL');
        }

        if (!noStatBuffs?.value() && card.attack > card.originalAttack) {
            pushPower('bonusAtk', 'status-atk-buff', [card.originalAttack], null, 'POSITIVE');
        }

        if (!noStatBuffs?.value() && card.attack < card.originalAttack) {
            pushPower('malusAtk', 'status-atk-debuff', [card.originalAttack], null, 'NEGATIVE');
        }

        if (!noStatBuffs?.value() && card.maxHp > card.originalHp) {
            pushPower('bonusHp', 'status-hp-buff', [card.originalHp], null, 'POSITIVE');
        }

        if (!noStatBuffs?.value() && card.maxHp < card.originalHp) {
            pushPower('malusHp', 'status-hp-debuff', [card.originalHp], null, 'NEGATIVE');
        }

        if (baseStatChangePower?.value() && (baseCard.hp !== card.originalHp || baseCard.attack !== card.originalAttack || baseCard.cost !== card.originalCost)) {
            var baseCardTranslated = $.i18n('{{CARD:' + selfId + '|1}}');
            pushPower('baseStatChange', 'status-base-stat-change', [baseCardTranslated, baseCard.cost, baseCard.attack, baseCard.hp, card.originalCost, card.originalAttack, card.originalHp], null, 'NEUTRAL');
        }

        if (card.caughtMonster !== undefined) {
            var caughtCardTranslated = $.i18n('{{CARD:' + card.caughtMonster.fixedId + '|1}}');
            pushPower('box', 'status-caught', [caughtCardTranslated, card.caughtMonster.owner.username], null, 'POSITIVE');
        }

        if (deadPower?.value() && card.hp < 1) {
            pushPower('dead', 'gs.status-dead', [], null, 'NEUTRAL');
        }
    }

        if (barrierPower?.value() && selfId === 801) {
            pushPower('smellsLikeLemons', 'gs.status-smells-like-lemons', [], null, 'NEUTRAL');
            pushPower('immuneToMadjick', 'gs.status-immune-to-madjick', [], null, 'NEUTRAL');
        }

        if (formerGloryPowers?.value() && formerGloryTrashy?.value() && selfId === 632) {
            pushPower('thorns', 'status-thorns', [2], 2, 'POSITIVE');
            pushPower('ranged', 'gs.status-ranged', [], null, 'POSITIVE');
        }

        if (formerGloryPowers?.value() && formerGloryUndying?.value() && selfId === 106) {
            pushPower('anotherChance', 'status-another-chance', [], null, 'POSITIVE');
        }

        if (undereventPower?.value() && selfId === 874) {
            pushPower('underevent2024', 'status-underevent-2024', [], null, 'NEUTRAL');
        }

        if (checkPower?.value()) {
            pushPower('check', 'gs.status-check', [cardLog(card)], null, 'NEUTRAL');
        }

        if (primePower?.value() && isPrime(selfId)) {
            pushPower('prime', 'gs.status-prime', [selfId], null, 'NEUTRAL');
        }

        if (newPower?.value() && selfId == 80) {
            pushPower('new', 'gs.status-new', [], null, 'NEUTRAL');
        }

        const actionSilenced = silencableActionPowers?.value() && findStatus(card, 'silenced')

        if (kittyCatsEnabled?.value() && gameData.cats.includes(card.id) && !card.playedTurn && card.ownerId === window.userId && !actionSilenced) {
            pushPower('kittyCat', 'gs.status-kitty-cat', [], null, 'NEGATIVE');
        }

        if (mikeDropsEnabled?.value() && gameData.mikes.includes(card.id) && !card.playedTurn && card.ownerId === window.userId && !actionSilenced) {
            pushPower('mikeDrop', 'gs.status-mike-drop', [], null, 'NEGATIVE');
        }

        monsterContainer.removeClass('playLocked').removeClass('attackLocked');

        if (equationsEnabled?.value() && !gameData.equationsWon.includes(card.id) && gameData.equations.includes(card.id) && !card.playedTurn && card.ownerId === window.userId && !actionSilenced) {
            pushPower('equation', 'gs.status-equation', [JSON.stringify(card).replaceAll('"', '&quot;').replaceAll('\'', '')], null, 'NEGATIVE');
            monsterContainer.addClass('playLocked');
        }

        if (bricksEnabled?.value() && gameData.bricks.includes(card.id) && !card.playedTurn && card.ownerId === window.userId && !actionSilenced) {
            pushPower('brick', 'gs.status-brick', [], null, 'NEGATIVE');
            monsterContainer.addClass('playLocked');
        }

        if (stuporEnabled?.value() && gameData.stupor.includes(card.id) && card.ownerId === window.userId && card.typeCard === 0 && !actionSilenced) {
            pushPower('stupor', 'gs.status-stupor', [], null, 'NEGATIVE');
            monsterContainer.addClass('attackLocked');
        }

        if (bitflippedEnabled?.value() && gameData.bitflipped.includes(card.id) && !bitflippedAmnesia?.value() && !actionSilenced) {
            if (card.typeCard === 0 || (card.typeCard === 1 && bitflippedSpells?.value())) {
                pushPower('bitflipped', 'gs.status-bitflipped', [], null, 'NEGATIVE');
            }
        }

        if (sludgeEnabled?.value() && gameData.sludge.includes(card.id) && !actionSilenced) {
            pushPower('sludge', 'gs.status-sludge', [], null, 'NEGATIVE');
        }

    var statuses = card.statuses;
    if (statuses !== undefined) {
        for (var i = 0; i < statuses.length; i++) {
            var status = statuses[i];
            if (
               !(status.name === 'program' && !programPower?.value()) &&
               !(status.name === 'silenced' && noSilence?.value())
               ) {
                pushPower(status.name, `status-${status.name}`, [status.counter], status.counter, status.statusType)
            }
        }
    }

    if (!noGenerated?.value() && card.creatorInfo !== undefined && card.creatorInfo.typeCreator >= 0) {
        var creatorCardTranslated = '';
        if (card.creatorInfo.typeCreator === 0) {creatorCardTranslated = $.i18n('{{CARD:' + card.creatorInfo.id + '|1}}');}
        else if (card.creatorInfo.typeCreator === 1) {creatorCardTranslated = $.i18n('{{ARTIFACT:' + card.creatorInfo.id + '}}');}
        else if (card.creatorInfo.typeCreator === 2) {creatorCardTranslated = $.i18n('{{SOUL:' + card.creatorInfo.name + '}}');}
        pushPower('created', 'status-created', [creatorCardTranslated], null, 'NEUTRAL');
    }

    for (let i = 0; i < powersStringArgs.length; i++) {
        var args = powersStringArgs[i];

        for (let j = 0; j < args.length; j++) {
            args[j] = window.base64EncodeUnicode(args[j]);
        }
    }

    const balatro = powerSkins?.value() === 'Balatro' || (powerSkins?.value() === 'match frame' && card.frameSkinName === 'Balatro')
    const showdown = powerSkins?.value() === 'Showdown' || (powerSkins?.value() === 'match frame' && card.frameSkinName === 'Showdown')
    var offset = Number(0);
    var numPowers = powers.length - 1
    powers.forEach((power) => {
        if (balatro) {
            if (power === 'brick') { numPowers += 2.375 }
            else if (power === 'dodge') { numPowers += 0.75 }
            else if (power === 'loop' || power === 'kr' || power === 'wanted' || power === 'paralyzed' || power === 'determination' || power === 'kittyCat') { numPowers += 0.625 }
            else if (power === 'legendmaker') { numPowers += 0.25 }
            else { numPowers += 0.125 }
        } else {
            if (power === 'brick') { numPowers++ };
        }
    });
    const overflowing = numPowers * powerSpacing?.value() > powerBounds?.value()
    var spacing = !legacyPowers?.value() ? overflowing ? powerBounds?.value() / numPowers : powerSpacing?.value() : powerSpacing?.value();
    for (let i = 0; i < powersStringKeys.length; i++) {

        var $cardContainerImage = monsterContainer.find('.cardStatus');
        if (!showdown) {
            var url;
            var git = powersStringKeys[i].startsWith("gs.") && $.i18n(powersStringKeys[i].replace("gs.", "").replace("-stacked", "")).includes("status-")
            if (powers[i] === 'thorns') {git = true;}
            if (powers[i] === 'anotherChance') {git = true;}
            if (powers[i] === 'ranged') {git = false;}
            switch (powerSkins?.value()) {
                case 'off':
                    url = git ? `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${powers[i]}.png` : `images/powers/${powers[i]}.png`;
                    break;
                case 'match frame':
                    if (card.frameSkinName === 'Balatro') {
                        url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/balatro-${powers[i]}.png`;
                    } else {
                        url = git ? `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${powers[i]}.png` : `images/powers/${powers[i]}.png`;
                    }
                    break;
                case 'Ancient':
                    if (['Atk', 'Cost', 'disarmed'].some(w => powers[i].includes(w))) {
                        url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/ancient-${powers[i]}.png`
                    } else {
                        url = git ? `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${powers[i]}.png` : `images/powers/${powers[i]}.png`;
                    }
                    break;
                case 'Neon':
                    url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/neon-${powers[i]}.png`;
                    break;
                case 'Balatro':
                    url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/balatro-${powers[i]}.png`;
                    break;
            }
            if (balatro) {
                function addOffset(num) {offset += overflowing ? (spacing - spacing / num) / 1.6 : num}
                if (powers[i] === 'brick') {
                    $cardContainerImage.append(`<img style="right: ${i * spacing + offset}px; ${card.frameSkinName === 'Balatro' ? 'transform: rotate(180deg);' : ''} max-height: unset; max-width: unset;" power="${powers[i]}" class="infoPowers helpPointer" src="${url}" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">`);
                    addOffset(38)
                } else if (powers[i] === 'dodge') {
                    $cardContainerImage.append(`<img style="right: ${i * spacing + offset}px; max-height: unset; max-width: unset;" power="${powers[i]}" class="infoPowers helpPointer" src="${url}" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">`);
                    addOffset(14)
                } else if (powers[i] === 'loop' || powers[i] === 'kr' || powers[i] === 'wanted' || powers[i] === 'paralyzed' || powers[i] === 'determination' || powers[i] === 'kittyCat') {
                    $cardContainerImage.append(`<img style="right: ${i * spacing + offset}px; max-height: unset; max-width: unset;" power="${powers[i]}" class="infoPowers helpPointer" src="${url}" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">`);
                    addOffset(10)
                } else if (powers[i] === 'legendmaker') {
                    $cardContainerImage.append(`<img style="right: ${i * spacing + offset}px; max-height: unset; max-width: unset;" power="${powers[i]}" class="infoPowers helpPointer" src="${url}" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">`);
                    addOffset(4)
                } else {
                    $cardContainerImage.append(`<img style="right: ${i * spacing + offset}px; max-height: unset; max-width: unset;" power="${powers[i]}" class="infoPowers helpPointer" src="${url}" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">`);
                    addOffset(2)
                }
            } else if (powers[i] === 'brick') {
                $cardContainerImage.append(`<img style="right: ${i * spacing + offset}px; ${card.frameSkinName === 'Balatro' ? 'transform: rotate(180deg);' : ''} max-width: 34px; width: 34px;" power="${powers[i]}" class="infoPowers helpPointer" src="${url}" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">`);
                offset += Number(spacing);
            } else {
                $cardContainerImage.append(`<img style="right: ${i * spacing + offset}px;" power="${powers[i]}" class="infoPowers helpPointer" src="${url}" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">`);
            }

            if (powersStringNumbers[i] !== null && powersStringNumbers[i] > 1) {
                $cardContainerImage.append(`<span style="right: ${i * spacing + offset}px;" class="infoPowersDetails helpPointer" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">${powersStringNumbers[i]}</span>`);
            }
        } else {
            var arg = powersStringArgs[i][0]
            if (!arg) {arg = 'Pz8/'}
            var powerType;
            switch (powers[i]) {
                case 'kr': powerType = 'psn'; break;
                case 'paralyzed': powerType = 'frz'; break;
                case 'disarmed': powerType = 'slp'; break;
                case 'stupor': powerType = 'stu'; break;
                case 'burn': powerType = 'brn'; break;
                default: powerType = powersTypes[i].toLowerCase();
            }
            const showdownNames = {
                bonusCost: `${card.cost - card.originalCost} ${$.i18n('stat-cost')}`,
                bonusAtk: `+${card.attack - card.originalAttack} ${$.i18n('stat-atk')}`,
                bonusHp: `+${card.maxHp - card.originalHp} ${$.i18n('stat-hp')}`,
                malusCost: `+${card.cost - card.originalCost} ${$.i18n('stat-cost')}`,
                malusAtk: `${card.attack - card.originalAttack} ${$.i18n('stat-atk')}`,
                malusHp: `${card.maxHp - card.originalHp} ${$.i18n('stat-hp')}`,
                check: `&nbsp;*&nbsp;`,
                turn: `Played on turn ${atob(arg)}`,
                prime: `Prime ID`,
                totem: `Totem drop`,
                anotherChance: `Another chance`,
                box: `Caught ${atob(arg)}`,
                created: `Generated`,
                kr: `PSN`,
                paralyzed: `FRZ`,
                disarmed: `SLP`,
                stupor: `SLP?`,
                burn: `BRN`,
                smellsLikeLemons: `Smells like lemons`,
                immuneToMadjick: `Imune to Madjick`,
                baseStatChange: `Altered base stats`,
                kittyCat: `Kitty cat`,
                mikeDrop: `Mike drop`,
                determination: `Determined`,
                loop: powersStringNumbers[i] ? `${$.i18n('kw-loop')} (${powersStringNumbers[i]})` : `+1 ${$.i18n('kw-loop')}`,
                dodge: powersStringNumbers[i] ? `${$.i18n('kw-dodge')} (${powersStringNumbers[i]})` : `+1 ${$.i18n('kw-dodge')}`,
                program: powersStringNumbers[i] ? `${$.i18n('kw-program')} (${powersStringNumbers[i]})` : `+1 ${$.i18n('kw-program')}`,
                thorns: powersStringNumbers[i] ? `${$.i18n('kw-thorns')} (${powersStringNumbers[i]})` : `+1 ${$.i18n('kw-thorns')}`,
                target: `Targets ${atob(arg)}`,
                shock: `${$.i18n('kw-shock')} active`,
                support: `${$.i18n('kw-support')} active`,
                bullseye: `${$.i18n('kw-bullseye')} active`,
            }
            $cardContainerImage.append(`<span power="${powers[i]}" class="infoPowers helpPointer ${powerType} showdownStatus" oncontextmenu="displayStatusStringKey(${window.formatArgs(powersStringKeys[i], powersStringArgs[i])});">${showdownNames[powers[i]] ?? powers[i].charAt(0).toUpperCase() + powers[i].slice(1)}</span>`);
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
        if (obscCardTribes?.value() === 'obfuscate' && obscActive(card)) {
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
    monsterContainer.find(".cardObject").html(JSON.stringify(card).replaceAll('"', '&quot;'));
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
            if (cardAliases?.value()) {
                var removedInSearch = results.search
                if (removed && removedInSearch) {
                    var searchValue = $('#searchInput').val().toLowerCase();
                    var alias = ""
                    if (!$.i18n('gs.card-alias-' + card.fixedId).includes('card-alias')) {
                        alias = $.i18n('gs.card-alias-' + card.fixedId).toLowerCase().replace(/(<.*?>)/g, '');
                        removed = !alias.includes(searchValue)
                    }
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

    filterPowersStandard.forEach((power) => {
        plugin.addFilter(
            function gsPowerFilter(card, removed) {
                if (!removed && $(`#${power.name}Input`).length) {
                    removed = $(`#${power.name}Input`).prop('checked') && !power.condition(card);
                }
                return removed;
            }
        )
    })

    filterPowersGalascript.forEach((power) => {
        plugin.addFilter(
            function gsPowerFilter(card, removed) {
                if (!removed && $(`#${power.name}Input`).length) {
                    removed = $(`#${power.name}Input`).prop('checked') && !power.condition(card);
                }
                return removed;
            }
        )
    })

}

function seededRand(s) {
    var mask = 0xffffffff;
    var m_w  = (123456789 + s) & mask;
    var m_z  = (987654321 - s) & mask;
    m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
}
function seededRandInt(min, max, seed) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(seededRand(seed) * (max - min + 1)) + min;
}

const checkUpdateCardVisual = setInterval(() => {
    if (typeof updateCardVisual === 'function'){
        clearInterval(checkUpdateCardVisual);
        function newUpdateCardVisual($htmlCard, card) {
        var statbase = 1;
        const baseClass = $htmlCard.attr("class").match(/base([0-9.]+)/);
        if (baseClass) {
            statbase = baseClass[1];
        }

        function stat(num) {
            num = num * statbase
            if (String(num).includes(".")) {
                return num.toPrecision(1);
            } else {
                return num;
            }
        }

        var cost = card.cost
        var attack = stat(card.attack);
        var baseAttack = stat(card.originalAttack);
        var hp = stat(card.hp);
        var maxHp = stat(card.maxHp);
        var baseHp = stat(card.originalHp);
        var fauxAttack = $htmlCard.find('.cardFauxATK').text();
        var fauxHp = $htmlCard.find('.cardFauxHP').text();
        var fauxMaxHp = $htmlCard.find('.cardFauxHP').text();

        const actionSilenced = silencableActionPowers?.value() && findStatus(card, 'silenced')
        const bitflipped = bitflippedEnabled?.value() && gameData.bitflipped.includes(card.id) && !actionSilenced
        var bit;
        switch (seededRandInt(0, 1, window.gameId + card.id)) {
            case 0: bit = 1; break;
            case 1: bit = -1; break;
        }
        if (bitflipped) {
            if (card.typeCard === 0) {
                switch (seededRandInt(0, 2, window.gameId + card.id)) {
                    case 0: attack += stat(bit); break;
                    case 1: hp += stat(bit); maxHp += stat(bit); baseHp += stat(bit); break;
                    case 2: cost += bit; break;
                }
            }
            if (card.typeCard === 1 && bitflippedSpells?.value()) {
                cost += bit;
            }
            if (bitflippedRealism?.value()) {
                if (cost < 0) { cost *= -1 }
                if (attack < 0) { attack *= -1 }
                if (maxHp < stat(1)) { hp *= -1; maxHp *= -1; baseHp *= -1; }
            }
        }


        var fauxCost = $htmlCard.find('.cardFauxCost').text();
        if (obscActive(card) && ['obfuscate', 'to set card', 'to random card'].includes(obscCardCost?.value())) {
            cost = fauxCost - (card.originalCost - card.cost)
            if (isNaN(cost)) {cost = fauxCost}
        }

        if (obscActive(card) && ['obfuscate', 'to set card', 'to random card'].includes(obscCardStats?.value())) {
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
        if (card.typeCard === 1) { return; }

        var $cardHp = $htmlCard.find('.cardHP');
        var $cardCurrentHp = $htmlCard.find('.currentHP');
        var $cardMaxHp = $htmlCard.find('.maxHP');
        var $cardHealthbar = $htmlCard.find('.cardHealthbar');
        $cardHp.html($cardCurrentHp);
        $cardHp.append($cardMaxHp);
        $cardCurrentHp.html(hp);
        $cardMaxHp.html('');
        $cardHealthbar.attr('value', hp);
        $cardHealthbar.attr('max', maxHp);
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
            $cardMaxHp.attr("style", `transform: scaleX(${maxHpSquish})`);                   // update: im not ever doing that am i
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
        $cardATK.removeClass('attack-buff').removeClass('attack-debuff');
        $htmlCard.removeClass('paralyzed');
        if (findStatus(card, 'paralyzed') > 0) {
            $htmlCard.addClass('paralyzed');
        } else {
            if (attack > baseAttack) {
                $cardATK.addClass('attack-buff');
            } else if (attack < baseAttack) {
                $cardATK.addClass('attack-debuff');
            }
        }
        if (findStatus(card, 'silenced')) {
            $htmlCard.find('.cardSilence').css('visibility', 'visible');
            if (card.frameSkinName === 'Its TV Time' || card.frameSkinName === 'Cold Place') {
                $htmlCard.find('.cardImage').css('filter', 'grayscale(100%)');
                if (card.frameSkinName === 'Cold Place') {
                    $htmlCard.find('.cardName').css('visibility', 'hidden');
                }
            }
        }
        $htmlCard.find(".cardObject").html(JSON.stringify(card).replaceAll('"', '&quot;'));
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
        refreshCards();
    });
}
window.defaultTranslations = defaultTranslations
function initGsTranslations() {
    if (!$) return;
    $.i18n().load({
        "gs.card-alias-8": "mommy",
        "gs.card-alias-30": "bp",
        "gs.card-alias-32": "memhead",
        "gs.card-alias-38": "rg1",
        "gs.card-alias-39": "rg2",
        "gs.card-alias-60": "paps",
        "gs.card-alias-62": "asdree",
        "gs.card-alias-64": "mttex mtt ex",
        "gs.card-alias-66": "wtf",
        "gs.card-alias-68": "achance",
        "gs.card-alias-69": "sblazing sblaze",
        "gs.card-alias-71": "fenergy",
        "gs.card-alias-82": "merchire",
        "gs.card-alias-88": "btreat bctreat",
        "gs.card-alias-89": "pgas polgas pollgas pollugas",
        "gs.card-alias-92": "fon",
        "gs.card-alias-95": "tow",
        "gs.card-alias-106": "undyne the undying",
        "gs.card-alias-107": "watercooler buble boobie",
        "gs.card-alias-110": "mttneo mtt neo",
        "gs.card-alias-117": "oflowey",
        "gs.card-alias-140": "polibear",
        "gs.card-alias-145": "db1",
        "gs.card-alias-146": "db2",
        "gs.card-alias-150": "ncg",
        "gs.card-alias-183": "pod",
        "gs.card-alias-201": "dmtt",
        "gs.card-alias-203": "aod",
        "gs.card-alias-214": "casdyne",
        "gs.card-alias-237": "phamster moni!!!",
        "gs.card-alias-239": "snowsign ssign",
        "gs.card-alias-254": "cpaps",
        "gs.card-alias-258": "bquiz",
        "gs.card-alias-262": "mmm",
        "gs.card-alias-265": "mr. generosity mr generosity",
        "gs.card-alias-267": "crystomb ctomb",
        "gs.card-alias-288": "groom",
        "gs.card-alias-296": "wormjar wormsjar jow",
        "gs.card-alias-299": "polibear",
        "gs.card-alias-315": "rg3",
        "gs.card-alias-316": "rg4",
        "gs.card-alias-318": "falvin",
        "gs.card-alias-414": "pmascot",
        "gs.card-alias-421": "astruck asstruck",
        "gs.card-alias-437": "shyagent sagent ralsei neo",
        "gs.card-alias-453": "cotg",
        "gs.card-alias-455": "phouse",
        "gs.card-alias-471": "cblaster",
        "gs.card-alias-490": "pod",
        "gs.card-alias-503": "libloox",
        "gs.card-alias-504": "blancer",
        "gs.card-alias-505": "skris",
        "gs.card-alias-508": "hoodsei hsei",
        "gs.card-alias-515": "hhathy",
        "gs.card-alias-520": "absart abs art",
        "gs.card-alias-531": "ttoriel",
        "gs.card-alias-532": "etdb",
        "gs.card-alias-533": "gertomb gtomb",
        "gs.card-alias-549": "copdyne",
        "gs.card-alias-552": "cow",
        "gs.card-alias-567": "blowbick",
        "gs.card-alias-573": "elimduck elim duck",
        "gs.card-alias-579": "bqueen",
        "gs.card-alias-581": "gmascot",
        "gs.card-alias-642": "pblook poliblook",
        "gs.card-alias-661": "cws cyber sign cybersign",
        "gs.card-alias-673": "bplush",
        "gs.card-alias-700": "vb",
        "gs.card-alias-707": "captn rouxl",
        "gs.card-alias-714": "cjester",
        "gs.card-alias-716": "rpaps",
        "gs.card-alias-717": "sneo",
        "gs.card-alias-726": "pkris",
        "gs.card-alias-734": "cwire",
        "gs.card-alias-742": "cg1",
        "gs.card-alias-743": "cg2",
        "gs.card-alias-754": "fheads",
        "gs.card-alias-756": "spamshop sshop",
        "gs.card-alias-758": "bneo",
        "gs.card-alias-760": "butsei",
        "gs.card-alias-761": "bstatue",
        "gs.card-alias-763": "cpanel",
        "gs.card-alias-767": "bdancer baldancer",
        "gs.card-alias-772": "jfs",
        "gs.card-alias-773": "shytomb stomb",
        "gs.card-alias-774": "dlancer dancer",
        "gs.card-alias-775": "galadino",
        "gs.card-alias-776": "tlights",
        "gs.card-alias-782": "talphys",
        "gs.card-alias-794": "gq",
        "gs.card-alias-815": "dalvdrobe",
        "gs.card-alias-828": "mommy",
        "gs.card-alias-838": "zmartlet",
        "gs.card-alias-848": "sansino csans",
        "gs.card-alias-853": "chutomb ctomb",
        "gs.card-alias-853": "duel",
        "gs.card-alias-869": "galadino",
        "gs.card-alias-878": "cero ketsukane",
        "gs.card-alias-883": "plancer",
        "gs.card-alias-884": "psusie",
        "gs.card-alias-885": "zkris",
        "gs.card-alias-888": "wcloak",
        "gs.card-alias-893": "fraudyne",
        "gs.card-alias-893": "tcatcher",
        "gs.card-alias-897": "tspawn titanspawn",
        "gs.card-alias-898": "tserpent",
        "gs.card-alias-902": "sguy",
        "gs.card-alias-903": "zsusie zusie",
        "gs.card-alias-904": "zralsei ralzei zootsei",
        "gs.card-alias-905": "lmower",
        "gs.card-alias-906": "planino planina pelnina pelnino",
        "gs.card-alias-907": "pelnina pelnino planino planina",
        "gs.card-alias-908": "rralsei rocksei",
        "gs.card-alias-909": "rkris",
        "gs.card-alias-912": "jstein jstien jackins your taking too long scairy",
        "gs.card-alias-913": "jstein jstien jackins your taking too long scairy",
        "gs.card-alias-914": "ctower cup tower",
        "gs.card-alias-915": "cposter",
        "gs.card-alias-917": "rposter",
        "gs.card-alias-919": "mposter",
        "gs.card-alias-920": "galadino",
        "gs.card-alias-922": "water cooler watercooler buble boobie",
        "gs.card-alias-923": "pkris",
        "gs.card-alias-926": "homophobia",
        "gs.card-alias-927": "gacha machine gpmachine gmachine",
        "gs.card-alias-929": "elnina elnino lanino lanina",
        "gs.card-alias-931": "tfuzzy",
        "gs.card-alias-932": "pvase",

        "gs.status-unknown": "Hmmm... there's a power here, but you can't exactly make it out.",
        "gs.status-unknown-stacked": "Hmmm...  there's a power here, but you can't exactly make it out.",
        "gs.tribe-unknown": "Hmmm... this monster has a tribe, but which one?",
        "gs.status-target": "This card has a target effect. It can target $1.",
        "gs.status-turn": "This card was played on turn $1. It has lived for $2 {{PLURAL:$2|turn|turns}}.",
        "gs.status-shiny": "This card is shiny.",
        "gs.status-dead": "This monster dead as hell.",
        "gs.status-legend": "This card's owner got {{DIVISION:T}} rank last season!",
        "gs.status-immune-to-madjick": "This card is imune to {{CARD:16|1}}.",
        "gs.status-smells-like-lemons": "This card smells like lemons.",
        "gs.status-totem": "This card is compatible with {{CARD:545|1}}.",
        "gs.status-prime": "This card's ID, $1, is a prime number! The more you know.",
        "gs.status-new": "This card is new! Wowie. I bet it's really cool.",
        "gs.status-check": "$1",
        "gs.status-kitty-cat": "This card is secretly possessed by a kitty! It will do something random when played or summoned from your hand.",
        "gs.status-mike-drop": "This card's a real showstopper! It ends your turn immediately when played or summoned from your hand.",
        "gs.status-brick": "This card cannot be played, due to the really heavy brick on it.",
        "gs.status-equation": "To be able to play this card, you must first solve a math equation.<br><button class=\"gsDialogButton\" onclick=\"mathtime('$1')\">Start problem</button>",
        "gs.status-stupor": "This monster can't attack. Or rather, you can't make it attack, because it's lazy...",
        "gs.status-bitflipped": "A random stat on this card is off by one. Do you know which?",
        "gs.status-sludge": "This card is covered in a thick layer of sludge. Gross.",
        "gs.status-loop-stacked": "This card can trigger its {{KW:LOOP}} effect an additional time.",
        "gs.status-program-stacked": "If you have an additional {{GOLD}}, spend it to trigger this effect.",
        "gs.status-turn-stacked": "This card was played an additional turn.",
        "gs.status-dodge-stacked": "This monster will negate an additional instance of {{DMG}} to itself.",
        "gs.status-thorns-stacked": "This monster will deal an additional {{DMG}} to the attacker.",
        "gs.status-ranged": "This monster is immune while attacking.",

        "gs.owned": "(Owned)",
        "gs.not-owned": "(Not owned)",
        "gs.collapsed": "(collapsed)",
        "gs.avatar": "{{PLURAL:$1|avatar|avatars}}",
        "gs.profile-skin": "{{PLURAL:$1|profile skin|profile skins}}",

        "gs.game-enemy": "Enemy",
        "gs.game-ally": "Your",
        "gs.game-bot": "(Bot)",
        "gs.game-going-first": "You go first.",
        "gs.game-going-second": "You go second.",

        "gs.game-intros": "$1 challenges you to a Dual!|Fighting $1!|$1 enters through a graceful misty fog...|$1 enters the scene!|$1 approaches!|$1 attacks!|$1 sniped you.|$1 wants to win! Are you just gonna let that happen?|C-could it be? It's the one and only $1...|...It's $1? Sorry, youre cooked.|$1 gracefully flops onto the battlefield like a fish.|A wild $1 appeared!|$1 glares at you. You hear boss music.|Well, you didn't expect $1 to be here.|Well, there is a $1 here. They might be happy to see you. What do you think?|> enters $5-less queue<br>> looks inside<br>> $5|Okay, so, a $1 walks into a bar|You are not fighting $1!|ITS FUCKING $6 RUN|My money's on $1. No pressure.|EPIC RAP BATTLES OF HISTORY:<br>$1<br>VERSUS!<br>$2|Fighting $2!<br>Wait, no...<br>...it's $1!|$1 calls an ambulance in advance.|$1, huh?|$1 emerges from the abyss!|Hey, it's $1!",
        "gs.game-intros-crystal": "$7 Free elo.",
        "gs.game-intros-dia": "$7 You're about to have a bad time.",
        "gs.game-intros-frogman": "$7 Pet the frog :D",
        "gs.game-intros-dware": "Beware the $1",
        "gs.game-intros-jaimee": "$7 rat",
        "gs.game-intros-gala": "$7 Wow, what a really cool and awesome opponent there!",
        "gs.game-intros-speednick": "Draw out your sword, $2,<br>and paint $7 me a beautiful fight!",

        "gs.alert-title-kitty": "Mrrp|Mrow|Meow|Nyaw|Mrrrrow|Prrrrrr|Mrorw|Mroooooow|Mew|Waoow|:3",
        "gs.alert-title-mike": "Truth nuke|Final act|That's all, folks|Yep, I went there|I'll see ya next time|Thank you all for coming|*cue applause*|Like and subscribe for part 2",
        "gs.alert-title-equation-win": "Mathematical|Aced it|A+|You're winner|Ready for colleg|Gold star|Calculated",
        "gs.alert-title-equation-fail": "Flunked|Dropout|F-|Didn't study|Dog ate it, probably|Slept through class|Yikes",
        "gs.alert-title-not-allowed": "Nope|Nuh uh|No you don't|Hey, stop that|Stop it|Don't",
        "gs.alert-title-import-complete": "Import complete!",
        "gs.alert-title-cosmetic-changed": "Change successful!",
        "gs.alert-title-error": "Error!|Uh oh|That was unexpected|Something happened",
        "gs.alert-title-bot": "Beep boop|Hello world|I'm real|Meow?",

        "gs.alert-mike": "$1's <i>Mike drop</i> ended your turn prematurely.",
        "gs.alert-kitty-foreign": "An evil $1 kitty changed your language!",
        "gs.alert-kitty-asleep": "This kitty is asleep...",
        "gs.alert-kitty-chat": "Kitty got out all the chats to play!",
        "gs.alert-kitty-emote": "Kitty found the emote control panel!",
        "gs.alert-kitty-fall": "A kitty fell off the counter ;(",
        "gs.alert-kitty-family": "This kitty wants you to meet her family!",
        "gs.alert-kitty-lights": "A kitty bapped the light switch.",
        "gs.alert-kitty-soulcolors": "A kitty messed with the color pallete.",
        "gs.alert-kitty-endturn": "A kitty ended your turn!",
        "gs.alert-kitty-shred": "A kitty shredded $1 to bits! You feel its remains flying into your wallet...",
        "gs.alert-kitty-clipboard": "A kitty got into your clipboard!",
        "gs.alert-kitty-dvd": "A kitty bapped the DVD player!",
        "gs.alert-kitty-surrender": "A kitty decided that that's enough Undercards for today.",
        "gs.alert-kitty-surrendernt": "A kitty surrendered... but it's not turn 5 yet!",
        "gs.alert-kitty-error": "Uh-oh! Kitty broke the space-time continuum and returned an error. Please report this to Gala!",
        "gs.alert-cant-surrender": "You can't surrender before turn 5.",
        "gs.alert-equation-win": "$1 can now be played!",
        "gs.alert-equation-not-your-turn": "You can't do equations right now, it's not your turn.",
        "gs.alert-equation-not-enemy-turn": "You can't do equations right now, it's not the enemy's turn.",
        "gs.alert-equation-fail-nopenalty": "You failed to free $1 from its mathematical aura...",
        "gs.alert-equation-fail-endturn": "Turn ended due to failing $1's math quiz!",
        "gs.alert-equation-fail-surrender": "Lost due to failing $1's math quiz!",
        "gs.alert-equation-fail-surrendernt": "Well, you would've lost due to failing $1's math quiz... but, I can't make you surrender before turn 5... so...",
        "gs.alert-import-complete": "Successfully overridden your settings to those of <i>$1</i>",
        "gs.alert-import-merged": "Successfully merged contents of <i>$1</i> into <i>$2</i>",
        "gs.alert-cosmetic-changed": "Your $1 has been changed to \"$2\".",
        "gs.alert-cosmetic-cant-change": "Your only favorited $1 is \"$2\", which you already have equipped.",
        "gs.alert-cosmetic-error": "There was a problem changing your $1.<br>$2",
        "gs.alert-lib-error": "There was a problem loading your $1.<br>$2",
        "gs.alert-facing-bot": "Your opponent is a bot!",

        "gs.math-title": "$1's Math Time|$1's Math Quiz|$1's Basics in Education and Learning|Mr. $1's Test",
        "gs.math-q-add": "What is $1 + $2?",
        "gs.math-q-subtract": "What is $1 - $2?",
        "gs.math-q-multiply": "What is $1 * $2?",
        "gs.math-q-divide": "What is $1 / $2?",
        "gs.math-q-dumb": "What is $1?|What is the meaning of life?|What|You turned off every operation... what did you expect?|Just guess|Type \"$1\"",

        "gs.dialog-translation-guide": "Translation Guide",
        "gs.dialog-next-page": "Next >",
        "gs.dialog-goto-page": "Flip to page...",
        "gs.dialog-prev-page": "< Prev",

        "gs.guide-page-name-1": "1 - Formatting and References",
        "gs.guide-page-1": `
        One of the basic tools that Undercards utilizes for its translations are these bits wrapped in curly braces:
        <pre>\{\{KW:MAGIC\}\}: Deal 2 \{\{DMG\}\}.</pre>
        These thingies are basically just special formatting instructions! <code>\{\{KW:MAGIC\}\}</code> tells UC to make some special underlined text that refers to the {{KW:MAGIC}} keyword. <code>\{\{DMG\}\}</code> simply tells UC to use the contents of the key <code>stat-dmg</code>, and make it yellow.
        Can my translation maker modify `,
        "gs.guide-page-name-2": "2 - Variables",
        "gs.guide-page-2": `
        Variables are used by some translation strings to provide additional information or context. Variables are denoted by a dollar sign, then a number.
        <pre>This card has a target effect. It can target $1.</pre>
        See that <code>$1</code>? It's used here in Galascript's <i>Target</i> power to be a stand-in for extra information the code sends, in this case, being... well, the target!
        <pre>What is $1 + $2?</pre>
        In this case, two variables are used. Variables don't really have "names" here; rather, they're just numbered.
        <br>
        Well then, these seem pretty useful, but... how do you, the average user, know what's inside a variable to properly utilize it?
        That's the neat part, you don't!
        Well, you can understand it if you poke around in the code. But, currently, little actual documentation goes into what variable means which for what translations...
        Don't get discouraged! You can ask me, I probably know :3`,

        "gs.dialog-import": "Yes, import",
        "gs.dialog-combine": "Combine with current",
        "gs.dialog-are-you-sure": "Are you sure?",
        "gs.dialog-import-settings": "Import Galascript settings",
        "gs.dialog-import-begin": "Import Galascript settings from a .gs file! You'll first be asked if you're sure about replacing your settings.",
        "gs.dialog-import-are-you-sure": "Are you sure you want to import <i>$1</i>?",
        "gs.dialog-import-override-all": "ALL settings will be overridden! If you'd like to keep them, go back and Export them.",
        "gs.dialog-import-override-some": "The following settings will be overridden:",
        "gs.dialog-import-override-one": "Just the <i>$1</i> setting will be overriden. If you'd like to keep its contents, Export them first, or press \"Combine with current\" to combine the two.",
        "gs.dialog-export-settings": "Export Galascript settings",
        "gs.dialog-export-begin": "Export your Galascript settings to send to other users or to save for later! Choose from one of the below presets to export.",
        "gs.dialog-export-all": "All settings",
        "gs.dialog-export-translations": "Custom translations",
    }, 'en');
}

function randi18n(key, ...args) {
    const list = $.i18n(key, ...args).split("|")
    return list.gs_random();
}

function initCustomTranslations() {
    const translations = Object.fromEntries(customTranslations.value());
    $.i18n().load(translations, $.i18n().locale);
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
            const introVars = [
                            player(), // $1: The enemy player
                            `${soulIcon(yourSoul)} ${soulColor(yourUser, yourSoul)}`, // $2: You!
                            soulColor(enemyUser), // $3: Enemy, no soul icon
                            soulColor(yourUser, yourSoul), // $4: You, no soul icon
                            player(enemyUser.toLowerCase()), // $5: The enemy player, lowercased
                            player(enemyUser.toUpperCase()), // $6: The enemy player, uppercased
                            soulIcon(), // $7 Enemy soul icon
                            soulIcon(yourSoul) // $8 Your soul icon
                        ]
            var introductions = $.i18n('gs.game-intros', ...introVars).split("|") ?? 'gs.game-intros';
            function funnyIntro() {
                switch (enemyUser) {
                    case "Crystal":                   return $.i18n('gs.game-intros-crystal', ...introVars);
                    case "Diamaincrah":               return $.i18n('gs.game-intros-dia', ...introVars);
                    case "frogman":                   return $.i18n('gs.game-intros-frogman', ...introVars);
                    case "Dware":                     return $.i18n('gs.game-intros-dware', ...introVars);
                    case "The Rat":                   return $.i18n('gs.game-intros-jaimee', ...introVars);
                    case "galadino":                  return $.i18n('gs.game-intros-gala', ...introVars);
                    case "speednick1972":             return $.i18n('gs.game-intros-speednick', ...introVars);
                }
                var result = introductions.gs_random();
                introductions.splice(introductions.indexOf(result), 1);
                return result;
            }
            var info = `${funnyIntro()}<br><br>
                        ${window.userTurn !== window.userId ? $.i18n('gs.game-going-first') : $.i18n('gs.game-going-second')}`;
            $('.bootstrap-dialog-message:has(.mulligan) > p').html(info)
        }
    });
}

function staticStyles() {
    style('static', 'add',
    `.cardFauxElement, .cardObject {display: none;}
    .cardImage > img {visibility: hidden;}
    .cardName div[style*="font-size: 7px;"] {white-space: nowrap;}
    #gsFlashlight {position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; pointer-events: none; z-index: 101; image-rendering: pixelated;}
    #gsDVD {position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; pointer-events: none; z-index: 100;}
    #gsDVD img {position: fixed;}
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
    #gsCredits h4 {font-size: 22px; font-weight: bold; text-align: center;}
    #gsCredits h5 {font-size: 18px; font-weight: bold; }
    #gsCredits h6 {font-weight: bold; text-align: center; color: grey}
    #gsCredits .coolguy {float: right; color: thistle;}
    *[id^="underscript\\.plugin\\.Galascript"][id$="Chance"] {width: 32px;}
    .setting-advancedMap_text_text:has(#underscript\\.plugin\\.Galascript\\.customTranslations) {width: 350px; border-bottom: none !important;}
    .setting-advancedMap_text_text:has(#underscript\\.plugin\\.Galascript\\.customTranslations) input {width: 40%; align-self: stretch; text-wrap: auto; text-align: center; background-repeat: no-repeat; background-size: cover; background-position: center;}
    .setting-advancedMap_text_text:has(#underscript\\.plugin\\.Galascript\\.customTranslations) textarea {min-height: 40px; height: 40px; width: 40%; resize: vertical; text-align: center; font-size: 12px; scrollbar-width: thin; scrollbar-color: white black}
    .card.full-skin.breaking-skin .cardImage {background-size: auto !important; background-position: center !important}
    .gsTransHelperOption {display: block; border: none; padding: 0px 5px; width: 90%; text-align: left; transition: none;}
    .gsTransHelperOption:not([class*="SwitchHighlight"]) { background-color: black; }
    p.gsTransHelperOption {color: thistle; margin: unset;}
    p.gsTransHelperOption ~ input.gsTransHelperOption {margin: 0px 12px;}
    input.gsTransHelperOption:hover {padding: 0px 0px 0px 10px;}
    #gsPowerFilterRow img {width: 24px;}
    :not(#dustpile) .playLocked:not(.doingEffect):not(.affected):not(.target):not(.cardOwned):not(.cardNotOwned) > *:not(.cardStatus) {filter: grayscale(100%) brightness(50%) sepia(0%) hue-rotate(0deg) saturate(100%) contrast(1);}
    :not(#dustpile) .playLocked:not(.doingEffect):not(.affected):not(.target):not(.cardOwned):not(.cardNotOwned) > .cardStatus > *:not([power="brick"]):not([power="equation"]) {filter: grayscale(100%) brightness(50%) sepia(0%) hue-rotate(0deg) saturate(100%) contrast(1);}
    :not(#dustpile) .playLocked:not(.doingEffect):not(.affected):not(.target):not(.cardOwned):not(.cardNotOwned) .cardBackground {box-shadow: none;}
    .cardStatus:has(.showdownStatus) { height: auto; width: 155px; top: 40px; left: 10px; line-height: 12px; display: flex; flex-direction: row-reverse; flex-wrap: wrap; justify-content: right; }
    .showdownStatus { padding: 0px 1px; border-radius: 3px; text-shadow: none; font-size: 7pt; border: 1px solid #FF4400; max-height: none; max-width: none; position: relative; margin: 0 1px;}
    .brn, .psn, .par, .slp, .frz, .stu { padding: 1px 2px; border: 0; color: #FFF;}
    .negative { border-color: #FF4400; background: #FFE5E0; color: #FF4400;}
    .positive { border-color: #33AA00; background: #E5FFE0; color: #33AA00;}
    .neutral { border-color: #555555; background: #F0F0F0; color: #555555;}
    .brn { background: #EE5533; }
    .psn { background: #A4009A; }
    .par { background: #9AA400; }
    .slp { background: #AA77AA; }
    .frz { background: #009AA4; }
    .stu { background: #FFF; color: #AA77AA;}
    .gsDialogButton {background-color: black; margin-bottom: 5px 0px}
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteAvatars),
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteProfiles),
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.possibleKitties) {width: 350px; border-bottom: none !important;}
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteAvatars) input,
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteProfiles) input,
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.possibleKitties) input {display: none;}
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteAvatars) .item,
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteProfiles) .item,
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.possibleKitties) .item {visibility: hidden}
    fieldset:not(:has(.gsCollapsable.collapsed)) .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteAvatars) :is(button, select, .warning),
    fieldset:not(:has(.gsCollapsable.collapsed)) .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteProfiles) :is(button, select, .warning),
    fieldset:not(:has(.gsCollapsable.collapsed)) .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.possibleKitties) :is(button, select, .warning) {visibility: visible}
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteAvatars) select,
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.favoriteProfiles) select,
    .setting-advancedMap_select_text:has(#underscript\\.plugin\\.Galascript\\.possibleKitties) select {height: 40px; width: 85%; margin-right: -6px;}
    .gsCollapsable {cursor: pointer; user-select: none;}
    .gsCollapsable.collapsed {line-height: 10px; width: 100%; transform: translateY(12px)}
    fieldset:has(.gsCollapsable.collapsed) {border: none; border-left: 3px solid silver;}
    fieldset:has(.gsCollapsable.collapsed) div {height: 0px; visibility: hidden; padding: 0px; pointer-events: none;}
    fieldset:has(.gsCollapsable.collapsed) {opacity: 0.3}
    fieldset:has(.gsCollapsable.collapsed) legend::after {content: " ${$.i18n('gs.collapsed')}"; font-size: 12px;}
    `)
}

const leGrandeObserver = new MutationObserver((mutations, obs) => {
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
            var emoteSrc;
            if (value == 0) {
                emoteSrc = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/genericFail.png'
            } else {
                emoteSrc = `/images/emotes/${window.chatEmotes.find(emote => emote.id === Number(value)).image}.png`
            }
            el.style.setProperty('background-image', `url('${emoteSrc}')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-repeat', 'no-repeat');
            el.style.setProperty('background-position', '85%');
            el.style.setProperty('background-size', '32px');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onfocus = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('[id^="underscript.plugin.Galascript.customTranslations."]:not([id$="value"])').forEach(el => { // dynamic backgrounds for custom translation setting
        function updateBackground (value) {
            el.style.setProperty('background', 'no-repeat');
            if (value.startsWith("card-") || value.startsWith("gs.card-")) {
                const card = window.getCard(Number(value.replace(/\D/g,'')))
                const image = card?.baseImage ?? "Blank"
                el.style.setProperty('background-image', `url('/images/cards/${image}.png')`);
                el.style.setProperty('background-size', '100%');
                el.style.setProperty('background-position-y', 'bottom');

            } else if (value.startsWith("artifact-")) {
                const artifactImg = allArtifacts.find(art => art.id === Number(value.replace(/\D/g,'')))?.image
                el.style.setProperty('background-image', `url('/images/artifacts/${artifactImg}.png')`);
                el.style.setProperty('background-size', '42%');
                el.style.setProperty('background-position', 'center');

            } else if (value.startsWith("status-") || value.startsWith("gs.status-")) {
                var git = value.startsWith("gs.") && $.i18n(value.replace("gs.", "").replace("-stacked", "")).includes("status-")
                const stacked = value.includes("-stacked")
                const camelCaseBitch = value.replace(/-([a-z])/g, function(match, char) {
                    return '-' + char.toUpperCase();
                });
                const statusImageBitch = camelCaseBitch.replace("gs.", "").replace("status-", "").replace("-Stacked", "").replaceAll("-", "")
                var statusImg = statusImageBitch.charAt(0).toLowerCase() + statusImageBitch.slice(1)

                function cap(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                }
                if (statusImg.includes("Debuff")) {
                    statusImg = "malus" + cap(statusImg.replace("Debuff", ""))
                }
                if (statusImg.includes("Buff")) {
                    statusImg = "bonus" + cap(statusImg.replace("Buff", ""))
                }
                switch (statusImg) {
                    case "caught": statusImg = "box"; break;
                    case "thorns": git = true; break;
                    case "anotherChance": git = true; break;
                    case "ranged": git = false; break;
                }
                var url;
                switch (powerSkins?.value()) {
                    case 'match frame':
                        if (frameSpoof?.value() === 'Balatro') {
                            url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/balatro-${statusImg}.png`;
                        } else {
                            url = git ? `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${statusImg}.png` : `images/powers/${statusImg}.png`;
                        }
                        break;
                    case 'Ancient':
                        url =
                        ['bonus', 'malus', 'disarmed'].includes(statusImg) ?
                            `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/ancient-${statusImg}.png`
                        :
                        git ?
                            `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${statusImg}.png`
                        :
                            `images/powers/${statusImg}.png`;
                        break;
                    case 'Neon':
                        url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/neon-${statusImg}.png`;
                        break;
                    case 'Balatro':
                        url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/balatro-${statusImg}.png`;
                        break;
                    default:
                        url = git ? `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${statusImg}.png` : `images/powers/${statusImg}.png`;
                }
                el.style.setProperty('image-rendering', 'pixelated');
                el.style.setProperty('background-image', `url('${url}')`);
                el.style.setProperty('background-size', '42%');
                if (statusImg.includes("brick")) {
                    el.style.setProperty('background-size', '84%')
                }
                el.style.setProperty('background-position', '50% 50%');
                if (stacked) {
                    el.style.setProperty('background-repeat', 'repeat-x')
                }

            } else if (value.startsWith("tribe-")) {
                const tribe = value.replace("tribe-", "").toUpperCase()
                el.style.setProperty('image-rendering', 'pixelated');
                el.style.setProperty('background-image', `url('/images/tribes/${tribe}.png')`);
                el.style.setProperty('background-size', '52%');
                el.style.setProperty('background-position', '50% 50%');
            } else if (value.startsWith("rarity-")) {
                var rarity = value.replace("rarity-", "");
                var rarityImg;
                switch (raritySkins?.value()) {
                    case 'off': rarityImg = `images/rarity/BASE_${rarity.toUpperCase()}.png`; break;
                    case 'match frame': rarityImg = `images/rarity/BASE_${rarity.toUpperCase()}.png`; break;
                    case 'Hollow Knight': rarityImg = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/hk-${rarity}.png`; break;
                    case 'FNAFB': rarityImg = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/fnafb-ut-${rarity}.png`; break;
                    case 'Celeste': rarityImg = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/celeste-ut-${rarity}.png`; break;
                    case 'Balatro': rarityImg = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/balatro-${rarity}.png`; break;
                    case 'OvenBreak': rarityImg = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/ovenbreak-${rarity}.png`; break;
                    case 'OvenBreak (Alt)': rarityImg = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/ovenbreak-alt-${rarity}.png`; break;
                }
                el.style.setProperty('image-rendering', 'pixelated');
                el.style.setProperty('background-image', `url('${rarityImg}')`);
                el.style.setProperty('background-size', '52%');
                el.style.setProperty('background-position', '50% 50%');
            } else if (value.startsWith("kw-")) {
                el.style.setProperty('background-image', `url('/images/cards/Blank.png')`)
            } else if (value.startsWith("gs.")) {
                el.style.setProperty('image-rendering', 'pixelated');
                el.style.setProperty('background-image', `url('https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/iconVirgil.png')`)
                el.style.setProperty('background-size', '52%');
                el.style.setProperty('background-position', '50% 50%');
            } else if (value.length) {
                el.style.setProperty('background-image', `url('https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/missing.png')`)
                el.style.setProperty('image-rendering', 'pixelated');
                el.style.setProperty('background-repeat', 'repeat');
                el.style.setProperty('background-size', '42%');
                el.style.setProperty('background-position', 'center');
            }
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onfocus = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('select[id^="underscript.plugin.Galascript.favoriteAvatars."]').forEach(el => { // dynamic backgrounds for avatars
        function updateBackground (value) {
            var avatarSrc;
            if (value == 0) {
                avatarSrc = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/genericFail.png'
            } else {
                avatarSrc = yourAvatars.find(avatar => avatar.id == value).src
            }
            el.style.setProperty('background-image', `url('${avatarSrc}')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-repeat', 'no-repeat');
            el.style.setProperty('background-position', '85%');
            el.style.setProperty('background-size', '64px');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onfocus = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('select[id^="underscript.plugin.Galascript.favoriteProfiles."]').forEach(el => { // dynamic backgrounds for avatars
        function updateBackground (value) {
            var profileSrc;
            if (value == 0) {
               profileSrc = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/genericFail.png'
            } else {
               profileSrc = yourProfiles.find(profile => profile.id == value).src
            }
            el.style.setProperty('background-image', `url('${profileSrc}')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-repeat', 'no-repeat');
            el.style.setProperty('background-position', 'center');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onfocus = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('.card.playLocked').forEach(el => { // restricting what you can play for action powers
        if (el.classList.contains('canPlay')) {
            el.classList.remove('canPlay');
            el.classList.add('cantPlay');
        }
    });
    document.querySelectorAll('td .card.attackLocked').forEach(el => { // make it so ally monsters cannot attack
        if (el.classList.contains('canPlay')) {
            el.classList.remove('canPlay');
            el.classList.add('cantPlay');
        }
    });
    document.querySelectorAll('.card.cantPlay').forEach(el => { // unlock
        if (!el.classList.contains('playLocked') && !el.classList.contains('attackLocked')) {
            el.classList.remove('cantPlay');
            if (window.userTurn === window.userId) {
                el.classList.add('canPlay');
            }
        }
    });
    document.querySelectorAll('[id="underscript.plugin.Galascript.frameSpoof"]').forEach(el => { // dynamic backgrounds for frame skins option
        function updateBackground (value) {
            var underscored = value.toString().replace(/\s+/g, '_');
            var dashed = value.toString().replace(/\s+/g, '-');
            var url;
            el.style.setProperty('background-position', '85% -2%');
            if (standardFrames.includes(value)) {
                url = `images/frameSkins/${underscored}/frame_monster.png`
            } else if (value === "Waterfall") {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/waterfall-frame.png`
            } else if (value === "Yet Darker") {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/yet-darker-frame.png`
            } else if (value === "Pokecard 1996") {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/pokecard-1996-frame-common.png`
            } else if (value === "Slay the Spire") {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/slay-the-spire-frame-monster-common.png`
            } else if (value === "brat") {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/brat-frame.png`
                el.style.setProperty('background-position', '85% 50%');
            } else {
                url = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/${dashed.toLowerCase()}-frame-monster.png`
            }
            el.style.setProperty('background-image', `url('${url}')`);
            el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
            el.style.setProperty('background-repeat', 'no-repeat');
            el.style.setProperty('background-size', '64px');
            el.style.setProperty('background-blend-mode', 'darken');
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onfocus = e => {
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
                case "Celeste": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/celeste-ut-determination.png'; break;
                case "Balatro": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/balatro-determination.png'; break;
                case "OvenBreak": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/ovenbreak-determination.png'; break;
                case "OvenBreak (Alt)": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/ovenbreak-alt-determination.png'; break;
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
        el.onfocus = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('[id="underscript.plugin.Galascript.powerSkins"]').forEach(el => { // dynamic backgrounds for rarity skins option
        function updateBackground (value) {
            var url;
            el.removeAttribute('style');
            for (const child of el.children) {
                child.style.setProperty('color', 'white');
            }
            if (value !== 'Showdown') {
                switch (value) {
                    case "off": url = 'images/powers/bonusAtk.png'; break;
                    case "match frame": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/power-match.gif'; break;
                    case "Ancient": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/ancient-bonusAtk.png'; break;
                    case "Neon": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/neon-bonusAtk.png'; break;
                    case "Balatro": url = 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/balatro-bonusAtk.png'; break;
                }
                el.style.setProperty('background-image', `url('${url}')`);
                el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.4)', 'important');
                el.style.setProperty('background-repeat', 'no-repeat');
                el.style.setProperty('background-position', '85%');
                el.style.setProperty('background-size', '32px');
                el.style.setProperty('background-blend-mode', 'darken');
            } else {
                el.style.setProperty('border', '1px solid #33AA00');
                el.style.setProperty('color', '#33AA00');
                el.style.setProperty('border-radius', '6px');
                el.style.setProperty('background', '#E5FFE0', 'important');
            }
        };
        el.oninput = e => {
            updateBackground(e.target.value);
        }
        el.onfocus = e => {
            updateBackground(e.target.value);
        }
        if (!el.dataset.gsSettingBgLoaded) {
            el.dataset.gsSettingBgLoaded = 'true';
            updateBackground(el.value);
        }
    });
    document.querySelectorAll('.card.balatro-frame').forEach(el => { // balatro frame hover animation
        function transforms(x, y, el) {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = (x - centerX) / rect.width;
            const dy = (y - centerY) / rect.height;

            const maxTilt = 40;
            const rotateX = -dy * maxTilt;
            const rotateY = dx * maxTilt;

            return `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        function cardHover(e) {
            const el = e.currentTarget;
            const transform = transforms(e.clientX, e.clientY, el);
            el.style.transform = transform;
        }

        if (!el.dataset.gsRandomDelay) {
            const delay = Math.random() * 6;
            el.dataset.gsRandomDelay = delay * -1;
            $(el).on('mousemove', function(e) {
                el.style.transform = '';
                if (!e.currentTarget.matches('.cardSkin:hover:not(.owned)')) {
                    cardHover(e);
                }
            })
            $(el).on('mouseleave', function(e) {
                el.style.transform = '';
            })
        }
    });
    document.querySelectorAll('.tabContent legend').forEach(el => { // collapsible categories
        const categoryName = `${$(el).parent().parent().parent().prev('.tabLabel').text().toLowerCase().replace(/[^a-zA-Z0-9]/g, "")}.${el.innerText.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")}`
        function updateCollapse() {
            if (collapsedCategories.value().includes(categoryName)) {
                el.classList.add('collapsed');
            } else {
                el.classList.remove('collapsed');
            }
        }
        function toggleCollapse() {
            if (collapsedCategories.value().includes(categoryName)) {
                collapsedCategories.set(collapsedCategories.value().filter(categ => { return categ !== categoryName}))
            } else {
                collapsedCategories.set(collapsedCategories.value().concat([categoryName]))
            }
        }
        if (!el.classList.contains('gsCollapsable')) {
            el.classList.add('gsCollapsable');
            updateCollapse();
            el.onclick = e => {
                toggleCollapse();
                updateCollapse();
            }
        }
    });
});

leGrandeObserver.observe(document.body, { childList: true, subtree: true });

function obscActive(card) {
    if (sludgeEnabled?.value()) {
        if (gameData.sludge.includes(card?.id)) {
            return 1;
        } else {
            return 0;
        }
    }
    switch (obscApply?.value()) {
        case 'nowhere': return 0;
        case 'ingame only': return window.gameId ? 1 : 0;
        case 'everywhere!!!': return 1;
    }
}

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
function obscure(element, type, firstLoad) {
    style(`${element}Obscurity`, 'remove')
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
            style(`${element}Obscurity`, 'replace', `.${element}.gsObscured {filter: blur(${obscBlurStrength.value()}px)}`)
            break;
        case 'hide':
            style(`${element}Obscurity`, 'replace', `.${element}.gsObscured {visibility: hidden}`)
            break;
        case 'hide, use spell frame':
            style(`${element}Obscurity`, 'replace', `.${element}.gsObscured {visibility: hidden}`)
            standardFrames.forEach(f => {
                const fclass = f.toString().replace(/\s+/g, '-').toLowerCase();
                const fimage = f.toString().replace(/\s+/g, '_');
                style(`${fclass}UseSpellGraphic`, 'add', `.${fclass}-frame.monster.gsObscured .cardFrame {background-image: url("/images/frameSkins/${fimage}/frame_spell.png");}`)
            });
            customFrames.forEach(f => {
                f = f.toString().replace(/\s+/g, '-').toLowerCase();
                if (f !== 'pokecard-1996') {
                    style(`${f}UseSpellGraphic`, 'add', `.${f}-frame.monster.gsObscured .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/${f}-frame-spell.png");}`)
                }
            });
            break;
    }
    if (!firstLoad) {
        refreshCards();
    }
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
function monochromeCopiesToggle(val) {
    style('monochromeCopies', val ? 'add' : 'remove', '.card:has([power="created"]) .cardImage {filter: grayscale(1);}')
}
function frameStyles() {
    style('static', 'add', `
    .cardSilence {background: transparent url("images/cardAssets/silence.png") no-repeat; visibility: hidden;}
    @keyframes float { 0% { transform: translatey(-4px); } 50% { transform: translatey(2px); } 100% { transform: translatey(-4px); } }
    @keyframes sway {
        0%   { transform: rotateX(0deg) rotateY(0deg) rotateZ(-1deg) translateZ(0px); }
        25%  { transform: rotateX(3deg) rotateY(-2deg) rotateZ(0deg) translateZ(2px); }
        50%  { transform: rotateX(-3deg) rotateY(1deg) rotateZ(1deg) translateZ(-1px); }
        75%  { transform: rotateX(1deg) rotateY(-1deg) rotateZ(0deg) translateZ(3px); }
        100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(-1deg) translateZ(0px); }
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
    .cold-place-frame .cardRarity {top: 222px; left: 82px; height: 16px; background-size: contain !important}
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
    .slay-the-spire-frame .cardImage {background-color: black !important; background-position: center !important;}
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
    .balatro-frame { height: 236px !important; text-shadow: 0 0 black !important; }
    .balatro-frame:not(:hover) { animation: 6s ease-in-out attr(data-gs-random-delay s) infinite normal both running sway; }
    .balatro-frame:hover { z-index: 10; }
    .balatro-frame .shinySlot {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-shiny.png"); opacity: 0.3; mix-blend-mode: hard-light;}
    .balatro-frame .shinySlot.animated {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-shiny-animated.gif"); opacity: 0.3; mix-blend-mode: hard-light;}
    .balatro-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-spell.png");}
    .balatro-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-monster.png");}
    .balatro-frame .cardHeader, .balatro-frame .cardFooter {background-color: rgba(0, 0, 0, 0);}
    .balatro-frame .cardFrame {background-size: 100%; image-rendering: pixelated;}
    .balatro-frame.monster .cardName, .balatro-frame .cardDesc {visibility: hidden}
    .balatro-frame.spell .cardName {top: 204px; text-align: center !important; left: 28px; transform: scaleX(0.99) scaleY(1.2); width: 120px; text-transform: uppercase; color: #4F6367 !important;}
    .balatro-frame.spell .cardCost {top: 5px; text-align: center !important; left: 28px; transform: scaleX(1.1) scaleY(0.6); width: 120px; text-transform: uppercase; color: #4F6367 !important;}
    .balatro-frame .cardBackground {visibility: hidden}
    .balatro-frame .cardImage {background-color: black !important; background-position: center !important;}
    .balatro-frame .cardStatus {left: 35px; top: 15px; transform: rotate(-90deg) scale(2); image-rendering: pixelated;}
    .balatro-frame.spell .cardStatus {left: 40px}
    .balatro-frame .cardStatus > img {transform: rotate(90deg)}
    .balatro-frame .cardStatus > span {transform: rotate(90deg) translateY(6px)}
    .balatro-frame .cardTribes {visibility: hidden}
    .balatro-frame.monster.standard-skin .cardImage {top: 5px; left: 5px; width: 165px; height: 225px; background-size: cover !important; image-rendering: pixelated;}
    .balatro-frame.spell.standard-skin .cardImage {top: 5px; left: 20px; width: 136px; height: 225px; background-size: cover !important; image-rendering: pixelated; background-color: #DAB772 !important; background-blend-mode: luminosity;}
    .balatro-frame.breaking-skin .cardImage, .balatro-frame.full-skin .cardImage {top: 5px; left: 5px; width: 165px; height: 225px; background-size: 132% !important; background-position-y: 50% !important; z-index: 0 !important}
    .balatro-frame.spell.breaking-skin .cardImage, .balatro-frame.spell.full-skin .cardImage {left: 20px; width: 140px; background-size: 140% !important; background-position-y: 70% !important; background-color: #DAB772 !important; background-blend-mode: luminosity;}
    .balatro-frame.spell .cardRarity {visibility: hidden;}
    .balatro-frame.monster .cardRarity {top: 30px; left: 140px;}
    .balatro-frame.monster .cardCost {top: 10px; left: 132px;}
    .balatro-frame.monster[data-rarity="TOKEN"] .cardCost {color: #6abe30}
    .balatro-frame.monster[data-rarity="BASE"] .cardCost {color: #4b5e62}
    .balatro-frame.monster[data-rarity="COMMON"] .cardCost {color: #bfc7d5}
    .balatro-frame.monster[data-rarity="RARE"] .cardCost {color: #0099f8}
    .balatro-frame.monster[data-rarity="EPIC"] .cardCost {color: #cd6cd9}
    .balatro-frame.monster[data-rarity="LEGENDARY"] .cardCost {color: #fca100}
    .balatro-frame.monster[data-rarity="DETERMINATION"] .cardCost {color: #f5392d}
    .balatro-frame .cardATK, .balatro-frame .cardHP {top: 202px; border-radius: 4px; width: 30px;}
    .balatro-frame .cardATK {left: 53px; background-color: #fd5f55;}
    .balatro-frame .cardHP {left: 93px; background-color: #009cfd;}
    .balatro-frame .currentATK {color: white}
    .balatro-frame .currentHP {color: white}
    .balatro-frame .cardQuantity, .balatro-frame .cardUCPCost {top: 230px;}
    .balatro-frame .cardSilence {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/balatro-frame-silenced.png"); background-repeat: no-repeat; background-position: center; background-size: contain; width: 176px; height: 236px; top: -0.5px; left: 0px; z-index: 7; opacity: 0.5; image-rendering: pixelated;}

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

    .snails-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .snails-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .snails-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/snails-frame-spell.png");}
    .snails-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/snails-frame-monster.png");}
    .snails-frame .cardName, .snails-frame .cardCost {top: 9px;}
    .snails-frame .cardDesc, .snails-frame .cardSilence {top: 129px;}
    .snails-frame .cardATK, .snails-frame .cardHP, .snails-frame .cardRarity {top: 213px;}
    .snails-frame .cardQuantity, .snails-frame .cardUCPCost {top: 240px;}

    .waterfall-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .waterfall-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .waterfall-frame .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/waterfall-frame.png");}
    .waterfall-frame .cardName, .waterfall-frame .cardCost {top: 9px;}
    .waterfall-frame .cardDesc, .waterfall-frame .cardSilence {top: 129px;}
    .waterfall-frame .cardATK, .waterfall-frame .cardHP, .waterfall-frame .cardRarity {top: 213px;}
    .waterfall-frame .cardQuantity, .waterfall-frame .cardUCPCost {top: 240px;}

    .yet-darker-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .yet-darker-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .yet-darker-frame .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/yet-darker-frame.png");}
    .yet-darker-frame .cardName, .yet-darker-frame .cardCost {top: 9px;}
    .yet-darker-frame .cardDesc, .yet-darker-frame .cardSilence {top: 129px;}
    .yet-darker-frame .cardATK, .yet-darker-frame .cardHP, .yet-darker-frame .cardRarity {top: 213px;}
    .yet-darker-frame .cardQuantity, .yet-darker-frame .cardUCPCost {top: 240px;}

    .bone-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .bone-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .bone-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/bone-frame-spell.png");}
    .bone-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/bone-frame-monster.png");}
    .bone-frame .cardName, .bone-frame .cardCost {top: 9px;}
    .bone-frame .cardDesc, .bone-frame .cardSilence {top: 129px;}
    .bone-frame .cardATK, .bone-frame .cardHP, .bone-frame .cardRarity {top: 213px;}
    .bone-frame .cardQuantity, .bone-frame .cardUCPCost {top: 240px;}

    .furry-sans-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .furry-sans-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .furry-sans-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/furry-sans-frame-spell.png");}
    .furry-sans-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/furry-sans-frame-monster.png");}
    .furry-sans-frame .cardName, .furry-sans-frame .cardCost {top: 9px;}
    .furry-sans-frame .cardDesc, .furry-sans-frame .cardSilence {top: 129px;}
    .furry-sans-frame .cardATK, .furry-sans-frame .cardHP, .furry-sans-frame .cardRarity {top: 213px;}
    .furry-sans-frame .cardQuantity, .furry-sans-frame .cardUCPCost {top: 240px;}

    .ovenbreak-frame .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .ovenbreak-frame .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .ovenbreak-frame.spell .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/ovenbreak-frame-spell.png");}
    .ovenbreak-frame.monster .cardFrame {background-image: url("https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/frames/ovenbreak-frame-monster.png");}
    .ovenbreak-frame .cardName, .ovenbreak-frame .cardCost {top: 9px;}
    .ovenbreak-frame .cardDesc, .ovenbreak-frame .cardSilence {top: 129px;}
    .ovenbreak-frame .cardATK, .ovenbreak-frame .cardHP, .ovenbreak-frame .cardRarity {top: 213px;}
    .ovenbreak-frame .cardQuantity, .ovenbreak-frame .cardUCPCost {top: 240px;}

    .respective-frame[data-extension="BASE"] .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .respective-frame[data-extension="BASE"] .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .respective-frame[data-extension="DELTARUNE"] .shinySlot {background-image: url("/images/frameSkins/Deltarune/frame_shiny.png");}
    .respective-frame[data-extension="DELTARUNE"] .shinySlot.animated {background-image: url("/images/frameSkins/Deltarune/frame_shiny_animated.png");}
    .respective-frame[data-extension="UTY"] .shinySlot {background-image: url("/images/frameSkins/Undertale/frame_shiny.png");}
    .respective-frame[data-extension="UTY"] .shinySlot.animated {background-image: url("/images/frameSkins/Undertale/frame_shiny_animated.png");}
    .respective-frame.spell[data-extension="BASE"] .cardFrame {background-image: url("/images/frameSkins/Undertale/frame_spell.png");}
    .respective-frame.monster[data-extension="BASE"] .cardFrame {background-image: url("/images/frameSkins/Undertale/frame_monster.png");}
    .respective-frame.spell[data-extension="DELTARUNE"] .cardFrame {background-image: url("/images/frameSkins/Deltarune/frame_spell.png");}
    .respective-frame.monster[data-extension="DELTARUNE"] .cardFrame {background-image: url("/images/frameSkins/Deltarune/frame_monster.png");}
    .respective-frame.spell[data-extension="UTY"] .cardFrame {background-image: url("/images/frameSkins/Undertale/frame_spell.png");}
    .respective-frame.monster[data-extension="UTY"] .cardFrame {background-image: url("/images/frameSkins/Undertale/frame_monster.png");}
    .respective-frame .cardName, .respective-frame .cardCost {top: 9px;}
    .respective-frame .cardDesc, .respective-frame .cardSilence {top: 129px;}
    .respective-frame .cardATK, .respective-frame .cardHP, .respective-frame .cardRarity {top: 213px;}
    .respective-frame .cardQuantity, .respective-frame .cardUCPCost {top: 240px;}

    .showdown-frame {font-family: Verdana, sans-serif;}
    .showdown-frame .shinySlot {background-image: url("");}
    .showdown-frame .shinySlot.animated {background-image: url("");}
    .showdown-frame.spell .cardFrame {background-image: url("");}
    .showdown-frame.monster .cardFrame {background-image: url("");}
    .showdown-frame .cardName {top: 9px; width: 180px; left: 0px; font-weight: bold; text-align: center !important; color: #222222; text-shadow: #FFFFFF 1px 1px 0, #FFFFFF 1px -1px 0, #FFFFFF -1px 1px 0, #FFFFFF -1px -1px 0;}
    .showdown-frame .cardHealthbar {position: relative; top: 29px; width: 180px; border: 1px solid #777777; border-radius: 4px;}
    .showdown-frame .cardBackground, .showdown-frame .cardHeader, .showdown-frame .cardFooter {background: none;}
    .showdown-frame .cardImageShowdown {height: 170px; top: 30px; width: 300px; margin: 0; padding: 0; position: absolute; left: -60px; z-index: 1; background-repeat: no-repeat; background-position: bottom; pointer-events: none;}
    .showdown-frame .cardStatus:has(.showdownStatus) {top: 44px; display: flex; justify-content: left;}
    .showdown-frame .cardStatus:not(:has(.showdownStatus)) {top: 44px; transform: rotate(180deg); left: 12px;}
    .showdown-frame .cardStatus:not(:has(.showdownStatus)) > * {transform: rotate(180deg);}
    .showdown-frame .cardCost, .showdown-frame .cardDesc, .showdown-frame .cardSilence {display: none;}
    .showdown-frame .cardATK, .showdown-frame .cardHP, .showdown-frame .cardRarity {top: 213px;}
    .showdown-frame .cardQuantity, .showdown-frame .cardUCPCost {top: 240px;}

    .brat-frame {font-family: "Arial Narrow", Arial, sans-serif; text-transform: lowercase; text-shadow: 0 0 black !important;}
    .brat-frame .cardBackground {background-color: #8ACE00; height: 160px;}
    .brat-frame .cardName { filter: blur(0.5px); top: 8px; left: 48px; text-align: center !important; width: 80px; height: 80px; display: flex; justify-content: center; align-items: center; transform: scale(2); transform-origin: top;}
    .brat-frame .cardName div {font-size: 20px !important;}
    .brat-frame {
        * {color: black;}
        .cardDesc, .cardATK, .cardHP, .cardCost, .cardRarity, .cardImage, .cardTribes, .cardStatus {visibility: hidden;}
    }
    .brat-frame :not(.cardBackground) {background: none !important;}
    .brat-frame .cardQuantity, .brat-frame .cardUCPCost {top: 160px;}
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
                .mirror-temple-frame[data-rarity="${r}"][data-extension="BASE"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/celeste-ut-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .mirror-temple-frame[data-rarity="${r}"][data-extension="DELTARUNE"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/celeste-dr-${r.toLowerCase()}.png) no-repeat transparent !important; transform: scale(2) translateY(-1px); image-rendering: pixelated;}
                .mirror-temple-frame[data-rarity="${r}"][data-extension="UTY"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/celeste-ut-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .balatro-frame[data-rarity="${r}"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/balatro-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .ovenbreak-frame[data-rarity="${r}"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/ovenbreak-${r.toLowerCase()}.png) no-repeat transparent !important;}
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
            case "Celeste":
                style('rarityStyle', 'add', `
                .card[data-rarity="${r}"][data-extension="BASE"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/celeste-ut-${r.toLowerCase()}.png) no-repeat transparent !important;}
                .card[data-rarity="${r}"][data-extension="DELTARUNE"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/celeste-dr-${r.toLowerCase()}.png) no-repeat transparent !important; transform: scale(2) translateY(-1px); image-rendering: pixelated;}
                .card[data-rarity="${r}"][data-extension="UTY"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/celeste-ut-${r.toLowerCase()}.png) no-repeat transparent !important;}
                `);
                break;
            case "Balatro":
                style('rarityStyle', 'add', `
                .card[data-rarity="${r}"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/balatro-${r.toLowerCase()}.png) no-repeat transparent !important;}
                `);
                break;
            case "OvenBreak":
                style('rarityStyle', 'add', `
                .card[data-rarity="${r}"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/ovenbreak-${r.toLowerCase()}.png) no-repeat transparent !important;}
                `);
                break;
            case "OvenBreak (Alt)":
                style('rarityStyle', 'add', `
                .card[data-rarity="${r}"] .cardRarity {background: url(https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/rarities/ovenbreak-alt-${r.toLowerCase()}.png) no-repeat transparent !important;}
                `);
                break;
        }
    });
}

function styleTabless(val) {
    const rarities = ['TOKEN', 'BASE', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'DETERMINATION'];
    const rarityColor = ['#00c800', 'gray', '#fff', '#00b8ff', '#d535d9', 'gold', 'red'];
    style('tabs', 'remove')
    switch (val) {
        case "overlay":
            style('tabs', 'add', `
            .cardsList .card, .cardSkinList .card {height: 246px;}
            .cardsList .card:has(.cardQuantity):not(.balatro-frame) .cardRarity, .cardSkinList .card:has(.cardQuantity):not(.balatro-frame) .cardRarity {opacity: 0.5;}
            .cardsList .card:has(.cardUCPCost):not(.balatro-frame) .cardRarity, .cardSkinList .card:has(.cardUCPCost):not(.balatro-frame) .cardRarity {opacity: 0.5;}
            .card .cardQuantity, .card .cardUCPCost {top: 210px; z-index: 8; border: none; background-color: unset}
            .slay-the-spire-frame .cardQuantity, .slay-the-spire-frame .cardUCPCost {top: 222px;}
            .pokecard-1996-frame .cardQuantity, .pokecard-1996-frame .cardUCPCost {top: 212px;}
            .halloween2020-frame .cardQuantity, .halloween2020-frame .cardUCPCost {top: 216px;}
            .balatro-frame .cardQuantity, .balatro-frame .cardUCPCost {top: 170px; left: 47px; border: none; background-color: #4f6367; border-radius: 4px 4px 0px 0px; width: 82px; z-index: 4}
            .balatro-frame.spell .cardQuantity, .balatro-frame.spell .cardUCPCost {color: #ffe5b4; top: 175px;}
            .card:not(.balatro-frame) .cardUCPCost:has(*) {visibility: hidden}
            .card:not(.balatro-frame) .cardUCPCost > * {visibility: visible; position: absolute; left: 35px; width: 55px;}
            .balatro-frame .cardUCPCost:has(*) {font-size: 15px; align-content: center;}
            `)
            break;
        case "overlay w/ color":
            style('tabs', 'add', `
            .cardsList .card, .cardSkinList .card {height: 246px;}
            .cardsList .card:has(.cardQuantity):not(.balatro-frame) .cardRarity, .cardSkinList .card:has(.cardQuantity):not(.balatro-frame) .cardRarity {opacity: 0.2;}
            .cardsList .card:has(.cardUCPCost):not(.balatro-frame) .cardRarity, .cardSkinList .card:has(.cardUCPCost):not(.balatro-frame) .cardRarity {opacity: 0.2;}
            .card .cardQuantity, .card .cardUCPCost {top: 210px; z-index: 8; border: none; background-color: unset}
            .slay-the-spire-frame .cardQuantity, .slay-the-spire-frame .cardUCPCost {top: 222px;}
            .pokecard-1996-frame .cardQuantity, .pokecard-1996-frame .cardUCPCost {top: 212px;}
            .halloween2020-frame .cardQuantity, .halloween2020-frame .cardUCPCost {top: 216px;}
            .card .cardUCPCost:has(*) {visibility: hidden}
            .card .cardUCPCost > * {visibility: visible; position: absolute; left: 35px; width: 55px;}
            `)
            rarities.forEach(r => {
                style('tabs', 'add', `
                .card:not(.balatro-frame)[data-rarity="${r}"] .cardQuantity, .card:not(.balatro-frame)[data-rarity="${r}"] .cardUCPCost {color: ${rarityColor[rarities.indexOf(r)]}}
                `)
            })
            break;
    }
}

function cardHighlightStyles(val) {
    style('highlights', 'remove')
    switch (val) {
        case "bright":
            style('highlights', 'add', `
            .target .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(10deg) saturate(900%) contrast(1.5);}
            .fight .cardFrame {filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(310deg) saturate(900%) contrast(1.5);}
            .canPlay .cardFrame, .craftable .cardFrame, .friendship-not-claimed .cardFrame {filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(900%) contrast(1.5);}
            .canPlay.trigger-helper .cardFrame {filter: grayscale(100%) brightness(75%) sepia(100%) hue-rotate(10deg) saturate(900%) contrast(1);}
            .affected .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(10deg) saturate(900%) contrast(1.5);}
            .doingEffect .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(170deg) saturate(900%) contrast(1.5);}
            .cardOwned .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(170deg) saturate(900%) contrast(1.5);}
            .cardNotOwned .cardFrame {filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(310deg) saturate(900%) contrast(1.5)}
            .cardHover .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(130deg) saturate(900%) contrast(1.75);}
            `)
            break;
        case "ultrabright":
            style('highlights', 'add', `
            .target .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(10deg) saturate(9000%) contrast(1.5);}
            .fight .cardFrame {filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(310deg) saturate(9000%) contrast(1.5);}
            .canPlay .cardFrame, .craftable .cardFrame, .friendship-not-claimed .cardFrame {filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(9000%) contrast(1.5);}
            .canPlay.trigger-helper .cardFrame {filter: grayscale(100%) brightness(75%) sepia(100%) hue-rotate(10deg) saturate(9000%) contrast(1);}
            .affected .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(10deg) saturate(9000%) contrast(1.5);}
            .doingEffect .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(170deg) saturate(9000%) contrast(1.5);}
            .cardOwned .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(170deg) saturate(9000%) contrast(1.5);}
            .cardNotOwned .cardFrame {filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(310deg) saturate(9000%) contrast(1.5)}
            .cardHover .cardFrame {filter: grayscale(100%) brightness(50%) sepia(100%) hue-rotate(130deg) saturate(9000%) contrast(1.75);}
            `)
            break;
        case "animated":
            style('highlights', 'add', `
            @keyframes action {
                0% { transform: rotate(0deg) }
                1% { transform: rotate(-7deg) translateY(0px) }
                25% { transform: rotate(6deg) }
                50% { transform: rotate(-5deg) }
                75% { transform: rotate(4deg) }
                100% { transform: rotate(0deg) }
            }
            @keyframes actionAtk {
                0% { transform: rotate(0deg) translateY(-20px); }
                1% { transform: rotate(-7deg) translateY(-20px); }
                25% { transform: rotate(6deg) translateY(-20px); }
                50% { transform: rotate(-5deg) translateY(-20px); }
                75% { transform: rotate(4deg) translateY(-20px); }
                100% { transform: rotate(0deg) scale(1) translateY(0px); }
            }
            @keyframes active {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-20px); }
            }
            @keyframes activeHand {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-5px); }
            }
            @keyframes notActiveHand {
                0% { transform: translateY(0px);}
                100% { transform: translateY(5px);}
            }
            .card:not(.playLocked) .cardFrame {filter: none !important}
            .cardBackground {box-shadow: none !important}

            .balatro-frame:not(:hover) { animation: unset; }
            .card.target, .card.canPlay, .card.craftable, .cardSkin:hover:not(.owned) {animation: active 0.3s ease-out forwards; z-index: 3}
            #handCards .card.target, #handCards .card.canPlay:not(.trigger-helper) {animation: activeHand 0.3s ease-out forwards; z-index: 10;}
            #handCards:has(.card.target) .card:not(.target), #handCards:has(.card.canPlay) .card:not(.canPlay) {animation: notActiveHand 0.3s ease-out forwards; z-index: 10;}
            #handCards .card {transition: opacity 0.3s}
            #handCards .card:not(.canPlay) {opacity: 0.8 !important}
            .card.canPlay.trigger-helper, .card.friendship-not-claimed {animation: active 0.5s infinite cubic-bezier(0.22, 0.61, 0.36, 1) alternate;}
            .card.affected, .card.doingEffect {animation: action 0.4s ease-out;}
            .card.fight {animation: actionAtk 0.4s ease-out;}
            .mulligan .card.fight {animation: active 0.3s ease-out forwards;}
            :not(#loadDeckCards) > .cardOwned .cardName::after, :not(#loadDeckCards) > .cardNotOwned .cardName::after {font-size: 7px; position: relative; top: -37px;}
            :not(#loadDeckCards) > .cardOwned .cardName::after {content: "${$.i18n('gs.game-ally')}"}
            :not(#loadDeckCards) > .cardNotOwned .cardName::after {content: "${$.i18n('gs.game-enemy')}"}
            :not(#loadDeckCards) > .cardOwned .cardName, :not(#loadDeckCards) > .cardNotOwned .cardName {transform: translateY(4px)}
            #loadDeckCards > .cardOwned .cardName::after, #loadDeckCards > .cardNotOwned .cardName::after {font-size: 7px; position: relative; top: -16px;}
            #loadDeckCards > .cardOwned .cardName::after {content: "${$.i18n('gs.owned')}"}
            #loadDeckCards > .cardNotOwned .cardName::after {content: "${$.i18n('gs.not-owned')}"}
            #loadDeckCards > .cardOwned .cardName, #loadDeckCards > .cardNotOwned .cardName {transform: translateY(-4px)}
            .card.inactive {animation: active 0.3s ease-out backwards;}

            .balatro-frame:not(:hover):not(.target):not(.fight):not(.canPlay):not(.affected):not(.doingEffect):not(.craftable):not(.friendship-not-claimed):not(.playLocked):not(.cardSkin:hover:not(.owned)) { animation: 6s ease-in-out attr(data-gs-random-delay s) infinite normal both running sway; }
            `)
            break;
        case "none":
            style('highlights', 'add', `
            .cardFrame {filter: none !important}
            .cardBackground {box-shadow: none !important}
            `)
            break;
    }
}

function settingOverriddenStyles() {
    style('settingOverrides', 'remove')
    if (sludgeEnabled?.value()) {
        style('settingOverrides', 'add', `
            #underscript\\.plugin\\.Galascript\\.obscApply {opacity: 0.5}
            *[for='underscript\\.plugin\\.Galascript\\.obscApply'] {opacity: 0.5}
        `)
    }
    if (powerSkins?.value() === 'Showdown') {
        style('settingOverrides', 'add', `
            #underscript\\.plugin\\.Galascript\\.powerSpacing {opacity: 0.5}
            *[for='underscript\\.plugin\\.Galascript\\.powerSpacing'] {opacity: 0.5}
            #underscript\\.plugin\\.Galascript\\.powerBounds {opacity: 0.5}
            *[for='underscript\\.plugin\\.Galascript\\.powerBounds'] {opacity: 0.5}
            #underscript\\.plugin\\.Galascript\\.legacyPowers {opacity: 0.5}
            *[for='underscript\\.plugin\\.Galascript\\.legacyPowers'] {opacity: 0.5}
        `)
    }
}
function cardModifier(val) {
    style('cardModifier', 'remove')
    const rarities = ['TOKEN', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'DETERMINATION'];
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
        case "thin": modifier = `.card.gsObscured {transform: scaleX(0.5)}`; break;
        case "wide": modifier = `.card.gsObscured {transform: scaleX(1.5)}`; break;
        case "wee": modifier = `.card.gsObscured {transform: scale(0.5)}`; break;
        case "large": modifier = `.card.gsObscured {transform: scale(1.5)}`; break;
        case "offset": modifier = `.card.gsObscured {transform: translate(-100px)}`; break;
        case "upsidedown": modifier = `.card.gsObscured {transform: rotate(180deg)}`; break;
        case "flipped":
            rarities.forEach(r => {
                function link(ext) {
                    if (r === 'BASE' || r === 'TOKEN') {
                        return `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/cardBacks/${ext}Card${r}.png`;
                    } else {
                        return `images/cardBacks/${ext}Card${r}.png`;
                    }
                }
                modifier += `.card[data-rarity="${r}"][data-extension="BASE"].gsObscured .cardFrame {background-image: url(${link('BASE')})}
                `;
                modifier += `.card[data-rarity="${r}"][data-extension="DELTARUNE"].gsObscured .cardFrame {background-image: url(${link('DELTARUNE')})}
                `;
                modifier += `.card[data-rarity="${r}"][data-extension="UTY"].gsObscured .cardFrame {background-image: url(${link('UTY')})}
                `;
            });
            modifier += `.card.gsObscured *:not(.cardFrame) {visibility: hidden;}
            `;
            if (obscCardRarity?.value() === 'blur') {
                modifier += `.card.gsObscured .cardFrame {filter: blur(${obscBlurStrength.value()}px)}`
            }
            break;
        case "spin": modifier = `.card.gsObscured {animation: spin 4s infinite linear;}`; break;
        case "treadmill": modifier = `.card.gsObscured {animation: treadmill 15s infinite linear;} .card:hover {animation-play-state: paused;}`; break;
    }
    style('cardModifier', 'add', modifier)
}

function updateSoulColor(soul, color) {
    style(`soulColor${soul}`, 'replace', `
        ${color === soulColors[soul] ? `
            img[src*="images/souls/${soul}.png"] {filter: drop-shadow(0px); transform: translateY(0px);}
            img[src*="images/souls/big/${soul}.png"] {filter: drop-shadow(0px); transform: translateY(0px);}
            div:not(.breaking-skin):has(.cardName.${soul}):not(.balatro-frame) > .cardImage {background-color: pebis; background-blend-mode: unset;}
            .${soul}:not(li span):not([onmouseover]):not(.pokecard-1996-frame .${soul}):not(#deckCardsCanvas *) {color: ${color}; text-shadow: revert}
        ` : `
            img[src*="images/souls/${soul}.png"] {filter: drop-shadow(5000px 5000px 0 ${color}); transform: translate(-5000px, -5000px);}
            img[src*="images/souls/big/${soul}.png"] {filter: drop-shadow(5000px 5000px 0 ${color}); transform: translate(-5000px, -5000px);}
            div:not(.breaking-skin):has(.cardName.${soul}):not(.balatro-frame) > .cardImage {background-color: ${color} !important; background-blend-mode: luminosity;}
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

function setBg(bg, detachMusic) {
    window.music.pause();
    $('body').css('background', '#000 url(\'images/backgrounds/' + bg + '.png\') no-repeat');
    $('body').css('background-size', 'cover');
    if (plugin.settings().value('underscript.persist.bgm')) {
        sessionStorage.setItem(`underscript.bgm.${window.gameId}`, bg);
    }
        if (detachMusic) {
            bgm = rollBgSmart(true);
        } else {
            bgm = bg;
        }
}

function rollBgSmart(returnNum) {
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
    setBg(newBg);
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
    value(val) {
    if (typeof val === 'boolean') return val;
        return val === '1' || val === 'true';
    }
    default() {
        return false;
    }
    labelFirst() {
        return null;
    }
    element(value, update, {
        name,
        data = {},
        dataColor = data?.color ?? 'white',
        dataDismissable = data?.dismissable ?? true,
    }) {
        return $(`<span>`)
            .html(name)
            .attr("gsPlaintextDismissed", dataDismissable ? value : false)
            .css({
                color: dataColor,
                cursor: dataDismissable ? 'pointer' : 'default'
            })
            .mouseenter((e) => {
                if (dataDismissable) {
                    $(e.currentTarget).append('<span class="gsPlaintextDismiss"> [Dismiss]</span>')
                }
            })
            .mouseleave((e) => {
                $('.gsPlaintextDismiss').remove()
            })
            .on('click', (e) => {
                if (dataDismissable) {
                    $(e.currentTarget).attr("gsPlaintextDismissed", true);
                    update(1);
                }
            })
        ;
    }
    styles() {
        return [
            'span { max-width: 360px }',
            '.gsPlaintextDismiss { font-style: italic; color: salmon; }',
            '[gsPlaintextDismissed="true"] { display: none; }',
        ];
    }
}

const plaintext = new plaintextSetting();
plugin.settings().addType(plaintext);

class buttonSetting extends underscript.utils.SettingType {
    constructor() {
        super('button');
    }

    element(value, update, {
        name,
        data = {},
    }) {
        return $(`<input type="button">`)
            .on('click', (e) => data.onclick())
            .val(name)
    }

    labelFirst() {
        return null;
    }

    styles() {
        return [
            'input[type=button] { background: black; color: white; margin: 4px; }',
        ];
    }
}

const button = new buttonSetting();
plugin.settings().addType(button);

class imgCheckboxSetting extends underscript.utils.SettingType {
    constructor() {
        super('imgCheckbox');
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
    return $(`<input type="checkbox" class="imgCheckbox" style="position: relative; background: none; background-image: url(${data.src}); background-size: cover; background-position: right; border: none; width: 20px; height: 20px;">`)
        .prop('checked', value)
        .on('change.script', (e) => update(getValue(e.target, remove)))
    }
    styles() {
        return [
            ".imgCheckbox { opacity: 0.2; }",
            ".imgCheckbox:checked { opacity: 1 }",
            ".imgCheckbox:focus { outline: none; box-shadow: none; }",
        ];
    }
}

const imgCheckbox = new imgCheckboxSetting();
plugin.settings().addType(imgCheckbox);

class advancedCheckboxSetting extends underscript.utils.SettingType {
    constructor() {
        super('advancedCheckbox');
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
        name,
        remove = false,
        data = {},
        image = data.src ?? false,
        childSettings = data.childSettings ?? [],
    }) {
    style(`${name}ChildrenVisibility`, 'remove');
    if (!value) {
        childSettings.forEach((setting) => style(`${name}ChildrenVisibility`, 'add', `.flex-start:has(#underscript\\.plugin\\.Galascript\\.${setting}) {display: none}`));
    } else {
        childSettings.forEach((setting) => style(`${name}ChildrenVisibility`, 'add', `.flex-start:has(#underscript\\.plugin\\.Galascript\\.${setting}) {background-color: rgba(216, 191, 216, 0.15)}`));
    }
    return $(`<input type="checkbox" class="advancedCheckbox${image ? ` withImage" style="background-image: url(${data.src});` : ""}">`)
        .prop('checked', value)
        .on('change.script', (e) => {
            style(`${name}ChildrenVisibility`, 'remove')
            if (!getValue(e.target)) {
                childSettings.forEach((setting) => style(`${name}ChildrenVisibility`, 'add', `.flex-start:has(#underscript\\.plugin\\.Galascript\\.${setting}) {display: none}`));
            } else {
                childSettings.forEach((setting) => style(`${name}ChildrenVisibility`, 'add', `.flex-start:has(#underscript\\.plugin\\.Galascript\\.${setting}) {background-color: rgba(216, 191, 216, 0.15)}`));
            }
            update(getValue(e.target, remove));
        })
    }
    styles() {
        return [
            ".advancedCheckbox.withImage { opacity: 0.2; background: none; background-position: right; background-size: cover; border: none; width: 20px; height: 20px; }",
            ".advancedCheckbox.withImage:checked { opacity: 1 }",
            ".advancedCheckbox.withImage:focus { outline: none; box-shadow: none; }",
        ];
    }
}

const advancedCheckbox = new advancedCheckboxSetting();
plugin.settings().addType(advancedCheckbox);

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

class textareaSetting extends underscript.utils.SettingType {
    constructor(name = 'text') {
    super(name);
    }

    value(val) {
        return `${val}`;
    }

    element(value, update) {
        return $('<textarea>')
            .val(value)
            .on('blur.script', (e) => update(e.target.value))
            .css({
            'background-color': 'transparent',
        });
    }
}

const textarea = new textareaSetting();

function refreshCards(collection) {
    if (collection) {
        window.applyFilters();
        window.showPage(window.currentPage);
        return;
    }
    $('.card').each(function() {
        const $el = $(this);
        const card = JSON.parse($el.find('.cardObject').html());
        window.createCard(card, $el)
        window.setInfoPowers($el, card)
        window.updateCardVisual($el, card)
    });
}

const cardAliases = plugin.settings().add({
    key: 'cardAliases',
    name: 'Card alias lookup',
    note: 'Cards can be searched in your collection by well-known aliases and shorthands<br>For example, searching "casdyne" will have Casual Undyne as a result',
    category: 'QoL',
    default: true,
    onChange: (val) => refreshCards(true)
});

const mulliganInfo = plugin.settings().add({
    key: 'mulliganInfo',
    name: 'Mulligan information',
    note: 'Displays turn order and opponent\'s name and SOUL on the Mulligan at the start of the game',
    category: 'QoL',
    default: true,
});

const programIndicators = plugin.settings().add({
    key: 'programIndicators',
    name: 'Program indicator',
    note: 'Program cards, when hovered, display their cost as their cost + the Program\'s cost',
    category: 'QoL',
    default: false,
    onChange: (val) => refreshCards()
});

const statsOnTop = plugin.settings().add({
    key: 'statsOnTop',
    name: 'Stats on top',
    note: 'Displays card stats over obstructing skins',
    category: 'QoL',
    default: false,
    onChange: (val) => statsOnTopToggle(val)
});

const logChat = plugin.settings().add({
    key: 'logChat',
    name: 'Log chat messages',
    note: 'Chat messages and emotes from you or the opponent will be logged in the Underscript chat log',
    category: 'QoL',
    default: false,
});

const detectBots = plugin.settings().add({
    key: 'detectBots',
    name: 'Detect bots',
    note: 'Makes it obvious that you\'re facing a bot',
    category: 'QoL',
    default: false,
});

const statFilters = plugin.settings().add({
    key: 'statFilters',
    name: 'Stat filters',
    note: 'Adds cost, ATK, and HP filters in your collection to better find specific cards',
    category: 'QoL',
    default: true,
    onChange: (val) => {if (val) {createStatFilters()} else {removeStatFilters()}}
});

const powerFilters = plugin.settings().add({
    key: 'powerFilters',
    name: 'Power filters',
    note: 'Adds filters for certain powers in your collection',
    category: 'QoL',
    type: "select", options: ["off", "standard", "standard + galascript"],
    default: 'off',
    onChange: (val) => {if (val !== 'off') {createPowerFilters()} else {removePowerFilters()}}
});

const maxHpIndicator = plugin.settings().add({
    key: 'maxHpIndicator',
    name: 'Max HP indicator',
    note: 'Adds an indicator that shows the monster\'s HP out of its max (ex. 5/6)<br><span style="color:thistle;">hide when full</span>: Doesn\'t display if the monster\'s HP is full.<br><span style="color:thistle;">always show</span>: Still displays if the monster\'s HP is full.',
    category: 'QoL',
    type: "select", options: ["off", "hide when full", "always show"],
    default: 'hide when full',
    onChange: (val) => refreshCards()
});

const cardSkinNames = plugin.settings().add({
    key: 'cardSkinNames',
    name: 'Card skin names',
    note: 'Card names will match applied skins',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const loopNames = plugin.settings().add({
    key: 'loopNames',
    name: 'Loop names',
    note: 'When a card has 1 or more Loop, its name will be changed to its plural form',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const breakingFullarts = plugin.settings().add({
    key: 'breakingFullarts',
    name: 'Breaking fullarts',
    note: 'Makes the "Full art" skin type instead<br>behave like a Breaking skin',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const frameSpoof = plugin.settings().add({
    key: 'frameSpoof',
    name: 'Card frame',
    note: 'Changes cards to use any frame, including some custom ones!<br><br>Some frames change the below settings when applied.',
    category: 'Cardpaint',
    type: "select", options: allFrames.toSpliced(0, 0, "off"),
    default: "off",
    onChange: (val, oldVal) => {
        switch (oldVal) {
            case 'Pokecard 1996':
                statBase.set('1');
                powerSpacing.set(20);
                powerBounds.set(135);
                numStack.set(0);
                break;
            case 'Slay the Spire':
                powerBounds.set(135);
                break;
            case 'Balatro':
                powerBounds.set(135);
                break;
        }
        switch (val) {
            case 'Pokecard 1996':
                statBase.set('10');
                powerSpacing.set(135);
                powerBounds.set(58);
                numStack.set(1);
                break;
            case 'Slay the Spire':
                powerBounds.set(102);
                break;
            case 'Balatro':
                powerBounds.set(79);
                break;
        }
      refreshCards();
    }
});

const frameSpoofBehavior = plugin.settings().add({
    key: 'frameSpoofBehavior',
    name: 'Display behavior',
    note: 'Where the set frame will be applied<br><i>Cards outside of games are considered \'allies\'<br>\'Force everywhere\' forces the custom frame to be shown even in<br>places it wouldn\'t, like the cosmetics shop and card hovers</i>',
    category: 'Cardpaint',
    type: "select", options: ["allies only", "enemies only", "allies + enemies", "force everywhere"],
    default: "allies + enemies",
    onChange: (val) => refreshCards()
});

const raritySkins = plugin.settings().add({
    key: 'raritySkins',
    name: 'Rarity skin',
    note: 'Use a set of custom rarity icons<br>"match frame" uses the custom rarity icon associated with the frame, if any',
    category: 'Cardpaint',
    type: "select", options: ["off", "match frame", "Hollow Knight", "FNAFB", "Celeste", "Balatro", "OvenBreak", "OvenBreak (Alt)"],
    default: "match frame",
    onChange: (val) => { rarityStyles(val); $('*').removeAttr("data-gs-setting-bg-loaded") }
});

const powerSkins = plugin.settings().add({
    key: 'powerSkins',
    name: 'Power skin',
    note: 'Use a set of custom status icons<br>"match frame" uses the custom icon set associated with the frame, if any',
    category: 'Cardpaint',
    type: "select", options: ["off", "match frame", "Ancient", "Neon", "Balatro", "Showdown"],
    default: "match frame",
    onChange: (val) => { refreshCards(); $('*').removeAttr("data-gs-setting-bg-loaded"); settingOverriddenStyles(); if(powerFilters?.value()) {createPowerFilters()}  }
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
    note: 'Displays ATK and HP stats in different base number multiples',
    category: 'Cardpaint',
    type: "select", options: ["0.01", "0.1", "0", "1", "2", "5", "10", "100", "1000", "10000"],
    default: "1",
    onChange: (val) => refreshCards()
});

const powerSpacing = plugin.settings().add({
    key: 'powerSpacing',
    name: 'Power spacing',
    note: () => powerSkins?.value() === 'Showdown' ? 'You have the <i>Showdown</i> power skin enabled, which<br>isn\'t compatiable with this setting' : 'Changes how close together or far powers are spaced from eachother',
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
    note: () => powerSkins?.value() === 'Showdown' ? 'You have the <i>Showdown</i> power skin enabled, which<br>isn\'t compatiable with this setting' :  'Changes how far powers can go up to',
    category: 'Cardpaint',
    type: "text",
    default: 135,
    reset: true,
    onChange: (val) => refreshCards()
});

const legacyPowers = plugin.settings().add({
    key: 'legacyPowers',
    name: 'No power fitting',
    note: () => powerSkins?.value() === 'Showdown' ? 'You have the <i>Showdown</i> power skin enabled, which<br>isn\'t compatiable with this setting' :  'Do you prefer the powers hanging off the card, you sick freak?<br>Here you go :3',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const numStack = plugin.settings().add({
    key: 'numStack',
    name: 'Powers iterate',
    note: 'Instead of numbers, powers iterate themselves<br><span style="color:thistle;">ex:</span> 3 Loop would appear as 3 seperate Loop icons,<br>not one Loop icon with a 3 on it',
    category: 'Cardpaint',
    default: false,
    onChange: (val) => refreshCards()
});

const tabless = plugin.settings().add({
    key: 'tabless',
    name: 'Tabless',
    note: 'Compacts Quantity / UCP Cost values into the Rarity area<br><span style="color:thistle;">overlay</span> is the default behavior<br><span style="color:thistle;">overlay w/ color</span> makes the text the color of the rarity',
    category: 'Cardpaint',
    type: "select", options: ["off", "overlay", "overlay w/ color"],
    default: "overlay",
    onChange: (val) => styleTabless(val)
});

const cardHighlights = plugin.settings().add({
    key: 'cardHighlights',
    name: 'Card highlights',
    note: 'Changes how glowing card highlights are displayed',
    category: 'Cardpaint',
    type: "select", options: ["default", "bright", "ultrabright", "animated", "none"],
    default: "default",
    onChange: (val) => cardHighlightStyles(val)
});

const keybindsInfo = plugin.settings().add({
    key: 'keybindsInfo',
    name: 'Keys cannot be bound to multiple actions. If they are, the highest setting takes priority. Additionally, you can press Escape while binding to unbind.',
    category: 'Keybinds',
    type: plaintext,
    data: { color: 'thistle' }
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

const randomizeAvatarKeybind = plugin.settings().add({
    key: 'randomizeAvatarKeybind',
    name: 'Randomize avatar',
    note: 'Sets the key used to randomize your avatar<br>(You can set favorites! See Cosmetics)',
    category: 'Keybinds',
    type: keybind,
    default: '["unbound", "unbound"]',
});

const randomizeProfileKeybind = plugin.settings().add({
    key: 'randomizeProfileKeybind',
    name: 'Randomize profile skin',
    note: 'Sets the key used to randomize your profile skin<br>(You can set favorites! See Cosmetics)',
    category: 'Keybinds',
    type: keybind,
    default: '["unbound", "unbound"]',
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
    note: 'Sets the key used to open chatroom 0 -- an ominous unused chat<br>Somewhat useful for writing notes!',
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
    default: [['["Digit1", "1"]', '1']],
    type: {
        key: keybind,
        value: 'select',
    },
    data: () => ({
        value: window.chatEmotes.length ? window.chatEmotes.map(emote => [emote.name, emote.id]) : [["Emotes not loaded!", 0]]
    }),
});

const filtersInfo = plugin.settings().add({
    key: 'filtersInfo',
    name: 'Don\'t get lost! By default, pressing Delete will turn off all filters.',
    category: 'Filters',
    type: plaintext,
    data: { color: 'thistle' }
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

const copiesAreMonochrome = plugin.settings().add({
    key: 'copiesAreMonochrome',
    name: 'Copies are monochrome',
    note: 'Generated cards\' images will be greyscaled',
    category: 'Filters',
    default: false,
    onChange: (val) => monochromeCopiesToggle(val)
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

const dvdBounce = plugin.settings().add({
    key: 'dvdBounce',
    name: 'Bouncing DVD logo',
    note: 'Puts a big bouncing DVD logo on your screen',
    category: 'Filters',
    data: {
        childSettings: ["dvdSpeed", "dvdSize"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => {if (val) {createDVD()} else {removeDVD()}
}});

const dvdSize = plugin.settings().add({
    key: 'dvdSize',
    name: 'Size',
    note: 'The size of the DVD logo',
    category: 'Filters',
    type: "slider",
    min: 50,
    max: 900,
    step: 10,
    default: 200,
    reset: true,
    onChange: (val) => createDVD()
});

const dvdSpeed = plugin.settings().add({
    key: 'dvdSpeed',
    name: 'Speed',
    note: 'The speed at which the DVD logo bounces',
    category: 'Filters',
    type: "slider",
    min: 0.1,
    max: 64,
    step: 0.1,
    default: 3,
    reset: true,
    onChange: (val) => createDVD()
});

const lightsOff = plugin.settings().add({
    key: 'lightsOff',
    name: '\"Dark\" mode',
    note: 'Makes the site dark, with your cursor being the only beacon of light...',
    category: 'Filters',
    data: {
        childSettings: ["flashlightRadiusInput", "flashlightStyle"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => {if (val) {createFlashlight()} else {removeFlashlight()}
}});

const flashlightRadiusInput = plugin.settings().add({
    key: 'flashlightRadiusInput',
    name: 'Radius',
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
    name: 'Style',
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
    note: 'Shuffles all the soul colors',
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
    note: 'Resets all the soul colors to their default values',
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
    note: 'Use custom translations ingame<br><br>Right-click on either box to open the Translation Helper! The<br>Translation Helper provides a bunch of easy to use formatting options,<br>aiming to make the process more easily understandable<br><br><span style="color:salmon;">Malformed or self-referencing values are extremely likely to cause issues</span>',
    category: 'To your liking',
    type: 'advancedMap',
    default: [["card-15", ";)"]],
    type: {
        value: textarea,
    },
    onChange: (val) => {
        $.i18n().load("translation", $.i18n().locale).then(() => {
            initCustomTranslations();
            staticStyles();
            cardHighlightStyles(cardHighlights?.value());
            refreshCards();
        });
    }
});

const translationGuide = plugin.settings().add({
    key: 'translationGuide',
    name: 'Translation guide',
    category: 'To your liking',
    type: button,
    data: {
        onclick() {
            window.BootstrapDialog.show({
                title: 'Galascript credits',
                size: window.BootstrapDialog.SIZE_NORMAL,
                id: 'gsCredits',
                message: function() {
                    return credits;
                },
                buttons: [{
                    label: $.i18n('dialog-close'),
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }
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
    data: { color: 'thistle' }
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
    note: '("Stats" is both ATK and HP)',
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
    note: 'Hides Generated status',
    category: 'Cardsludge',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/createdUnknown.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const noSilence = plugin.settings().add({
    key: 'noSilence',
    name: 'No silence',
    note: 'Hides Silence status and background effect',
    category: 'Cardsludge',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/silencedUnknown.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => {hide('cardSilence', val); refreshCards()}
});

const noCostBuffs = plugin.settings().add({
    key: 'noCostBuffs',
    name: 'No cost buffs',
    note: 'Hides cost buff and debuff statuses',
    category: 'Cardsludge',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/costUnknown.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const noStatBuffs = plugin.settings().add({
    key: 'noStatBuffs',
    name: 'No ATK / HP buffs',
    note: 'Hides ATK / HP buff and debuff statuses',
    category: 'Cardsludge',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/statsUnknown.gif' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const obscApply = plugin.settings().add({
    key: 'obscApply',
    name: 'Apply sludge',
    note: () => sludgeEnabled?.value() ? 'You have the <i>Sludge</i> action power enabled, which<br>overrides this setting' : 'Changes where exactly Cardsludge settings will be applied, in case you want to<br>let the chaos loose, or bottle it up, never to be seen again...',
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

const baseStatChangePower = plugin.settings().add({
    key: 'baseStatChangePower',
    name: 'Base stat change',
    note: 'Brings back the base stat change power<br>...Should be stable this time. I think.',
    category: 'Too many powers!!!',
    data: { src: 'images/powers/baseStatChange.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const undereventPower = plugin.settings().add({
    key: 'undereventPower',
    name: 'Underevent 2024',
    note: 'Displays on El Undercardio',
    category: 'Too many powers!!!',
    data: { src: 'images/powers/underevent2024.png' },
    type: imgCheckbox,
    default: true,
    onChange: (val) => refreshCards()
});

const programPower = plugin.settings().add({
    key: 'programPower',
    name: 'Program',
    note: 'Displays the program value',
    category: 'Too many powers!!!',
    data: { src: 'images/powers/program.png' },
    type: imgCheckbox,
    default: true,
    onChange: (val) => refreshCards()
});

const newPower = plugin.settings().add({
    key: 'newPower',
    name: 'New',
    note: 'Displays if the card is... new!!! Yay!!!',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/new.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const targetPower = plugin.settings().add({
    key: 'targetPower',
    name: 'Target',
    note: 'Displays the card\'s valid board targets',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/target.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const turnsPower = plugin.settings().add({
    key: 'turnsPower',
    name: 'Turn played',
    note: 'Displays the turn a card was played',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/turn.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const shinyPower = plugin.settings().add({
    key: 'shinyPower',
    name: 'Shiny',
    note: 'Displays when card is shiny',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/shiny.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const deadPower = plugin.settings().add({
    key: 'deadPower',
    name: 'Dead',
    note: 'Displays if the card has 0 or less HP',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/dead.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const legendPower = plugin.settings().add({
    key: 'legendPower',
    name: 'King of Rolypoly',
    note: 'Displays if the card\'s owner got T rank last season<br><br>Literally: <img style="height: 24px; width: 48px;" src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/tennapose.gif"> <hr style="border-top: 3px dotted red;"/> Have you ever seen such a <img style="height: 24px;" src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/tennapose.gif"> ?<br><img style="height: 256px; width: 356px;" src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/tennapose.gif">',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/legendmaker.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const totemPower = plugin.settings().add({
    key: 'totemPower',
    name: 'Totem drop',
    note: 'Displays if the card has base 7 cost or HP',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/totem.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const barrierPower = plugin.settings().add({
    key: 'barrierPower',
    name: 'The Barrier',
    note: 'How else would you know such <i>crucial</i> information about The Barrier?',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/barrierPowers.gif' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const primePower = plugin.settings().add({
    key: 'primePower',
    name: 'Prime',
    note: 'Displays if the monster\'s card ID is a prime number',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/prime.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const formerGloryPowers = plugin.settings().add({
    key: 'formerGloryPowers',
    name: 'Former glory',
    note: 'Gives back lost powers to cards that still mechanically have them',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/formerGlory.png',
        childSettings: ["formerGloryTrashy", "formerGloryUndying"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const formerGloryTrashy = plugin.settings().add({
    key: 'formerGloryTrashy',
    name: 'Trashy',
    note: 'Gives Trashy Thorns and Ranged',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/trashy.gif'
    },
    type: imgCheckbox,
    default: true,
    onChange: (val) => refreshCards()
});

const formerGloryUndying = plugin.settings().add({
    key: 'formerGloryUndying',
    name: 'Undyne the Undying',
    note: 'Gives Undyne the Undying Another Chance',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/anotherChance.png'
    },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const checkPower = plugin.settings().add({
    key: 'checkPower',
    name: 'Check',
    note: 'Always displays, giving all of a card\'s currently stored information<br>For use in debugging :P',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/check.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => refreshCards()
});

const actionPowersInfo = plugin.settings().add({
    key: 'actionPowersInfo',
    name: 'Below are <i>action powers</i>. They appear on<br>a set % of cards and can affect the way you<br>play the game.',
    category: 'Too many powers!!!',
    type: plaintext,
    data: { color: 'thistle' }
});

const kittyCatsEnabled = plugin.settings().add({
    key: 'kittyCatsEnabled',
    name: 'Kitty cat',
    note: 'Ingame, a % of cards have a <i>Kitty cat</i>.<br>When played, a <i>Kitty cat</i> card will do something random! :3',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/kittyCat.png',
        childSettings: ["kittyCatsChance", "possibleKitties"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => { refreshCards(); }
});

const kittyCatsChance = plugin.settings().add({
    key: 'kittyCatsChance',
    name: 'Kitty cats %',
    note: 'The % chance that a card will have a <i>Kitty cat</i>',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(true); }
});

const possibleKitties = plugin.settings().add({
    key: 'possibleKitties',
    name: 'Possible kitties',
    note: 'Choose what all a <i>Kitty cat</i> is capable of!',
    category: 'Too many powers!!!',
    type: 'advancedMap',
    default: [
        ["foreign", 0],
        ["asleep", 0],
        ["chat", 0],
        ["fall", 0],
        ["family", 0],
        ["lights", 0],
        ["soulcolors", 0],
        ["clipboard", 0],
        ["dvd", 0]
    ],
    type: {
        key: 'select',
        value: 'text',
    },
    data: () => ({
        key: [
            [ 'Randomize language', 'foreign' ],
            [ 'Do nothing', 'asleep' ],
            [ 'Scramble chats', 'chat' ],
            [ 'Send a random emote', 'emote' ],
            [ 'Fall off counter :(', 'fall' ],
            [ 'Show a tribe menu', 'family' ],
            [ 'Toggle flashlight mode', 'lights' ],
            [ 'Shuffle SOUL colors', 'soulcolors' ],
            [ 'End your turn', 'endturn' ],
            [ 'Copy something to clipboard', 'clipboard' ],
            [ 'Toggle bouncing DVD logo', 'dvd' ],
            [ 'Surrender the game', 'surrender' ]
        ]
    }),
});

const mikeDropsEnabled = plugin.settings().add({
    key: 'mikeDropsEnabled',
    name: 'Mike drop',
    note: 'Ingame, a % of cards have a <i>Mike drop</i><br>When played, a <i>Mike drop</i> card will end your turn!',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/mikeDrop.png',
        childSettings: ["mikeDropsChance"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => { refreshCards(); }
});

const mikeDropsChance = plugin.settings().add({
    key: 'mikeDropsChance',
    name: 'Mike drops %',
    note: 'The % chance that a card will have a <i>Mike drop</i>',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(true); }
});

const equationsEnabled = plugin.settings().add({
    key: 'equationsEnabled',
    name: 'Equation',
    note: 'Ingame, a % of cards have an <i>Equation</i><br><i>Equation</i> cards cannot be played from hand until you inspect the power and successfully solve the equation',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/equation.png',
        childSettings: ["equationsChance", "equationsAddSubtract", "equationsMultiplyDivide", "equationsMaxOperand", "equationsNegatives", "equationsDoableDuring", "equationsPenalty"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => { refreshCards(); }
});

const equationsChance = plugin.settings().add({
    key: 'equationsChance',
    name: 'Equations %',
    note: 'The % chance that a card will have an <i>Equation</i>',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(true); }
});

const equationsAddSubtract = plugin.settings().add({
    key: 'equationsAddSubtract',
    name: '+ -',
    note: 'Addition and subtraction problems will show up',
    category: 'Too many powers!!!',
    default: true,
});

const equationsMultiplyDivide = plugin.settings().add({
    key: 'equationsMultiplyDivide',
    name: '× ÷',
    note: 'Multiplication and division problems will show up',
    category: 'Too many powers!!!',
    default: true,
});

const equationsMaxOperand = plugin.settings().add({
    key: 'equationsMaxOperand',
    name: 'Maximum operand',
    note: 'The maximum operand able to be used',
    category: 'Too many powers!!!',
    type: 'text',
    default: '12'
});

const equationsNegatives = plugin.settings().add({
    key: 'equationsNegatives',
    name: 'Negative operands',
    note: 'Operands can be negative',
    category: 'Too many powers!!!',
    default: false
});

const equationsDoableDuring = plugin.settings().add({
    key: 'equationsDoableDuring',
    name: 'Completable during',
    note: 'Defines when Equations are allowed to be solved',
    category: 'Too many powers!!!',
    type: "select", options: ['any time', 'your turn only', 'enemy turn only'],
    default: 'any time',
});

const equationsPenalty = plugin.settings().add({
    key: 'equationsPenalty',
    name: 'Equation fail penalty',
    note: 'Defines what happens when you fail an Equation<br><br>"end turn" requires that it\'s your turn. It\'s recommended that this option is<br>used in conjunction with "Completable during" on "your turn only""',
    category: 'Too many powers!!!',
    type: "select", options: ['none', 'end turn', 'surrender'],
    default: 'none',
});

const bricksEnabled = plugin.settings().add({
    key: 'bricksEnabled',
    name: 'Brick',
    note: 'Ingame, a % of cards have a <i>Brick</i><br><i>Brick</i> cards cannot be played',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/brick.png',
        childSettings: ["bricksChance"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => { refreshCards(); }
});

const bricksChance = plugin.settings().add({
    key: 'bricksChance',
    name: 'Bricks %',
    note: 'The % chance that a card will be a <i>Brick</i>',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(true); }
});

const stuporEnabled = plugin.settings().add({
    key: 'stuporEnabled',
    name: 'Stupor',
    note: 'Ingame, a % of monsters have <i>Stupor</i><br><i>Stupored</i> monsters cannot attack',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/stupor.png',
        childSettings: ["stuporChance"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => { refreshCards(); }
});

const stuporChance = plugin.settings().add({
    key: 'stuporChance',
    name: 'Stupor %',
    note: 'The % chance that a card will have <i>Stupor</i>',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(true); }
});

const bitflippedEnabled = plugin.settings().add({
    key: 'bitflippedEnabled',
    name: 'Bitflipped',
    note: 'Ingame, a % of cards are <i>Bitflipped</i><br><i>Bitflipped</i> cards have a random stat visually off by 1',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/bitflipped.png',
        childSettings: ["bitflippedChance", "bitflippedAmnesia", "bitflippedRealism", "bitflippedSpells"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => { refreshCards(); }
});

const bitflippedChance = plugin.settings().add({
    key: 'bitflippedChance',
    name: 'Bitflipped %',
    note: 'The % chance that a card will be <i>Bitflipped</i>',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(true); }
});

const bitflippedAmnesia = plugin.settings().add({
    key: 'bitflippedAmnesia',
    name: 'Amnesia',
    note: 'The <i>Bitflipped</i> power/icon does not show up',
    category: 'Too many powers!!!',
    data: { src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/bitflippedUnknown.png' },
    type: imgCheckbox,
    default: false,
    onChange: (val) => { refreshCards(); }
});

const bitflippedRealism = plugin.settings().add({
    key: 'bitflippedRealism',
    name: 'Be a little realistic, now',
    note: 'Stats can\'t bitflip into the negatives, and HP can\'t bitflip to 0',
    category: 'Too many powers!!!',
    default: true,
    onChange: (val) => { refreshCards(); }
});

const bitflippedSpells = plugin.settings().add({
    key: 'bitflippedSpells',
    name: 'Spells can be Bitflipped',
    category: 'Too many powers!!!',
    default: false,
    onChange: (val) => { refreshCards(); }
});

const sludgeEnabled = plugin.settings().add({
    key: 'sludgeEnabled',
    name: 'Sludge',
    note: 'Ingame, a % of cards have <i>Sludge</i><br><i>Sludge</i> cards will use your <i>Cardsludge</i> settings, and non-<i>Sludge</i> cards will appear normally',
    category: 'Too many powers!!!',
    data: {
        src: 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/sludge.png',
        childSettings: ["sludgeChance"]
    },
    type: advancedCheckbox,
    default: false,
    onChange: (val) => { refreshCards(); settingOverriddenStyles(); }
});

const sludgeChance = plugin.settings().add({
    key: 'sludgeChance',
    name: 'Sludge %',
    note: 'The % chance that a card will have <i>Sludge</i>',
    category: 'Too many powers!!!',
    type: "text",
    default: 5,
    onChange: (val) => { rollEventArrays(true); }
});

const healableActionPowers = plugin.settings().add({
    key: 'healableActionPowers',
    name: 'Action powers can be healed off',
    note: 'Cards such as Heal and Cafe Table can cleanse a card of all <i>Action powers</i>',
    category: 'Too many powers!!!',
    default: true,
});

const silencableActionPowers = plugin.settings().add({
    key: 'silencableActionPowers',
    name: 'Action powers can be silenced off',
    note: 'Silencing a card also rids it of all <i>Action powers</i>',
    category: 'Too many powers!!!',
    default: true,
});

const randomizeKeybindsInfo = plugin.settings().add({
    key: 'randomizeKeybindsInfo',
    name: 'You can also randomize your cosmetics with keypresses! See the <i>Keybinds</i> section.',
    category: 'Cosmetics',
    type: plaintext,
    data: { color: 'thistle' }
});

const randomizeAvatarAuto = plugin.settings().add({
    key: 'randomizeAvatarAuto',
    name: 'Randomize avatar every match',
    note: 'Randomizes your avatar when the game ends',
    category: 'Cosmetics',
    default: false,
});

const randomizeProfileAuto = plugin.settings().add({
    key: 'randomizeProfileAuto',
    name: 'Randomize profile skin every match',
    note: 'Randomizes your profile skin when the game ends',
    category: 'Cosmetics',
    default: false,
});

const randomizeCosmeticsButtons = plugin.settings().add({
    key: 'randomizeCosmeticsButtons',
    name: 'Buttons',
    note: 'Adds buttons to randomize your avatar/profile skin on their respective equip pages',
    category: 'Cosmetics',
    default: true,
    onChange: (val) => { if (val) {createCosmeticButtonsNormal()} else {removeCosmeticButtonsNormal()} }
});

const randomizeCosmeticsPlay = plugin.settings().add({
    key: 'randomizeCosmeticsPlay',
    name: 'Buttons on Play page',
    note: 'Adds buttons to randomize your avatar/profile skin on the Play page',
    category: 'Cosmetics',
    default: false,
    onChange: (val) => { if (val) {createCosmeticButtonsPlay()} else {removeCosmeticButtonsPlay()} }
});

const favoriteAvatars = plugin.settings().add({
    key: 'favoriteAvatars',
    name: 'Favorite avatars',
    note: 'Pick your favorite avatars!<br>Only these will be selected when you randomize your avatar.<br>If there\'s nothing here, a completely random avatar will be chosen instead',
    category: 'Cosmetics',
    type: 'advancedMap',
    default: [],
    type: {
        key: 'select',
        value: 'text',
    },
    data: () => ({
        key: yourAvatars.length ? yourAvatars.map(avatar => [avatar.name, avatar.id]) : [["Avatars not loaded!", 0]]
    }),
});

var currentAvatar = [];

function getCurrentAvatar() {
    return fetch('https://undercards.net/Avatars')
    .then(response => {
        return response.text();
    })
    .then(data => {
        const $equippedAvatar = $(data).find('.col-sm-2:has(input:disabled) .avatar')
        const equippedAvatar = yourAvatars.find(avatar => avatar.src === $equippedAvatar.attr('src'))
        currentAvatar = equippedAvatar
        return equippedAvatar;
    })
    .catch(error => {
        iconToast('genericFail', 'error', 'cosmetic-error', randi18n('gs.avatar', 1), error)
    });
}

function setRandomAvatar() {
    const $yourAvatar = $('.navbar .avatar').length ? $('.navbar .avatar') : $('#yourAvatar').length && !window.spectate ? $('#yourAvatar') : $('<img>')
    $yourAvatar.css('opacity', '0.5')
    var avatars;
    const favAvatars = [...favoriteAvatars?.value().keys()]
    if (favAvatars.length === 0) {
        avatars = yourAvatars.map(avatar => avatar.id)
    } else {
        avatars = favAvatars
    }
    function requestSet() {
        fetch('https://undercards.net/Avatars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new
                URLSearchParams({
                    idAvatar: avatars.gs_random(),
                    changeAvatar: true,
                })
            .toString()
        })
        .then(response => {
            return response.text();
        })
        .then(data => {
            const $sentAvatar = $(data).find('.col-sm-2:has(input:disabled) .avatar')
            const sentAvatar = yourAvatars.find(avatar => avatar.src === $sentAvatar.attr('src'))
            if (sentAvatar === currentAvatar && favAvatars.length !== 1) {
                setRandomAvatar()
            } else {
                $yourAvatar.attr('src', $sentAvatar.attr('src'))
                $yourAvatar.attr('class', $sentAvatar.attr('class'))
                $yourAvatar.attr('title', sentAvatar.name)
                currentAvatar = sentAvatar
                if (sentAvatar === currentAvatar && favAvatars.length === 1) {
                    iconToast('genericFail', 'error', 'cosmetic-cant-change', randi18n('gs.avatar', 1), sentAvatar.name)
                } else {
                    iconToast('genericSuccess', 'cosmetic-changed', 'cosmetic-changed', randi18n('gs.avatar', 1), sentAvatar.name)
                }
                $yourAvatar.css('opacity', '1')
            }
        })
        .catch(error => {
            iconToast('genericFail', 'error', 'cosmetic-error', randi18n('gs.avatar', 1), error)
            $yourAvatar.css('opacity', '1')
        });
    }
    if (currentAvatar.length === 0) {
        getCurrentAvatar().then(() => { requestSet(); });
    } else {
        requestSet()
    }
}

const favoriteProfiles = plugin.settings().add({
    key: 'favoriteProfiles',
    name: 'Favorite profile skins',
    note: 'Pick your favorite profile skins!<br>Only these will be selected when you randomize your profile skin.<br>If there\'s nothing here, a completely random profile skin will be chosen instead',
    category: 'Cosmetics',
    type: 'advancedMap',
    default: [],
    type: {
        key: 'select',
        value: 'text',
    },
    data: () => ({
        key: yourProfiles.length ? yourProfiles.map(profile => [profile.name, profile.id]) : [["Profiles not loaded!", 0]]
    }),
});

var currentProfile = [];

function getCurrentProfile() {
    return fetch('https://undercards.net/ProfileSkins')
    .then(response => {
        return response.text();
    })
    .then(data => {
        const $equippedProfile = $(data).find('tr:has(input:disabled) .profileSkin')
        const equippedProfile = yourProfiles.find(profile => profile.src === $equippedProfile.attr('src'))
        currentProfile = equippedProfile
        return equippedProfile;
    })
    .catch(error => {
        iconToast('genericFail', 'error', 'cosmetic-error', randi18n('gs.profile-skin', 1), error)
    });
}

function setRandomProfile() {
    const $yourProfile = $('.profile:has(#yourUsername)').length && !window.spectate ? $('.profile:has(#yourUsername)') : $('<img>')
    $yourProfile.css('opacity', '0.5')
    var profiles;
    const favProfiles = [...favoriteProfiles?.value().keys()]
    if (favProfiles.length === 0) {
        profiles = yourProfiles.map(avatar => avatar.id)
    } else {
        profiles = favProfiles
    }
    function requestSet() {
        fetch('https://undercards.net/ProfileSkins', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new
                URLSearchParams({
                    idProfileSkin: profiles.gs_random(),
                    changeProfileSkin: true,
                })
            .toString()
        })
        .then(response => {
            return response.text();
        })
        .then(data => {
            const $sentProfile = $(data).find('tr:has(input:disabled) .profileSkin')
            const sentProfile = yourProfiles.find(profile => profile.src === $sentProfile.attr('src'))
            if (sentProfile === currentProfile && favProfiles.length !== 1) {
                setRandomProfile()
            } else {
                $yourProfile.css('background-image', `url("${$sentProfile.attr("src")}")`)
                currentProfile = sentProfile
                if (sentProfile === currentProfile && favProfiles.length === 1) {
                    iconToast('genericFail', 'error', 'cosmetic-cant-change', randi18n('gs.profile-skin', 1), sentProfile.name)
                } else {
                    iconToast('genericSuccess', 'cosmetic-changed', 'cosmetic-changed', randi18n('gs.profile-skin', 1), sentProfile.name)
                }
                $yourProfile.css('opacity', '1')
            }
        })
        .catch(error => {
            iconToast('genericFail', 'error', 'cosmetic-error', randi18n('gs.profile-skin', 1), error)
            $yourProfile.css('opacity', '1')
        });
    }
    if (currentProfile.length === 0) {
        getCurrentProfile().then(() => { requestSet(); });
    } else {
        requestSet()
    }
}

window.prof = setRandomProfile

const versionInfo = plugin.settings().add({
    key: 'versionInfo',
    name: `Version ${pluginVersion}`,
    type: plaintext,
    data: {
        dismissable: false,
    },
    default: false,
    category: 'Galascript',
});

const readPatchNotes = plugin.settings().add({
    key: 'readPatchNotes',
    name: 'Patch notes',
    category: 'Galascript',
    type: button,
    data: {
        onclick() {
            window.BootstrapDialog.show({
                title: `Galascript v${gsVersion?.value()} Patch Notes`,
                size: window.BootstrapDialog.SIZE_NORMAL,
                id: 'gsPatchNotes',
                message: function() {
                    return convertMarkdown.makeHtml(patchNotes);
                },
                buttons: [{
                    label: $.i18n('dialog-close'),
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }
});

const readCredits = plugin.settings().add({
    key: 'readCredits',
    name: 'Credits',
    category: 'Galascript',
    type: button,
    data: {
        onclick() {
            window.BootstrapDialog.show({
                title: 'Galascript credits',
                size: window.BootstrapDialog.SIZE_NORMAL,
                id: 'gsCredits',
                message: function() {
                    return credits;
                },
                buttons: [{
                    label: $.i18n('dialog-close'),
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }
});

const exportSettings = plugin.settings().add({
    key: 'exportSettings',
    name: 'Export settings',
    category: 'Galascript',
    type: button,
    data: {
        onclick() {
            window.saveGsTranslations = function() {
                var settingObject = {customTranslations: localStorage.getItem('underscript.plugin.Galascript.customTranslations')}
                saveFile('translations.gs', JSON.stringify(settingObject));
                $('#gsExportDialog').modal('hide');
            }
            window.saveGsAll = function() {
                var settingObject = {}
                Object.keys(localStorage).forEach(function(key) {
                    if (key.startsWith('underscript.plugin.Galascript.') && !key.includes('version') && !key.includes('info') && !key.includes('collaps')) {
                        settingObject[key.slice(30)] = localStorage.getItem(key)
                    }
                });
                saveFile('settings.gs', JSON.stringify(settingObject));
                $('#gsExportDialog').modal('hide');
            }
            window.BootstrapDialog.show({
                title: $.i18n('gs.dialog-export-settings'),
                size: window.BootstrapDialog.SIZE_NORMAL,
                id: 'gsExportDialog',
                message: function() {
                    return `<p>${$.i18n('gs.dialog-export-begin')}</p>
                    <button class="gsDialogButton" onclick="saveGsTranslations()">${$.i18n('gs.dialog-export-translations')}</button>
                    <button class="gsDialogButton" onclick="saveGsAll()">${$.i18n('gs.dialog-export-all')}</button>
                    `
                },
                buttons: [{
                    label: $.i18n('dialog-cancel'),
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }
});

const importSettings = plugin.settings().add({
    key: 'importSettings',
    name: 'Import settings',
    category: 'Galascript',
    type: button,
    data: {
        onclick() {
            window.importGsSettings = function() {
                const file = document.getElementById('gsImport').files[0]
                const reader = new FileReader();

                reader.onload = function(e) {
                    const fileName = file.name;
                    const fileContent = e.target.result;
                    const settings = JSON.parse(fileContent);
                    function just(setting) {return Object.keys(settings).length === 1 && Object.hasOwn(settings, setting)}
                    var options = []
                    options.push({
                            label: $.i18n('gs.dialog-import'),
                            cssClass: 'btn-danger',
                            action: function (dialog) {
                                dialog.close();
                                Object.keys(localStorage).forEach(function(key) {
                                    if (key.startsWith('underscript.plugin.Galascript.') && !key.includes('version') && !key.includes('info') && !key.includes('collaps')) {
                                        localStorage.removeItem(key)
                                    }
                                });
                                Object.keys(settings).forEach(key => {
                                    localStorage.setItem(`underscript.plugin.Galascript.${key}`, settings[key]);
                                });
                                $('.underscript-dialog').modal('hide');
                                plugin.toast({
                                    title: $.i18n('gs.alert-title-import-complete'),
                                    text: $.i18n('gs.alert-import-complete', fileName),
                                    timeout: 5000,
                                });
                                refreshCards();
                            }})
                    if (just('customTranslations')) {
                        options.push({
                                label: $.i18n('gs.dialog-combine'),
                                cssClass: 'btn-warning',
                                action: function (dialog) {
                                    dialog.close();
                                    const newTrans = JSON.parse(localStorage.getItem('underscript.plugin.Galascript.customTranslations')).concat(JSON.parse(settings.customTranslations))
                                    localStorage.setItem('underscript.plugin.Galascript.customTranslations', JSON.stringify(newTrans));
                                    $('.underscript-dialog').modal('hide');
                                plugin.toast({
                                    title: $.i18n('gs.alert-title-import-complete'),
                                    text: $.i18n('gs.alert-import-merged', fileName, 'Custom translations'),
                                    timeout: 5000,
                                })
                                refreshCards();
                                }})
                    }
                    options.push({
                            label: $.i18n('dialog-cancel'),
                            cssClass: 'btn-primary',
                            action: function (dialog) {
                                dialog.close();
                            }
                        })
                    window.BootstrapDialog.show({
                        title: $.i18n('gs.dialog-are-you-sure'),
                        size: window.BootstrapDialog.SIZE_NORMAL,
                        id: 'gsImportConfirm',
                        message: function() {
                            var message = `<p>${$.i18n('gs.dialog-import-are-you-sure', fileName)}`;
                            if (just('customTranslations')) {
                                message += `<br><br>${$.i18n('gs.dialog-import-override-one', 'Custom translations')}`
                            } else if (Object.keys(settings).length > 20) {
                                message += `<br><br>${$.i18n('gs.dialog-import-override-all')}`
                            } else {
                                message += `<br><br>${$.i18n('gs.dialog-import-override-some')}`
                                Object.keys(settings).forEach(key => {
                                    message += `<br>${key}`
                                });
                            }
                            message += `</p>`
                            return message;
                        },
                        buttons: options,
                    });
                };

                reader.onerror = function(e) {
                    console.error("Error reading file:", e.target.error);
                };

                reader.readAsText(file);
                $('#gsImportDialog').modal('hide');
            }
            window.BootstrapDialog.show({
                title: $.i18n('gs.dialog-import-settings'),
                size: window.BootstrapDialog.SIZE_NORMAL,
                id: 'gsImportDialog',
                message: function() {
                    return `<p>${$.i18n('gs.dialog-import-begin')}</p>
                    <input type="file" id="gsImport" accept=".gs" onchange="importGsSettings()">
                    `
                },
                buttons: [{
                    label: $.i18n('dialog-cancel'),
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }
});

const restoreTips = plugin.settings().add({
    key: 'restoreTips',
    name: 'Restore tips',
    category: 'Galascript',
    type: button,
    data: {
        onclick() {
            keybindsInfo.set(false)
            filtersInfo.set(false)
            obscurityInfo.set(false)
            actionPowersInfo.set(false)
        }
    }
});

const gsVersion = plugin.settings().add({
    key: 'version',
    name: 'Version',
    type: 'text',
    category: 'Galascript',
    hidden: true,
});

const collapsedCategories = plugin.settings().add({
    key: 'collapsedCategories',
    name: 'Collapsed categories',
    type: 'array',
    category: 'Galascript',
    hidden: true,
});

window.gsUpdateToast = function() {
    plugin.toast({
        title: `Galascript v${pluginVersion}`,
        text: `Successfully installed Galascript v${pluginVersion}!`,
        buttons: [{
            text: 'Read patch notes',
            onclick: () => {
                 window.BootstrapDialog.show({
                    title: `Galascript v${gsVersion?.value()} Patch Notes`,
                    size: window.BootstrapDialog.SIZE_NORMAL,
                    id: 'gsPatchNotes',
                    message: function() {
                        return convertMarkdown.makeHtml(patchNotes);
                    },
                    buttons: [{
                        label: $.i18n('dialog-close'),
                        cssClass: 'btn-primary',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            }
        },{
            text: 'Dismiss',
            onclick: () => {
            }
        }],
        css: {
            textAlign: 'center',
            title: {
                fontSize: '18px',
            },
            button: {
                background: 'rgb(0, 0, 0, 0.2)',
                border: '1px solid white',
                borderRadius: '0px',
                textShadow: 'none',
                fontSize: '14px',
                margin: '3px 40px',
                width: '200px',
                height: '40px',
            }
        }
    });
}

async function saveFile(filename, content) {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [{
                description: 'Galascript settings files',
                accept: { 'text/plain': ['.gs'] },
            }],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
    } catch (err) {
        console.error('Error saving file:', err);
    }
}

function processBinds(e) {
    if (e.target.getAttribute("type") !== 'text' && e.target.className !== 'gsKeybind' && $(".underscript-dialog").length == 0) { // if not in a text field, setting a keybind, or a dialog is open
        switch ('button' in e ? e.button : e.code) {
            case bgKeybind?.value()[0]:
                if (!ingame) {
                    break;
                }
                rollBgSmart();
                window.playBackgroundMusic(bgm);
                break;
            case resetFiltersKeybind?.value()[0]:
                crispiness.set(100);
                blurriness.set(0);
                greyscale.set(0);
                invert.set(false);
                dvdBounce.set(false);
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
            case randomizeAvatarKeybind?.value()[0]:
                setRandomAvatar();
                break;
            case randomizeProfileKeybind?.value()[0]:
                setRandomProfile();
                break;
            case surrenderKeybind?.value()[0]:
                if (!ingame) {
                    break;
                }
                if (window.spectate) {
                    break;
                }
                if (window.turn < 5) {
                    iconToast('genericFail', 'not-allowed', 'cant-surrender')
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

var gameData = {
    cats: [],
    mikes: [],
    equations: [],
    bricks: [],
    stupor: [],
    bitflipped: [],
    sludge: [],
    allowedCats: [],
    allowedMikes: [],
    equationsWon: [],
    timestamp: Date.now()
};
function rollEventArrays(override) { // override is a bool to start from new
    Object.keys(localStorage).forEach(function(key) {
        if (key.startsWith('galascript.match')) {
            const value = JSON.parse(localStorage.getItem(key));
            const outdated = (value.timestamp < Date.now() - 2700000) || !Object.hasOwn(value, 'timestamp') // 2700000ms is 45min, the max match time
            if (outdated) {
                localStorage.removeItem(key);
            }
        }
    });
     if (!ingame || window.spectate) {
        return;
    }
    const saved = JSON.parse(localStorage.getItem(`galascript.match${window.gameId}.actionPowers`)) ?? false;
    if (saved && !override) {
        gameData = saved;
        refreshCards();
        return;
    }

    gameData.cats = []
    gameData.mikes = []
    gameData.equations = []
    gameData.bricks = []
    gameData.stupor = []
    gameData.bitflipped = []
    gameData.sludge = []

    const seed = window.gameId ?? 1
    function rollChance(i) {
        var m = 2**35 - 31
        var a = 185852
        var s = ((seed ^ i) * 2654435761) >>> 0;
        var roll = (s * a % m) / m
        return roll * 100 + 1;
    }
    const kittyCatsChancer = Number(kittyCatsChance.value())
    const mikeDropsChancer = Number(mikeDropsChance.value())
    const equationsChancer = Number(equationsChance.value())
    const bricksChancer = Number(bricksChance.value())
    const stuporChancer = Number(stuporChance.value())
    const bitflippedChancer = Number(bitflippedChance.value())
    const sludgeChancer = Number(sludgeChance.value())
    for (let i = 10000; i <= 12000; i++) {       // <- if you somehow generate more than 2000 monster ids in a game then good for you, you broke it :D
        if (kittyCatsChancer >= rollChance(i)) { // previous was 10000, which is even more impossible, and i decided to actually observe this time around, so... yeah, 2000 is good
            gameData.cats.push(i);               // the optimization is needed when im setting big ass arrays--whom the tail ends of will likely never be used--to localstorage
        }
        if (mikeDropsChancer >= rollChance(i + 1)) {
            gameData.mikes.push(i);
        }
        if (equationsChancer >= rollChance(i + 2)) {
            gameData.equations.push(i);
        }
        if (bricksChancer >= rollChance(i + 3)) {
            gameData.bricks.push(i);
        }
        if (stuporChancer >= rollChance(i + 4)) {
            gameData.stupor.push(i);
        }
        if (bitflippedChancer >= rollChance(i + 5)) {
            gameData.bitflipped.push(i);
        }
        if (sludgeChancer >= rollChance(i + 6)) {
            gameData.sludge.push(i);
        }
    }
    try {
        localStorage.setItem(`galascript.match${window.gameId}.actionPowers`, JSON.stringify(gameData));
    } catch (e) {
        if (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError') {
            alert('localStorage is full, so Galascript\'s persistent match data can\'t save! Either I did a shit job at limiting the space used, or you just have a lot going on in there.');
        }
    }
    refreshCards();
}

function updGameData(name, operation, val) {
    switch (operation) {
        case 'set': Object.defineProperty(gameData, name, {value: val}); break;
        case 'push': gameData[name].push(val); break;
        case 'remove': gameData[name] = gameData[name].filter(item => item !== val); break;
    }
    try {
        localStorage.setItem(`galascript.match${window.gameId}.actionPowers`, JSON.stringify(gameData));
    } catch (e) {
        if (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError') {
            alert('localStorage is full, so Galascript\'s persistent match data can\'t save! Either I did a shit job at limiting the space used, or you just have a lot going on in there.');
        }
    }
}
var awaitingMike, awaitingKitty, lastCard, lastBoard, facingBot;
plugin.events.on('GameEvent', (data) => {
    var cardPlayed = (data.action === 'getMonsterPlayed' || data.action === 'getSpellPlayed');
    var actionSilenced = false;
    if (cardPlayed) {
        var card = JSON.parse(data.card);
        var cid = card.id
        if (!awaitingMike && !awaitingKitty) {
            lastCard = card;
        }
        actionSilenced = silencableActionPowers?.value() && findStatus(card, 'silenced')
    }
    if (data.action === 'getPlayableCards') {
        var cardIds = JSON.parse(data.playableCards)
        cardIds.forEach((cid) => {
            const inhand = $('#handCards').find($('#' + cid)).length;

            if (gameData.mikes.includes(cid) && !gameData.allowedMikes.includes(cid) && inhand) {
                updGameData('allowedMikes', 'push', cid)
            } else if (gameData.allowedMikes.includes(cid) && !inhand) {
                updGameData('allowedMikes', 'remove', cid)
            }

            if (gameData.cats.includes(cid) && !gameData.allowedCats.includes(cid) && inhand) {
                updGameData('allowedCats', 'push', cid)
            } else if (gameData.allowedCats.includes(cid) && !inhand) {
                updGameData('allowedCats', 'remove', cid)
            }
        });
        refreshCards();
    }
    if (cardPlayed && gameData.allowedMikes.includes(cid) && (card.ownerId === window.selfId) && mikeDropsEnabled?.value() && !actionSilenced) {
        awaitingMike = true;
        updGameData('mikes', 'remove', cid);
        updGameData('allowedMikes', 'remove', cid);
    }
    if (cardPlayed && gameData.allowedCats.includes(cid) && (card.ownerId === window.selfId) && kittyCatsEnabled?.value() && !actionSilenced) {
        awaitingKitty = true;
        updGameData('cats', 'remove', cid);
        updGameData('allowedCats', 'remove', cid);
    }
    if (data.action === 'getPlayableCards') {
        if (awaitingMike) {
            window.socketGame.send(JSON.stringify({action: "endTurn"}));
            iconToast('mikeDrop', 'mike', 'mike', lastCard.name)
            awaitingMike = false;
        }
        if (awaitingKitty) {
            kittytime(lastCard);
            awaitingKitty = false;
        }
    }
    if (data.action === "getDoingEffect" && healableActionPowers?.value()) {
        const healCards = ['Heal', 'Asriel', 'Cafe Table']
        if (healCards.includes(JSON.parse(data.card).name)) {
            JSON.parse(data.affecteds).forEach((cid) => {
                updGameData('mikes', 'remove', cid);
                updGameData('cats', 'remove', cid);
                updGameData('allowedMikes', 'remove', cid);
                updGameData('allowedCats', 'remove', cid);
                updGameData('bricks', 'remove', cid);
                updGameData('equations', 'remove', cid);
                updGameData('stupor', 'remove', cid);
                updGameData('bitflipped', 'remove', cid);
                updGameData('sludge', 'remove', cid);
            });
        }
    }
    if (logChat?.value() && data.action === "getEmote") {
        if (data.idUser === window.userId) {
            $('#log').prepend(`<div><span class="${window.yourSoul.name}" style="text-decoration: underline;"><img src="images/souls/${window.yourSoul.name}.png">${$('#yourUsername').text()}</span>: <img src="images/emotes/${data.emoteImage}.png"></div>`)
        } else {
            $('#log').prepend(`<div><span class="${window.enemySoul.name}" style="text-decoration: underline;"><img src="images/souls/${window.enemySoul.name}.png">${$('#enemyUsername').text()}</span>: <img src="images/emotes/${data.emoteImage}.png"></div>`)
        }
    }
    if (randomizeAvatarAuto?.value() && data.action === "getResult" && !window.spectate) {
        setRandomAvatar();
        iconToast('bitflipped', 'error', 'game-end');
    }
    if (randomizeProfileAuto?.value() && data.action === "getResult" && !window.spectate) {
        setRandomProfile();
    }
    if (data.action === "getBotDelay" && detectBots?.value() && !facingBot && !window.spectate) {
        facingBot = true;
        iconToast('bitflipped', 'bot', 'facing-bot');
        $("#enemyUsername").append(` <span class="COMMON">${randi18n('gs.game-bot')}</span>`);

        switch (Math.floor(Math.random() * 4)) {
            case 0:
                $("#enemyAvatar").attr('src', 'https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/Common_Bot.png')
                $("#enemyAvatar").attr('class', 'avatar COMMON pointer')
                $("#enemyAvatar").attr('title', 'Common Bot')
                break;
            case 1:
                $("#enemyAvatar").attr('src', 'images/avatars/Rare_Bot.png')
                $("#enemyAvatar").attr('class', 'avatar RARE pointer')
                $("#enemyAvatar").attr('title', 'Rare Bot')
                break;
            case 2:
                $("#enemyAvatar").attr('src', 'images/avatars/Epic_Bot.png')
                $("#enemyAvatar").attr('class', 'avatar EPIC pointer')
                $("#enemyAvatar").attr('title', 'Rare Bot')
                break;
            case 3:
                $("#enemyAvatar").attr('src', 'images/avatars/Legendary_Bot.png')
                $("#enemyAvatar").attr('class', 'avatar LEGENDARY pointer')
                $("#enemyAvatar").attr('title', 'Legendary Bot')
                break;
        }
    }
});
plugin.events.on('ChatMessage', (data) => {
    if (logChat?.value() && ingame && $('#log').length && data.action === 'getMessage') {
        const user = JSON.parse(data.chatMessage).user.id
        const message = JSON.parse(data.chatMessage).message
        if (user === window.userId) {
            $('#log').prepend(`<div><span class="${window.yourSoul.name}" style="text-decoration: underline;"><img src="images/souls/${window.yourSoul.name}.png">${$('#yourUsername').text()}</span>: <span style="color: thistle">${message}</span></div>`)
        } else if (user === window.opponentId) {
            $('#log').prepend(`<div><span class="${window.enemySoul.name}" style="text-decoration: underline;"><img src="images/souls/${window.enemySoul.name}.png">${$('#enemyUsername').text()}</span>: <span style="color: thistle">${message}</span></div>`)
        }
    }
});

function iconToast(icon, title, text = title, ...transParams) {
    title = `<img src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${icon}.png"> ${randi18n('gs.alert-title-' + title)}`;
    plugin.toast({
        title: title,
        text: randi18n('gs.alert-' + text, ...transParams),
        timeout: 5000,
    })
}
var transParams;
function kittytime(card) {
    let kittymind = [...possibleKitties?.value().keys()]
    transParams = []
    let kittytype = kittymind.gs_random();
    switch (kittytype) {
        case `foreign`: evilForeignKitty(); break;
        case `asleep`: break;
        case `chat`: chattyKitty(); break;
        case `emote`: emotingKitty(); break;
        case `fall`: window.shakeScreen(); break;
        case `family`: familyKitty(card); break;
        case `lights`: if ($("#gsFlashlight").length) { removeFlashlight() } else { createFlashlight() } break;
        case `soulcolors`: shuffleSouls(1); break;
        case `endturn`: window.socketGame.send(JSON.stringify({action: "endTurn"})); break;
        case `shred`: if (card.rarity !== 'TOKEN') { shredKitty(card); break; } kittytime(card); return;
        case `clipboard`: navigator.clipboard.writeText(randi18n('gs.alert-title-kitty')); break;
        case `dvd`: if ($("#gsDVD").length) { removeDVD(); } else { createDVD(); }; break;
        case `surrender`: if (window.turn < 5) { window.socketGame.send(JSON.stringify({action: "surrender"})) } else { kittytype = 'surrendernt' } break;
        default: kittytype = 'error'; return;
    }
    iconToast('kittyCat', 'kitty', 'kitty-' + kittytype, ...transParams)
}

function evilForeignKitty() {
    const langs = ['en', 'es', 'ru', 'it', 'de', 'cn'];
    var langpoll = langs.indexOf($.i18n().locale)
    var lang = langs[langpoll];
    while (lang === $.i18n().locale) {
        lang = langs.gs_random()
    }
    defaultTranslations(lang);
    transParams.push($.i18n('chat-' + lang));
}

function chattyKitty() {
    for (let i = 1; i <= 16; i++) { openRoomRandom(i); };
}

function kill() {
    console.log([...possibleKitties?.value().keys()])
}

window.kill = kill;

function openRoomRandom(id) {
    window.openRoom(id)
    const $chat = $(`#chat-public-${id}`)
    $chat.css('top', window.randInt(50, 400));
    $chat.css('left', window.randInt(0, 1000));
}

function emotingKitty() {
    const emotes = window.chatEmotes.map(emote => emote.id) ?? [];
    const id = emotes.gs_random().toString();
    if (id) {
        window.socketGame.send(JSON.stringify({action: "emote", id: id}));
    }
}

function familyKitty(card) {
    const cardMainTribe = card.tribes[0] || null;
    const tribes = ['SNAILS', 'TEMMIE', 'ARACHNID', 'DOG']
    window.showTribeCards(cardMainTribe ?? tribes.gs_random())
}

function shredKitty(card) {
    const idCard = card.id
    const shiny = card.shiny ? true : false
    $.ajax({
            url: 'CraftConfig',
            type: "POST",
            dataType: "json",
            data: JSON.stringify({action: "disenchant", idCard: parseInt(idCard), isShiny: shiny}),
            contentType: "application/json",
    });
    transParams.push(card.name);
}

function mathtime(card) {
    $('*:not(:has(.mulligan))').modal('hide');
    const doableYourTurn = equationsDoableDuring?.value() === 'your turn only' && window.userTurn === window.userId
    const doableEnemyTurn = equationsDoableDuring?.value() === 'enemy turn only' && window.userTurn !== window.userId
    const doable = doableYourTurn || doableEnemyTurn || equationsDoableDuring?.value() === 'any time'
    if (!doable) {
        iconToast('genericFail', 'not-allowed', !doableYourTurn ? 'equation-not-your-turn' : 'equation-not-enemy-turn');
        return;
    }
    if (typeof card === 'string') {
        card = JSON.parse(card)
    }
    const $htmlCard = getElementByCard(card);
    function operand(seed) {
        const lowerLimit = equationsNegatives.value() ? equationsMaxOperand.value() * -1 : 0
        const upperLimit = equationsMaxOperand.value() ?? 1
        return seededRandInt(lowerLimit, upperLimit, seed)
    }
    var operands, answer, type
    function makeEquation(seed, forceType) {
        operands = [operand(seed), operand(seed + 1), operand(seed + 2), operand(seed + 3)]
        if (!forceType) {
            if (equationsAddSubtract.value() && !equationsMultiplyDivide.value()) {
                if (seededRandInt(0, 1, seed)) {
                    type = 'add';
                } else {
                    type = 'subtract';
                }
            } else if (!equationsAddSubtract.value() && equationsMultiplyDivide.value()) {
                if (seededRandInt(0, 1, seed)) {
                    type = 'multiply';
                } else {
                    type = 'divide';
                }
            } else if (equationsAddSubtract.value() && equationsMultiplyDivide.value()) {
                switch (seededRandInt(0, 3, seed)) {
                    case 0: type = 'add'; break;
                    case 1: type = 'subtract'; break;
                    case 2: type = 'multiply'; break;
                    case 3: type = 'divide'; break;
                }
            } else {
                type = 'dumb';
            }
        } else {
            type = forceType
        }
        switch (type) {
            case 'add': answer = operands[0] + operands[1]; break;
            case 'subtract': answer = operands[0] - operands[1]; break;
            case 'multiply': answer = operands[0] * operands[1]; break;
            case 'divide': answer = operands[0] / operands[1]; break;
            case 'dumb': answer = operands[0]; break;
            default: answer = operands[0]; break;
        }
        if (!equationsNegatives.value() && answer < 0) {makeEquation(seed + 1, type)}
        if (!Number.isInteger(answer)) {makeEquation(seed + 1, type)}
        if (answer === undefined) {makeEquation(seed + 1, type)}
    }
    makeEquation(window.gameId ^ card.id)
    bootstrapPrompt(randi18n('gs.math-title', card.name), randi18n('gs.math-q-' + type, ...operands), ` `, function(input) {
        if (input == answer) {
            iconToast('equation', 'equation-win', 'equation-win', card.name)
            updGameData('equationsWon', 'push', card.id)
            refreshCards()
        } else {
            switch (equationsPenalty.value()) {
                case 'none': iconToast('genericFail', 'equation-fail', 'equation-fail-nopenalty', card.name); break;
                case 'end turn':
                    window.socketGame.send(JSON.stringify({action: "endTurn"}));
                    iconToast('genericFail', 'equation-fail', 'equation-fail-endturn', card.name);
                    break;
                case 'surrender':
                    if (window.turn < 5) {
                        window.socketGame.send(JSON.stringify({action: "surrender"}));
                        iconToast('genericFail', 'equation-fail', 'equation-fail-surrender', card.name);
                    } else {
                        iconToast('genericFail', 'equation-fail', 'equation-fail-surrendernt', card.name)
                    }
                    break;
            }
        }
    });
}

window.mathtime = mathtime;

function getElementByCard(card) {
    return $(`#${card.id}`);
}
function getCardFromElement($element) {
    return $element.find('.cardObject');
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
let dvdAnim = null;
let resizeHandler = null;
function createDVD() {
    removeDVD();
    let $dvd = $("<div id='gsDVD'></div>").html(`
        <img src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/dvdlogo.svg">
    `);
    $("body").append($dvd);
    const $img = $dvd.find('img');
    const $container = $('#gsDVD');

    $img.width(dvdSize?.value())

    let x = Math.random() * ($(window).width() - $img.width());
    let y = Math.random() * ($(window).height() - $img.height());

    let speed = dvdSpeed?.value()
    let dx = Math.random() < 0.5 ? +speed : -speed;
    let dy = Math.random() < 0.5 ? +speed : -speed;

    function bounce() {
        const color = Math.floor(Math.random() * 360);
        $img.css('filter', `hue-rotate(${color}deg)`);
    }

    bounce();

    function animate() {
        x += dx;
        y += dy;

        if (x <= 0 || x + $img.width() >= $(window).width()) {
            dx *= -1;
            bounce();
        }
        if (y <= 0 || y + $img.height() >= $(window).height()) {
            dy *= -1;
            bounce();
        }

        $img.css({ left: x + 'px', top: y + 'px' });
        dvdAnim = requestAnimationFrame(animate);
    }

    dvdAnim = requestAnimationFrame(animate);

    resizeHandler = function() {
        x = Math.min(x, Math.max(0, $(window).width() - $img.width()));
        y = Math.min(y, Math.max(0, $(window).height() - $img.height()));
    };
    $(window).on('resize', resizeHandler);
}
function removeDVD() {
    if (dvdAnim !== null) {
        cancelAnimationFrame(dvdAnim);
        dvdAnim = null;
    }
    if (resizeHandler !== null) {
        $(window).off('resize', resizeHandler);
        resizeHandler = null;
    }
    $('#gsDVD').remove();
}

plugin.events.on(':preload', () => {
    frameStyles();
    rarityStyles(raritySkins?.value());
    cardModifier(visualModifier?.value());
    siteFilter(crispiness?.value(), blurriness?.value(), greyscale?.value(), invert?.value());
    monochromeCopiesToggle(copiesAreMonochrome?.value());
    updateFlashlightRadius(flashlightRadiusInput?.value());
    updateFlashlightImg(flashlightStyle?.value());
    imgPixelToggle(pixelImageRendering?.value());
    for (var i in obscSettings) { obscSettings[i].elements.forEach(k => obscure(k, obscSettings[i].value, true)) };
    if (noSilence?.value()) {hide('cardSilence', true)};
    if (dvdBounce?.value()) {createDVD()};
    if (lightsOff?.value()) {createFlashlight()};
    shinyDisplayToggle(shinyDisplay?.value());
    statsOnTopToggle(statsOnTop?.value());
    styleTabless(tabless?.value());
    if (mulliganInfo?.value()) {initMulliganInfo()}
    updateSoulColor('DETERMINATION', dtColor?.value());
    updateSoulColor('INTEGRITY', integColor?.value());
    updateSoulColor('KINDNESS', kindnessColor?.value());
    updateSoulColor('JUSTICE', justiceColor?.value());
    updateSoulColor('PERSEVERANCE', pvColor?.value());
    updateSoulColor('BRAVERY', braveryColor?.value());
    updateSoulColor('PATIENCE', patienceColor?.value());
    settingOverriddenStyles();
    if (gsVersion.value() != pluginVersion) {
        gsVersion.set(pluginVersion);
        window.gsUpdateToast();
    }
});

plugin.events.on('translation:loaded', () => {
    initGsTranslations();
    initCustomTranslations();
    staticStyles();
    cardHighlightStyles(cardHighlights?.value());
    loadLibraries();
});


function setProfileSkin(profileSkin) {
    var profileSkinBackgrounds = ['Vaporwave', 'Sans Bar', 'Holy War', 'Spider Party', 'Halloween2020', 'Memories of the Snow', 'Smartopia Arrived'];
    var profileSkinMusics = ['Vaporwave', 'Spider Party', 'Memories of the Snow', 'Smartopia Arrived'];

    if (profileSkinBackgrounds.includes(profileSkin.name)) {
        setBg(profileSkin.image, !profileSkinMusics.includes(profileSkin.name))
    } else {
        rollBgSmart()
    }
}

var bgm;
plugin.events.on('GameStart', () => {
    plugin.events.on('connect', (data) => {
        const profileSkin = JSON.parse(data.yourProfileSkin)
        const savedBg = sessionStorage.getItem(`underscript.bgm.${window.gameId}`);
        const underscriptPersistBg = plugin.settings().value('underscript.persist.bgm');
        function loadBg() {
            if (savedBg && underscriptPersistBg) {
                setBg(savedBg);
            } else {
                setProfileSkin(profileSkin)
            }
        }

        loadBg()
        $('html').unbind('click');
        $('html').click(function () {
            window.playBackgroundMusic(bgm);
            $('html').unbind('click');
        });
        rollEventArrays();
    });
});

plugin.events.on(':load', () => {
    if (statFilters?.value()) {createStatFilters()}
    if (powerFilters?.value() !== 'off') {createPowerFilters()}
});

function removeStatFilters() {
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
    removeStatFilters();
    const includePaths = ['/Crafting', '/Decks'];
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

function createPowerFilters() {
    removePowerFilters();
    const includePaths = ['/Crafting', '/Decks'];
    if (!includePaths.includes(window.location.pathname)) { return; }
    style('powerFiltersSpacing', 'remove')

    const $newFilterRow = $('<p>', {
        style: 'text-align: center; font-size: 16px;',
        class: 'filter',
        id: 'gsPowerFilterRow',
    })

    var powers = {}
    if (powerFilters?.value() === 'standard' || powerFilters?.value() === 'standard + galascript') {
        style('powerFiltersSpacing', 'add', '.filter {margin: 0 0 4px;}')
        filterPowersStandard.forEach((power) => {
            var $powerFilter = $('<label>')
            $powerFilter.append($('<input>', {
                id: `${power.name}Input`,
                type: 'checkbox',
                class: 'powerInput',
                onchange: 'applyFilters(); showPage(0);'
            }))
            var link = '';
            switch (powerSkins.value()) {
                case 'Ancient': link = power.name === 'disarmed' ? `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/ancient-${power.icon}.png` : `images/powers/${power.icon}.png`; break;
                case 'Neon': link = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/neon-${power.icon}.png`; break;
                case 'Balatro': link = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/balatro-${power.icon}.png`; break;
                default: link = `images/powers/${power.icon}.png`
            }
            $powerFilter.append($('<img>', {
                src: link,
            }))
            powers[`${power.name}Input`] = $powerFilter
        })
    }
    if (powerFilters?.value() === 'standard + galascript') {
        filterPowersGalascript.forEach((power) => {
            var $powerFilter = $('<label>')
            $powerFilter.append($('<input>', {
                id: `${power.name}Input`,
                type: 'checkbox',
                class: 'powerInput',
                onchange: 'applyFilters(); showPage(0);'
            }))
            var link = '';
            switch (powerSkins.value()) {
                case 'Neon': link = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/neon-${power.icon}.png`; break;
                case 'Balatro': link = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/balatro-${power.icon}.png`; break;
                default: link = `https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/powers/${power.icon}.png`
            }
            $powerFilter.append($('<img>', {
                src: link,
            }))
            powers[`${power.name}Input`] = $powerFilter
        })
    }
    if (window.location.pathname === '/Decks') {
        if (powerFilters?.value() === 'standard') {
            style('powerFiltersSpacing', 'add', '#gsPowerFilterRow img {margin: 0 0px;}');
        } else {
            style('powerFiltersSpacing', 'add', '#gsPowerFilterRow img {margin: 0 -1px;}');
        }
    } else {
        if (powerFilters?.value() === 'standard') {
            style('powerFiltersSpacing', 'add', '#gsPowerFilterRow img {margin: 0 2px;}');
        } else {
            style('powerFiltersSpacing', 'add', '#gsPowerFilterRow img {margin: 0 1px;}');
        }
    }

    for (const $filter in powers) {
        $newFilterRow.append(powers[$filter]);
    }

    $('.filter:last').after($newFilterRow)
}

function removePowerFilters() {
    $('#gsPowerFilterRow').remove()
    style('powerFiltersSpacing', 'remove')
}

plugin.events.on('Settings:open', () => createTransHelper());

var selectedEl = null;
var siblingEl = null;
var pluralize = 1;
var allArtifacts = [];
var allTribes = [];
var allKeywords = [];
var allStatus = [];
var allSouls = [];
var allRarities = [];
var allDivisions = [];
var allGsTrans = [];
var yourAvatars = [];
var yourProfiles = [];

function loadLibraries() {
    if (!allArtifacts.length) {
        $.ajax({
            url: `${location.origin}/DecksConfig`,
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                allArtifacts = JSON.parse(data.allArtifacts);
            }
        });
    }
    if (!allTribes.length) {
        window.allCards.forEach(function (card) {
            card.tribes.forEach(function (tribe) {
                if (!allTribes.includes(tribe)) {allTribes.push(tribe)}
            });
        });
    }
    if (!allKeywords.length) {
        Object.entries($.i18n().messageStore.messages.en).forEach(([key, value])=> {
            if (key.startsWith("kw-") && !key.includes("desc")) {
                const keyword = key.replace("kw-", "").toUpperCase()
                if (!allKeywords.includes(keyword)) {allKeywords.push(keyword)}
            }
        });
        allKeywords.push("KR")
    }
    if (!allStatus.length) {
        var gsStatus = [];
        Object.entries($.i18n().messageStore.messages.en).forEach(([key, value])=> {
            if (key.startsWith("status-")) {
                const status = key.replace("status-", "").toUpperCase()
                if (!allStatus.includes(status)) {allStatus.push(status)}
            }
            if (key.startsWith("gs.status-")) {
                const status = key.replace("gs.status-", "galascript: ").toUpperCase()
                if (!gsStatus.includes(status)) {gsStatus.push(status)}
            }
        });
        allStatus = allStatus.sort()
        gsStatus = gsStatus.sort()
        allStatus = allStatus.concat(gsStatus)
    }
    if (!allSouls.length) {
        Object.keys($.i18n().messageStore.messages.en).forEach(([key, value]) => {
            if (key.startsWith("soul-") && !key.includes("desc")) {
                const soul = key.replace("soul-", "").toUpperCase()
                if (!allSouls.includes(soul)) {allSouls.push(soul)}
            }
        });
    }
    if (!allRarities.length) {
        Object.keys($.i18n().messageStore.messages.en).forEach(([key, value])=> {
            if (key.startsWith("rarity-") && !key.includes("MYTHIC")) {
                const rarity = key.replace("rarity-", "").toUpperCase()
                if (!allRarities.includes(rarity)) {allRarities.push(rarity)}
            }
        });
    }
    if (!allDivisions.length) {
        Object.keys($.i18n().messageStore.messages.en).forEach(([key, value])=> {
            if (key.startsWith("division-")) {
                const div = key.replace("division-", "").toUpperCase()
                if (!allDivisions.includes(div)) {allDivisions.push(div)}
            }
        });
    }
    if (!allGsTrans.length) {
        Object.entries($.i18n().messageStore.messages.en).forEach(([key, value])=> {
            if (key.startsWith("gs.") && !key.includes("alias") && !key.includes("status")) {
                if (!allGsTrans.includes(key)) {allGsTrans.push(key)}
            }
        });
    }
    if (!yourAvatars.length) {
        fetch('https://undercards.net/Avatars')
        .then(response => {
            return response.text();
        })
        .then(data => {
            const $avatarIds = $(data).find('.avatarsList [name="idAvatar"]')
            const $avatars = $(data).find('.avatarsList .avatar')
            $avatars.each((i) => yourAvatars.push(
                {
                    name: $($avatars[i]).attr('src').slice(15).slice(0, -4).replaceAll("_", " "),
                    src: $($avatars[i]).attr('src'),
                    id: $($avatarIds[i]).val()
                }
            ))
        })
        .catch((error) => {
            iconToast('genericFail', 'error', 'lib-error', randi18n('gs.avatar', 2), error)
        });
    }
    window.yourAvatars = yourAvatars;
    if (!yourProfiles.length) {
        fetch('https://undercards.net/ProfileSkins')
        .then(response => {
            return response.text();
        })
        .then(data => {
            const $profileIds = $(data).find('.table [name="idProfileSkin"]')
            const $profiles = $(data).find('.table .profileSkin')
            $profiles.each((i) => yourProfiles.push(
                {
                    name: $($profiles[i]).attr('title'),
                    src: $($profiles[i]).attr('src'),
                    id: $($profileIds[i]).val()
                }
            ))
        })
        .catch((error) => {
            iconToast('genericFail', 'error', 'lib-error', randi18n('gs.profile', 2), error)
        });
    }
}

function bootstrapPrompt(title, text, other, func) {
    window.BootstrapDialog.show({
        title: title,
        size: window.BootstrapDialog.SIZE_NORMAL,
        message: function() {
            if (typeof other === 'string') {
                return $('<div>')
                    .append(
                        $('<p>').text(text),
                        $('<input>', {
                            type: 'text',
                            id: 'gsBootstrapPrompt',
                            class: 'form-control',
                            placeholder: other,
                        }).autocomplete({ disabled: true })
                    );
            } else if (typeof other === 'object') {
                const $el = $('<div>')
                    .append(
                        $('<p>').text(text)
                    );
                const $sel =
                    $('<select>', {
                        id: 'gsBootstrapPrompt',
                        class: 'form-control',
                        css: {'color': 'white'},
                    })
                $.each(other, function(i, val) {
                    $sel.append( $('<option></option>').val(val).html(val).css({'color': val.includes("GALASCRIPT:") ? "thistle" : ""}) )
                });
                $el.append($sel)
                return $el;
            }
        },
        buttons: [{
            label: $.i18n('dialog-confirm'),
            cssClass: 'btn-primary',
            action: function (dialog) {
                dialog.close();
                const input =  $('#gsBootstrapPrompt').val();
                if (typeof func === "function") {
                    func(input);
                }
                selectedEl.focus();
            }
        }, {
            label: $.i18n('dialog-cancel'),
            cssClass: 'btn-default',
            action: function (dialog) {
                dialog.close();
            }
        }]
    });
}

function insert(text) {
    var pos = selectedEl.selectionStart
    var content = selectedEl.value
    selectedEl.value = content.substring(0, pos) + text + content.substring(pos)
}

function createTransHelper() {
    const $transHelper = $('<div>', {
        id: 'gsTransHelper',
        css: {display: 'none',
              position: 'absolute',
              background: '#000',
              padding: '10px',
              border: '1px solid #aaa',
              zIndex: '1800'
             }
    });
    const transHelperKeyContent = [
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnNewRow',
            value: 'Add new row'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnTransGuide',
            value: 'Translation guide'
        }),
        $('<p>', {
            class: 'gsTransHelperOption',
            id: 'category1'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnCardName',
            value: 'Card name'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnCardDesc',
            value: 'Card description'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnKeywordName',
            value: 'Keyword name'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnKeywordDesc',
            value: 'Keyword description'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnStatusDesc',
            value: 'Status (icon) description'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnRarityName',
            value: 'Rarity name'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnTribeName',
            value: 'Tribe name'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnArtifactName',
            value: 'Artifact name'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnArtifactDesc',
            value: 'Artifact description'
        }),
        $('<p>', {
            class: 'gsTransHelperOption',
            id: 'category2'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnCardAlias',
            value: 'Card alias'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnGalascript',
            value: 'Misc. Galascript strings'
        }),
    ]

    const transHelperValueContent = [
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnNewRow',
            value: 'Add new row'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnTransGuide',
            value: 'Translation guide'
        }),
        $('<p>', {
            class: 'gsTransHelperOption',
            id: 'category1'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnCardName',
            value: 'Card name'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnCardDesc',
            value: 'Card description'
        }),
        $('<p>', {
            class: 'gsTransHelperOption',
            id: 'category2'
        }),
        $('<input>', {
            class: 'gsTransHelperOption cost-color',
            type: 'button',
            id: 'gsBtnCOST',
            value: 'cost'
        }),
        $('<input>', {
            class: 'gsTransHelperOption atk-color',
            type: 'button',
            id: 'gsBtnATK',
            value: 'ATK'
        }),
        $('<input>', {
            class: 'gsTransHelperOption hp-color',
            type: 'button',
            id: 'gsBtnHP',
            value: 'HP'
        }),
        $('<input>', {
            class: 'gsTransHelperOption yellow',
            type: 'button',
            id: 'gsBtnG',
            value: 'G'
        }),
        $('<input>', {
            class: 'gsTransHelperOption PATIENCE',
            type: 'button',
            id: 'gsBtnCardRef',
            value: 'Card reference'
        }),
        $('<input>', {
            class: 'gsTransHelperOption underlined',
            type: 'button',
            id: 'gsBtnKeyword',
            value: 'Keyword'
        }),
        $('<input>', {
            class: 'gsTransHelperOption underlined',
            type: 'button',
            id: 'gsBtnTribe',
            value: 'Tribe'
        }),
        $('<input>', {
            class: 'gsTransHelperOption underlined',
            type: 'button',
            id: 'gsBtnArtifact',
            value: 'Artifact'
        }),
        $('<input>', {
            class: 'gsTransHelperOption DETERMINATION',
            type: 'button',
            id: 'gsBtnRarity',
            value: 'Rarity'
        }),
        $('<input>', {
            class: 'gsTransHelperOption underlined',
            type: 'button',
            id: 'gsBtnSoul',
            value: 'SOUL'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnStats',
            value: 'Stats'
        }),
        $('<input>', {
            class: 'gsTransHelperOption',
            type: 'button',
            id: 'gsBtnPlural',
            value: 'Pluralization set'
        }),
        $('<input>', {
            class: 'gsTransHelperOption SwitchHighlight_Left',
            type: 'button',
            id: 'gsBtnSwitchLeft',
            value: 'Left Switch'
        }),
        $('<input>', {
            class: 'gsTransHelperOption SwitchHighlight_Right',
            type: 'button',
            id: 'gsBtnSwitchRight',
            value: 'Right Switch'
        }),
        $('<input>', {
            class: 'gsTransHelperOption T_NEON',
            type: 'button',
            id: 'gsBtnDivision',
            value: 'Division'
        }),
        $('<input>', {
            class: 'gsTransHelperOption ucp',
            type: 'button',
            id: 'gsBtnUCP',
            value: 'UCP'
        }),
    ]

    function setMenu(x) {
        $transHelper.empty();
        if (x === 'key') {
            transHelperKeyContent.forEach(opt => $transHelper.append(opt));

            $('#category1').text('New...');
            $('#category2').text('Galascript');

            $('#gsBtnNewRow').on('click', function() {
                const translationAddBtn = document.getElementById("underscript.plugin.Galascript.customTranslations")
                translationAddBtn.click();
            });

            $('#gsBtnCardName').on('click', function() {
                bootstrapPrompt("New card name", "Select the card.", window.allCards.map(card => card.name).sort(), function (input) {
                    var id = window.getCardWithName(input)?.id ?? 0
                    selectedEl.value = `card-name-${id}`
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][`card-name-${id}`]
                    siblingEl.focus();
                })
            });
            $('#gsBtnCardDesc').on('click', function() {
                bootstrapPrompt("New card description", "Select the card.", window.allCards.map(card => card.name).sort(), function (input) {
                    var id = window.getCardWithName(input)?.id ?? 0
                    selectedEl.value = `card-${id}`
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][`card-${id}`]
                    siblingEl.focus();
                })
            });
            $('#gsBtnKeywordName').on('click', function() {
                bootstrapPrompt("New keyword name", "Select the keyword.", allKeywords.sort(), function (input) {
                    if (input === "KR") {
                        selectedEl.value = `stat-kr`
                        siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][`stat-kr`]
                    } else {
                        selectedEl.value = `kw-${input.toLowerCase()}`
                        siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][`kw-${input.toLowerCase()}`]
                    }
                    siblingEl.focus();
                })
            });
            $('#gsBtnKeywordDesc').on('click', function() {
                bootstrapPrompt("New keyword description", "Select the keyword.", allKeywords.sort(), function (input) {
                    selectedEl.value = `kw-${input.toLowerCase()}-desc`
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][`kw-${input.toLowerCase()}-desc`]
                    siblingEl.focus();
                })
            });
            $('#gsBtnStatusDesc').on('click', function() {
                bootstrapPrompt("New status description", "Select the status.", allStatus, function (input) {
                    var status;
                    if (input.startsWith("GALASCRIPT: ")) {
                        status = `gs.status-${input.replace("GALASCRIPT: ", "").toLowerCase()}`
                    } else {
                        status = `status-${input.toLowerCase()}`
                    }
                    selectedEl.value = status
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][status]
                    siblingEl.focus();
                })
            });
            $('#gsBtnRarityName').on('click', function() {
                bootstrapPrompt("New rarity name", "Select the rarity.", ['BASE', 'TOKEN', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'DETERMINATION'], function (input) {
                    var rarity = `rarity-${input.toLowerCase()}`
                    selectedEl.value = rarity
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][rarity]
                    siblingEl.focus();
                })
            });
            $('#gsBtnTribeName').on('click', function() {
                bootstrapPrompt("New tribe name", "Select the tribe.", allTribes.sort(), function (input) {
                    var tribe = `tribe-${input.toLowerCase()}`
                    selectedEl.value = tribe
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][tribe]
                    siblingEl.focus();
                })
            });
            $('#gsBtnArtifactName').on('click', function() {
                bootstrapPrompt("New artifact name", "Select the artifact.", allArtifacts.map(art => art.name).sort(), function (input) {
                    const idArtifact = allArtifacts.find(art => art.name === input)?.id ?? 0
                    selectedEl.value = `artifact-name-${idArtifact}`
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][`artifact-name-${idArtifact}`]
                    siblingEl.focus();
                })
            });
            $('#gsBtnArtifactDesc').on('click', function() {
                bootstrapPrompt("New artifact description", "Select the artifact.", allArtifacts.map(art => art.name).sort(), function (input) {
                    const idArtifact = allArtifacts.find(art => art.name === input)?.id ?? 0
                    selectedEl.value = `artifact-${idArtifact}`
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][`artifact-${idArtifact}`]
                    siblingEl.focus();
                })
            });
            $('#gsBtnCardAlias').on('click', function() {
                bootstrapPrompt("New card alias", "Select the card. Card aliases are used for the \"Card Alias Lookup\" setting.", window.allCards.map(card => card.name).sort(), function (input) {
                    var id = window.getCardWithName(input)?.id ?? 0
                    selectedEl.value = `gs.card-alias-${id}`
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][`gs.card-alias-${id}`] ?? ""
                    siblingEl.focus();
                })
            });
            $('#gsBtnGalascript').on('click', function() {
                bootstrapPrompt("New Galascript string", "Select any translation custom-added by Galascript. More will be added along the way!", allGsTrans, function (input) {
                    selectedEl.value = input
                    siblingEl.value = $.i18n().messageStore.messages[$.i18n().locale][input] ?? ""
                    siblingEl.focus();
                })
            });
        } else if (x === 'value') {
            transHelperValueContent.forEach(opt => $transHelper.append(opt));

            $('#category1').text('Replace...');
            $('#category2').text('Insert...');

            $('#gsBtnNewRow').on('click', function() {
                const translationAddBtn = document.getElementById("underscript.plugin.Galascript.customTranslations")
                translationAddBtn.click();
            });
            $('#gsBtnCardName').on('click', function() {
                bootstrapPrompt("Getting card name", "Select the card.", window.allCards.map(card => card.name).sort(), function (input) {
                    var id = window.getCardWithName(input)?.id ?? 0
                    selectedEl.value = $.i18n().messageStore.messages[$.i18n().locale][`card-name-${id}`];
                })
            });
            $('#gsBtnCardDesc').on('click', function() {
                bootstrapPrompt("Getting card description", "Select the card.", window.allCards.map(card => card.name).sort(), function (input) {
                    var id = window.getCardWithName(input)?.id ?? 0
                    selectedEl.value = $.i18n().messageStore.messages[$.i18n().locale][`card-${id}`];
                })
            });
            $('#gsBtnCOST').on('click', function() {
                insert('{{COST}}');
                selectedEl.focus();
            });
            $('#gsBtnATK').on('click', function() {
                insert('{{ATK}}');
                selectedEl.focus();
            });
            $('#gsBtnHP').on('click', function() {
                insert('{{HP}}');
                selectedEl.focus();
            });
            $('#gsBtnG').on('click', function() {
                insert('{{GOLD}}');
                selectedEl.focus();
            });
            $('#gsBtnCardRef').on('click', function() {
                bootstrapPrompt("Inserting card reference", "Select the card.", window.allCards.map(card => card.name).sort(), function (input) {
                    insert(`{{CARD:${window.getCardWithName(input)?.id ?? 0}|1}}`);
                }, true)
            });
            $('#gsBtnCardRef').attr('onmouseover', 'displayCardHelp(this, 775)')
            $('#gsBtnCardRef').attr('onmouseleave', 'removeCardHover()')

            $('#gsBtnKeyword').on('click', function() {
                bootstrapPrompt("Inserting keyword", "Select the keyword.", allKeywords.sort(), function (input) {
                    if (input === "KR") {
                        insert(`{{KR}}`);
                    } else {
                        insert(`{{KW:${input}}}`);
                    }
                })
            });
            $('#gsBtnTribe').on('click', function() {
                bootstrapPrompt("Inserting tribe", "Select the tribe.", allTribes.sort(), function (input) {
                    insert(`{{TRIBE:${input}}}`)
                })
            });
            $('#gsBtnArtifact').on('click', function() {
                bootstrapPrompt("Inserting artifact", "Select the artifact.", allArtifacts.map(art => art.name).sort(), function (input) {
                    const idArtifact = allArtifacts.find(art => art.name === input)?.id ?? 0
                    insert(`{{ARTIFACT:${idArtifact}}}`)
                })
            });
            $('#gsBtnRarity').on('click', function() {
                bootstrapPrompt("Inserting rarity", "Select the rarity.", allRarities, function (input) {
                    insert(`{{RARITY:${input}}}`)
                })
            });
            $('#gsBtnSoul').on('click', function() {
                bootstrapPrompt("Inserting SOUL", "Select the SOUL.", allSouls, function (input) {
                    insert(`{{SOUL:${input}}}`)
                })
            });
            $('#gsBtnStats').on('click', function() {
                insert('{{STATS:1|1|1}}')
                selectedEl.focus();
            });
            $('#gsBtnPlural').on('click', function() {
                insert('{{PLURAL:$1|Sample|Samples}}')
                selectedEl.focus();
            });
            $('#gsBtnSwitchLeft').on('click', function() {
                insert('{{SWITCH_LEFT:1|Sample}}')
                selectedEl.focus();
            });
            $('#gsBtnSwitchRight').on('click', function() {
                insert('{{SWITCH_RIGHT:1|Sample}}')
                selectedEl.focus();
            });
            $('#gsBtnDivision').on('click', function() {
                bootstrapPrompt("Inserting ranked division", "Select the ranked division. Note: Old rank names currently do not work.", allDivisions, function (input) {
                    insert(`{{DIVISION:${input}}}`)
                })
            });
            $('#gsBtnUCP').on('click', function() {
                insert('{{UCP:Sample}}');
                selectedEl.focus();
            });
        }
    }

    $('body').append($transHelper);

    $(document).on('click contextmenu', function (e) {
        const $target = $(e.target);
        if (!$target.closest(selectedEl).length) {
            $transHelper.hide();
        }
    });

    const observer = new MutationObserver((mutations, obs) => {
        document.querySelectorAll('[id^="underscript.plugin.Galascript.customTranslations"]').forEach(el => {
            if (!el.dataset.gsMenuLoaded) {
                el.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    selectedEl = el;
                    siblingEl = $(el).siblings(":not(button, div)")[0];
                    setMenu(el.id.endsWith('value') ? 'value' : 'key')
                    loadLibraries()
                    $transHelper.css({
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

function creditTitleSmall(title) {
    return `<h6>${title}</h4>`
}

function creditRow(contribution, creator) {
    return `<h5>${contribution}<span class="coolguy">${creator}</span></h5>`
}
function creatorRow(creator) {
    return `<h5 style="text-align: center; color: thistle;">${creator}</h5>`
}
function link(display, link, icon, htmlIcon = '') {
    if (icon) {htmlIcon = `<img style="width: 14px;" src="https://raw.githubusercontent.com/galadinowo/galascript/refs/heads/main/images/misc/${icon}.png">`}
    return `<a target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;" href="${link}">${htmlIcon}${display}</a>`
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
    ${creditRow("Snails", "Emerald")}
    ${creditRow("Waterfall", "Emerald")}
    ${creditRow("Yet Darker", "Za")}
    ${creditRow("Steamworks", "Shyren")}
    ${creditRow("Bone", "Diamaincrah")}
    ${creditRow("Furry Sans", "Diamaincrah")}
    ${creditRow("OvenBreak", "Shyren")}
    ${creditRow("Inscrypted", "Dylan Hall")}
    ${creditRow("It's TV Time!", "Dylan Hall")}
    ${creditRow("Cold Place", "Dylan Hall")}
    ${creditRow("Slay the Spire", "Bartwk")}
${creditTitle("Rarity icons")}
    ${creditRow("Hollow Knight", "Jaku")}
    ${creditRow("FNAFB", "JaimeezNuts")}
    ${creditRow("Celeste", "Emerald")}
    ${creditRow("OvenBreak", "Shyren")}
${creditTitle("Fair use assets")}
${creditTitleSmall("I do not own, nor did I ask for permission to use, any of the following assets. They belong to their respective intellectual property holders. Galascript makes use of these copyrighted materials under the fair use doctrine, Section 107 of U.S. Copyright Law")}
    ${creditRow("Pokecard 1996 - Monster", link("ILKCMP", "https://www.deviantart.com/ilkcmp", "deviantart_thistle"))}
    ${creditRow("Pokecard 1996 - Spell", link("icycatelf", "https://www.deviantart.com/icycatelf", "deviantart_thistle"))}
    ${creditRow("Balatro assets", "Balatro by LocalThunk")}
    ${creditRow("Showdown frame misc assets", "Pokémon Showdown", "https://pokemonshowdown.com")}
    ${creditRow("", "© The Pokémon Company Intl.")}
${creditTitleSmall("Galascript is a fan project solely intended for non-commercial use!")}
${creditTitle("Special Thanks")}
    ${creatorRow("feildmaster (again)")}
    ${creatorRow("Onutrem")}
    ${creatorRow("Galascript's early supporters and testers")}
    ${creatorRow("And you. Thank you <3")}
`