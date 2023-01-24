const fs = require('fs');
const path = '../../_data/nma/';

const mediums = {};
const types = {};

fs.readdirSync(path).forEach(file => {
  if (file !== 'mediums.txt' && file !== 'types.txt') {
    const j = JSON.parse(fs.readFileSync(path + file, 'utf-8'));
    j.data.forEach(item => {
      if ('additionalType' in item) {
        item.additionalType.forEach(n => {
          const name = n.toLowerCase().split(',').join('').trim();
          if (!(name in types)) {
            types[name] = 0;
          }
          types[name]++;
        });
      }
      if ('medium' in item) {
        item.medium.forEach(n => {
          if ("title" in n) {
            const name = n.title.toLowerCase().split(',').join('').trim();
            if (!(name in mediums)) {
              mediums[name] = 0;
            }
            mediums[name]++;
          }
        });
      }
    });
  }
});

let sortMediums = [];
Object.keys(mediums).forEach(n => {
  sortMediums.push([n, mediums[n]]);
});

sortMediums.sort((a, b) => {
  return b[1] - a[1];
});

fs.writeFileSync('../../_data/nma/mediums.txt', sortMediums.map(n => n[0] + ',' + n[1]).join('\n'), 'utf-8');

let sortTypes = [];
Object.keys(types).forEach(n => {
  sortTypes.push([n, types[n]]);
});

sortTypes.sort((a, b) => {
  return b[1] - a[1];
});

fs.writeFileSync('../../_data/nma/types.txt', sortTypes.map(n => n[0] + ',' + n[1]).join('\n'), 'utf-8');
