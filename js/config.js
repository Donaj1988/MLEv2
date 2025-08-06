const SAVE_KEY = 'economicGameSave_v79_t2_t3_impl';

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
    }
};

const BALANCE = {
    workerProduction: {
        wood: { produces: { wood: 0.8 } },
        stone: { produces: { stone: 0.8 } },
        grain: { produces: { grain: 1.2 } },
        hopFarmer: { produces: { hops: 0.6 } },
        water: { produces: { water: 0.8 } },
        miller: { produces: { flour: 1.0 }, consumes: { grain: 0.8 } },
        baker: { produces: { bread: 1.0 }, consumes: { flour: 0.6, water: 0.2 } },
        rancher: { produces: { cattle: 0.2, rawhide: 0.2 }, consumes: { grain: 0.5, water: 0.1 } },
        butcher: { produces: { meat: 0.5 }, consumes: { cattle: 0.1 } },
        tanner: { produces: { leather: 0.5 }, consumes: { rawhide: 0.5, water: 0.2 } },
        brewer: { produces: { beer: 0.4 }, consumes: { hops: 0.6, water: 0.4 } },
        beekeeper: { produces: { honey: 0.5, wax: 0.2 } },
        candlemaker: { produces: { candles: 0.3 }, consumes: { wax: 0.5 } },
        fisherman: { produces: { fish: 1.0 } },
        clayMiner: { produces: { clay: 0.8 } },
        potter: { produces: { pottery: 0.5 }, consumes: { clay: 1.0 } },
        brickmaker: { produces: { bricks: 1.0 }, consumes: { clay: 1.5, wood: 0.2 } },
        shepherd: { produces: { wool: 0.5 } },
        weaver: { produces: { fabric: 0.4 }, consumes: { wool: 0.6 } },
        tailor: { produces: { clothes: 0.2 }, consumes: { fabric: 0.5, leather: 0.1 } },
        herbalist: { produces: { herbs: 0.3 }, consumes: { water: 0.2, honey: 0.1 } },
        charcoalBurner: { produces: { charcoal: 0.6 }, consumes: { wood: 1.2 } },
        ironMiner: { produces: { ironOre: 0.5 } },
        smelter: { produces: { ironIngots: 0.5 }, consumes: { ironOre: 1.0, charcoal: 0.5 } },
        blacksmith: { produces: { tools: 0.3 }, consumes: { ironIngots: 0.8, charcoal: 0.2 } },
        healer: { consumes: { herbs: 0.2 } },
    },
    buildingEffects: {
        settlersCabin: { unlocks: ['smallHouseBuilding', 'workersCampBuilding', 'buildersShedBuilding', 'yardBuilding', 'granarySBuilding', 'depotBuilding', 'vaultBuilding'] },
        workersCamp: { unlocks: ['workers'], workerLimit: 10, buildingUnlocks: ['farmBuilding', 'lumberjacksHutBuilding', 'quarryBuilding', 'clayPitBuilding'] },
        buildersShed: { workerSlots: { builder: 2 } },
        smallHouse: { population: 2 },
        yard: { storage: { wood: 400, stone: 400, clay: 400, bricks: 400, charcoal: 200, ironOre: 200, ironIngots: 200, tools: 200 } },
        granaryS: { storage: { grain: 400, flour: 400, bread: 400, hops: 400, beer: 400, water: 400, fish: 400, meat: 400, honey: 400 } },
        depot: { storage: { rawhide: 400, leather: 400, wool: 400, fabric: 400, pottery: 400, wax: 400, herbs: 400, clay: 400 } },
        vault: { storage: { clothes: 400, candles: 400 } },
        farm: { workerSlots: { grain: 5 } },
        lumberjacksHut: { workerSlots: { wood: 5 } },
        quarry: { workerSlots: { stone: 5 } },
        clayPit: { workerSlots: { clayMiner: 5 } },
        reevesHouse: { unlocks: ['houseBuilding', 'innBuilding', 'churchBuilding', 'apiaryBuilding', 'charcoalKilnBuilding'] },
        workersLodge: { workerLimit: 10, workerSlots: { foreman: 1 } },
        buildersWorkshop: { workerSlots: { builder: 4, masterBuilder: 1 } },
        house: { population: 5 },
        mill: { unlocks: ['flour'], workerSlots: { miller: 3 } },
        bakery: { unlocks: ['bread'], workerSlots: { baker: 5 } },
        well: { unlocks: ['water'], workerSlots: { water: 5 } },
        apiary: { unlocks: ['honey', 'wax'], workerSlots: { beekeeper: 3 } },
        candlemakersWorkshop: { unlocks: ['candles'], workerSlots: { candlemaker: 2 } },
        fishermansHut: { unlocks: ['fish'], workerSlots: { fisherman: 4 } },
        brickyard: { unlocks: ['bricks'], workerSlots: { brickmaker: 3 } },
        pottersWorkshop: { unlocks: ['pottery'], workerSlots: { potter: 3 } },
        herbalistsGarden: { unlocks: ['herbs'], workerSlots: { herbalist: 2 } },
        charcoalKiln: { unlocks: ['charcoal'], workerSlots: { charcoalBurner: 2 } },
        inn: { settlerTimeBonus: 0.15, workerSlots: { innkeeper: 1 } },
        church: { settlerTimeBonus: 0.03, workerSlots: { priest: 1 } },
        villageHall: { unlocks: ['ironMineBuilding', 'smelteryBuilding', 'blacksmithBuilding'], workerSlots: { clerk: 1 } },
        workersQuarters: { workerLimit: 10, workerSlots: { foreman: 1, foremanAssistant: 5 } },
        masterBuildersHouse: { workerSlots: { builder: 6, masterBuilder: 1 } },
        largeYard: { storage: { wood: 1500, stone: 1500, clay: 1500, bricks: 1500, charcoal: 1000, ironOre: 1000, ironIngots: 1000, tools: 1000 } },
        largeGranary: { storage: { grain: 1500, flour: 1500, bread: 1500, hops: 1500, beer: 1500, water: 1500, fish: 1500, meat: 1500, honey: 1500 } },
        largeDepot: { storage: { rawhide: 1500, leather: 1500, wool: 1500, fabric: 1500, pottery: 1500, wax: 1500, herbs: 1500, clay: 1500 } },
        treasury: { storage: { clothes: 1500, candles: 1500 } },
        ranch: { unlocks: ['cattle', 'rawhide'], workerSlots: { rancher: 3 } },
        butcher: { unlocks: ['meat'], workerSlots: { butcher: 3 } },
        tannery: { unlocks: ['leather'], workerSlots: { tanner: 3 } },
        hopFarm: { unlocks: ['hops'], workerSlots: { hopFarmer: 5 } },
        brewery: { unlocks: ['beer'], workerSlots: { brewer: 5 } },
        sheepFarm: { unlocks: ['wool'], workerSlots: { shepherd: 3 } },
        weaversWorkshop: { unlocks: ['fabric'], workerSlots: { weaver: 4 } },
        tailorsWorkshop: { unlocks: ['clothes'], workerSlots: { tailor: 3 } },
        ironMine: { unlocks: ['ironOre'], workerSlots: { ironMiner: 4 } },
        smeltery: { unlocks: ['ironIngots'], workerSlots: { smelter: 3 } },
        blacksmith: { unlocks: ['tools'], workerSlots: { blacksmith: 2 } },
        tavern: { settlerTimeBonus: 0.05, workerSlots: { tavernMaid: 1 } },
        healersHut: { workerSlots: { healer: 1 }, settlerTimeBonus: 0.05 },
        tenement: { population: 10 },
    },
    bonuses: {
        foremanWorkerLimit: 30,
        assistantMultiplier: { // Placeholder for potential future use
            workersQuarters: 22,
            workersBarracks: 20,
            workersGuildhall: 65,
        }
    }
};

const tierConfig = {
    [C.TIERS.SETTLEMENT]: {
        population: 0,
        buildingLimit: 15,
        unlocks: [] 
    },
    [C.TIERS.SMALL_VILLAGE]: {
        population: 10,
        buildingLimit: 45,
        unlocks: [
            'wellBuilding', 'fishermansHutBuilding', 'pottersWorkshopBuilding', 
            'herbalistsGardenBuilding', 'millBuilding', 'bakeryBuilding', 
            'brickyardBuilding', 'candlemakersWorkshopBuilding'
        ],
        showModal: true 
    },
    [C.TIERS.VILLAGE]: {
        population: 40,
        buildingLimit: 100,
        unlocks: [
            'largeYardBuilding', 'largeGranaryBuilding', 'largeDepotBuilding', 
            'treasuryBuilding', 'hopFarmBuilding', 'breweryBuilding', 'ranchBuilding',
            'butcherBuilding', 'tanneryBuilding', 'sheepFarmBuilding', 
            'weaversWorkshopBuilding', 'tailorsWorkshopBuilding', 'healersHutBuilding'
        ]
    },
    [C.TIERS.SMALL_TOWN]: {
        population: 150,
        buildingLimit: 150,
        unlocks: ['tenementBuilding']
    },
    [C.TIERS.TOWN]: {
        population: 800,
        buildingLimit: 300,
        unlocks: []
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
    wood: { nameKey: "workerNames.wood", ...BALANCE.workerProduction.wood },
    stone: { nameKey: "workerNames.stone", ...BALANCE.workerProduction.stone },
    grain: { nameKey: "workerNames.grain", ...BALANCE.workerProduction.grain },
    hopFarmer: { nameKey: "workerNames.hopFarmer", ...BALANCE.workerProduction.hopFarmer },
    water: { nameKey: "workerNames.water", ...BALANCE.workerProduction.water },
    miller: { nameKey: "workerNames.miller", ...BALANCE.workerProduction.miller },
    baker: { nameKey: "workerNames.baker", ...BALANCE.workerProduction.baker },
    rancher: { nameKey: "workerNames.rancher", ...BALANCE.workerProduction.rancher },
    butcher: { nameKey: "workerNames.butcher", ...BALANCE.workerProduction.butcher },
    tanner: { nameKey: "workerNames.tanner", ...BALANCE.workerProduction.tanner },
    brewer: { nameKey: "workerNames.brewer", ...BALANCE.workerProduction.brewer },
    beekeeper: { nameKey: "workerNames.beekeeper", ...BALANCE.workerProduction.beekeeper },
    candlemaker: { nameKey: "workerNames.candlemaker", ...BALANCE.workerProduction.candlemaker },
    fisherman: { nameKey: "workerNames.fisherman", ...BALANCE.workerProduction.fisherman },
    clayMiner: { nameKey: "workerNames.clayMiner", ...BALANCE.workerProduction.clayMiner },
    potter: { nameKey: "workerNames.potter", ...BALANCE.workerProduction.potter },
    brickmaker: { nameKey: "workerNames.brickmaker", ...BALANCE.workerProduction.brickmaker },
    shepherd: { nameKey: "workerNames.shepherd", ...BALANCE.workerProduction.shepherd },
    weaver: { nameKey: "workerNames.weaver", ...BALANCE.workerProduction.weaver },
    tailor: { nameKey: "workerNames.tailor", ...BALANCE.workerProduction.tailor },
    herbalist: { nameKey: "workerNames.herbalist", ...BALANCE.workerProduction.herbalist },
    charcoalBurner: { nameKey: "workerNames.charcoalBurner", ...BALANCE.workerProduction.charcoalBurner },
    ironMiner: { nameKey: "workerNames.ironMiner", ...BALANCE.workerProduction.ironMiner },
    smelter: { nameKey: "workerNames.smelter", ...BALANCE.workerProduction.smelter },
    blacksmith: { nameKey: "workerNames.blacksmith", ...BALANCE.workerProduction.blacksmith },
    healer: { nameKey: "workerNames.healer", descriptionKey: 'workerDescriptions.healer', ...BALANCE.workerProduction.healer },
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
    settlersCabin: { nameKey: "buildingNames.settlersCabin", descriptionKey: "buildingDescriptions.settlersCabin", category: "important", cost: { wood: 25, stone: 10 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.settlersCabin },
    workersCamp: { nameKey: "buildingNames.workersCamp", descriptionKey: "buildingDescriptions.workersCamp", category: "important", cost: { wood: 100, stone: 50 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.workersCamp, requires: { tier: C.TIERS.SETTLEMENT } },
    buildersShed: { nameKey: "buildingNames.buildersShed", descriptionKey: "buildingDescriptions.buildersShed", category: "important", cost: { wood: 50, stone: 80 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.buildersShed, requires: { tier: C.TIERS.SETTLEMENT } },
    smallHouse: { nameKey: "buildingNames.smallHouse", descriptionKey: "buildingDescriptions.smallHouse", category: "population", cost: { wood: 50, stone: 20 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.smallHouse },
    yard: { nameKey: "buildingNames.yard", descriptionKey: "buildingDescriptions.yard", category: "storage", cost: { wood: 100, stone: 90 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.yard },
    granaryS: { nameKey: "buildingNames.granaryS", descriptionKey: "buildingDescriptions.granaryS", category: "storage", cost: { wood: 140, clay: 60 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.granaryS },
    depot: { nameKey: "buildingNames.depot", descriptionKey: "buildingDescriptions.depot", category: "storage", cost: { wood: 130, stone: 80, clay: 40 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.depot },
    vault: { nameKey: "buildingNames.vault", descriptionKey: "buildingDescriptions.vault", category: "storage", cost: { wood: 160, stone: 120, bricks: 60 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.vault },
    farm: { nameKey: "buildingNames.farm", descriptionKey: "buildingDescriptions.farm", category: "production", cost: { wood: 80, grain: 20 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.farm, requires: { building: { key: C.BUILDINGS.BUILDERS_SHED, staffed: true } } },
    lumberjacksHut: { nameKey: "buildingNames.lumberjacksHut", descriptionKey: "buildingDescriptions.lumberjacksHut", category: "production", cost: { wood: 60, stone: 10 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.lumberjacksHut, requires: { building: { key: C.BUILDINGS.BUILDERS_SHED, staffed: true } } },
    quarry: { nameKey: "buildingNames.quarry", descriptionKey: "buildingDescriptions.quarry", category: "production", cost: { wood: 40, stone: 40 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.quarry, requires: { building: { key: C.BUILDINGS.BUILDERS_SHED, staffed: true } } },
    clayPit: { nameKey: "buildingNames.clayPit", descriptionKey: "buildingDescriptions.clayPit", category: "production", cost: { wood: 50, stone: 20 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.clayPit, requires: { building: { key: C.BUILDINGS.BUILDERS_SHED, staffed: true } } },

    //Tier 2 - Mała wioska
    reevesHouse: { nameKey: "buildingNames.reevesHouse", descriptionKey: "buildingDescriptions.reevesHouse", category: "important", cost: { wood: 180, stone: 120, clay: 80 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.reevesHouse, upgradesFrom: C.BUILDINGS.SETTLERS_CABIN, requires: { population: 10, building: { key: C.BUILDINGS.BUILDERS_SHED, built: true } } },
    workersLodge: { nameKey: "buildingNames.workersLodge", descriptionKey: "buildingDescriptions.workersLodge", category: "important", cost: { wood: 300, stone: 120, clay: 100 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.workersLodge, upgradesFrom: C.BUILDINGS.WORKERS_CAMP, requires: { tier: C.TIERS.SMALL_VILLAGE } },
    buildersWorkshop: { nameKey: "buildingNames.buildersWorkshop", descriptionKey: "buildingDescriptions.buildersWorkshop", category: "important", cost: { wood: 180, stone: 180, clay: 120 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.buildersWorkshop, upgradesFrom: C.BUILDINGS.BUILDERS_SHED, requires: { tier: C.TIERS.SMALL_VILLAGE } },
    house: { nameKey: "buildingNames.house", descriptionKey: "buildingDescriptions.house", category: "population", cost: { wood: 100, stone: 50, clay: 80 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.house, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    mill: { nameKey: "buildingNames.mill", descriptionKey: "buildingDescriptions.mill", category: "production", cost: { wood: 120, stone: 100, clay: 50 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.mill, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    bakery: { nameKey: "buildingNames.bakery", descriptionKey: "buildingDescriptions.bakery", category: "production", cost: { wood: 150, stone: 75 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.bakery, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    well: { nameKey: "buildingNames.well", descriptionKey: "buildingDescriptions.well", category: "production", cost: { wood: 30, stone: 30 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.well, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    apiary: { nameKey: "buildingNames.apiary", descriptionKey: "buildingDescriptions.apiary", category: "production", cost: { wood: 150, grain: 50 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.apiary, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    candlemakersWorkshop: { nameKey: "buildingNames.candlemakersWorkshop", descriptionKey: "buildingDescriptions.candlemakersWorkshop", category: "production", cost: { wood: 110, bricks: 70 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.candlemakersWorkshop, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    fishermansHut: { nameKey: "buildingNames.fishermansHut", descriptionKey: "buildingDescriptions.fishermansHut", category: "production", cost: { wood: 80, clay: 40 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.fishermansHut, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    brickyard: { nameKey: "buildingNames.brickyard", descriptionKey: "buildingDescriptions.brickyard", category: "production", cost: { wood: 150, stone: 100 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.brickyard, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    pottersWorkshop: { nameKey: "buildingNames.pottersWorkshop", descriptionKey: "buildingDescriptions.pottersWorkshop", category: "production", cost: { wood: 100, stone: 80 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.pottersWorkshop, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    herbalistsGarden: { nameKey: "buildingNames.herbalistsGarden", descriptionKey: "buildingDescriptions.herbalistsGarden", category: "production", cost: { wood: 120, grain: 30 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.herbalistsGarden, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    charcoalKiln: { nameKey: "buildingNames.charcoalKiln", descriptionKey: "buildingDescriptions.charcoalKiln", category: "production", cost: { wood: 80, clay: 100 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.charcoalKiln, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    inn: { nameKey: "buildingNames.inn", descriptionKey: "buildingDescriptions.inn", category: "services", cost: { wood: 250, stone: 100, clay: 50 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.inn, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },
    church: { nameKey: "buildingNames.church", descriptionKey: "buildingDescriptions.church", category: "services", cost: { wood: 150, stone: 200, bricks: 400 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.church, requires: { building: { key: C.BUILDINGS.BUILDERS_WORKSHOP, staffed: true, workerSlots: { masterBuilder: 1 } } } },

    //Tier 3 - Wioska
    villageHall: { nameKey: "buildingNames.villageHall", descriptionKey: "buildingDescriptions.villageHall", category: "important", cost: { wood: 350, stone: 250, clay: 150, bricks: 350 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.villageHall, upgradesFrom: C.BUILDINGS.REEVES_HOUSE, requires: { population: 40 }, betaStop: true },
    workersQuarters: { nameKey: "buildingNames.workersQuarters", descriptionKey: "buildingDescriptions.workersQuarters", category: "important", cost: { wood: 550, stone: 250, clay: 150, bricks: 400 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.workersQuarters, upgradesFrom: C.BUILDINGS.WORKERS_LODGE, requires: { building: { key: C.BUILDINGS.VILLAGE_HALL, staffed: true, workerSlots: { clerk: 1 } } }, betaStop: true },
    masterBuildersHouse: { nameKey: "buildingNames.masterBuildersHouse", descriptionKey: "buildingDescriptions.masterBuildersHouse", category: "important", cost: { wood: 800, stone: 350, clay: 200, bricks: 550 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.masterBuildersHouse, upgradesFrom: C.BUILDINGS.BUILDERS_WORKSHOP, requires: { building: { key: C.BUILDINGS.VILLAGE_HALL, staffed: true, workerSlots: { clerk: 1 } } }, betaStop: true },
    largeYard: { nameKey: "buildingNames.largeYard", descriptionKey: "buildingDescriptions.largeYard", category: "storage", cost: { wood: 600, stone: 300, bricks: 250 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.largeYard, requires: { tier: C.TIERS.VILLAGE, building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    largeGranary: { nameKey: "buildingNames.largeGranary", descriptionKey: "buildingDescriptions.largeGranary", category: "storage", cost: { wood: 550, stone: 200, bricks: 250 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.largeGranary, requires: { tier: C.TIERS.VILLAGE, building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    largeDepot: { nameKey: "buildingNames.largeDepot", descriptionKey: "buildingDescriptions.largeDepot", category: "storage", cost: { wood: 550, stone: 250, bricks: 250 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.largeDepot, requires: { tier: C.TIERS.VILLAGE, building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    treasury: { nameKey: "buildingNames.treasury", descriptionKey: "buildingDescriptions.treasury", category: "storage", cost: { wood: 500, stone: 300, bricks: 300, clay: 150 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.treasury, requires: { tier: C.TIERS.VILLAGE, building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    ranch: { nameKey: "buildingNames.ranch", descriptionKey: "buildingDescriptions.ranch", category: "production", cost: { wood: 150, stone: 50 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.ranch, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    butcher: { nameKey: "buildingNames.butcher", descriptionKey: "buildingDescriptions.butcher", category: "production", cost: { wood: 100, stone: 50, bricks: 80 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.butcher, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    tannery: { nameKey: "buildingNames.tannery", descriptionKey: "buildingDescriptions.tannery", category: "production", cost: { wood: 150, stone: 120 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.tannery, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    hopFarm: { nameKey: "buildingNames.hopFarm", descriptionKey: "buildingDescriptions.hopFarm", category: "production", cost: { wood: 120, stone: 60 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.hopFarm, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    brewery: { nameKey: "buildingNames.brewery", descriptionKey: "buildingDescriptions.brewery", category: "production", cost: { wood: 150, stone: 100, bricks: 120 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.brewery, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    sheepFarm: { nameKey: "buildingNames.sheepFarm", descriptionKey: "buildingDescriptions.sheepFarm", category: "production", cost: { wood: 130, stone: 40 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.sheepFarm, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    weaversWorkshop: { nameKey: "buildingNames.weaversWorkshop", descriptionKey: "buildingDescriptions.weaversWorkshop", category: "production", cost: { wood: 100, stone: 80 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.weaversWorkshop, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    tailorsWorkshop: { nameKey: "buildingNames.tailorsWorkshop", descriptionKey: "buildingDescriptions.tailorsWorkshop", category: "production", cost: { wood: 120, bricks: 90 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.tailorsWorkshop, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    ironMine: { nameKey: "buildingNames.ironMine", descriptionKey: "buildingDescriptions.ironMine", category: "production", cost: { wood: 200, stone: 150 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.ironMine, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    smeltery: { nameKey: "buildingNames.smeltery", descriptionKey: "buildingDescriptions.smeltery", category: "production", cost: { wood: 150, stone: 200, bricks: 100 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.smeltery, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    blacksmith: { nameKey: "buildingNames.blacksmith", descriptionKey: "buildingDescriptions.blacksmith", category: "production", cost: { wood: 120, stone: 100, bricks: 150 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.blacksmith, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    tavern: { nameKey: "buildingNames.tavern", descriptionKey: "buildingDescriptions.tavern", category: "services", cost: { wood: 400, stone: 150, bricks: 250 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.tavern, upgradesFrom: C.BUILDINGS.INN, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
    healersHut: { nameKey: "buildingNames.healersHut", descriptionKey: "buildingDescriptions.healersHut", category: "services", cost: { wood: 200, stone: 150, bricks: 100 }, isBuilt: false, repeatable: false, effect: BALANCE.buildingEffects.healersHut, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },

    //Tier 4 - Miasteczko
    tenement: { nameKey: "buildingNames.tenement", descriptionKey: "buildingDescriptions.tenement", category: "population", cost: { wood: 200, stone: 150, bricks: 450 }, count: 0, repeatable: true, effect: BALANCE.buildingEffects.tenement, requires: { building: { key: C.BUILDINGS.MASTER_BUILDERS_HOUSE, staffed: true } } },
};