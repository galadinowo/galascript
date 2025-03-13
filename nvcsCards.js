function nvcsCards(card) {
    if (typeof dustpile === 'undefined') var dustpile = 0;
    return {
        0: {
            key: 'boneBox',
            name: 'Bone Box',
            info: 'Displays Bone Box\'s card pool',
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
        7: {
            key: 'recruitment',
            name: 'Recruitment',
            info: 'Displays Recruitment\'s card pool',
            pool: [[allCards, ['rarity', 'cost', 'typeCard'], ['includes', 'includes', '==='], [['BASE', 'COMMON', 'RARE', 'EPIC'], [4, 5], 0]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        8: {
            key: 'draft',
            name: 'Draft',
            info: 'Displays Draft\'s card pool',
            pool: [[allCards, ['rarity', 'cost', 'typeCard'], ['includes', 'includes', '==='], [['BASE', 'COMMON', 'RARE', 'EPIC'], [5, 6], 0]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        9: {
            key: 'dtExtractor',
            name: 'DT Extractor',
            info: 'Displays DT Extractor\'s card pool',
            pool: [[allCards, ['rarity'], ['==='], ['DETERMINATION']]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        10: {
            key: 'junkForSale',
            name: 'Junk for Sale',
            info: 'Displays Junk for Sale\'s card pool',
            pool: [[allCards, ['rarity', 'cost', 'typeCard'], ['includes', '===', '==='], [['BASE', 'COMMON', 'RARE', 'EPIC'], 3, 0]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        11: {
            key: 'casinoSans',
            name: 'Casino Sans',
            info: 'Displays Casino Sans\'s card pool',
            pool: [[allCards, ['rarity'], ['==='], ['TOKEN']]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        12: {
            key: 'tutorialGuy',
            name: 'Tutorial Guy',
            info: 'Displays Tutorial Guy\'s card pool',
            pool: [[allCards, ['rarity'], ['==='], ['BASE']]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        13: {
            key: 'eggplantTrashbag',
            name: 'Eggplant Trashbag',
            info: 'Displays Eggplant Trashbag\'s card pool',
            pool: [[allCards, ['rarity', 'typeCard'], ['===', '==='], ['BASE', 1]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        },
        14: {
            key: 'resurrection',
            name: 'Resurrection',
            info: 'Displays Resurrection\'s card pool (from your dustpile)',
            pool: [[dustpile, ['creatorInfo.typeCreator'], ['!=='], [undefined]]],
            sprite: 'NVCSactive',
            transKey: 'status-nvcs-pool',
        }
    }
}
