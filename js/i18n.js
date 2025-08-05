import en from './translations/en.js';
import pl from './translations/pl.js';

let translations = {};
let currentLang = 'en';

function _t(key){
  const parts = key.split('.');
  let v = translations;
  for(const p of parts){
    if(v && p in v) v = v[p];
    else return key;
  }
  return typeof v === 'string'? v: key;
}

function apply(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.dataset.i18n;
    el.textContent=_t(k);
  });
}

export function changeLanguage(lang){
  if(lang==='pl') translations=pl,currentLang='pl';
  else translations=en,currentLang='en';
  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang===lang);
  });
  apply();
  localStorage.setItem('lang', lang);
  document.dispatchEvent(new CustomEvent('languageChanged',{detail:lang}));
}

export function initLanguage(){
  const saved=localStorage.getItem('lang')||'en';
  changeLanguage(saved);
  document.getElementById('btnPl')?.addEventListener('click',()=>changeLanguage('pl'));
  document.getElementById('btnEn')?.addEventListener('click',()=>changeLanguage('en'));
  document.addEventListener('languageChanged',()=>apply());
}