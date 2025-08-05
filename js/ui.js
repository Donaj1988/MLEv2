// ===================================================================================
//
//  SECTION 1: I18N & UI STATE
//
// ===================================================================================

let currentLang = 'en';
let translations = {};

const dom = {};
const buildingUIs = {};
const workerUIs = {};

function _t(key, replacements = {}) {
    if (!translations) {
        return key; 
    }
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return key; 
        }
    }

    if (typeof value !== 'string') {
        return key;
    }

    for (const placeholder in replacements) {
        value = value.replace(`%${placeholder}%`, replacements[placeholder]);
    }

    return value;
}

// ===================================================================================
//
//  SECTION 2: DOM INITIALIZATION & ELEMENT CREATION
//
// ===================================================================================

function initializeDOM() {
    const elements = {
        resourceBarContainer: document.getElementById('resource-bar-container'),
        workerCardsContainer: document.getElementById('worker-cards-container'),
        resetButton: document.getElementById('reset-button'),
        exportSaveButton: document.getElementById('export-save-button'),
        importSaveButton: document.getElementById('import-save-button'),
        logContainer: document.getElementById('logContainer'),
        gatheringView: document.getElementById('gathering-view'),
        buildingsView: document.getElementById('buildings-view'),
        workersMenuButton: document.getElementById('workers-menu-button'),
        workersCount: document.getElementById('workers-count'),
        populationLimit: document.getElementById('population-limit'),
        freeWorkersCount: document.getElementById('free-workers-count'),
        workerLimit: document.getElementById('worker-limit'),
        workerConsumptionInfoText: document.getElementById('worker-consumption-info-text'),
        canteenSection: document.getElementById('canteen-section'),
        infoPopulation: document.getElementById('info-population'),
        infoTier: document.getElementById('info-tier'),
        infoProductionBonus: document.getElementById('info-production-bonus'),
        infoTierProgressContainer: document.getElementById('info-tier-progress-container'),
        infoTierProgressBar: document.getElementById('info-tier-progress-bar'),
        infoTierProgressText: document.getElementById('info-tier-progress-text'),
        infoBuildingLimitContainer: document.getElementById('info-building-limit-container'),
        infoBuildingLimitBar: document.getElementById('info-building-limit-bar'),
        infoBuildingLimitText: document.getElementById('info-building-limit-text'),
        infoSettlerTimer: document.getElementById('info-settler-timer'),
        infoSettlerBonus: document.getElementById('info-settler-bonus'),
        infoSettlerProgressBar: document.getElementById('info-settler-progress-bar'),
        infoSettlerProgressContainer: document.getElementById('info-settler-progress-container'),
        storageLimitsList: document.getElementById('storage-limits-list'),
        infoConstructionContainer: document.getElementById('info-construction-container'),
        infoConstructionQueue: document.getElementById('info-construction-queue'),
        welcomeModal: document.getElementById('welcome-modal'),
        tierUpModal: document.getElementById('tier-up-modal'),
        tierUpTitle: document.getElementById('tier-up-title'),
        tierUpText: document.getElementById('tier-up-text'),
        exportModal: document.getElementById('export-modal'),
        exportTextarea: document.getElementById('export-textarea'),
        copySaveButton: document.getElementById('copy-save-button'),
        saveToFileButton: document.getElementById('save-to-file-button'),
        tooltip: document.getElementById('tooltip'),
        cheatPanelContent: document.getElementById('cheat-panel-content'),
    };
    Object.assign(dom, elements);
}

function applyTranslationsToStaticDOM() {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        el.textContent = _t(key);
    });
}

function createAllDynamicElements() {
    createResourceBar();
    createCanteenUI();
    createWorkerCards();
    createBuildingCards();
    createCheatPanelButtons();
    applyTranslationsToStaticDOM();
}

function createResourceBar() {
    dom.resourceBarContainer.innerHTML = '';
    dom.resourceBarContainer.className = 'flex justify-center items-start flex-wrap gap-x-6 gap-y-2 overflow-x-auto scrollbar-hidden';
    
    for (const categoryKey in resourceCategoriesConfig) {
        const category = resourceCategoriesConfig[categoryKey];
        const categoryContainer = document.createElement('div');
        categoryContainer.id = `resource-category-${categoryKey}`;
        categoryContainer.className = 'flex flex-col items-start';
        
        const title = document.createElement('h4');
        title.className = 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-1';
        title.textContent = _t(`resourceCategories.${categoryKey}`);
        categoryContainer.appendChild(title);
        
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'flex flex-wrap gap-2';
        
        let visible = false;
        
        category.resources.forEach(resKey => {
            if (!resourceIcons[resKey]) return;
            
            const itemDiv = document.createElement('div');
            itemDiv.id = `${resKey}-item`;
            itemDiv.className = 'resource-item hidden items-center gap-2 px-3 py-1 rounded-full bg-slate-700/60 ring-1 ring-slate-600/60 transition';
            
            itemDiv.innerHTML = `
                <img src="${resourceIcons[resKey]}" class="w-6 h-6 shrink-0" alt="${_t('resources.'+resKey)}">
                <div class="leading-tight">
                    <p id="${resKey}-amount" class="tabular-nums font-semibold text-md">0</p>
                    <p id="${resKey}-passive" class="tabular-nums text-xs text-emerald-400 font-semibold">+0.00/s</p>
                    <div class="mt-0.5 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                        <div id="${resKey}-storagebar" class="bg-emerald-500 h-full" style="width:0%"></div>
                    </div>
                </div>`;
            
            itemDiv.addEventListener('mouseover', e => showResourceTooltip(resKey, e));
            itemDiv.addEventListener('mouseout', hideTooltip);
            itemDiv.addEventListener('mousemove', e => {
                dom.tooltip.style.left = `${e.pageX + 15}px`;
                dom.tooltip.style.top = `${e.pageY + 15}px`;
            });
            
            itemsContainer.appendChild(itemDiv);
            if (gameState.unlockedFeatures.includes(resKey)) visible = true;
        });
        
        categoryContainer.appendChild(itemsContainer);
        categoryContainer.classList.toggle('hidden', !visible);
        dom.resourceBarContainer.appendChild(categoryContainer);
    }
}

function createCanteenUI() {
    const foodValueConfig = { grain: { bonus: 0.00 }, bread: { bonus: 0.03 }, fish: { bonus: 0.03 }, meat: { bonus: 0.05 }, beer: { bonus: 0.03 }, honey: { bonus: 0.02 }, };
    let buttonsHTML = '';
    for (const food in foodValueConfig) {
        const bonusText = `(+${(foodValueConfig[food].bonus * 100).toFixed(0)}%)`;
        const foodName = _t('resources.' + food);
        buttonsHTML += `<button id="food-supply-${food}" onclick="toggleFoodSupply('${food}')" class="food-choice-btn w-full flex items-center justify-center p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition hidden"><img src="${resourceIcons[food]}" class="w-6 h-6 mr-2" alt="${foodName}"><span>${_t('ui.supply')} ${foodName}</span><span class="text-xs text-gray-300 ml-1">${bonusText}</span></button>`;
    }
    dom.canteenSection.innerHTML = `<h3 class="text-xl font-bold text-gray-300 border-b border-gray-700 pb-2">${_t('ui.canteen')}</h3><p class="text-xs text-gray-400 my-2">${_t('ui.canteenDesc')}</p><div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">${buttonsHTML}</div>`;
}

function createWorkerCards() {
    dom.workerCardsContainer.innerHTML = '';
    for (const categoryKey in workerConfig.categories) {
        const workerKeys = workerConfig.categories[categoryKey];
        const header = document.createElement('h3');
        header.className = 'text-xl font-bold text-gray-300 border-b border-gray-700 pb-2';
        header.textContent = _t(`workerCategories.${categoryKey}`);
        dom.workerCardsContainer.appendChild(header);
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        workerKeys.forEach(workerKey => {
            const card = document.createElement('div');
            card.id = `${workerKey}-worker-card`;
            card.className = 'bg-gray-700 p-4 rounded-lg text-center hidden';
            card.innerHTML = `<h4 class="font-bold"><span>${_t(workerData[workerKey].nameKey)}</span>: <span id="${workerKey}-workers">0</span> / <span id="${workerKey}-worker-slots">0</span></h4><p class="text-xs text-gray-400 my-2 h-8" id="produces_${workerKey}_details"></p><div class="flex justify-center gap-2"><button onclick="unassignWorker('${workerKey}')" class="bg-red-500 w-10 h-10 rounded-full font-bold text-lg">-</button><button onclick="assignWorker('${workerKey}')" class="bg-green-500 w-10 h-10 rounded-full font-bold text-lg">+</button></div>`;
            grid.appendChild(card);
            workerUIs[workerKey] = { card: card, count: card.querySelector(`#${workerKey}-workers`), slots: card.querySelector(`#${workerKey}-worker-slots`), details: card.querySelector(`#produces_${workerKey}_details`) };
        });
        dom.workerCardsContainer.appendChild(grid);
    }
}

function createBuildingCards() {
    dom.buildingsView.innerHTML = '';
    const buildingsByCategory = {};
    const categoryOrder = ['important', 'services', 'population', 'production', 'storage'];
    const buildingOrder = [
        'settlersCabin', 'workersCamp', 'buildersShed', 'smallHouse', 'farm', 'lumberjacksHut', 'quarry', 'clayPit', 'yard', 'granaryS', 'depot', 'vault',
        'house', 'inn', 'church', 'mill', 'bakery', 'well', 'apiary', 'candlemakersWorkshop', 'fishermansHut', 'brickyard', 'pottersWorkshop', 'herbalistsGarden', 'charcoalKiln',
        'healersHut', 'ranch', 'butcher', 'tannery', 'hopFarm', 'brewery', 'sheepFarm', 'weaversWorkshop', 'tailorsWorkshop', 'ironMine', 'smeltery', 'blacksmith',
        'largeYard', 'largeGranary', 'largeDepot', 'treasury', 'tenement'
    ];
    buildingOrder.forEach(key => {
        const building = gameState.buildings[key];
        if (!building || building.upgradesFrom) return;
        if (!buildingsByCategory[building.category]) { buildingsByCategory[building.category] = []; }
        buildingsByCategory[building.category].push({ key, ...building });
    });
    categoryOrder.forEach(category => {
        if (buildingsByCategory[category]) {
            const header = document.createElement('h3');
            header.className = 'text-2xl font-bold mb-2 mt-4 text-gray-300 border-b border-gray-700 pb-2';
            header.textContent = _t(`buildingCategories.${category}`) || (category.charAt(0).toUpperCase() + category.slice(1));
            dom.buildingsView.appendChild(header);
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
            buildingsByCategory[category].forEach(buildingData => {
                const key = buildingData.key;
                const card = document.createElement('div');
                card.id = `${key}-card`;
                card.className = 'bg-gray-700 rounded-lg p-4 building-card hidden';
                card.dataset.category = buildingData.category;
                let supplySection = '';
                if (key === 'inn') {
                    const breadName = _t('resources.bread');
                    const beerName = _t('resources.beer');
                    const meatName = _t('resources.meat');
                    supplySection = `<div id="inn-supply-section" class="mt-3 pt-3 border-t border-gray-600 hidden"><h4 class="text-md font-semibold mb-2">${_t('ui.supply')}</h4><div class="space-y-2"><button id="supply-bread-btn" onclick="toggleSupply('bread')" class="supply-btn w-full flex items-center justify-center p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled><img src="${resourceIcons.bread}" class="w-6 h-6 mr-2" alt="${breadName}"><span>${_t('ui.supply')} ${breadName}</span></button><button id="supply-beer-btn" onclick="toggleSupply('beer')" class="supply-btn w-full flex items-center justify-center p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled><img src="${resourceIcons.beer}" class="w-6 h-6 mr-2" alt="${beerName}"><span>${_t('ui.supply')} ${beerName}</span></button><button id="supply-meat-btn" onclick="toggleSupply('meat')" class="supply-btn w-full flex items-center justify-center p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled><img src="${resourceIcons.meat}" class="w-6 h-6 mr-2" alt="${meatName}"><span>${_t('ui.supply')} ${meatName}</span></button></div></div>`;
                }
                const demolishIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
                card.innerHTML = `<div class="building-card-content"><h3 id="${key}-name" class="text-xl font-bold"></h3><p id="${key}-desc" class="text-sm text-gray-300 mt-2"></p><div class="my-2 text-sm"><p><strong>${_t('ui.cost')}</strong> <span id="${key}-cost" class="font-semibold"></span></p></div><div id="${key}-upgrade-section" class="hidden"><hr class="border-gray-600 my-2"><p id="${key}-upgrade-info" class="text-xs text-blue-300"></p></div><div id="${key}-req" class="my-2 text-xs text-yellow-400"></div><div class="my-3 text-xs text-gray-400" id="${key}-time-info"></div>${supplySection}</div><div class="mt-auto pt-2"><p id="${key}-status" class="text-sm font-semibold mb-2"></p><div class="w-full bg-gray-600 rounded-full h-4 mb-2"><div id="${key}-progress-bar" class="bg-green-500 h-4 rounded-full" style="width: 0%"></div></div><div class="flex gap-2"><button id="build-${key}-button" class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"></button><button id="demolish-${key}-button" onclick="demolishBuilding('${key}')" class="hidden w-1/3 demolish-btn text-white font-bold p-2 rounded-lg flex items-center justify-center" title="${_t('ui.demolish')}">${demolishIcon}</button></div></div>`;
                grid.appendChild(card);
                const timeInfoEl = card.querySelector(`#${key}-time-info`);
                timeInfoEl.addEventListener('mouseover', (e) => {
                    const currentTargetKey = e.currentTarget.dataset.buildKey;
                    if (currentTargetKey) showBuildTimeTooltip(currentTargetKey, e);
                });
                timeInfoEl.addEventListener('mouseout', hideTooltip);
                timeInfoEl.addEventListener('mousemove', (e) => { dom.tooltip.style.left = `${e.pageX + 15}px`; dom.tooltip.style.top = `${e.pageY + 15}px`; });
                buildingUIs[key] = { card: card, name: card.querySelector(`#${key}-name`), desc: card.querySelector(`#${key}-desc`), upgradeSection: card.querySelector(`#${key}-upgrade-section`), upgradeInfo: card.querySelector(`#${key}-upgrade-info`), req: card.querySelector(`#${key}-req`), status: card.querySelector(`#${key}-status`), progressBar: card.querySelector(`#${key}-progress-bar`), button: card.querySelector(`#build-${key}-button`), demolishButton: card.querySelector(`#demolish-${key}-button`), cost: card.querySelector(`#${key}-cost`), timeInfo: timeInfoEl, supplySection: card.querySelector(`#inn-supply-section`), };
            });
            dom.buildingsView.appendChild(grid);
        }
    });
}

function createCheatPanelButtons() {
    dom.cheatPanelContent.innerHTML = '';
    const resources = Object.keys(getDefaultGameState().resources);
    resources.forEach(res => {
        const btn = document.createElement('button');
        btn.id = `cheat-add-${res}`;
        btn.className = 'w-full bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded hidden';
        btn.textContent = `${_t('ui.add100')} ${_t('resources.' + res)}`;
        btn.onclick = () => addResource(res, 100);
        dom.cheatPanelContent.appendChild(btn);
    });
    const addSettlerBtn = document.createElement('button');
    addSettlerBtn.className = 'w-full bg-indigo-700 hover:bg-indigo-600 text-white text-xs py-1 px-2 rounded mt-1';
    addSettlerBtn.textContent = _t('ui.add1Settler');
    addSettlerBtn.onclick = () => addPopulation(1);
    dom.cheatPanelContent.appendChild(addSettlerBtn);
}

// ===================================================================================
//
//  SECTION 3: UI DISPLAY & UPDATES
//
// ===================================================================================

function renderStorageItem(resKey) {
    const current = Math.floor(gameState.resources[resKey]);
    const limit = gameState.storageLimits[resKey];
    const resName = _t('resources.' + resKey);
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2';
    li.innerHTML = `<img src="${resourceIcons[resKey]}" class="w-5 h-5 shrink-0" alt="${resName}"><span>${resName}:</span><span class="tabular-nums font-semibold">${current} / ${limit}</span>`;
    return li;
}

function getTotalBuildingCount() {
    let count = 0;
    for(const key in gameState.buildings) {
        const b = gameState.buildings[key];
        if(b.isBuilt && !b.repeatable) count++;
        else if (b.count > 0) count += b.count;
    }
    return count;
}

function findUpgradeTarget(buildingKey) {
    for (const key in gameState.buildings) {
        if (gameState.buildings[key].upgradesFrom === buildingKey) return key;
    }
    return null;
}

function isBuildingTierMet(requiredKey) {
    let currentKey = requiredKey;
    while (currentKey) {
        if (gameState.buildings[currentKey] && gameState.buildings[currentKey].isBuilt) return true;
        const nextUpgrade = findUpgradeTarget(currentKey);
        if (!nextUpgrade) break;
        currentKey = nextUpgrade;
    }
    return false;
}

function updateDisplay() {
    // Update resource bar
    for (const res in gameState.resources) {
        const amountEl = document.getElementById(`${res}-amount`);
        if (amountEl) amountEl.textContent = Math.floor(gameState.resources[res]);
        const bar = document.getElementById(`${res}-storagebar`);
        if (bar) {
            const cap = gameState.storageLimits[res];
            const pct = cap > 0 ? Math.min(100, (gameState.resources[res] / cap) * 100) : 0;
            bar.style.width = pct + '%';
            bar.classList.toggle('bg-emerald-500', pct <= 90);  
            bar.classList.toggle('bg-red-500', pct > 90);
        }
    }

    // Update resource categories visibility
    for (const categoryKey in resourceCategoriesConfig) {
        const category = resourceCategoriesConfig[categoryKey];
        const categoryContainer = document.getElementById(`resource-category-${categoryKey}`);
        if (categoryContainer) {
            let categoryHasVisibleItems = category.resources.some(resKey => gameState.unlockedFeatures.includes(resKey));
            categoryContainer.classList.toggle('hidden', !categoryHasVisibleItems);
        }
    }

    // Calculate net income
    const netIncome = Object.keys(gameState.resources).reduce((acc, key) => (acc[key] = 0, acc), {});
    for(const workerType in gameState.assignedWorkers) {
        const workerCount = gameState.assignedWorkers[workerType];
        if (workerCount > 0 && workerData[workerType]) {
            const data = workerData[workerType];
            if (data.produces) {
                for(const res in data.produces) netIncome[res] += (data.produces[res] * gameState.currentProductionBonus) * workerCount;
            }
            if (data.consumes) {
                for(const res in data.consumes) netIncome[res] -= data.consumes[res] * workerCount;
            }
        }
    }

    // Food and Inn consumption
    const totalAssigned = Object.values(gameState.assignedWorkers).reduce((a, b) => a + b, 0);
    let consumptionDetails = [];
    if (totalAssigned > 0) {
        for (const food in gameState.foodConsumptionPerSecond) {
            const rate = gameState.foodConsumptionPerSecond[food];
            if (rate > 0) {
                netIncome[food] -= rate;
                consumptionDetails.push(`${rate.toFixed(2)} ${_t('resources.'+food)}/s`);
            }
        }
    }
    dom.workerConsumptionInfoText.textContent = consumptionDetails.length > 0 ? _t('ui.workersAreConsuming', {details: consumptionDetails.join(', ')}) : (totalAssigned > 0 ? _t('ui.productionHaltedNoFood') : '');
    
    const innConsumptionRate = 0.5;
    const tierLevels = { settlement: 1, small_village: 2, village: 3, small_town: 4, town: 5 };
    const consumption = innConsumptionRate * tierLevels[gameState.villageTier];
    if (gameState.innSupplies.bread) netIncome.bread -= consumption;
    if (gameState.innSupplies.beer) netIncome.beer -= consumption;
    if (gameState.innSupplies.meat) netIncome.meat -= consumption;

    // Update passive income display
    for (const res in netIncome) {
        const el = document.getElementById(`${res}-passive`);
        if (el) {
            el.textContent = `${netIncome[res] >= 0 ? '+' : ''}${netIncome[res].toFixed(2)}/s`;
            el.classList.toggle('text-red-400', netIncome[res] < 0);
            el.classList.toggle('text-green-400', netIncome[res] >= 0);
        }
    }
    
    // Update worker panel
    if(gameState.unlockedFeatures.includes('workers')) {
        const assignedCount = Object.values(gameState.assignedWorkers).reduce((a, b) => a + b, 0);
        dom.workersCount.textContent = gameState.totalWorkers;
        dom.populationLimit.textContent = gameState.populationLimit;
        dom.freeWorkersCount.textContent = gameState.totalWorkers - assignedCount;
        dom.workerLimit.textContent = gameState.workerLimit;
        for(const workerType in workerUIs) {
            const ui = workerUIs[workerType];
            if(ui && ui.card) {
                ui.count.textContent = gameState.assignedWorkers[workerType];
                ui.slots.textContent = gameState.workerSlots[workerType];
                ui.card.classList.toggle('hidden', gameState.workerSlots[workerType] === 0);
                const data = workerData[workerType];
                let detailsText = '';
                if(data.descriptionKey) detailsText = _t(data.descriptionKey);
                else {
                    if (data.produces) detailsText += `${_t('ui.produces')}: ${Object.entries(data.produces).map(([res, amount]) => `+${amount} ${_t('resources.'+res)}/s`).join(', ')}`;
                    if (data.consumes) detailsText += `${detailsText ? '. ' : ''}${_t('ui.consumes')}: ${Object.entries(data.consumes).map(([res, amount]) => `${amount} ${_t('resources.'+res)}/s`).join(', ')}`;
                }
                ui.details.textContent = detailsText;
            }
        }
    }

    // Update building cards
    for (const key in buildingUIs) {
        const ui = buildingUIs[key];
         if (!ui || !ui.card) continue;
        let currentStageKey = key;
        if(gameState.buildings[key].isBuilt) {
            let nextUpgradeInChain = findUpgradeTarget(key);
            while(nextUpgradeInChain) {
                if (gameState.buildings[nextUpgradeInChain].isBuilt) {
                    currentStageKey = nextUpgradeInChain;
                    nextUpgradeInChain = findUpgradeTarget(nextUpgradeInChain);
                } else break;
            }
        }
        let isBuilt = gameState.buildings[currentStageKey].isBuilt;
        let upgradeTargetKey = findUpgradeTarget(currentStageKey);
        const stageBuilding = gameState.buildings[currentStageKey];
        if (stageBuilding.betaStop && isBuilt) {
            ui.name.innerHTML = _t(stageBuilding.nameKey);
            ui.desc.textContent = _t(stageBuilding.descriptionKey);
            ui.cost.classList.add('hidden');
            ui.timeInfo.classList.add('hidden');
            ui.button.innerHTML = _t('ui.notAvailableInBeta');
            ui.button.disabled = true;
            ui.button.classList.remove('bg-blue-600','hover:bg-blue-700');
            ui.button.classList.add('bg-red-700','cursor-not-allowed');
            ui.status.textContent = _t('ui.built');
            ui.progressBar.style.width = '100%';
            continue;
        }
        const currentStageBuilding = gameState.buildings[currentStageKey];
        const queueCount = gameState.buildingQueue.filter(b => b.key === key).length;
        ui.name.innerHTML = `${_t(currentStageBuilding.nameKey)} <span class="text-base text-gray-400">${currentStageBuilding.repeatable ? `(${currentStageBuilding.count}${queueCount > 0 ? ` +${queueCount}` : ''})` : ''}</span>`;
        ui.desc.textContent = _t(currentStageBuilding.descriptionKey);
        let isUpgrade = !!upgradeTargetKey && isBuilt;
        let targetKey = isUpgrade ? upgradeTargetKey : currentStageKey;
        let targetBuilding = gameState.buildings[targetKey];
        let reqs = targetBuilding.requires || {};
        ui.timeInfo.dataset.buildKey = targetKey;
        ui.upgradeSection.classList.toggle('hidden', !(isUpgrade && targetBuilding.upgradesFrom && gameState.buildings[targetBuilding.upgradesFrom].upgradeInfo));
        if (isUpgrade && targetBuilding.upgradesFrom && gameState.buildings[targetBuilding.upgradesFrom].upgradeInfo) ui.upgradeInfo.textContent = _t(gameState.buildings[targetBuilding.upgradesFrom].upgradeInfo);
        const { currentTime: buildTime } = calculateBuildTime(targetKey);
        ui.timeInfo.innerHTML = `<span class="font-semibold">${_t('ui.baseTime')}:</span> ${calculateBuildTime(targetKey).baseTime.toFixed(1)}s, <span class="font-semibold">${_t('ui.constructionTime')}:</span> ${isFinite(buildTime) ? buildTime.toFixed(1) + 's' : '∞'}`;
        ui.cost.innerHTML = Object.entries(targetBuilding.cost).map(([res, amount]) => `<span data-cost-res="${res}">${amount} ${_t('resources.'+res)}</span>`).join(', ');
        
        const hammerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.373 8.373a1 1 0 1 1-1.414-1.414L12.586 11.586l-1.99-1.99a3 3 0 1 1 4.24-4.24l1.99 1.99 1.414-1.414a1 1 0 1 1 1.414 1.414L15 12z"></path></svg>`;
        const isInQueue = gameState.buildingQueue.some(b => b.key === targetKey || b.key === key);
        if (isUpgrade && isInQueue) ui.button.innerHTML = `<span>${_t('ui.upgrading')}...</span>`;
        else if (isUpgrade) ui.button.innerHTML = `${hammerIcon} <span>${_t('ui.upgradeTo')} ${_t(targetBuilding.nameKey)}</span>`;
        else ui.button.innerHTML = `${hammerIcon} <span>${_t('ui.build')}</span>`;
        ui.button.onclick = () => startBuilding(targetKey);

        let allReqsMet = true;
        if (ui.req) {
            const reqsMsgs = [];
            if (reqs.population && gameState.totalWorkers < reqs.population) { reqsMsgs.push(_t('ui.populationReq', {count: reqs.population})); allReqsMet = false; }
            if (reqs.tier) {
                const tierOrder = Object.keys(gameState.tierRequirements);
                if (tierOrder.indexOf(gameState.villageTier) < tierOrder.indexOf(reqs.tier)) { reqsMsgs.push(_t('ui.tierReq', {tier: _t(`settlementTiers.${reqs.tier}`)})); allReqsMet = false; }
            }
            if (reqs.building) {
                const reqBuilding = gameState.buildings[reqs.building.key];
                const buildingName = _t(reqBuilding.nameKey);
                if (reqs.building.staffed) {
                    let staffed = isBuildingTierMet(reqs.building.key);
                    if (staffed && reqs.building.workerSlots) {
                        for (const workerKey in reqs.building.workerSlots) {
                            if (gameState.assignedWorkers[workerKey] < reqs.building.workerSlots[workerKey]) { staffed = false; break; }
                        }
                    }
                    if (!staffed) {
                        let specificReq = _t('ui.staffedBuildingReq', { building: buildingName });
                        if (reqs.building.workerSlots) specificReq += ` (${_t('ui.requires')}: ${Object.keys(reqs.building.workerSlots).map(k => `${reqs.building.workerSlots[k]} ${_t(workerData[k].nameKey)}`).join(', ')})`;
                        reqsMsgs.push(specificReq);
                        allReqsMet = false;
                    }
                } else if (!isBuildingTierMet(reqs.building.key)) { reqsMsgs.push(_t('ui.buildingReq', { building: buildingName })); allReqsMet = false; }
            }
            if (reqs.worker && gameState.assignedWorkers[reqs.worker.key] < reqs.worker.count) { reqsMsgs.push(_t('ui.workerReq', {worker: _t(workerData[reqs.worker.key].nameKey)})); allReqsMet = false; }
            ui.req.innerHTML = reqsMsgs.join('<br>') || '';
            ui.req.classList.toggle('text-red-400', !allReqsMet);
        }

        let canAfford = true;
        ui.cost.querySelectorAll('span[data-cost-res]').forEach(span => {
            const res = span.dataset.costRes;
            const hasEnough = targetBuilding.cost[res] <= gameState.resources[res];
            span.classList.toggle('text-red-400', !hasEnough);
            if(!hasEnough) canAfford = false;
        });
        ui.button.classList.toggle('build-btn-cant-afford', !canAfford || !allReqsMet);
        ui.demolishButton.classList.toggle('hidden', !currentStageBuilding.repeatable || currentStageBuilding.count === 0);

        if (isInQueue && !targetBuilding.repeatable) {
            const buildInstance = gameState.buildingQueue.find(b => b.key === targetKey);
            if (buildInstance) {
                const percentage = Math.min(100, (buildInstance.progress / buildInstance.totalTime) * 100);
                ui.status.textContent = `${_t('ui.underConstruction')} (${Math.round(percentage)}%)`;
                ui.progressBar.style.width = `${percentage}%`;
            }
            ui.button.disabled = true;
        } else {
            const currentlyConstructing = gameState.buildingQueue[0] && gameState.buildingQueue[0].key === key;
            if(currentlyConstructing) {
                const buildInstance = gameState.buildingQueue[0];
                const percentage = Math.min(100, (buildInstance.progress / buildInstance.totalTime) * 100);
                ui.status.textContent = `${_t('ui.underConstruction')} (${Math.round(percentage)}%)`;
                ui.progressBar.style.width = `${percentage}%`;
            } else if (queueCount > 0 && targetBuilding.repeatable) {
                ui.status.textContent = _t('ui.inQueue');
                ui.progressBar.style.width = `0%`;
            } else {
                ui.status.textContent = (currentStageBuilding.repeatable && currentStageBuilding.count > 0) || isBuilt ? _t('ui.built') : _t('ui.notBuilt');
                ui.progressBar.style.width = `0%`;
            }
            ui.button.disabled = gameState.buildingQueue.length >= 5 || !allReqsMet;
        }

        if (key === 'inn' && ui.supplySection) {
            const isInnActive = gameState.buildings.inn.isBuilt || gameState.buildings.tavern.isBuilt;
            ui.supplySection.classList.toggle('hidden', !isInnActive);
            if (isInnActive) {
                const breadBtn = ui.supplySection.querySelector('#supply-bread-btn');
                const beerBtn = ui.supplySection.querySelector('#supply-beer-btn');
                const meatBtn = ui.supplySection.querySelector('#supply-meat-btn');
                breadBtn.disabled = !gameState.unlockedFeatures.includes('bread');
                beerBtn.disabled = !gameState.unlockedFeatures.includes('beer');
                meatBtn.disabled = !gameState.unlockedFeatures.includes('meat');
                breadBtn.classList.toggle('active', gameState.innSupplies.bread);
                beerBtn.classList.toggle('active', gameState.innSupplies.beer);
                meatBtn.classList.toggle('active', gameState.innSupplies.meat);
            }
        }
    }
    
    // Update general info panel
    const buildingCount = getTotalBuildingCount();
    const buildingLimit = gameState.totalBuildingLimits[gameState.villageTier];
    const tierName = _t(`settlementTiers.${gameState.villageTier}`);
    dom.infoTier.textContent = tierName;
    dom.infoPopulation.textContent = `${gameState.totalWorkers} / ${gameState.populationLimit}`;
    dom.infoProductionBonus.textContent = `+${((gameState.currentProductionBonus - 1) * 100).toFixed(1)}%`;
    dom.infoBuildingLimitText.textContent = `${buildingCount} / ${buildingLimit}`;
    dom.infoBuildingLimitBar.style.width = `${(buildingCount / buildingLimit) * 100}%`;
    
    const settlerTime = calculateNextSettlerTime();
    dom.infoSettlerTimer.textContent = `${Math.ceil(gameState.nextSettlerEvent)}s`;
    dom.infoSettlerProgressBar.style.width = `${((settlerTime.totalTime - gameState.nextSettlerEvent) / settlerTime.totalTime) * 100}%`;
    dom.infoSettlerBonus.textContent = settlerTime.bonus > 0 ? _t('messages.settlerTimeReduced', {bonus: (settlerTime.bonus * 100).toFixed(0)}) : '';
    dom.infoSettlerBonus.classList.toggle('hidden', settlerTime.bonus <= 0);

    const tierKeys = Object.keys(gameState.tierRequirements);
    const currentTierIndex = tierKeys.indexOf(gameState.villageTier);
    const nextTierKey = tierKeys[currentTierIndex + 1];
    if (nextTierKey) {
        dom.infoTierProgressContainer.classList.remove('hidden');
        const nextTierName = _t(`settlementTiers.${nextTierKey}`);
        dom.infoTierProgressContainer.querySelector('span').textContent = `${_t('ui.nextTierProgress')} (${nextTierName})`;
        dom.infoTierProgressText.textContent = `${gameState.totalWorkers} / ${gameState.tierRequirements[nextTierKey]}`;
        dom.infoTierProgressBar.style.width = `${Math.min(100, (gameState.totalWorkers / gameState.tierRequirements[nextTierKey]) * 100)}%`;
    } else {
        dom.infoTierProgressContainer.classList.add('hidden');
    }

    // Update storage limits and construction queue
    dom.storageLimitsList.innerHTML = '';
    Object.keys(gameState.storageLimits).filter(res => gameState.unlockedFeatures.includes(res)).forEach(res => dom.storageLimitsList.appendChild(renderStorageItem(res)));
    
    dom.infoConstructionContainer.classList.toggle('hidden', gameState.buildingQueue.length === 0);
    if(gameState.buildingQueue.length > 0) {
        dom.infoConstructionQueue.innerHTML = '';
        gameState.buildingQueue.forEach((item, index) => {
            const queueItemDiv = document.createElement('div');
            const buildingName = _t(gameState.buildings[item.key].nameKey);
            queueItemDiv.innerHTML = `<div class="text-xs ${index > 0 ? 'opacity-60' : ''} flex items-center justify-between"><p>${index + 1}. ${buildingName}</p><button class="text-red-400 text-xs hover:underline ml-2" onclick="cancelBuilding(${index})">[${_t('ui.cancel')}]</button></div>`;
            if (index === 0) {
                const percentage = Math.round((item.progress / item.totalTime) * 100);
                queueItemDiv.innerHTML += `<div class="w-full bg-gray-600 rounded-full h-2 mt-1"><div class="bg-green-500 h-2 rounded-full" style="width: ${percentage}%"></div></div>`;
            }
            dom.infoConstructionQueue.appendChild(queueItemDiv);
        });
    }

    // Update visibility of features/tabs
    dom.canteenSection.classList.toggle('hidden', !gameState.unlockedFeatures.includes('workers'));
    if (!dom.canteenSection.classList.contains('hidden')) {
        for (const food in gameState.suppliedFoods) {
            const btn = document.getElementById(`food-supply-${food}`);
            if (btn) {
                btn.classList.toggle('hidden', !gameState.unlockedFeatures.includes(food));
                btn.classList.toggle('active', gameState.suppliedFoods[food]);
            }
        }
    }
    const gatheringTabButton = document.querySelector('.menu-button[onclick="showView(\'gathering\')"]');
    const shouldHideGathering = (gameState.villageTier !== 'settlement');
    gatheringTabButton.classList.toggle('hidden', shouldHideGathering);
    if (shouldHideGathering && dom.gatheringView.classList.contains('active')) showView('workers');
    
    gameState.unlockedFeatures.forEach(feature => {
        const resItem = document.getElementById(`${feature}-item`);
        if (resItem) { resItem.classList.remove('hidden'); resItem.classList.add('flex'); }
        if (feature.endsWith('Building')) {
            const card = buildingUIs[feature.replace('Building', '')]?.card;
            if (card) card.classList.remove('hidden');
        }
        if (feature === 'workers') dom.workersMenuButton.classList.remove('hidden');
    });

    updateCheatPanel();
}


function updateCheatPanel() {
    for (const res of Object.keys(gameState.resources)) {
        const btn = document.getElementById(`cheat-add-${res}`);
        if (btn) {
            btn.classList.toggle('hidden', !gameState.unlockedFeatures.includes(res));
            btn.textContent = `${_t('ui.add100')} ${_t('resources.' + res)}`;
        }
    }
    const addSettlerBtn = dom.cheatPanelContent.querySelector('button:last-child');
    if(addSettlerBtn) addSettlerBtn.textContent = _t('ui.add1Settler');
}

// ===================================================================================
//
//  SECTION 4: UI INTERACTION & HELPERS
//
// ===================================================================================

function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
    document.getElementById(`${viewId}-view`).classList.add('active');
    document.querySelectorAll('.menu-button').forEach(button => button.classList.remove('active'));
    document.querySelector(`.menu-button[onclick="showView('${viewId}')"]`).classList.add('active');
}

function toggleCheatPanel() {
    const content = document.getElementById('cheat-panel-content');
    const icon = document.getElementById('cheat-panel-toggle-icon');
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    icon.textContent = isHidden ? '-' : '+';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showModal(modalId) {
     document.getElementById(modalId).classList.remove('hidden');
}

function showTierUpModal() {
    dom.tierUpTitle.textContent = _t("messages.tierUpModalTitle");
    dom.tierUpText.textContent = _t("messages.tierUpModalText");
    showModal('tier-up-modal');
}

function queueMessage(message, type = 'info', delay = 0) {
    setTimeout(() => {
        if (!dom.logContainer) return;
        const msgElement = document.createElement('div');
        msgElement.textContent = message;
        let typeClass = 'text-blue-300';
        if (type === 'success') typeClass = 'text-green-400';
        if (type === 'error') typeClass = 'text-red-400';
        msgElement.className = `log-message p-2 rounded-md bg-gray-700 text-sm ${typeClass} opacity-0 transition-opacity duration-500`;
        dom.logContainer.prepend(msgElement);
        requestAnimationFrame(() => msgElement.classList.remove('opacity-0'));
        setTimeout(() => {
            msgElement.classList.add('opacity-0');
            setTimeout(() => msgElement.remove(), 1000);
        }, 7000);
    }, delay);
}

function showConfirmModal(title, message, onConfirm) {
    const confirmModal = document.getElementById('confirm-modal');
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    const confirmBtn = document.getElementById('confirm-action-button');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    newConfirmBtn.textContent = _t('ui.confirm');
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.onclick = () => {
        onConfirm();
        closeModal('confirm-modal');
    };
    showModal('confirm-modal');
}

function hideTooltip() {
    dom.tooltip.style.display = 'none';
}

function showResourceTooltip(resource, event) {
    const producers = [];
    const consumers = [];
    const resourceName = _t('resources.' + resource);

    for (const workerType in gameState.assignedWorkers) {
        if (gameState.assignedWorkers[workerType] > 0 && workerData[workerType]) {
            const data = workerData[workerType];
            const workerCount = gameState.assignedWorkers[workerType];
            const workerName = _t(data.nameKey);
            if (data.produces && data.produces[resource]) {
                 producers.push({ source: workerName, amount: (data.produces[resource] * gameState.currentProductionBonus) * workerCount });
            }
            if (data.consumes && data.consumes[resource]) {
                consumers.push({ source: workerName, amount: data.consumes[resource] * workerCount });
            }
        }
    }

    if (gameState.foodConsumptionPerSecond[resource] > 0) {
        consumers.push({ source: _t('ui.workers'), amount: gameState.foodConsumptionPerSecond[resource] });
    }

    if (isBuildingTierMet('inn') && gameState.innSupplies[resource]) {
        const innConsumptionRate = 0.5;
        const tierLevels = { settlement: 1, small_village: 2, village: 3, small_town: 4, town: 5 };
        const consumption = innConsumptionRate * tierLevels[gameState.villageTier];
        consumers.push({ source: _t('buildingNames.inn'), amount: consumption });
    }

    let html = `<strong class="text-lg text-blue-300">${resourceName}</strong>`;
    if (producers.length > 0) {
        html += `<div class="mt-2"><strong class="text-green-400">${_t('ui.production')}:</strong><ul>`;
        producers.forEach(p => { html += `<li>${p.source}: +${p.amount.toFixed(2)}/s</li>`; });
        html += `</ul></div>`;
    }
    if (consumers.length > 0) {
        html += `<div class="mt-2"><strong class="text-red-400">${_t('ui.consumption')}:</strong><ul>`;
        consumers.forEach(c => { html += `<li>${c.source}: -${c.amount.toFixed(2)}/s</li>`; });
        html += `</ul></div>`;
    }
    if (producers.length === 0 && consumers.length === 0) {
        html += `<div class="mt-2">${_t('ui.noProductionOrConsumption')}</div>`;
    }

    dom.tooltip.innerHTML = html;
    dom.tooltip.style.display = 'block';
}

function showSettlerTooltip(event) {
    const timeData = calculateNextSettlerTime();
    let html = `<strong class="text-lg text-blue-300">${_t('ui.settlerArrival')}</strong>`;
    html += `<div class="mt-2"><span>${_t('ui.baseTime')}:</span> <span class="font-semibold">${timeData.baseTime.toFixed(2)}s</span></div>`;
    
    if (timeData.bonus > 0) {
        html += `<hr class="border-gray-600 my-1">`;
        let bonusHtml = '';
        if (isBuildingTierMet('church') && gameState.assignedWorkers.priest > 0) bonusHtml += `<li>${_t('ui.bonusFrom')} ${_t('buildingNames.church')}: -${(gameState.buildings.church.effect.settlerTimeBonus * 100).toFixed(0)}%</li>`;
        if (isBuildingTierMet('healersHut') && gameState.assignedWorkers.healer > 0) bonusHtml += `<li>${_t('ui.bonusFrom')} ${_t('buildingNames.healersHut')}: -${(gameState.buildings.healersHut.effect.settlerTimeBonus * 100).toFixed(0)}%</li>`;
        if (isBuildingTierMet('tavern') && gameState.assignedWorkers.innkeeper > 0) {
            bonusHtml += `<li>${_t('ui.bonusFrom')} ${_t('buildingNames.inn')}: -${(gameState.buildings.inn.effect.settlerTimeBonus * 100).toFixed(0)}%</li>`;
            if (gameState.assignedWorkers.tavernMaid > 0) bonusHtml += `<li>${_t('ui.bonusFrom')} ${_t('buildingNames.tavern')}: -${(gameState.buildings.tavern.effect.settlerTimeBonus * 100).toFixed(0)}%</li>`;
        } else if (isBuildingTierMet('inn') && gameState.assignedWorkers.innkeeper > 0) {
            bonusHtml += `<li>${_t('ui.bonusFrom')} ${_t('buildingNames.inn')}: -${(gameState.buildings.inn.effect.settlerTimeBonus * 100).toFixed(0)}%</li>`;
        }
        if (gameState.innSupplies.bread) bonusHtml += `<li>${_t('ui.bonusFrom')} ${_t('resources.bread')}: -5%</li>`;
        if (gameState.innSupplies.beer) bonusHtml += `<li>${_t('ui.bonusFrom')} ${_t('resources.beer')}: -5%</li>`;
        if (gameState.innSupplies.meat) bonusHtml += `<li>${_t('ui.bonusFrom')} ${_t('resources.meat')}: -10%</li>`;
        if (bonusHtml) html += `<ul class="text-xs">${bonusHtml}</ul>`;
        html += `<hr class="border-gray-600 my-1">`;
        html += `<div><span>${_t('ui.totalBonus')}:</span> <span class="font-semibold text-green-400">-${(timeData.bonus * 100).toFixed(0)}%</span></div>`;
    }
    
    html += `<div class="mt-1"><span>${_t('ui.finalTime')}:</span> <span class="font-bold text-lg">${timeData.totalTime.toFixed(2)}s</span></div>`;

    dom.tooltip.innerHTML = html;
    dom.tooltip.style.display = 'block';
}

function showBuildTimeTooltip(key, event) {
    const building = gameState.buildings[key];
    if (!building) return;

    const { baseTime, currentTime, details } = calculateBuildTime(key, true);
    const playerBaseSpeed = 1;

    let html = `<strong class="text-lg text-blue-300">${_t('ui.constructionTime')}</strong>`;
    html += `<div class="mt-2"><span>${_t('ui.baseTime')}:</span> <span class="font-semibold">${baseTime.toFixed(1)}s</span></div>`;
    html += `<hr class="border-gray-600 my-1">`;
    html += `<div><strong class="text-green-400">${_t('ui.buildPower')}:</strong><ul>`;
    html += `<li>${_t('ui.base')}: ${playerBaseSpeed.toFixed(2)}</li>`; 
    html += `<li>${_t('workerNames.builder')} (${details.builderCount}): +${details.builderPower.toFixed(2)}</li>`;
    html += `</ul></div>`;
    html += `<hr class="border-gray-600 my-1">`;
    html += `<div><span>${_t('ui.totalBuildSpeed')}:</span> <span class="font-semibold">${details.totalSpeed.toFixed(2)}</span></div>`;
    html += `<div class="mt-1"><span>${_t('ui.finalTime')}:</span> <span class="font-bold text-lg">${isFinite(currentTime) ? currentTime.toFixed(1) + 's' : '∞'}</span></div>`;

    dom.tooltip.innerHTML = html;
    dom.tooltip.style.display = 'block';
}