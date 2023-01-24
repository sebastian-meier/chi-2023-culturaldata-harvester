const fs = require('fs');
const path = '../../_data/jam/';

const categories = {};
const subCategories = {};
const types = {};
const contentTypes = {};

fs.readdirSync(path).forEach(file => {
  if (file !== 'subCategories-en.txt' && file !== 'types-en.txt' && file !== 'categories.txt' && file !== 'subCategories.txt' && file !== 'types.txt' && file !== 'contentTypes.txt') {
    const j = JSON.parse(fs.readFileSync(path + file, 'utf-8'));
    j.list.forEach(item => {
      if ('common' in item) {
        if ('category' in item.common) {
          item.common.category.forEach(n => {
            const name = n.toLowerCase().split(',').join('').trim();
            if (!(name in categories)) {
              categories[name] = 0;
            }
            categories[name]++;
          });
        }
        if ('subCategory' in item.common) {
          item.common.subCategory.forEach(n => {
            const name = n.toLowerCase().split(',').join('').trim();
            if (!(name in subCategories)) {
              subCategories[name] = 0;
            }
            subCategories[name]++;
          });
        }
        if ('contentsType' in item.common) {
          const name = item.common.contentsType.toLowerCase().split(',').join('').trim();
          if (!(name in contentTypes)) {
            contentTypes[name] = 0;
          }
          contentTypes[name]++;
        }
      }
      if ('rdfindex' in item) {
        if ('type' in item.rdfindex) {
          item.rdfindex.type.forEach(n => {
            const name = n.toLowerCase().split(',').join('').trim();
            if (!(name in types)) {
              types[name] = 0;
            }
            types[name]++;
          });
        }
      }
    });
  }
});

[
  [categories,'categories.txt'],
  [subCategories,'subCategories.txt'],
  [types,'types.txt'],
  [contentTypes,'contentTypes.txt']
].forEach(s => {
  let sorted = [];
  Object.keys(s[0]).forEach(n => {
    sorted.push([n, s[0][n]]);
  });
  sorted.sort((a, b) => {
    return b[1] - a[1];
  });
  fs.writeFileSync('../../_data/jam/' + s[1], sorted.map(n => n[0] + ',' + n[1]).join('\n'), 'utf-8');
})
