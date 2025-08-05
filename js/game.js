// This file defines the main Game class which encapsulates all game state and logic.
class Game {
    constructor() {
        this.state = {};
        this.lastTick = null;
        this.productionHalted = false;
        this.hiddenTimestamp = null;
        this.isSimulatingOffline = false;
        
        // The UI controller is now a part of the Game instance
        this.ui = new UI(this);
    }

    // This method kicks off the entire game.
    init() {
        this.ui.initializeDOM();
        this.ui.loadLanguageAndInit('en', true);
    }

    // The main game loop, now a method of the Game class
    loop() {
        const now = Date.now();
        const delta = (now - this.lastTick) / 1000;
        this.lastTick = now;
        
        this.update(delta);
        
        // Keep the loop going
        requestAnimationFrame(() => this.loop());
    }
    
    // All functions from the old game.js are now methods of this class.
    
    getDefaultGameState() {
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
            resources: { wood: 0, stone: 0, grain: 0, flour: 0, bread: 0, cattle: 0, meat: 0, hops: 0, water: 0, beer: 0, rawhide: 0, leather: 0, honey: 0, wax: 0, fish: 0, clay: 0, pottery: 0, bricks: 0, wool: 0, fabric: 0, clothes: 0, herbs: 0, candles: 0, charcoal: 0, ironOre: 0, ironIngots: 0, tools: 0 },
            storageLimits: { wood: 100, stone: 100, grain: 100, flour: 0, bread: 0, cattle: 0, meat: 0, hops: 0, water: 0, beer: 0, rawhide: 0, leather: 0, honey: 0, wax: 0, fish: 0, clay: 100, pottery: 0, bricks: 0, wool: 0, fabric: 0, clothes: 0, herbs: 0, candles: 0, charcoal: 0, ironOre: 0, ironIngots: 0, tools: 0 },
            unlockedFeatures: ['wood', 'stone', 'clay', 'grain', 'settlersCabinBuilding'],
            populationLimit: 0, totalWorkers: 0, workerLimit: 0,
            assignedWorkers: { wood: 0, stone: 0, grain: 0, miller: 0, rancher: 0, butcher: 0, tanner: 0, hopFarmer: 0, water: 0, baker: 0, brewer: 0, beekeeper: 0, candlemaker: 0, builder: 0, foreman: 0, foremanAssistant: 0, masterBuilder: 0, clerk: 0, innkeeper: 0, tavernMaid: 0, priest: 0, fisherman: 0, clayMiner: 0, potter: 0, brickmaker: 0, shepherd: 0, weaver: 0, tailor: 0, herbalist: 0, healer: 0, charcoalBurner: 0, ironMiner: 0, smelter: 0, blacksmith: 0 },
            workerSlots: { wood: 0, stone: 0, grain: 0, miller: 0, rancher: 0, butcher: 0, tanner: 0, hopFarmer: 0, water: 0, baker: 0, brewer: 0, beekeeper: 0, candlemaker: 0, builder: 0, foreman: 0, foremanAssistant: 0, masterBuilder: 0, clerk: 0, innkeeper: 0, tavernMaid: 0, priest: 0, fisherman: 0, clayMiner: 0, potter: 0, brickmaker: 0, shepherd: 0, weaver: 0, tailor: 0, herbalist: 0, healer: 0, charcoalBurner: 0, ironMiner: 0, smelter: 0, blacksmith: 0 },
            suppliedFoods: { grain: true, bread: false, meat: false, beer: false, honey: false, fish: false },
            foodConsumptionPerSecond: { grain: 0, bread: 0, meat: 0, beer: 0, honey: 0, fish: 0 },
            currentProductionBonus: 1.0, villageTier: C.TIERS.SETTLEMENT, nextSettlerEvent: 10, nextSettlerTime: 10,
            innSupplies: { bread: false, beer: false, meat: false },
            buildings: JSON.parse(JSON.stringify(buildingDataConfig)),
            totalBuildingLimits: totalBuildingLimits,
            tierRequirements: tierRequirements,
            buildingQueue: [], 
            productionBonuses: {}, 
            lastSaveTimestamp: Date.now()
        };
    }

    checkBuildingRequirements(key) {
        const building = this.state.buildings[key];
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

        if (reqs.population && this.state.totalWorkers < reqs.population) {
            results.requirements.passed = false;
            results.requirements.messages.push(_t('ui.populationReq', {count: reqs.population}));
        }
        if (reqs.tier) {
            const tierOrder = Object.keys(this.state.tierRequirements);
            if (tierOrder.indexOf(this.state.villageTier) < tierOrder.indexOf(reqs.tier)) {
                results.requirements.passed = false;
                results.requirements.messages.push(_t('ui.tierReq', {tier: _t(`settlementTiers.${reqs.tier}`)}));
            }
        }
        if (reqs.building) {
            const buildingName = _t(this.state.buildings[reqs.building.key].nameKey);
            if (reqs.building.staffed) {
                let staffed = this.ui.isBuildingTierMet(reqs.building.key);
                if (staffed && reqs.building.workerSlots) {
                    for (const workerKey in reqs.building.workerSlots) {
                        if (this.state.assignedWorkers[workerKey] < reqs.building.workerSlots[workerKey]) {
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
            } else if (!this.ui.isBuildingTierMet(reqs.building.key)) {
                results.requirements.passed = false;
                results.requirements.messages.push(_t('ui.buildingReq', { building: buildingName }));
            }
        }
        if (reqs.worker && this.state.assignedWorkers[reqs.worker.key] < reqs.worker.count) {
            results.requirements.passed = false;
            results.requirements.messages.push(_t('ui.workerReq', {worker: _t(workerData[reqs.worker.key].nameKey)}));
        }

        for (const resource in building.cost) {
            const has = this.state.resources[resource];
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

    recalculateAllStats() {
        const defaultState = this.getDefaultGameState();
        
        this.state.populationLimit = 0;
        this.state.workerLimit = 0;
        this.state.workerSlots = JSON.parse(JSON.stringify(defaultState.workerSlots));
        this.state.storageLimits = JSON.parse(JSON.stringify(defaultState.storageLimits));

        for (const key in this.state.buildings) {
            const building = this.state.buildings[key];
            
            let highestTierInChain = key;
            let nextUpgrade = this.ui.findUpgradeTarget(key);
            while(nextUpgrade) {
                if (this.state.buildings[nextUpgrade].isBuilt) {
                    highestTierInChain = nextUpgrade;
                    nextUpgrade = this.ui.findUpgradeTarget(nextUpgrade);
                } else {
                    break;
                }
            }
            
            if(key === highestTierInChain) {
                const count = building.repeatable ? building.count : (building.isBuilt ? 1 : 0);
                if (count > 0 && building.effect) {
                    if (building.effect.population) this.state.populationLimit += building.effect.population * count;
                    if (building.effect.workerLimit) this.state.workerLimit += building.effect.workerLimit * count;
                    if (building.effect.workerSlots) {
                        for(const type in building.effect.workerSlots) {
                            this.state.workerSlots[type] += building.effect.workerSlots[type] * count;
                        }
                    }
                    if (building.effect.storage) {
                        for(const res in building.effect.storage) {
                            this.state.storageLimits[res] += building.effect.storage[res] * count;
                        }
                    }
                }
            }
        }

        if (this.state.assignedWorkers.foreman > 0) {
            this.state.workerLimit += 30;
        }
        let assistantBonus = 0;
        const assistantCount = this.state.assignedWorkers.foremanAssistant;
        if (assistantCount > 0) {
            if (this.ui.isBuildingTierMet('workersGuildhall')) assistantBonus = assistantCount * 65;
            else if (this.ui.isBuildingTierMet('workersBarracks')) assistantBonus = assistantCount * 20;
            else if (this.ui.isBuildingTierMet(C.BUILDINGS.WORKERS_QUARTERS)) assistantBonus = assistantCount * 22;
        }
        this.state.workerLimit += assistantBonus;


        for (const type in this.state.assignedWorkers) {
            if (this.state.assignedWorkers[type] > this.state.workerSlots[type]) {
                const toUnassign = this.state.assignedWorkers[type] - this.state.workerSlots[type];
                this.state.assignedWorkers[type] -= toUnassign;
            }
        }
    }

    calculateBuildTime(key, getDetails = false) {
        const building = this.state.buildings[key];
        if (!building) {
            const details = { builderCount: 0, builderPower: 0, totalSpeed: 0 };
            return { baseTime: 0, currentTime: Infinity, details };
        }

        const baseTime = Object.values(building.cost).reduce((a, b) => a + b, 0) / 5;
        const builderCount = this.state.assignedWorkers[C.WORKERS.BUILDER];
        const playerBaseSpeed = 1;
        const speedPerBuilder = 0.1;
        const builderPower = builderCount * speedPerBuilder;
        let totalSpeed = playerBaseSpeed + builderPower;

        if (this.state.villageTier !== C.TIERS.SETTLEMENT && builderCount === 0) {
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

    calculateNextSettlerTime() {
        const baseTime = 10;
        const timePerPop = 1.5;
        const popPenaltyCap = 50;
        const effectivePop = Math.min(this.state.totalWorkers, popPenaltyCap);
        const popTime = baseTime + (effectivePop * timePerPop);
        
        let totalBonus = 0;
        
        let innBonus = 0;
        if (this.ui.isBuildingTierMet(C.BUILDINGS.INN) && this.state.assignedWorkers[C.WORKERS.INNKEEPER] > 0) {
            innBonus = this.state.buildings[C.BUILDINGS.INN].effect.settlerTimeBonus;
            if (this.ui.isBuildingTierMet(C.BUILDINGS.TAVERN) && this.state.assignedWorkers[C.WORKERS.TAVERN_MAID] > 0) {
                innBonus += this.state.buildings[C.BUILDINGS.TAVERN].effect.settlerTimeBonus;
            }
        }
        totalBonus += innBonus;

        if (this.ui.isBuildingTierMet(C.BUILDINGS.CHURCH) && this.state.assignedWorkers[C.WORKERS.PRIEST] > 0) {
            totalBonus += this.state.buildings[C.BUILDINGS.CHURCH].effect.settlerTimeBonus;
        }

        if (this.ui.isBuildingTierMet(C.BUILDINGS.HEALERS_HUT) && this.state.assignedWorkers[C.WORKERS.HEALER] > 0) {
            totalBonus += this.state.buildings[C.BUILDINGS.HEALERS_HUT].effect.settlerTimeBonus;
        }

        if (this.ui.isBuildingTierMet(C.BUILDINGS.INN)) {
            if (this.state.innSupplies.bread) totalBonus += 0.05;
            if (this.state.innSupplies.beer) totalBonus += 0.05;
            if (this.state.innSupplies.meat) totalBonus += 0.10;
        }

        const bonusMultiplier = 1 - totalBonus;
        const finalTime = Math.max(5, popTime * bonusMultiplier);

        return { baseTime: popTime, totalTime: finalTime, bonus: totalBonus };
    }

    toggleSupply(good) {
        if (this.state.resources[good] > 0) {
            this.state.innSupplies[good] = !this.state.innSupplies[good];
        } else {
            this.state.innSupplies[good] = false;
        }
        this.ui.updateDisplay();
    }

    toggleFoodSupply(foodType) {
        this.state.suppliedFoods[foodType] = !this.state.suppliedFoods[foodType];
        this.ui.updateDisplay();
    }

    addResource(type, amount) {
        if (typeof this.state.resources[type] === 'number') {
            this.state.resources[type] = Math.min(this.state.resources[type] + amount, this.state.storageLimits[type]);
        }
    }

    addPopulation(amount) {
        if (this.state.totalWorkers < this.state.populationLimit) {
            this.state.totalWorkers += amount;
        }
    }

    collectResource(type) { 
        if (this.state.villageTier !== C.TIERS.SETTLEMENT) return;
        this.addResource(type, 1);
    }

    unlockGameFeatures(features) {
        features.forEach(feature => {
            if (!this.state.unlockedFeatures.includes(feature)) {
                this.state.unlockedFeatures.push(feature);
                let name;
                if (feature.endsWith('Building')) {
                    const buildingKey = feature.replace('Building', '');
                    const building = this.state.buildings[buildingKey];
                    if (building) {
                        name = _t(building.nameKey);
                    } else {
                        console.error(`Attempted to unlock a building with no definition: ${buildingKey}`);
                        name = buildingKey;
                    }
                } else {
                    name = _t('resources.' + feature);
                }
                if(name) this.ui.queueMessage(_t('messages.unlocked', {name: name}));
            }
        });
    }

    startBuilding(key) {
        const building = this.state.buildings[key];
        if(!building) {
            console.error(`Building with key ${key} not found!`);
            return;
        }
        
        if (this.state.buildingQueue.length >= 5) {
            this.ui.queueMessage(_t("messages.queueFull"), 'error');
            return;
        }
        if (!building.repeatable && (building.isBuilt || this.state.buildingQueue.some(b => b.key === key))) {
            this.ui.queueMessage(_t("messages.alreadyBuiltOrQueued"), 'error');
            return;
        }
        
        const isUpgrade = !!building.upgradesFrom;
        const buildingCount = this.ui.getTotalBuildingCount() + this.state.buildingQueue.length;
        if (!isUpgrade && buildingCount >= this.state.totalBuildingLimits[this.state.villageTier]) {
             this.ui.queueMessage(_t("messages.tierBuildingLimit"), 'error');
            return;
        }
        
        const check = this.checkBuildingRequirements(key);
        if (!check.allChecksPassed) {
            const errorMessage = check.requirements.messages.length > 0 
                ? check.requirements.messages.join(' ') 
                : _t("messages.notEnoughResources", { resources: '' });
            this.ui.queueMessage(errorMessage, 'error');
            return;
        }

        for(const resource in building.cost) {
            this.state.resources[resource] -= building.cost[resource];
        }
        
        const { currentTime } = this.calculateBuildTime(key);
        this.state.buildingQueue.push({ key: key, progress: 0, totalTime: currentTime });
        this.ui.queueMessage(_t("messages.buildQueued", {building: _t(building.nameKey)}));
    }

    cancelBuilding(index) {
        if (index < 0 || index >= this.state.buildingQueue.length) return;
        
        const itemToCancel = this.state.buildingQueue.splice(index, 1)[0];
        const building = this.state.buildings[itemToCancel.key];

        for(const resource in building.cost) {
            this.addResource(resource, building.cost[resource]);
        }

        this.ui.queueMessage(_t("messages.buildCancelled", {building: _t(building.nameKey)}));

        if (index === 0 && this.state.buildingQueue.length > 0) {
            const nextBuildingKey = this.state.buildingQueue[0].key;
            const { currentTime } = this.calculateBuildTime(nextBuildingKey);
            this.state.buildingQueue[0].totalTime = currentTime;
        }
        this.ui.updateDisplay();
    }

    demolishBuilding(key) {
        const building = this.state.buildings[key];
        if (!building || !building.repeatable || building.count <= 0) return;
        const buildingName = _t(building.nameKey);

        this.ui.showConfirmModal(
            _t('ui.demolish') + ` ${buildingName}?`,
            _t('messages.demolishConfirm', {building: buildingName}),
            () => {
                building.count--;
                for (const res in building.cost) {
                    this.addResource(res, Math.floor(building.cost[res] * 0.5));
                }
                this.recalculateAllStats();
                this.ui.queueMessage(_t('messages.demolished', {building: buildingName}));
                this.ui.updateDisplay();
            }
        );
    }

    completeBuilding(key) {
        const building = this.state.buildings[key];
        
        if(building.repeatable) {
            building.count++;
        } else {
             building.isBuilt = true;
        }

        this.recalculateAllStats();
        
        this.ui.queueMessage(_t('messages.buildComplete', {building: _t(building.nameKey)}));
        if (building.effect.unlocks) this.unlockGameFeatures(building.effect.unlocks);
        if (building.effect.buildingUnlocks) this.unlockGameFeatures(building.effect.buildingUnlocks);
        
        this.state.buildingQueue.shift(); 

        if (this.state.buildingQueue.length > 0) {
            const nextBuildingKey = this.state.buildingQueue[0].key;
            const { currentTime } = this.calculateBuildTime(nextBuildingKey);
            this.state.buildingQueue[0].totalTime = currentTime;
        }
        this.ui.createBuildingCards();
        this.ui.updateDisplay();
    }

    assignWorker(type) {
        const assignedCount = Object.values(this.state.assignedWorkers).reduce((a, b) => a + b, 0);
        if (assignedCount >= this.state.totalWorkers) {
            this.ui.queueMessage(_t('messages.noFreeSettlers'), "error");
            return;
        }
        if (assignedCount >= this.state.workerLimit) {
            this.ui.queueMessage(_t('messages.noWorkerCapacity'), "error");
            return;
        }
        if (this.state.assignedWorkers[type] >= this.state.workerSlots[type]) {
            this.ui.queueMessage(_t('messages.noMoreSlots'), "error");
            return;
        }
        this.state.assignedWorkers[type]++;
        this.recalculateAllStats();
    }

    unassignWorker(type, force = false) {
        if (!force && type === C.WORKERS.BUILDER && this.state.buildingQueue.length > 0 && this.state.assignedWorkers[C.WORKERS.BUILDER] <= 1 && this.state.villageTier !== C.TIERS.SETTLEMENT) {
            const buildingName = _t(this.state.buildings[this.state.buildingQueue[0].key].nameKey);
            this.ui.queueMessage(_t('messages.unassignError', {building: buildingName}), 'error');
            return;
        }
        if (this.state.assignedWorkers[type] <= 0) {
            return;
        }
        this.state.assignedWorkers[type]--;
        this.recalculateAllStats();
    }

    processOfflineProgress(totalSeconds) {
        const MAX_OFFLINE_SECONDS = 86400;
        const secondsToSimulate = Math.min(totalSeconds, MAX_OFFLINE_SECONDS);

        if (secondsToSimulate < 10) return;

        this.isSimulatingOffline = true;
        const initialResources = JSON.parse(JSON.stringify(this.state.resources));
        const initialPopulation = this.state.totalWorkers;

        const originalQueueMessage = this.ui.queueMessage;
        this.ui.queueMessage = () => {};

        for (let i = 0; i < secondsToSimulate; i++) {
            this.update(1);
        }

        this.ui.queueMessage = originalQueueMessage;

        const populationGained = this.state.totalWorkers - initialPopulation;
        const resourceGains = [];
        for (const res in this.state.resources) {
            const gain = Math.floor(this.state.resources[res] - initialResources[res]);
            if (gain > 1) {
                resourceGains.push(`${gain} ${_t('resources.'+res)}`);
            }
        }

        const hours = Math.floor(secondsToSimulate / 3600);
        const minutes = Math.floor((secondsToSimulate % 3600) / 60);
        const timeString = `${hours}h ${minutes}m`;

        this.ui.queueMessage(_t('messages.welcomeBack', {time: timeString}), 'info');

        if (populationGained > 0) {
            this.ui.queueMessage(_t('messages.settlersArrived', {count: populationGained}), 'info', 500);
        }
        if (resourceGains.length > 0) {
            this.ui.queueMessage(_t('messages.gathered', {resources: resourceGains.join(', ')}), 'info', 1000);
        } else if (populationGained <= 0) {
            this.ui.queueMessage(_t('messages.noProgress'), 'info', 500);
        }
        
        this.isSimulatingOffline = false;
        this.ui.updateDisplay();
    }

    saveGame() {
        if (this.isSimulatingOffline) return;
        this.state.lastSaveTimestamp = Date.now();
        localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    }

    deepMerge(target, source) {
        const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);
        let output = { ...target };

        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (key in target && isObject(target[key])) {
                        output[key] = this.deepMerge(target[key], source[key]);
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

    loadGame() {
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
        
        const defaultState = this.getDefaultGameState();
        
        if (savedState) {
            this.state = this.deepMerge(defaultState, savedState);
        } else {
            this.state = defaultState;
        }
        return savedState; 
    }

    exportSave() {
        const saveData = btoa(JSON.stringify(this.state));
        this.ui.dom.exportTextarea.value = saveData;
        this.ui.showModal('export-modal');
    }

    saveToFile() {
        const data = this.ui.dom.exportTextarea.value;
        if (!data) {
            this.ui.queueMessage(_t('messages.noDataToSave'), 'error');
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

    importSave() {
        const saveData = prompt(_t("ui.importSavePrompt"));
        if (saveData) {
            try {
                const decodedSave = atob(saveData);
                const newState = JSON.parse(decodedSave);
                this.state = this.deepMerge(this.getDefaultGameState(), newState);
                this.saveGame();
                this.ui.createAllDynamicElements();
                this.recalculateAllStats();
                this.ui.updateDisplay();
                this.ui.queueMessage(_t("messages.saveImported"), 'success');
            } catch (e) {
                console.error("Failed to import save:", e);
                this.ui.queueMessage(_t("messages.saveImportFailed"), 'error');
            }
        }
    }

    resetGame() {
        this.ui.showConfirmModal(
            _t('ui.resetProgress'),
            _t('messages.resetConfirm'),
            () => {
                localStorage.clear();
                this.state = this.getDefaultGameState();
                location.reload(true);
            }
        );
    }

    processFoodConsumption(delta) {
        const workingWorkers = Object.values(this.state.assignedWorkers).reduce((a, b) => a + b, 0);
        this.state.currentProductionBonus = 1.0;
        this.state.foodConsumptionPerSecond = { grain: 0, bread: 0, meat: 0, beer: 0, honey: 0, fish: 0 };
        const wasHalted = this.productionHalted; 
        this.productionHalted = false;

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
            if (this.state.suppliedFoods[food] && this.state.resources[food] > 0) {
                const attractiveness = 1 / foodValueConfig[food].consumption;
                availableFoodMix[food] = { attractiveness: attractiveness, config: foodValueConfig[food] };
                totalAttractiveness += attractiveness;
                totalBonus += foodValueConfig[food].bonus;
            }
        }

        if (totalAttractiveness > 0) {
            let totalSatiationAvailable = 0;
            for (const food in availableFoodMix) {
                 totalSatiationAvailable += this.state.resources[food] / availableFoodMix[food].config.consumption;
            }
            const satiationNeededThisTick = workingWorkers * delta;

            if (totalSatiationAvailable >= satiationNeededThisTick) {
                this.productionHalted = false;
                this.state.currentProductionBonus = 1.0 + totalBonus;
                for (const food in availableFoodMix) {
                    const proportion = availableFoodMix[food].attractiveness / totalAttractiveness;
                    const consumptionRate = availableFoodMix[food].config.consumption;
                    const consumptionPerSecondForFood = workingWorkers * proportion * consumptionRate;
                    const amountToConsumeThisTick = Math.min(consumptionPerSecondForFood * delta, this.state.resources[food]);
                    this.state.resources[food] -= amountToConsumeThisTick;
                    this.state.foodConsumptionPerSecond[food] = consumptionPerSecondForFood;
                }
            } else {
                this.productionHalted = true;
            }
        } else {
            this.productionHalted = true;
        }

        if (this.productionHalted && !wasHalted) {
            this.ui.queueMessage(_t("ui.productionHaltedNoFood"), "error");
        }
    }

    processProduction(delta) {
        const foodTypes = ['grain', 'flour', 'bread', 'water', 'fish', 'cattle', 'meat', 'hops', 'beer', 'honey'];
        for (const workerType in this.state.assignedWorkers) {
            const workerCount = this.state.assignedWorkers[workerType];
            if (workerCount <= 0 || !workerData[workerType]) continue;

            const data = workerData[workerType];
            
            let isAnyFoodProducer = data.produces ? Object.keys(data.produces).some(resource => foodTypes.includes(resource)) : false;
            if (this.productionHalted && !isAnyFoodProducer) continue;

            let canProduce = true;
            if (data.consumes) {
                for (const res in data.consumes) {
                    if (this.state.resources[res] < data.consumes[res] * workerCount * delta) {
                        canProduce = false;
                        break;
                    }
                }
            }
            if (canProduce) {
                if (data.consumes) {
                    for (const res in data.consumes) this.state.resources[res] -= data.consumes[res] * workerCount * delta;
                }
                if (data.produces) {
                    for (const res in data.produces) {
                        this.addResource(res, (data.produces[res] * this.state.currentProductionBonus) * workerCount * delta);
                    }
                }
            }
        }
    }

    processInnSupplies(delta) {
        const innConsumptionRate = 0.5; 
        const tierLevels = { settlement: 1, small_village: 2, village: 3, small_town: 4, town: 5 };
        const consumption = innConsumptionRate * tierLevels[this.state.villageTier] * delta;

        if (this.state.innSupplies.bread) {
            if (this.state.resources.bread >= consumption) this.state.resources.bread -= consumption;
            else this.state.innSupplies.bread = false;
        }
        if (this.state.innSupplies.beer) {
             if (this.state.resources.beer >= consumption) this.state.resources.beer -= consumption;
            else this.state.innSupplies.beer = false;
        }
        if (this.state.innSupplies.meat) {
             if (this.state.resources.meat >= consumption) this.state.resources.meat -= consumption;
            else this.state.innSupplies.meat = false;
        }
    }

    processConstructionQueue(delta) {
        if (this.state.buildingQueue.length > 0) {
            const currentBuild = this.state.buildingQueue[0];
            const { currentTime } = this.calculateBuildTime(currentBuild.key);
            currentBuild.totalTime = currentTime;

            if (isFinite(currentBuild.totalTime)) {
                currentBuild.progress += delta;
            }

            if (currentBuild.progress >= currentBuild.totalTime) {
                this.completeBuilding(currentBuild.key);
            }
        }
    }

    processSettlerArrival(delta) {
        if (this.state.populationLimit > this.state.totalWorkers) {
            this.state.nextSettlerEvent -= delta;
            if (this.state.nextSettlerEvent <= 0) {
                this.state.totalWorkers++;
                this.ui.queueMessage(_t("messages.newSettler"), "success");
                const newTime = this.calculateNextSettlerTime();
                this.state.nextSettlerEvent = newTime.totalTime;
                this.state.nextSettlerTime = newTime.totalTime;
            }
        }
    }

    processTierUp() {
        const pop = this.state.totalWorkers;
        const tierKeys = Object.keys(this.state.tierRequirements);
        const currentTier = this.state.villageTier;
        let newTier = currentTier;

        for (let i = tierKeys.length - 1; i >= 0; i--) {
            const tier = tierKeys[i];
            if (pop >= this.state.tierRequirements[tier]) {
                newTier = tier;
                break;
            }
        }
        
        const currentTierIndex = tierKeys.indexOf(currentTier);
        const newTierIndex = tierKeys.indexOf(newTier);

        if (newTierIndex > currentTierIndex) {
            const newTierData = tierConfig[newTier];
            
            let canAdvance = false;
            if (newTier === C.TIERS.SMALL_VILLAGE && this.ui.isBuildingTierMet(C.BUILDINGS.REEVES_HOUSE)) canAdvance = true;
            else if (newTier === C.TIERS.VILLAGE && this.ui.isBuildingTierMet(C.BUILDINGS.VILLAGE_HALL)) canAdvance = true;
            
            if (canAdvance) {
                this.state.villageTier = newTier;
                this.ui.queueMessage(_t("messages.tierUp", {tier: _t(`settlementTiers.${newTier}`)}));
                
                if (newTierData.unlocks && newTierData.unlocks.length > 0) {
                    this.unlockGameFeatures(newTierData.unlocks);
                }
                
                if (newTierData.showModal) {
                    this.ui.showTierUpModal();
                }
            }
        }
    }

    update(delta) {
        this.processFoodConsumption(delta);
        this.processProduction(delta);
        this.processInnSupplies(delta);
        this.processConstructionQueue(delta);
        this.processSettlerArrival(delta);
        this.processTierUp();
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.hiddenTimestamp = Date.now();
            this.saveGame();
        } else {
            if (this.hiddenTimestamp) {
                const offlineSeconds = (Date.now() - this.hiddenTimestamp) / 1000;
                this.processOfflineProgress(offlineSeconds);
                this.hiddenTimestamp = null;
            }
            this.lastTick = Date.now();
        }
    }
}