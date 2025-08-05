import { state } from '../game/logic.js';
import { STORAGE_CAPACITY } from '../core/config.js';
const RESOURCES=[
  {key:'wood', icon:'/pic/icons/wood.png'},
  {key:'stone', icon:'/pic/icons/stone.png'},
  {key:'clay', icon:'/pic/icons/clay.png'},
  {key:'grain', icon:'/pic/icons/grain.png'}
];
let container;
function createBar(resource){
  const wrapper=document.createElement('div');
  wrapper.className='flex items-center gap-2 mr-4 text-xs';
  const icon=document.createElement('img');
  icon.src=resource.icon;
  icon.alt=resource.key;
  icon.width=16;icon.height=16;icon.className='rounded';
  const label=document.createElement('div');
  label.className='flex gap-1';
  const amountSpan=document.createElement('span');
  amountSpan.id=resource.key+'-amount-top';
  amountSpan.textContent='0';
  const slash=document.createElement('span');slash.textContent='/';
  const capSpan=document.createElement('span');
  capSpan.id=resource.key+'-cap-top';capSpan.textContent='0';
  const barOuter=document.createElement('div');
  barOuter.className='w-32 h-2 bg-gray-700 rounded overflow-hidden ml-2';
  const barInner=document.createElement('div');
  barInner.id=resource.key+'-bar-top';
  barInner.className='h-full bg-amber-500';
  barInner.style.width='0%';
  barOuter.appendChild(barInner);
  wrapper.appendChild(icon);
  wrapper.appendChild(amountSpan);
  wrapper.appendChild(slash);
  wrapper.appendChild(capSpan);
  wrapper.appendChild(barOuter);
  return wrapper;
}
function render(){
  if(!container) return;
  RESOURCES.forEach(r=>{
    const amt=state.resources[r.key]||0;
    const cap=STORAGE_CAPACITY[r.key]||0;
    const percent=cap>0?Math.min(amt/cap*100,100):0;
    const amountEl=document.getElementById(r.key+'-amount-top');
    const capEl=document.getElementById(r.key+'-cap-top');
    const barInner=document.getElementById(r.key+'-bar-top');
    if(amountEl) amountEl.textContent=Math.floor(amt);
    if(capEl) capEl.textContent=cap;
    if(barInner) barInner.style.width=percent+'%';
  });
}
export function initResourceBar(){
  container=document.getElementById('resource-bar-container');
  if(!container) return;
  container.innerHTML='';
  RESOURCES.forEach(r=>{
    container.appendChild(createBar(r));
  });
  setInterval(render,500);
  render();
}