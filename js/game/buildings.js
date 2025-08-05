import { state } from './logic.js';
import { saveGame } from './save.js';
import { STORAGE_CAPACITY } from '../core/config.js';

export const buildings = {
  smallHouse: { name: 'Small House', cost: { wood: 50, stone: 20 }, population:2, count:0 },
  storehouse: { name: 'Storehouse', cost: { wood: 80, stone: 40 }, capacityBonus: 200, count:0 }
};

function canAfford(cost){
  return Object.entries(cost).every(([k,v])=> (state.resources[k]||0) >= v);
}
function pay(cost){
  Object.entries(cost).forEach(([k,v])=> state.resources[k]-=v);
}

function refreshButtonState(b, btn){
  const affordable = canAfford(b.cost);
  if(!affordable){
    btn.classList.add('opacity-50','cursor-not-allowed');
    btn.disabled=true;
  } else {
    btn.classList.remove('opacity-50','cursor-not-allowed');
    btn.disabled=false;
  }
  btn.title = 'Cost: ' + Object.entries(b.cost).map(([k,v])=>`${v} ${k}`).join(', ');
}

export function initBuildingsUI(){
  const container=document.getElementById('buildings-view');
  if(!container) return;
  container.innerHTML='';
  Object.keys(buildings).forEach(key=>{
    const b=buildings[key];
    const card=document.createElement('div');
    card.className='bg-gray-700 p-4 rounded-lg mb-4';
    const title=document.createElement('h3');
    title.className='text-lg font-bold';
    title.textContent=b.name;
    const info=document.createElement('p');
    info.className='text-sm';
    if(key==='smallHouse'){
      info.textContent='Increases population by '+b.population;
    } else if(key==='storehouse'){
      info.textContent='Increases storage cap by '+b.capacityBonus;
    }
    const costP=document.createElement('p');
    costP.className='text-xs';
    costP.textContent='Cost: '+Object.entries(b.cost).map(([k,v])=>`${v} ${k}`).join(', ');
    const btn=document.createElement('button');
    btn.className='mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded';
    btn.textContent='Build';
    btn.addEventListener('click',()=>{
      if(!canAfford(b.cost)) return;
      pay(b.cost);
      if(key==='smallHouse'){
        // population effect handled elsewhere
      } else if(key==='storehouse'){
        Object.keys(STORAGE_CAPACITY).forEach(r=>{
          STORAGE_CAPACITY[r]+=b.capacityBonus;
        });
      }
      b.count++;
      renderBuildings();
    });
    refreshButtonState(b, btn);
    card.appendChild(title);
    card.appendChild(info);
    card.appendChild(costP);
    card.appendChild(btn);
    const status=document.createElement('div');
    status.className='mt-1 text-xs';
    status.id=`${key}-status`;
    card.appendChild(status);
    container.appendChild(card);
  });
  renderBuildings();
}

function renderBuildings(){
  Object.keys(buildings).forEach(key=>{
    const b=buildings[key];
    const status=document.getElementById(`${key}-status`);
    if(status){
      if(key==='smallHouse'){
        status.textContent=`Built: ${b.count} (population +${b.population * b.count})`;
      } else if(key==='storehouse'){
        status.textContent=`Built: ${b.count} (extra cap ${b.count * b.capacityBonus})`;
      }
    }
    // update button states
    const cards = document.querySelectorAll('#buildings-view button');
    cards.forEach(btn=>{
      const parent = btn.closest('div');
      if(!parent) return;
      // naive: refresh all
    });
  });
  saveGame(window.__state);
}

export function initBuildings(){
  initBuildingsUI();
}