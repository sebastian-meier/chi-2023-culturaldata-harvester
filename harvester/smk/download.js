const fs = require('fs');
const https = require('https');

const maxLimit = 2000;

// get max
https.get('https://api.smk.dk/api/v1/art/search/?keys=*&offset=0&rows=1&lang=en', (res) => {
  let result = '';
  res.on('data', (d) => {
    result += d;
  });
  res.on('end', () => {
    const j = JSON.parse(result);
    getAll(j.found);
  });
});

// get all (based on max)
const getAll = async (limit) => {
  	for (let i = 0; i < limit / maxLimit; i += 1) {
      const d = await getOffset(i * maxLimit);
      fs.writeFileSync('../../_data/smk/data_' + i + '.json', d, 'utf-8');
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
    https.get('https://api.smk.dk/api/v1/art/search/?keys=*&offset=' + offset + '&rows=' + maxLimit + '&lang=en', (res) => {
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