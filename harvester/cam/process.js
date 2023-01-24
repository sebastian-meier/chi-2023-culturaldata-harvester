const fs = require('fs');
const path = '../../_data/cam/';

const materials = {};
const techniques = {};
const types = {};

fs.readdirSync(path).forEach(file => {
  if (file !== 'materials.txt' && file !== 'types.txt' && file !== 'techniques.txt') {
    const j = JSON.parse(fs.readFileSync(path + file, 'utf-8'));
    j.data.forEach(item => {
      if ('type' in item && item.type) {
        const name = item.type.toLowerCase().split(',').join('').trim();
        if (!(name in types)) {
          types[name] = 0;
        }
        types[name]++;
      }
      if ('technique' in item && item.technique) {
        const name = item.technique.toLowerCase().split(',').join('').trim();
        if (!(name in techniques)) {
          techniques[name] = 0;
        }
        techniques[name]++;
      }
      if ('support_materials' in item && item.support_materials) {
        item.support_materials.forEach(n => {
          if (n.description) {
            const name = n.description.toLowerCase().split(',').join('').trim();
            if (!(name in materials)) {
              materials[name] = 0;
            }
            materials[name]++;
          }
        });
      }
      
    });
  }
});

let sortMaterials = [];
Object.keys(materials).forEach(n => {
  sortMaterials.push([n, materials[n]]);
});

sortMaterials.sort((a, b) => {
  return b[1] - a[1];
});

fs.writeFileSync('../../_data/cam/materials.txt', sortMaterials.map(n => n[0] + ',' + n[1]).join('\n'), 'utf-8');

let sortTechniques = [];
Object.keys(techniques).forEach(n => {
  sortTechniques.push([n, techniques[n]]);
});

sortTechniques.sort((a, b) => {
  return b[1] - a[1];
});

fs.writeFileSync('../../_data/cam/techniques.txt', sortTechniques.map(n => n[0] + ',' + n[1]).join('\n'), 'utf-8');

let sortTypes = [];
Object.keys(types).forEach(n => {
  sortTypes.push([n, types[n]]);
});

sortTypes.sort((a, b) => {
  return b[1] - a[1];
});

fs.writeFileSync('../../_data/cam/types.txt', sortTypes.map(n => n[0] + ',' + n[1]).join('\n'), 'utf-8');
