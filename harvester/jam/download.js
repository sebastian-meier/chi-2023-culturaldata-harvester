const fs = require('fs');
const https = require('https');

// get all (based on max)
const getAll = async () => {
  let counter = 0;
  let nextId = '';
  while (nextId != null) {
    const d = await getNext(nextId);
    fs.writeFileSync('../../_data/jam/data_' + counter + '.json', d, 'utf-8');
    await waitFor(1000);
    counter += 1;
    const j = JSON.parse(d);
    if (j.scrollId) {
      nextId = j.scrollId;
    } else {
      nextId = null;
    }
  }
};

const waitFor = async (time) => {
  return new Promise ((resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

const getNext = (scrollId) => {
  return new Promise((resolve, reject) => {
    https.get('https://jpsearch.go.jp/api/item/scroll/jps-cross?scrollId=' + scrollId, (res) => {
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

getAll();