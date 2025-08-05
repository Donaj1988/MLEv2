import { START_RESOURCES, STORAGE_CAPACITY } from '../core/config.js';
import { applyWorkerProduction, updatePopulationFromHouses, renderWorkersUI } from './workers.js';
import { buildings } from './buildings.js';

const state = { resources: { ...START_RESOURCES } };
window.__state = state;

function clampResource(key,val){
  const cap = STORAGE_CAPACITY[key] ?? Infinity;
  return Math.min(val, cap);
}

function render(){
  ['wood','stone','clay','grain'].forEach(r=>{
    const amt=state.resources[r]||0;
    const cap=STORAGE_CAPACITY[r]||0;
    const percent = cap>0? Math.min(amt/cap*100,100):0;
    const amtTop=document.getElementById(r+'-amount-top');
    if(amtTop) amtTop.textContent=Math.floor(amt);
    const capTop=document.getElementById(r+'-cap-top');
    if(capTop) capTop.textContent=cap;
    const barInner=document.getElementById(r+'-bar-top');
    if(barInner) barInner.style.width=percent+'%';
  });
  // update population info
  const popEl=document.getElementById('info-population');
  const totalPop=buildings.smallHouse.count*2;
  if(popEl) popEl.textContent=`${totalPop} / ${totalPop}`;
}

export function startGameLoop(){
  render();
  setInterval(()=>{
    // base income
    if (state.assignedWorkers.wood > 0) {
    state.resources.wood = clampResource('wood', state.resources.wood + state.assignedWorkers.wood);
}
    if (state.assignedWorkers.stone > 0) {
    state.resources.stone = clampResource('stone', state.resources.stone + state.assignedWorkers.stone);
}
    if (state.assignedWorkers.clay > 0) {
    state.resources.clay = clampResource('clay', state.resources.clay + state.assignedWorkers.clay);
}
    if (state.assignedWorkers.grain > 0) {
    state.resources.grain = clampResource('grain', state.resources.grain + state.assignedWorkers.grain);
}

    // population from houses drives available workers
    updatePopulationFromHouses(buildings.smallHouse.count);
    renderWorkersUI();

    // worker assigned production
    applyWorkerProduction();

    // enforce caps
    ['wood','stone','clay','grain'].forEach(r=>{
      state.resources[r]=clampResource(r, state.resources[r]);
    });

    render();
  },1000);
}

export { state };