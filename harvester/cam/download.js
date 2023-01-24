const fs = require('fs');
const https = require('https');

const maxLimit = 1000;

// get max
https.get('https://openaccess-api.clevelandart.org/api/artworks?limit=1&skip=0', (res) => {
  let result = '';
  res.on('data', (d) => {
    result += d;
  });
  res.on('end', () => {
    const j = JSON.parse(result);
    getAll(j.info.total);
  });
});

// get all (based on max)
const getAll = async (limit) => {
  	for (let i = 0; i < limit / maxLimit; i += 1) {
      const d = await getOffset(i * maxLimit);
      fs.writeFileSync('../../_data/cam/data_' + i + '.json', d, 'utf-8');
      await waitFor(1000);
    }
};

const waitFor = async (time) => {
  return new Promise ((resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

const getOffset = (offset) => {
  return new Promise((resolve, reject) => {
    https.get('https://openaccess-api.clevelandart.org/api/artworks?limit=' + maxLimit + '&skip=' + offset, (res) => {
      let result = '';
      res.on('data', (d) => {
        result += d;
      });
      res.on('end', () => {
        resolve(result);
      });
      res.on('error', (e) => {
        reject(e);
      });
    });
  });
};