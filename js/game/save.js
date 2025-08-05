const KEY='simple_game_save';
export function loadSave(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch{return{}}}
export function saveGame(state){localStorage.setItem(KEY,JSON.stringify(state));}
export function autoSave(state){setInterval(()=>saveGame(state),10000);}