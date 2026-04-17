import { readFileSync } from 'fs';

const en = JSON.parse(readFileSync('app/i18n/locales/en.json', 'utf8'));
const id = JSON.parse(readFileSync('app/i18n/locales/id.json', 'utf8'));

function getKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? prefix + '.' + k : k;
    return typeof v === 'object' && v !== null ? getKeys(v, key) : [key];
  });
}

const enKeys = new Set(getKeys(en));
const idKeys = new Set(getKeys(id));

const missingInId = [...enKeys].filter(k => !idKeys.has(k));
const missingInEn = [...idKeys].filter(k => !enKeys.has(k));

console.log('Keys in en but not in id:', missingInId.length ? missingInId : 'NONE');
console.log('Keys in id but not in en:', missingInEn.length ? missingInEn : 'NONE');
console.log('Total en keys:', enKeys.size);
console.log('Total id keys:', idKeys.size);
