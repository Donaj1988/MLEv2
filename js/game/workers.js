import { state } from './logic.js';
import { saveGame } from './save.js';
import { buildings } from './buildings.js';

/**
 * Workers assigned to resources.
 */
const workers = {
  population: 0,
  assigned: { wood: 0, stone: 0, clay: 0, grain: 0 }
};

function totalAssigned(){
  return Object.values(workers.assigned).reduce((a,b)=>a+b,0);
}
function availableWorkers(){
  return Math.max(0, workers.population - totalAssigned());
}

export function updatePopulationFromHouses(houseCount){
  workers.population = houseCount * 2;
}

export function assign(resource){
  if(availableWorkers()<=0) return false;
  workers.assigned[resource]=(workers.assigned[resource]||0)+1;
  persist();
  return true;
}
export function unassign(resource){
  if((workers.assigned[resource]||0)<=0) return false;
  workers.assigned[resource]--;
  persist();
  return true;
}
export function getAssigned(resource){
  return workers.assigned[resource]||0;
}
export function getState(){
  return workers;
}
export function applyWorkerProduction(){
  Object.entries(workers.assigned).forEach(([res,cnt])=>{
    if(cnt>0){
      state.resources[res]=(state.resources[res]||0)+cnt;
    }
  });
}

function persist(){
  saveGame(window.__state);
}

export function initWorkersUI(){
  const container=document.getElementById('gathering-view');
  if(!container) return;
  // remove existing if any
  const existing = document.getElementById('workers-assign-panel');
  if(existing) existing.remove();

  const panel=document.createElement('div');
  panel.id='workers-assign-panel';
  panel.className='mt-4 bg-gray-700 p-4 rounded-lg flex flex-col gap-2';
  panel.innerHTML = `<div class="flex justify-between mb-1">
    <div><strong data-i18n="ui.settlers"></strong>: <span id="worker-used">0</span> / <span id="worker-total">0</span></div>
    <div><small>Assign to resources</small></div>
  </div>`;
  const assignWrapper=document.createElement('div');
  assignWrapper.className='grid grid-cols-4 gap-4';

  ['wood','stone','clay','grain'].forEach(res=>{
    const card=document.createElement('div');
    card.className='bg-gray-800 p-3 rounded flex flex-col items-center';
    const title=document.createElement('div');
    title.textContent=res.charAt(0).toUpperCase()+res.slice(1);
    const assigned=document.createElement('div');
    assigned.className='text-sm my-1';
    assigned.id=`assigned-${res}`;
    const controls=document.createElement('div');
    controls.className='flex gap-1';
    const plus=document.createElement('button');
    plus.textContent='+';
    plus.className='bg-green-600 px-2 rounded';
    plus.addEventListener('click',()=>{
      assign(res);
      renderWorkersUI();
    });
    const minus=document.createElement('button');
    minus.textContent='-';
    minus.className='bg-red-600 px-2 rounded';
    minus.addEventListener('click',()=>{
      unassign(res);
      renderWorkersUI();
    });
    controls.appendChild(minus);
    controls.appendChild(plus);
    card.appendChild(title);
    card.appendChild(assigned);
    card.appendChild(controls);
    assignWrapper.appendChild(card);
  });

  panel.appendChild(assignWrapper);
  container.appendChild(panel);
  renderWorkersUI();
}

export function renderWorkersUI(){
  const used=document.getElementById('worker-used');
  const total=document.getElementById('worker-total');
  if(used) used.textContent=totalAssigned();
  if(total) total.textContent=workers.population;
  ['wood','stone','clay','grain'].forEach(res=>{
    const el=document.getElementById(`assigned-${res}`);
    if(el) el.textContent=`Assigned: ${workers.assigned[res]||0}`;
  });
}