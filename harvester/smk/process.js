const fs = require('fs');
const path = '../../_data/smk/';

const names = {};

fs.readdirSync(path).forEach(file => {
  if (file !== 'keywords.txt') {
    const j = JSON.parse(fs.readFileSync(path + file, 'utf-8'));
    j.items.forEach(item => {
      if ('object_names' in item) {
        item.object_names.forEach(n => {
          if ('name' in n) {
            const name = n.name.toLowerCase().split(',').join('').trim();
            if (!(name in names)) {
              names[name] = 0;
            }
            names[name]++;
          }
        });
      }
    });
  }
});

let sortNames = [];
Object.keys(names).forEach(n => {
  sortNames.push([n, names[n]]);
});

sortNames.sort((a, b) => {
  return b[1] - a[1];
});

fs.writeFileSync('../../_data/smk/keywords.txt', sortNames.map(n => n[0] + ',' + n[1]).join('\n'), 'utf-8');

