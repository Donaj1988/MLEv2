const C = {
    TIERS: {
        SETTLEMENT: 'settlement',
        SMALL_VILLAGE: 'small_village',
        VILLAGE: 'village',
        SMALL_TOWN: 'small_town',
        TOWN: 'town',
    },
    BUILDINGS: {
        SETTLERS_CABIN: 'settlersCabin',
        WORKERS_CAMP: 'workersCamp',
        BUILDERS_SHED: 'buildersShed',
        REEVES_HOUSE: 'reevesHouse',
        WORKERS_LODGE: 'workersLodge',
        BUILDERS_WORKSHOP: 'buildersWorkshop',
        VILLAGE_HALL: 'villageHall',
        WORKERS_QUARTERS: 'workersQuarters',
        MASTER_BUILDERS_HOUSE: 'masterBuildersHouse',
        INN: 'inn',
        TAVERN: 'tavern',
        CHURCH: 'church',
        HEALERS_HUT: 'healersHut',
        // Potencjalnie więcej kluczy w przyszłości
    },
    RESOURCES: {
        WOOD: 'wood',
        STONE: 'stone',
        CLAY: 'clay',
        GRAIN: 'grain',
        WATER: 'water',
        BREAD: 'bread',
        BEER: 'beer',
        MEAT: 'meat',
        // Itd. dla wszystkich surowców
    },
    WORKERS: {
        BUILDER: 'builder',
        FOREMAN: 'foreman',
        FOREMAN_ASSISTANT: 'foremanAssistant',
        MASTER_BUILDER: 'masterBuilder',
        CLERK: 'clerk',
        INNKEEPER: 'innkeeper',
        TAVERN_MAID: 'tavernMaid',
        PRIEST: 'priest',
        HEALER: 'healer'
        // Itd. dla wszystkich pracowników
    }
};

const resourceCategoriesConfig = {
    materials: { resources: ['wood', 'stone', 'clay', 'bricks', 'charcoal'] },
    metals_and_tools: { resources: ['ironOre', 'ironIngots', 'tools'] },
    food_and_drinks: { resources: ['grain', 'flour', 'bread', 'water', 'fish', 'cattle', 'meat', 'hops', 'beer', 'honey'] },
    artisan_goods: { resources: ['rawhide', 'leather', 'wool', 'fabric', 'pottery', 'wax', 'herbs'] },
    luxury_goods: { resources: ['clothes', 'candles'] }
};

const resourceIcons = {
    wood: 'pic/icons/wood.png', stone: 'pic/icons/stone.png', grain: 'pic/icons/grain.png', water: 'pic/icons/water.png', flour: 'pic/icons/flour.png', bread: 'pic/icons/bread.png', cattle: 'pic/icons/cattle.png', meat: 'pic/icons/meat.png', hops: 'pic/icons/hops.png', beer: 'pic/icons/beer.png', rawhide: 'pic/icons/rawhide.png', leather: 'pic/icons/leather.png', honey: 'pic/icons/honey.png', wax: 'pic/icons/wax.png', candles: 'pic/icons/candles.png', fish: 'pic/icons/fish.png', clay: 'pic/icons/clay.png', pottery: 'pic/icons/pottery.png', wool: 'pic/icons/wool.png', fabric: 'pic/icons/fabric.png', clothes: 'pic/icons/clothes.png', herbs: 'pic/icons/herbs.png', bricks: 'pic/icons/bricks.png',
    charcoal: 'pic/icons/charcoal.png', ironOre: 'pic/icons/iron_ore.png', ironIngots: 'pic/icons/iron_ingot.png', tools: 'pic/icons/tools.png'
};

const workerConfig = {
    categories: {
        'Basic Workers': ['wood', 'stone', 'clayMiner', 'water', 'grain', 'hopFarmer', 'beekeeper', 'fisherman', 'shepherd', 'ironMiner'],
        'Food Processors': ['miller', 'baker', 'rancher', 'butcher', 'brewer'],
        'Artisans': ['tanner', 'potter', 'brickmaker', 'weaver', 'tailor', 'herbalist', 'healer', 'candlemaker', 'charcoalBurner', 'smelter', 'blacksmith'],
        'Others': ['builder', 'foreman', 'foremanAssistant', 'masterBuilder'],
        'Service Workers': ['innkeeper', 'tavernMaid', 'priest', 'clerk']
    }
};

const workerData = {
    wood: { nameKey: "workerNames.wood", produces: { wood: 0.8 } },
    stone: { nameKey: "workerNames.stone", produces: { stone: 0.8 } },
    grain: { nameKey: "workerNames.grain", produces: { grain: 1.2 } },
    hopFarmer: { nameKey: "workerNames.hopFarmer", produces: { hops: 0.6 } },
    water: { nameKey: "workerNames.water", produces: { water: 0.8 } },
    miller: { nameKey: "workerNames.miller", produces: { flour: 1.0 }, consumes: { grain: 0.8 } },
    baker: { nameKey: "workerNames.baker", produces: { bread: 1.0 }, consumes: { flour: 0.6, water: 0.2 } },
    rancher: { nameKey: "workerNames.rancher", produces: { cattle: 0.2, rawhide: 0.2 }, consumes: { grain: 0.5, water: 0.1 } },
    butcher: { nameKey: "workerNames.butcher", produces: { meat: 0.5 }, consumes: { cattle: 0.1 } },
    tanner: { nameKey: "workerNames.tanner", produces: { leather: 0.5 }, consumes: { rawhide: 0.5, water: 0.2 } },
    brewer: { nameKey: "workerNames.brewer", produces: { beer: 0.4 }, consumes: { hops: 0.6, water: 0.4 } },
    beekeeper: { nameKey: "workerNames.beekeeper", produces: { honey: 0.5, wax: 0.2 } },
    candlemaker: { nameKey: "workerNames.candlemaker", produces: { candles: 0.3 }, consumes: { wax: 0.5 } },
    fisherman: { nameKey: "workerNames.fisherman", produces: { fish: 1.0 } },
    clayMiner: { nameKey: "workerNames.clayMiner", produces: { clay: 0.8 } },
    potter: { nameKey: "workerNames.potter", produces: { pottery: 0.5 }, consumes: { clay: 1.0 } },
    brickmaker: { nameKey: "workerNames.brickmaker", produces: { bricks: 1.0 }, consumes: { clay: 1.5, wood: 0.2 } },
    shepherd: { nameKey: "workerNames.shepherd", produces: { wool: 0.5 } },
    weaver: { nameKey: "workerNames.weaver", produces: { fabric: 0.4 }, consumes: { wool: 0.6 } },
    tailor: { nameKey: "workerNames.tailor", produces: { clothes: 0.2 }, consumes: { fabric: 0.5, leather: 0.1 } },
    herbalist: { nameKey: "workerNames.herbalist", produces: { herbs: 0.3 }, consumes: { water: 0.2, honey: 0.1 } },
    charcoalBurner: { nameKey: "workerNames.charcoalBurner", produces: { charcoal: 0.6 }, consumes: { wood: 1.2 } },
    ironMiner: { nameKey: "workerNames.ironMiner", produces: { ironOre: 0.5 } },
    smelter: { nameKey: "workerNames.smelter", produces: { ironIngots: 0.5 }, consumes: { ironOre: 1.0, charcoal: 0.5 } },
    blacksmith: { nameKey: "workerNames.blacksmith", produces: { tools: 0.3 }, consumes: { ironIngots: 0.8, charcoal: 0.2 } },
    healer: { nameKey: "workerNames.healer", consumes: { herbs: 0.2 }, descriptionKey: 'workerDescriptions.healer' },
    innkeeper: { nameKey: "workerNames.innkeeper", descriptionKey: 'workerDescriptions.innkeeper' },
    tavernMaid: { nameKey: "workerNames.tavernMaid", descriptionKey: 'workerDescriptions.tavernMaid' },
    priest: { nameKey: "workerNames.priest", descriptionKey: 'workerDescriptions.priest' },
    foreman: { nameKey: "workerNames.foreman", descriptionKey: 'workerDescriptions.foreman' },
    foremanAssistant: { nameKey: "workerNames.foremanAssistant", descriptionKey: 'workerDescriptions.foremanAssistant' },
    masterBuilder: { nameKey: "workerNames.masterBuilder", descriptionKey: 'workerDescriptions.masterBuilder' },
    clerk: { nameKey: "workerNames.clerk", descriptionKey: 'workerDescriptions.clerk' },
    builder: { nameKey: "workerNames.builder", descriptionKey: 'workerDescriptions.builder' },
};

const buildingDataConfig = {
    //Tier 1 - Osada
    settlersCabin: { nameKey: "buildingNames.settlersCabin", descriptionKey: "buildingDescriptions.settlersCabin", category: "important", cost: { wood: 25, stone: 10 }, isBuilt: false, repeatable: false, effect: { unlocks: ['smallHouseBuilding', 'workersCampBuilding', 'buildersShedBuilding', 'yardBuilding', 'granarySBuilding', 'depotBuilding', 'vaultBuilding'] } },
    workersCamp: { nameKey: "buildingNames.workersCamp", descriptionKey: "buildingDescriptions.workersCamp", category: "important", cost: { wood: 100, stone: 50 }, isBuilt: false, repeatable: false, effect: { unlocks: ['workers'], workerLimit: 10, buildingUnlocks: ['farmBuilding', 'lumberjacksHutBuilding', 'quarryBuilding', 'clayPitBuilding'] }, requires: { tier: C.TIERS.SETTLEMENT } },
    buildersShed: { nameKey: "buildingNames.buildersShed", descriptionKey: "buildingDescriptions.buildersShed", category: "important", cost: { wood: 50, stone: 80 }, isBuilt: false, repeatable: false, effect: { workerSlots: { builder: 2 } }, requires: { tier: C.TIERS.SETTLEMENT } },
    smallHouse: { nameKey: "buildingNames.smallHouse", descriptionKey: "buildingDescriptions.smallHouse", category: "population", cost: { wood: 50, stone: 20 }, count: 0, repeatable: true, effect: { population: 2 } },
    yard: { nameKey: "buildingNames.yard", descriptionKey: "buildingDescriptions.yard", category: "storage", cost: { wood: 100, stone: 90 }, count: 0, repeatable: true, effect: { storage: { wood: 400, stone: 400, clay: 400, bricks: 400, charcoal: 200, ironOre: 200, ironIngots: 200, tools: 200 } } },
    granaryS: { nameKey: "buildingNames.granaryS", descriptionKey: "buildingDescriptions.granaryS", category: "storage", cost: { wood: 140, clay: 60 }, count: 0, repeatable: true, effect: { storage: { grain: 400, flour: 400, bread: 400, hops: 400, beer: 400, water: 400, fish: 400, meat: 400, honey: 400 } } },
    depot: { nameKey: "buildingNames.depot", descriptionKey: "buildingDescriptions.depot", category: "storage", cost: { wood: 130, stone: 80, clay: 40 }, count: 0, repeatable: true, effect: { storage: { rawhide: 400, leather: 400, wool: 400, fabric: 400, pottery: 400, wax: 400, herbs: 400, clay: 400 } } },
    vault: { nameKey: "buildingNames.vault", descriptionKey: "buildingDescriptions.vault", category: "storage", cost: { wood: 160, stone: 120, bricks: 60 }, count: 0, repeatable: true, effect: { storage: { clothes: 400, candles: 400 } } },
    farm: { nameKey: "buildingNames.farm", descriptionKey: "buildingDescriptions.farm", category: "production", cost: { wood: 80, grain: 20 }, count: 0, repeatable: true, effect: { workerSlots: { grain: 5 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_SHED, staffed: true } } },
    lumberjacksHut: { nameKey: "buildingNames.lumberjacksHut", descriptionKey: "buildingDescriptions.lumberjacksHut", category: "production", cost: { wood: 60, stone: 10 }, count: 0, repeatable: true, effect: { workerSlots: { wood: 5 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_SHED, staffed: true } } },
    quarry: { nameKey: "buildingNames.quarry", descriptionKey: "buildingDescriptions.quarry", category: "production", cost: { wood: 40, stone: 40 }, count: 0, repeatable: true, effect: { workerSlots: { stone: 5 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_SHED, staffed: true } } },
    clayPit: { nameKey: "buildingNames.clayPit", descriptionKey: "buildingDescriptions.clayPit", category: "production", cost: { wood: 50, stone: 20 }, count: 0, repeatable: true, effect: { workerSlots: { clayMiner: 5 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_SHED, staffed: true } } },

    //Tier 2 - Mała wioska
    reevesHouse: { nameKey: "buildingNames.reevesHouse", descriptionKey: "buildingDescriptions.reevesHouse", category: "important", cost: { wood: 180, stone: 120, clay: 80 }, isBuilt: false, repeatable: false, effect: { unlocks: ['houseBuilding', 'innBuilding', 'churchBuilding', 'apiaryBuilding', 'charcoalKilnBuilding'] }, upgradesFrom: C.BUILDINGS.SETTLERS_CABIN, requires: { population: 10, building: { key: C.BUILDINGS.BUILDERS_SHED, built: true } } },
    workersLodge: { nameKey: "buildingNames.workersLodge", descriptionKey: "buildingDescriptions.workersLodge", category: "important", cost: { wood: 300, stone: 120, clay: 100 }, isBuilt: false, repeatable: false, effect: { workerLimit: 10, workerSlots: { foreman: 1 } }, upgradesFrom: C.BUILDINGS.WORKERS_CAMP, requires: { tier: C.TIERS.SMALL_VILLAGE } },
    buildersWorkshop: { nameKey: "buildingNames.buildersWorkshop", descriptionKey: "buildingDescriptions.buildersWorkshop", category: "important", cost: { wood: 180, stone: 180, clay: 120 }, isBuilt: false, repeatable: false, effect: { workerSlots: { builder: 4, masterBuilder: 1 } }, upgradesFrom: C.BUILDINGS.BUILDERS_SHED, requires: { tier: C.TIERS.SMALL_VILLAGE } },
    house: { nameKey: "buildingNames.house", descriptionKey: "buildingDescriptions.house", category: "population", cost: { wood: 100, stone: 50, clay: 80 }, count: 0, repeatable: true, effect: { population: 5 }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    mill: { nameKey: "buildingNames.mill", descriptionKey: "buildingDescriptions.mill", category: "production", cost: { wood: 120, stone: 100, clay: 50 }, count: 0, repeatable: true, effect: { unlocks: ['flour'], workerSlots: { miller: 3 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    bakery: { nameKey: "buildingNames.bakery", descriptionKey: "buildingDescriptions.bakery", category: "production", cost: { wood: 150, stone: 75 }, count: 0, repeatable: true, effect: { unlocks: ['bread'], workerSlots: { baker: 5 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    well: { nameKey: "buildingNames.well", descriptionKey: "buildingDescriptions.well", category: "production", cost: { wood: 30, stone: 30 }, count: 0, repeatable: true, effect: { unlocks: ['water'], workerSlots: { water: 5 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    apiary: { nameKey: "buildingNames.apiary", descriptionKey: "buildingDescriptions.apiary", category: "production", cost: { wood: 150, grain: 50 }, count: 0, repeatable: true, effect: { unlocks: ['honey', 'wax'], workerSlots: { beekeeper: 3 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    candlemakersWorkshop: { nameKey: "buildingNames.candlemakersWorkshop", descriptionKey: "buildingDescriptions.candlemakersWorkshop", category: "production", cost: { wood: 110, bricks: 70 }, count: 0, repeatable: true, effect: { unlocks: ['candles'], workerSlots: { candlemaker: 2 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    fishermansHut: { nameKey: "buildingNames.fishermansHut", descriptionKey: "buildingDescriptions.fishermansHut", category: "production", cost: { wood: 80, clay: 40 }, count: 0, repeatable: true, effect: { unlocks: ['fish'], workerSlots: { fisherman: 4 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    brickyard: { nameKey: "buildingNames.brickyard", descriptionKey: "buildingDescriptions.brickyard", category: "production", cost: { wood: 150, stone: 100 }, count: 0, repeatable: true, effect: { unlocks: ['bricks'], workerSlots: { brickmaker: 3 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    pottersWorkshop: { nameKey: "buildingNames.pottersWorkshop", descriptionKey: "buildingDescriptions.pottersWorkshop", category: "production", cost: { wood: 100, stone: 80 }, count: 0, repeatable: true, effect: { unlocks: ['pottery'], workerSlots: { potter: 3 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    herbalistsGarden: { nameKey: "buildingNames.herbalistsGarden", descriptionKey: "buildingDescriptions.herbalistsGarden", category: "production", cost: { wood: 120, grain: 30 }, count: 0, repeatable: true, effect: { unlocks: ['herbs'], workerSlots: { herbalist: 2 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    charcoalKiln: { nameKey: "buildingNames.charcoalKiln", descriptionKey: "buildingDescriptions.charcoalKiln", category: "production", cost: { wood: 80, clay: 100 }, count: 0, repeatable: true, effect: { unlocks: ['charcoal'], workerSlots: { charcoalBurner: 2 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    inn: { nameKey: "buildingNames.inn", descriptionKey: "buildingDescriptions.inn", category: "services", cost: { wood: 250, stone: 100, clay: 50 }, isBuilt: false, repeatable: false, effect: { settlerTimeBonus: 0.15, workerSlots: { innkeeper: 1 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    church: { nameKey: "buildingNames.church", descriptionKey: "buildingDescriptions.church", category: "services", cost: { wood: 150, stone: 200, bricks: 400 }, isBuilt: false, repeatable: false, effect: { settlerTimeBonus: 0.03, workerSlots: { priest: 1 } }, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },

    //Tier 3 - Wioska
    villageHall: { nameKey: "buildingNames.villageHall", descriptionKey: "buildingDescriptions.villageHall", category: "important", cost: { wood: 350, stone: 250, clay: 150, bricks: 350 }, isBuilt: false, repeatable: false, effect: { unlocks: ['ironMineBuilding', 'smelteryBuilding', 'blacksmithBuilding'], workerSlots: { clerk: 1 } }, upgradesFrom: C.BUILDINGS.REEVES_HOUSE, requires: { population: 40 }, betaStop: true },
    workersQuarters: { nameKey: "buildingNames.workersQuarters", descriptionKey: "buildingDescriptions.workersQuarters", category: "important", cost: { wood: 550, stone: 250, clay: 150, bricks: 400 }, isBuilt: false, repeatable: false, effect: { workerLimit: 10, workerSlots: { foreman: 1, foremanAssistant: 5 } }, upgradesFrom: C.BUILDINGS.WORKERS_LODGE, requires: { building: { key: C.BUILDINGS.VILLAGE_HALL, staffed: true, workerSlots: { clerk: 1 } } }, betaStop: true },
    masterBuildersHouse: { nameKey: "buildingNames.masterBuildersHouse", descriptionKey: "buildingDescriptions.masterBuildersHouse", category: "important", cost: { wood: 800, stone: 350, clay: 200, bricks: 550 }, isBuilt: false, repeatable: false, effect: { workerSlots: { builder: 6, masterBuilder: 1 } }, upgradesFrom: C.BUILDINGS.BUILDERS_WORKSHOP, requires: { building: { key: C.BUILDINGS.VILLAGE_HALL, staffed: true, workerSlots: { clerk: 1 } } }, betaStop: true },
    largeYard: { nameKey: "buildingNames.largeYard", descriptionKey: "buildingDescriptions.largeYard", category: "storage", cost: { wood: 600, stone: 300, bricks: 250 }, count: 0, repeatable: true, effect: { storage: { wood: 1500, stone: 1500, clay: 1500, bricks: 1500, charcoal: 1000, ironOre: 1000, ironIngots: 1000, tools: 1000 } }, requires: { tier: C.TIERS.VILLAGE, building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    largeGranary: { nameKey: "buildingNames.largeGranary", descriptionKey: "buildingDescriptions.largeGranary", category: "storage", cost: { wood: 550, stone: 200, bricks: 250 }, count: 0, repeatable: true, effect: { storage: { grain: 1500, flour: 1500, bread: 1500, hops: 1500, beer: 1500, water: 1500, fish: 1500, meat: 1500, honey: 1500 } }, requires: { tier: C.TIERS.VILLAGE, building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    largeDepot: { nameKey: "buildingNames.largeDepot", descriptionKey: "buildingDescriptions.largeDepot", category: "storage", cost: { wood: 550, stone: 250, bricks: 250 }, count: 0, repeatable: true, effect: { storage: { rawhide: 1500, leather: 1500, wool: 1500, fabric: 1500, pottery: 1500, wax: 1500, herbs: 1500, clay: 1500, } }, requires: { tier: C.TIERS.VILLAGE, building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    treasury: { nameKey: "buildingNames.treasury", descriptionKey: "buildingDescriptions.treasury", category: "storage", cost: { wood: 500, stone: 300, bricks: 300, clay: 150 }, count: 0, repeatable: true, effect: { storage: { clothes: 1500, candles: 1500 } }, requires: { tier: C.TIERS.VILLAGE, building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    ranch: { nameKey: "buildingNames.ranch", descriptionKey: "buildingDescriptions.ranch", category: "production", cost: { wood: 150, stone: 50 }, count: 0, repeatable: true, effect: { unlocks: ['cattle', 'rawhide'], workerSlots: { rancher: 3 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    butcher: { nameKey: "buildingNames.butcher", descriptionKey: "buildingDescriptions.butcher", category: "production", cost: { wood: 100, stone: 50, bricks: 80 }, count: 0, repeatable: true, effect: { unlocks: ['meat'], workerSlots: { butcher: 3 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    tannery: { nameKey: "buildingNames.tannery", descriptionKey: "buildingDescriptions.tannery", category: "production", cost: { wood: 150, stone: 120 }, count: 0, repeatable: true, effect: { unlocks: ['leather'], workerSlots: { tanner: 3 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    hopFarm: { nameKey: "buildingNames.hopFarm", descriptionKey: "buildingDescriptions.hopFarm", category: "production", cost: { wood: 120, stone: 60 }, count: 0, repeatable: true, effect: { unlocks: ['hops'], workerSlots: { hopFarmer: 5 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    brewery: { nameKey: "buildingNames.brewery", descriptionKey: "buildingDescriptions.brewery", category: "production", cost: { wood: 150, stone: 100, bricks: 120 }, count: 0, repeatable: true, effect: { unlocks: ['beer'], workerSlots: { brewer: 5 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    sheepFarm: { nameKey: "buildingNames.sheepFarm", descriptionKey: "buildingDescriptions.sheepFarm", category: "production", cost: { wood: 130, stone: 40 }, count: 0, repeatable: true, effect: { unlocks: ['wool'], workerSlots: { shepherd: 3 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    weaversWorkshop: { nameKey: "buildingNames.weaversWorkshop", descriptionKey: "buildingDescriptions.weaversWorkshop", category: "production", cost: { wood: 100, stone: 80 }, count: 0, repeatable: true, effect: { unlocks: ['fabric'], workerSlots: { weaver: 4 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    tailorsWorkshop: { nameKey: "buildingNames.tailorsWorkshop", descriptionKey: "buildingDescriptions.tailorsWorkshop", category: "production", cost: { wood: 120, bricks: 90 }, count: 0, repeatable: true, effect: { unlocks: ['clothes'], workerSlots: { tailor: 3 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    ironMine: { nameKey: "buildingNames.ironMine", descriptionKey: "buildingDescriptions.ironMine", category: "production", cost: { wood: 200, stone: 150 }, count: 0, repeatable: true, effect: { unlocks: ['ironOre'], workerSlots: { ironMiner: 4 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    smeltery: { nameKey: "buildingNames.smeltery", descriptionKey: "buildingDescriptions.smeltery", category: "production", cost: { wood: 150, stone: 200, bricks: 100 }, count: 0, repeatable: true, effect: { unlocks: ['ironIngots'], workerSlots: { smelter: 3 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    blacksmith: { nameKey: "buildingNames.blacksmith", descriptionKey: "buildingDescriptions.blacksmith", category: "production", cost: { wood: 120, stone: 100, bricks: 150 }, count: 0, repeatable: true, effect: { unlocks: ['tools'], workerSlots: { blacksmith: 2 } }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    tavern: { nameKey: "buildingNames.tavern", descriptionKey: "buildingDescriptions.tavern", category: "services", cost: { wood: 400, stone: 150, bricks: 250 }, isBuilt: false, repeatable: false, effect: { settlerTimeBonus: 0.05, workerSlots: { tavernMaid: 1 } }, upgradesFrom: C.BUILDINGS.INN, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    healersHut: { nameKey: "buildingNames.healersHut", descriptionKey: "buildingDescriptions.healersHut", category: "services", cost: { wood: 200, stone: 150, bricks: 100 }, isBuilt: false, repeatable: false, effect: { workerSlots: { healer: 1 }, settlerTimeBonus: 0.05 }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },

    //Tier 4 - Miasteczko
    tenement: { nameKey: "buildingNames.tenement", descriptionKey: "buildingDescriptions.tenement", category: "population", cost: { wood: 200, stone: 150, bricks: 450 }, count: 0, repeatable: true, effect: { population: 10 }, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
};

const tierRequirementsConfig = { settlement: 0, small_village: 10, village: 40, small_town: 150, town: 800, };
const totalBuildingLimitsConfig = { settlement: 15, small_village: 45, village: 100, small_town: 150, town: 300, };