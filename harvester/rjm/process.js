const {XMLParser} = require('fast-xml-parser');
const {decode} = require('html-entities');
const fs = require('fs');

const readStream = fs.createReadStream('../../_data/rjm/202001-rma-lido-collection/202001-rma-lido-collection.xml').setEncoding('UTF8');

const parser = new XMLParser({
  attributeNamePrefix : "@_",
  ignoreAttributes : false,
});

let data = '';
const startTag = '<lido:lido>';
const endTag = '</lido:lido>';

const types = {};
const classes = {};

let counter = 0;

const walk = (obj, steps) => {
  if (steps.length === 0) {
    return obj;
  }
  const step = steps[0];
  if (step in obj) {
    obj = [obj];
  }
  let r = [];
  obj.forEach(o => {
    if (step in o && typeof o[step] === 'object') {
      r.push(walk(o[step], steps.slice(1)));
    }
  });
  return r;
};

const flatten = (obj, path) => {
  for (let i = 0; i < path.length; i += 1) {
    obj = obj.flat();
  }
  return obj;
};

readStream.on('data', (d) => {
  data += d;

  while(data.indexOf(endTag) >= 0) {
    let lido = data.substring(data.indexOf(startTag), data.indexOf(endTag) + endTag.length);
    let lidoObj = parser.parse(lido);

    let path = [
      'lido:lido',
      'lido:descriptiveMetadata',
      'lido:objectClassificationWrap',
      'lido:objectWorkTypeWrap',
      'lido:objectWorkType',
      'lido:term'
    ];

    let terms = flatten(walk(lidoObj, path), path);

    terms.forEach(t => {
      if (t['@_xml:lang'] == 'nl') {
        const name = decode(t['#text']);
        if (!(name in types)) {
          types[name] = 0;
        }
        types[name]++;
      }
    });

    path = [
      'lido:lido',
      'lido:descriptiveMetadata',
      'lido:objectClassificationWrap',
      'lido:classificationWrap',
      'lido:classification',
      'lido:term'
    ];

    terms = flatten(walk(lidoObj, path), path);

    terms.forEach(t => {
      const name = decode(t['#text']);
      if (!(name in classes)) {
        classes[name] = 0;
      }
      classes[name]++;
    });

    console.log(counter++);

    data = data.substring(data.indexOf(endTag) + endTag.length);
  }
});

readStream.on('end', () => {
  [
    [classes,'classes.txt'],
    [types,'types.txt'],
  ].forEach(s => {
    let sorted = [];
    Object.keys(s[0]).forEach(n => {
      sorted.push([n, s[0][n]]);
    });
    sorted.sort((a, b) => {
      return b[1] - a[1];
    });
    fs.writeFileSync('../../_data/rjm/' + s[1], sorted.map(n => n[0] + ',' + n[1]).join('\n'), 'utf-8');
  });
  
  console.log('DONE');
});