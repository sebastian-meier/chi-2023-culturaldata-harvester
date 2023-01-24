const fs = require('fs');
const https = require('https');

const maxLimit = 100;

// get max
https.get('https://data.nma.gov.au/object?limit=1&text=*&format=simple', (res) => {
  let result = '';
  res.on('data', (d) => {
    result += d;
  });
  res.on('end', () => {
    const j = JSON.parse(result);
    getAll(j.meta.results);
  });
});

// get all (based on max)
const getAll = async (limit) => {
  	for (let i = 0; i < limit / maxLimit; i += 1) {
      const d = await getOffset(i * maxLimit);
      fs.writeFileSync('../../_data/nma/data_' + i + '.json', d, 'utf-8');
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
    https.get('https://data.nma.gov.au/object?offset=' + offset + '&limit=' + maxLimit + '&text=*&format=simple', (res) => {
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