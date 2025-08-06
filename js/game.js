// ===================================================================================
//
//  SECTION 1: GAME STATE & CORE LOGIC
//
// ===================================================================================

let gameState = {};

function getDefaultGameState() {
    const tierKeys = Object.keys(tierConfig);
    const tierRequirements = tierKeys.reduce((acc, key) => {
        acc[key] = tierConfig[key].population;
        return acc;
    }, {});
    const totalBuildingLimits = tierKeys.reduce((acc, key) => {
        acc[key] = tierConfig[key].buildingLimit;
        return acc;
    }, {});

    return {
        resources: { 
            wood: 0, stone: 0, grain: 0, flour: 0, bread: 0, cattle: 0, meat: 0, hops: 0, water: 0, beer: 0, rawhide: 0, leather: 0, honey: 0, wax: 0, fish: 0, clay: 0, pottery: 0, bricks: 0, wool: 0, fabric: 0, clothes: 0, herbs: 0, candles: 0,
            charcoal: 0, ironOre: 0, ironIngots: 0, tools: 0
        },
        storageLimits: { 
            wood: 100, stone: 100, grain: 100, flour: 0, bread: 0, cattle: 0, meat: 0, hops: 0, water: 0, beer: 0, rawhide: 0, leather: 0, honey: 0, wax: 0, fish: 0, clay: 100, pottery: 0, bricks: 0, wool: 0, fabric: 0, clothes: 0, herbs: 0, candles: 0,
            charcoal: 0, ironOre: 0, ironIngots: 0, tools: 0
        },
        unlockedFeatures: ['wood', 'stone', 'clay', 'grain', 'settlersCabinBuilding'],
        populationLimit: 0, totalWorkers: 0, workerLimit: 0,
        assignedWorkers: { 
            wood: 0, stone: 0, grain: 0, miller: 0, rancher: 0, butcher: 0, tanner: 0, hopFarmer: 0, water: 0, baker: 0, brewer: 0, beekeeper: 0, candlemaker: 0, builder: 0, foreman: 0, foremanAssistant: 0, masterBuilder: 0, clerk: 0, innkeeper: 0, tavernMaid: 0, priest: 0, fisherman: 0, clayMiner: 0, potter: 0, brickmaker: 0, shepherd: 0, weaver: 0, tailor: 0, herbalist: 0, healer: 0,
            charcoalBurner: 0, ironMiner: 0, smelter: 0, blacksmith: 0
        },
        workerSlots: { 
            wood: 0, stone: 0, grain: 0, miller: 0, rancher: 0, butcher: 0, tanner: 0, hopFarmer: 0, water: 0, baker: 0, brewer: 0, beekeeper: 0, candlemaker: 0, builder: 0, foreman: 0, foremanAssistant: 0, masterBuilder: 0, clerk: 0, innkeeper: 0, tavernMaid: 0, priest: 0, fisherman: 0, clayMiner: 0, potter: 0, brickmaker: 0, shepherd: 0, weaver: 0, tailor: 0, herbalist: 0, healer: 0,
            charcoalBurner: 0, ironMiner: 0, smelter: 0, blacksmith: 0
        },
        suppliedFoods: { grain: true, bread: false, meat: false, beer: false, honey: false, fish: false, },
        foodConsumptionPerSecond: { grain: 0, bread: 0, meat: 0, beer: 0, honey: 0, fish: 0, },
        currentProductionBonus: 1.0, villageTier: C.TIERS.SETTLEMENT, nextSettlerEvent: 10, nextSettlerTime: 10,
        innSupplies: { bread: false, beer: false, meat: false, },
        buildings: JSON.parse(JSON.stringify(buildingDataConfig)),
        totalBuildingLimits: totalBuildingLimits,
        tierRequirements: tierRequirements,
        buildingQueue: [], 
        productionBonuses: {}, 
        lastSaveTimestamp: Date.now()
    };
}


// ===================================================================================
//
//  SECTION 2: GAME LOGIC
//
// ===================================================================================

function checkBuildingRequirements(key) {
    const building = gameState.buildings[key];
    const results = {
        allChecksPassed: true,
        requirements: { passed: true, messages: [] },
        cost: { passed: true, details: {} }
    };

    if (!building) {
        results.allChecksPassed = false;
        return results;
    }

    const reqs = building.requires || {};

    if (reqs.population && gameState.totalWorkers < reqs.population) {
        results.requirements.passed = false;
        results.requirements.messages.push(_t('ui.populationReq', {count: reqs.population}));
    }
    if (reqs.tier) {
        const tierOrder = Object.keys(gameState.tierRequirements);
        if (tierOrder.indexOf(gameState.villageTier) < tierOrder.indexOf(reqs.tier)) {
            results.requirements.passed = false;
            results.requirements.messages.push(_t('ui.tierReq', {tier: _t(`settlementTiers.${reqs.tier}`)}));
        }
    }
    if (reqs.building) {
        const buildingName = _t(gameState.buildings[reqs.building.key].nameKey);
        if (reqs.building.staffed) {
            let staffed = isBuildingTierMet(reqs.building.key);
            if (staffed && reqs.building.workerSlots) {
                for (const workerKey in reqs.building.workerSlots) {
                    if (gameState.assignedWorkers[workerKey] < reqs.building.workerSlots[workerKey]) {
                        staffed = false;
                        break;  
                    }
                }
            }
            if (!staffed) {
                let specificReq = _t('ui.staffedBuildingReq', { building: buildingName });
                if (reqs.building.workerSlots) {
                    const requiredWorkers = Object.keys(reqs.building.workerSlots).map(k => `${reqs.building.workerSlots[k]} ${_t(workerData[k].nameKey)}`).join(', ');
                    specificReq += ` (${_t('ui.requires')}: ${requiredWorkers})`;
                }
                results.requirements.passed = false;
                results.requirements.messages.push(specificReq);
            }
        } else if (!isBuildingTierMet(reqs.building.key)) {
            results.requirements.passed = false;
            results.requirements.messages.push(_t('ui.buildingReq', { building: buildingName }));
        }
    }
    if (reqs.worker && gameState.assignedWorkers[reqs.worker.key] < reqs.worker.count) {
        results.requirements.passed = false;
        results.requirements.messages.push(_t('ui.workerReq', {worker: _t(workerData[reqs.worker.key].nameKey)}));
    }

    for (const resource in building.cost) {
        const has = gameState.resources[resource];
        const required = building.cost[resource];
        const met = has >= required;
        results.cost.details[resource] = { required, has, met };
        if (!met) {
            results.cost.passed = false;
        }
    }

    results.allChecksPassed = results.requirements.passed && results.cost.passed;
    return results;
}

function recalculateAllStats() {
    const defaultState = getDefaultGameState();
    
    gameState.populationLimit = 0;
    gameState.workerLimit = 0;
    gameState.workerSlots = JSON.parse(JSON.stringify(defaultState.workerSlots));
    gameState.storageLimits = JSON.parse(JSON.stringify(defaultState.storageLimits));

    for (const key in gameState.buildings) {
        const building = gameState.buildings[key];
        
        let highestTierInChain = key;
        let nextUpgrade = findUpgradeTarget(key);
        while(nextUpgrade) {
            if (gameState.buildings[nextUpgrade].isBuilt) {
                highestTierInChain = nextUpgrade;
                nextUpgrade = findUpgradeTarget(nextUpgrade);
            } else {
                break;
            }
        }
        
        if(key === highestTierInChain) {
            const count = building.repeatable ? building.count : (building.isBuilt ? 1 : 0);
            if (count > 0 && building.effect) {
                if (building.effect.population) gameState.populationLimit += building.effect.population * count;
                if (building.effect.workerLimit) gameState.workerLimit += building.effect.workerLimit * count;
                if (building.effect.workerSlots) {
                    for(const type in building.effect.workerSlots) {
                        gameState.workerSlots[type] += building.effect.workerSlots[type] * count;
                    }
                }
                if (building.effect.storage) {
                    for(const res in building.effect.storage) {
                        gameState.storageLimits[res] += building.effect.storage[res] * count;
                    }
                }
            }
        }
    }

    if (gameState.assignedWorkers.foreman > 0) {
        gameState.workerLimit += BALANCE.bonuses.foremanWorkerLimit;
    }
    let assistantBonus = 0;
    const assistantCount = gameState.assignedWorkers.foremanAssistant;
    if (assistantCount > 0) {
        if (isBuildingTierMet('workersGuildhall')) assistantBonus = assistantCount * BALANCE.bonuses.assistantMultiplier.workersGuildhall;
        else if (isBuildingTierMet('workersBarracks')) assistantBonus = assistantCount * BALANCE.bonuses.assistantMultiplier.workersBarracks;
        else if (isBuildingTierMet(C.BUILDINGS.WORKERS_QUARTERS)) assistantBonus = assistantCount * BALANCE.bonuses.assistantMultiplier.workersQuarters;
    }
    gameState.workerLimit += assistantBonus;


    for (const type in gameState.assignedWorkers) {
        if (gameState.assignedWorkers[type] > gameState.workerSlots[type]) {
            const toUnassign = gameState.assignedWorkers[type] - gameState.workerSlots[type];
            gameState.assignedWorkers[type] -= toUnassign;
        }
    }
}

function calculateBuildTime(key, getDetails = false) {
    const building = gameState.buildings[key];
    if (!building) {
        const details = { builderCount: 0, builderPower: 0, totalSpeed: 0 };
        return { baseTime: 0, currentTime: Infinity, details };
    }

    const baseTime = Object.values(building.cost).reduce((a, b) => a + b, 0) / 5;
    const builderCount = gameState.assignedWorkers[C.WORKERS.BUILDER];
    const playerBaseSpeed = 1;
    const speedPerBuilder = 0.1;
    const builderPower = builderCount * speedPerBuilder;
    let totalSpeed = playerBaseSpeed + builderPower;

    if (gameState.villageTier !== C.TIERS.SETTLEMENT && builderCount === 0) {
        totalSpeed = 0;
    }

    const currentTime = totalSpeed > 0 ? baseTime / totalSpeed : Infinity;

    if (getDetails) {
        return {
            baseTime,
            currentTime,
            details: {
                builderCount,
                builderPower,
                totalSpeed
            }
        };
    }
    
    return { baseTime, currentTime };
}

function calculateNextSettlerTime() {
    const baseTime = 10;
    const timePerPop = 1.5;
    const popPenaltyCap = 50;
    const effectivePop = Math.min(gameState.totalWorkers, popPenaltyCap);
    const popTime = baseTime + (effectivePop * timePerPop);
    
    let totalBonus = 0;
    
    let innBonus = 0;
    if (isBuildingTierMet(C.BUILDINGS.INN) && gameState.assignedWorkers[C.WORKERS.INNKEEPER] > 0) {
        innBonus = BALANCE.buildingEffects.inn.settlerTimeBonus;
        if (isBuildingTierMet(C.BUILDINGS.TAVERN) && gameState.assignedWorkers[C.WORKERS.TAVERN_MAID] > 0) {
            innBonus += BALANCE.buildingEffects.tavern.settlerTimeBonus;
        }
    }
    totalBonus += innBonus;

    if (isBuildingTierMet(C.BUILDINGS.CHURCH) && gameState.assignedWorkers[C.WORKERS.PRIEST] > 0) {
        totalBonus += BALANCE.buildingEffects.church.settlerTimeBonus;
    }

    if (isBuildingTierMet(C.BUILDINGS.HEALERS_HUT) && gameState.assignedWorkers[C.WORKERS.HEALER] > 0) {
        totalBonus += BALANCE.buildingEffects.healersHut.settlerTimeBonus;
    }

    if (isBuildingTierMet(C.BUILDINGS.INN)) {
        if (gameState.innSupplies.bread) totalBonus += 0.05;
        if (gameState.innSupplies.beer) totalBonus += 0.05;
        if (gameState.innSupplies.meat) totalBonus += 0.10;
    }

    const bonusMultiplier = 1 - totalBonus;
    const finalTime = Math.max(5, popTime * bonusMultiplier);

    return { baseTime: popTime, totalTime: finalTime, bonus: totalBonus };
}

function toggleSupply(good) {
    if (gameState.resources[good] > 0) {
        gameState.innSupplies[good] = !gameState.innSupplies[good];
    } else {
        gameState.innSupplies[good] = false;
    }
    updateDisplay();
}

function toggleFoodSupply(foodType) {
    gameState.suppliedFoods[foodType] = !gameState.suppliedFoods[foodType];
    updateDisplay();
}

function addResource(type, amount) {
    if (typeof gameState.resources[type] === 'number') {
        gameState.resources[type] = Math.min(gameState.resources[type] + amount, gameState.storageLimits[type]);
    }
}

function addPopulation(amount) {
    if (gameState.totalWorkers < gameState.populationLimit) {
        gameState.totalWorkers += amount;
    }
}

function collectResource(type) { 
    if (gameState.villageTier !== C.TIERS.SETTLEMENT) return;
    addResource(type, 1);
}

function unlockGameFeatures(features) {
    features.forEach(feature => {
        if (!gameState.unlockedFeatures.includes(feature)) {
            gameState.unlockedFeatures.push(feature);
            let name;
            if (feature.endsWith('Building')) {
                const buildingKey = feature.replace('Building', '');
                const building = gameState.buildings[buildingKey];
                if (building) {
                    name = _t(building.nameKey);
                } else {
                    console.error(`Attempted to unlock a building with no definition: ${buildingKey}`);
                    name = buildingKey;
                }
            } else {
                name = _t('resources.' + feature);
            }
            if(name) queueMessage(_t('messages.unlocked', {name: name}));
        }
    });
}

function startBuilding(key) {
    const building = gameState.buildings[key];
    if(!building) {
        console.error(`Building with key ${key} not found!`);
        return;
    }
    
    if (gameState.buildingQueue.length >= 5) {
        queueMessage(_t("messages.queueFull"), 'error');
        return;
    }
    if (!building.repeatable && (building.isBuilt || gameState.buildingQueue.some(b => b.key === key))) {
        queueMessage(_t("messages.alreadyBuiltOrQueued"), 'error');
        return;
    }
    
    const isUpgrade = !!building.upgradesFrom;
    const buildingCount = getTotalBuildingCount() + gameState.buildingQueue.length;
    if (!isUpgrade && buildingCount >= gameState.totalBuildingLimits[gameState.villageTier]) {
         queueMessage(_t("messages.tierBuildingLimit"), 'error');
        return;
    }
    
    const check = checkBuildingRequirements(key);
    if (!check.allChecksPassed) {
        const errorMessage = check.requirements.messages.length > 0 
            ? check.requirements.messages.join(' ') 
            : _t("messages.notEnoughResources", { resources: '' });
        queueMessage(errorMessage, 'error');
        return;
    }

    for(const resource in building.cost) {
        gameState.resources[resource] -= building.cost[resource];
    }
    
    const { currentTime } = calculateBuildTime(key);
    gameState.buildingQueue.push({ key: key, progress: 0, totalTime: currentTime });
    queueMessage(_t("messages.buildQueued", {building: _t(building.nameKey)}));
}


function cancelBuilding(index) {
    if (index < 0 || index >= gameState.buildingQueue.length) return;
    
    const itemToCancel = gameState.buildingQueue.splice(index, 1)[0];
    const building = gameState.buildings[itemToCancel.key];

    for(const resource in building.cost) {
        addResource(resource, building.cost[resource]);
    }

    queueMessage(_t("messages.buildCancelled", {building: _t(building.nameKey)}));

    if (index === 0 && gameState.buildingQueue.length > 0) {
        const nextBuildingKey = gameState.buildingQueue[0].key;
        const { currentTime } = calculateBuildTime(nextBuildingKey);
        gameState.buildingQueue[0].totalTime = currentTime;
    }
    updateDisplay();
}

function demolishBuilding(key) {
    const building = gameState.buildings[key];
    if (!building || !building.repeatable || building.count <= 0) return;
    const buildingName = _t(building.nameKey);

    showConfirmModal(
        _t('ui.demolish') + ` ${buildingName}?`,
        _t('messages.demolishConfirm', {building: buildingName}),
        () => {
            building.count--;
            for (const res in building.cost) {
                addResource(res, Math.floor(building.cost[res] * 0.5));
            }
            recalculateAllStats();
            queueMessage(_t('messages.demolished', {building: buildingName}));
            updateDisplay();
        }
    );
}

function completeBuilding(key) {
    const building = gameState.buildings[key];
    
    if(building.repeatable) {
        building.count++;
    } else {
         building.isBuilt = true;
    }

    recalculateAllStats();
    
    queueMessage(_t('messages.buildComplete', {building: _t(building.nameKey)}));
    if (building.effect.unlocks) unlockGameFeatures(building.effect.unlocks);
    if (building.effect.buildingUnlocks) unlockGameFeatures(building.effect.buildingUnlocks);
    
    gameState.buildingQueue.shift(); 

    if (gameState.buildingQueue.length > 0) {
        const nextBuildingKey = gameState.buildingQueue[0].key;
        const { currentTime } = calculateBuildTime(nextBuildingKey);
        gameState.buildingQueue[0].totalTime = currentTime;
    }
    createBuildingCards();
    updateDisplay();
}

function assignWorker(type) {
    const assignedCount = Object.values(gameState.assignedWorkers).reduce((a, b) => a + b, 0);
    if (assignedCount >= gameState.totalWorkers) {
        queueMessage(_t('messages.noFreeSettlers'), "error");
        return;
    }
    if (assignedCount >= gameState.workerLimit) {
        queueMessage(_t('messages.noWorkerCapacity'), "error");
        return;
    }
    if (gameState.assignedWorkers[type] >= gameState.workerSlots[type]) {
        queueMessage(_t('messages.noMoreSlots'), "error");
        return;
    }
    gameState.assignedWorkers[type]++;
    recalculateAllStats();
}

function unassignWorker(type, force = false) {
    if (!force && type === C.WORKERS.BUILDER && gameState.buildingQueue.length > 0 && gameState.assignedWorkers[C.WORKERS.BUILDER] <= 1 && gameState.villageTier !== C.TIERS.SETTLEMENT) {
        const buildingName = _t(gameState.buildings[gameState.buildingQueue[0].key].nameKey);
        queueMessage(_t('messages.unassignError', {building: buildingName}), 'error');
        return;
    }
    if (gameState.assignedWorkers[type] <= 0) {
        return;
    }
    gameState.assignedWorkers[type]--;
    recalculateAllStats();
}

function processOfflineProgress(totalSeconds) {
    const MAX_OFFLINE_SECONDS = 86400;
    const secondsToSimulate = Math.min(totalSeconds, MAX_OFFLINE_SECONDS);

    if (secondsToSimulate < 10) return;

    isSimulatingOffline = true;
    const initialResources = JSON.parse(JSON.stringify(gameState.resources));
    const initialPopulation = gameState.totalWorkers;

    const originalQueueMessage = window.queueMessage;
    window.queueMessage = () => {};

    for (let i = 0; i < secondsToSimulate; i++) {
        updateGameState(1);
    }

    window.queueMessage = originalQueueMessage;

    const populationGained = gameState.totalWorkers - initialPopulation;
    const resourceGains = [];
    for (const res in gameState.resources) {
        const gain = Math.floor(gameState.resources[res] - initialResources[res]);
        if (gain > 1) {
            resourceGains.push(`${gain} ${_t('resources.'+res)}`);
        }
    }

    const hours = Math.floor(secondsToSimulate / 3600);
    const minutes = Math.floor((secondsToSimulate % 3600) / 60);
    const timeString = `${hours}h ${minutes}m`;

    queueMessage(_t('messages.welcomeBack', {time: timeString}), 'info');

    if (populationGained > 0) {
        queueMessage(_t('messages.settlersArrived', {count: populationGained}), 'info', 500);
    }
    if (resourceGains.length > 0) {
        queueMessage(_t('messages.gathered', {resources: resourceGains.join(', ')}), 'info', 1000);
    } else if (populationGained <= 0) {
        queueMessage(_t('messages.noProgress'), 'info', 500);
    }
    
    isSimulatingOffline = false;
    updateDisplay();
}

let isSimulatingOffline = false;

function saveGame() {
    if (isSimulatingOffline) return;
    gameState.lastSaveTimestamp = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function deepMerge(target, source) {
    const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);
    let output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (key in target && isObject(target[key])) {
                    output[key] = deepMerge(target[key], source[key]);
                } else {
                    output[key] = source[key];
                }
            } else {
                output[key] = source[key];
            }
        });
    }
    return output;
}

function loadGame() {
    const savedStateJSON = localStorage.getItem(SAVE_KEY);
    let savedState = null;
    if (savedStateJSON) {
        try {
            savedState = JSON.parse(savedStateJSON);
        } catch (e) {
            console.error("Error parsing saved game state:", e);
            localStorage.removeItem(SAVE_KEY);
        }
    }
    
    const defaultState = getDefaultGameState();
    
    if (savedState) {
        gameState = deepMerge(defaultState, savedState);
    } else {
        gameState = defaultState;
    }
    return savedState; 
}

function exportSave() {
    const saveData = btoa(JSON.stringify(gameState));
    dom.exportTextarea.value = saveData;
    showModal('export-modal');
}

function saveToFile() {
    const data = dom.exportTextarea.value;
    if (!data) {
        queueMessage(_t('messages.noDataToSave'), 'error');
        return;
    }

    const date = new Date();
    const year = String(date.getFullYear()).substring(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const filename = `MyLittleEmpire_${day}-${month}-${year}_${hours}-${minutes}.txt`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function importSave() {
    const saveData = prompt(_t("ui.importSavePrompt"));
    if (saveData) {
        try {
            const decodedSave = atob(saveData);
            const newState = JSON.parse(decodedSave);
            gameState = deepMerge(getDefaultGameState(), newState);
            saveGame();
            createAllDynamicElements();
            recalculateAllStats();
            updateDisplay();
            queueMessage(_t("messages.saveImported"), 'success');
        } catch (e) {
            console.error("Failed to import save:", e);
            queueMessage(_t("messages.saveImportFailed"), 'error');
        }
    }
}

function resetGame() {
    showConfirmModal(
        _t('ui.resetProgress'),
        _t('messages.resetConfirm'),
        () => {
            localStorage.clear();
            gameState = getDefaultGameState();
            location.reload(true);
        }
    );
}

let lastTick = Date.now();
let productionHalted = false;
let hiddenTimestamp = null;

function processFoodConsumption(delta) {
    const workingWorkers = Object.values(gameState.assignedWorkers).reduce((a, b) => a + b, 0);
    gameState.currentProductionBonus = 1.0;
    gameState.foodConsumptionPerSecond = { grain: 0, bread: 0, meat: 0, beer: 0, honey: 0, fish: 0 };
    const wasHalted = productionHalted; 
    productionHalted = false;

    if (workingWorkers <= 0) return;

    const foodValueConfig = {
        grain: { consumption: 0.3, bonus: 0.00 },
        bread: { consumption: 0.2, bonus: 0.03 },
        fish: { consumption: 0.25, bonus: 0.03 },
        meat:  { consumption: 0.15, bonus: 0.05 },
        beer:  { consumption: 0.18, bonus: 0.03 },
        honey: { consumption: 0.17, bonus: 0.02 },
    };

    const availableFoodMix = {};
    let totalAttractiveness = 0;
    let totalBonus = 0;
    
    for (const food in foodValueConfig) {
        if (gameState.suppliedFoods[food] && gameState.resources[food] > 0) {
            const attractiveness = 1 / foodValueConfig[food].consumption;
            availableFoodMix[food] = { attractiveness: attractiveness, config: foodValueConfig[food] };
            totalAttractiveness += attractiveness;
            totalBonus += foodValueConfig[food].bonus;
        }
    }

    if (totalAttractiveness > 0) {
        let totalSatiationAvailable = 0;
        for (const food in availableFoodMix) {
             totalSatiationAvailable += gameState.resources[food] / availableFoodMix[food].config.consumption;
        }
        const satiationNeededThisTick = workingWorkers * delta;

        if (totalSatiationAvailable >= satiationNeededThisTick) {
            productionHalted = false;
            gameState.currentProductionBonus = 1.0 + totalBonus;
            for (const food in availableFoodMix) {
                const proportion = availableFoodMix[food].attractiveness / totalAttractiveness;
                const consumptionRate = availableFoodMix[food].config.consumption;
                const consumptionPerSecondForFood = workingWorkers * proportion * consumptionRate;
                const amountToConsumeThisTick = Math.min(consumptionPerSecondForFood * delta, gameState.resources[food]);
                gameState.resources[food] -= amountToConsumeThisTick;
                gameState.foodConsumptionPerSecond[food] = consumptionPerSecondForFood;
            }
        } else {
            productionHalted = true;
        }
    } else {
        productionHalted = true;
    }

    if (productionHalted && !wasHalted) {
        queueMessage(_t("ui.productionHaltedNoFood"), "error");
    }
}

function processProduction(delta) {
    const foodTypes = ['grain', 'flour', 'bread', 'water', 'fish', 'cattle', 'meat', 'hops', 'beer', 'honey'];
    for (const workerType in gameState.assignedWorkers) {
        const workerCount = gameState.assignedWorkers[workerType];
        if (workerCount <= 0 || !workerData[workerType]) continue;

        const data = workerData[workerType];
        
        let isAnyFoodProducer = data.produces ? Object.keys(data.produces).some(resource => foodTypes.includes(resource)) : false;
        if (productionHalted && !isAnyFoodProducer) continue;

        let canProduce = true;
        if (data.consumes) {
            for (const res in data.consumes) {
                if (gameState.resources[res] < data.consumes[res] * workerCount * delta) {
                    canProduce = false;
                    break;
                }
            }
        }
        if (canProduce) {
            if (data.consumes) {
                for (const res in data.consumes) gameState.resources[res] -= data.consumes[res] * workerCount * delta;
            }
            if (data.produces) {
                for (const res in data.produces) {
                    addResource(res, (data.produces[res] * gameState.currentProductionBonus) * workerCount * delta);
                }
            }
        }
    }
}

function processInnSupplies(delta) {
    const innConsumptionRate = 0.5; 
    const tierLevels = { settlement: 1, small_village: 2, village: 3, small_town: 4, town: 5 };
    const consumption = innConsumptionRate * tierLevels[gameState.villageTier] * delta;

    if (gameState.innSupplies.bread) {
        if (gameState.resources.bread >= consumption) gameState.resources.bread -= consumption;
        else gameState.innSupplies.bread = false;
    }
    if (gameState.innSupplies.beer) {
         if (gameState.resources.beer >= consumption) gameState.resources.beer -= consumption;
        else gameState.innSupplies.beer = false;
    }
    if (gameState.innSupplies.meat) {
         if (gameState.resources.meat >= consumption) gameState.resources.meat -= consumption;
        else gameState.innSupplies.meat = false;
    }
}

function processConstructionQueue(delta) {
    if (gameState.buildingQueue.length > 0) {
        const currentBuild = gameState.buildingQueue[0];
        const { currentTime } = calculateBuildTime(currentBuild.key);
        currentBuild.totalTime = currentTime;

        if (isFinite(currentBuild.totalTime)) {
            currentBuild.progress += delta;
        }

        if (currentBuild.progress >= currentBuild.totalTime) {
            completeBuilding(currentBuild.key);
        }
    }
}

function processSettlerArrival(delta) {
    if (gameState.populationLimit > gameState.totalWorkers) {
        gameState.nextSettlerEvent -= delta;
        if (gameState.nextSettlerEvent <= 0) {
            gameState.totalWorkers++;
            queueMessage(_t("messages.newSettler"), "success");
            const newTime = calculateNextSettlerTime();
            gameState.nextSettlerEvent = newTime.totalTime;
            gameState.nextSettlerTime = newTime.totalTime;
        }
    }
}

function processTierUp() {
    const pop = gameState.totalWorkers;
    const tierKeys = Object.keys(gameState.tierRequirements);
    const currentTier = gameState.villageTier;
    let newTier = currentTier;

    for (let i = tierKeys.length - 1; i >= 0; i--) {
        const tier = tierKeys[i];
        if (pop >= gameState.tierRequirements[tier]) {
            newTier = tier;
            break;
        }
    }
    
    const currentTierIndex = tierKeys.indexOf(currentTier);
    const newTierIndex = tierKeys.indexOf(newTier);

    if (newTierIndex > currentTierIndex) {
        const newTierData = tierConfig[newTier];
        
        let canAdvance = false;
        if (newTier === C.TIERS.SMALL_VILLAGE && isBuildingTierMet(C.BUILDINGS.REEVES_HOUSE)) canAdvance = true;
        else if (newTier === C.TIERS.VILLAGE && isBuildingTierMet(C.BUILDINGS.VILLAGE_HALL)) canAdvance = true;
        
        if (canAdvance) {
            gameState.villageTier = newTier;
            queueMessage(_t("messages.tierUp", {tier: _t(`settlementTiers.${newTier}`)}));
            
            if (newTierData.unlocks && newTierData.unlocks.length > 0) {
                unlockGameFeatures(newTierData.unlocks);
            }
            
            if (newTierData.showModal) {
                showTierUpModal();
            }
        }
    }
}

function updateGameState(delta) {
    processFoodConsumption(delta);
    processProduction(delta);
    processInnSupplies(delta);
    processConstructionQueue(delta);
    processSettlerArrival(delta);
    processTierUp();
}

function gameLoop() {
    const now = Date.now();
    const delta = (now - lastTick) / 1000;
    lastTick = now;
    
    updateGameState(delta);
    
    requestAnimationFrame(gameLoop);
}

function handleVisibilityChange() {
    if (document.hidden) {
        hiddenTimestamp = Date.now();
        saveGame();
    } else {
        if (hiddenTimestamp) {
            const offlineSeconds = (Date.now() - hiddenTimestamp) / 1000;
            processOfflineProgress(offlineSeconds);
            hiddenTimestamp = null;
        }
        lastTick = Date.now();
    }
}