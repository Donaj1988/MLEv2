import { startGameLoop, state } from './game/logic.js';
import { loadSave, autoSave } from './game/save.js';
import './ui/devTools.js';
import { initBuildings } from './game/buildings.js';

const saved = loadSave();
if (saved.resources) Object.assign(state.resources, saved.resources);
if (saved.buildings) {
  // let buildings module load state via event
  window.addEventListener('load', () => {
    const ev = new CustomEvent('updateBuildings', { detail: { buildings: saved.buildings } });
    window.dispatchEvent(ev);
  });
}
startGameLoop();
autoSave(state);
initBuildings();