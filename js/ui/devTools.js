import { state } from '../game/logic.js';
import { saveGame } from '../game/save.js';
function add100(resource){
  state.resources[resource]=(state.resources[resource]||0)+100;
  saveGame(window.__state);
}
const panel=document.createElement('div');
panel.className='fixed bottom-4 right-4 bg-gray-900 text-white p-2 rounded-lg shadow-lg flex gap-2';
panel.innerHTML='<button id="addWood" class="bg-amber-600 px-2 rounded">+100 wood</button>' +
  '<button id="addStone" class="bg-slate-400 px-2 rounded">+100 stone</button>';
document.body.appendChild(panel);
panel.querySelector('#addWood').addEventListener('click',()=>add100('wood'));
panel.querySelector('#addStone').addEventListener('click',()=>add100('stone'));