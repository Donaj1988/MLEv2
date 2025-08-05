import { initLanguage } from './i18n.js';
import { startGameLoop, state } from './game/logic.js';
import { loadSave, autoSave } from './game/save.js';
import { initBuildings } from './game/buildings.js';
import { initWorkersUI } from './game/workers.js';
import './ui/devTools.js';
import { initResourceBar } from './ui/resourceBar.js';

initLanguage();
Object.assign(state.resources, loadSave().resources||{});
startGameLoop();
initBuildings();
initWorkersUI();
initResourceBar();
autoSave(window.__state);

// gather helpers
window.collectResource=(res)=>{
  state.resources[res]=Math.min((state.resources[res]||0)+5, 9999);
};
window.showView=(name)=>{
  document.querySelectorAll('.view-section').forEach(v=>v.classList.remove('active'));
  const el=document.getElementById(name+'-view');
  if(el) el.classList.add('active');
};