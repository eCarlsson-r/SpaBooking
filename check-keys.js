const en = JSON.parse(require('fs').readFileSync('app/i18n/locales/en.json', 'utf8'));
const id = JSON.parse(require('fs').readFileSync('app/i18n/locales/id.json', 'utf8'));

function getKeys(obj, prefix) {
  prefix = prefix || '';
  return Object.entries(obj).reduce(function(acc, entry) {
    var k = entry[0];
    var v = entry[1];
    var full = prefix ? prefix + '.' + k : k;
    if (typeof v === 'object' && v !== null) {
      return acc.concat(getKeys(v, full));
    }
    return acc.concat([full]);
  }, []);
}

var enKeys = getKeys(en);
var idKeys = getKeys(id);
var enSet = {};
enKeys.forEach(function(k) { enSet[k] = true; });
var idSet = {};
idKeys.forEach(function(k) { idSet[k] = true; });
var missingInId = enKeys.filter(function(k) { return !idSet[k]; });
var missingInEn = idKeys.filter(function(k) { return !enSet[k]; });
console.log('Missing in id:', JSON.stringify(missingInId));
console.log('Missing in en:', JSON.stringify(missingInEn));
console.log('Total en:', enKeys.length, 'id:', idKeys.length);
