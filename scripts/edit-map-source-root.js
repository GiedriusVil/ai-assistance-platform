const fs = require('fs');
const path = require('path');

const CONFIGS = {
  dir: './dist/client',
  app: 'portal'
}

console.log('Starting source map editing');

for (let i=2; i < process.argv.length; i++) {
  const ARG = process.argv[i].substring(2);
  if (ARG in CONFIGS) {
    CONFIGS[ARG] = process.argv[++i];
  }
}

console.table(CONFIGS);

const CLIENT_ABSOLUTE_PATH = path.join(process.cwd(), CONFIGS.dir);
const FILES = fs.readdirSync(CLIENT_ABSOLUTE_PATH);

FILES.filter(file => file.endsWith('.map')).forEach(file => {
  const MAP_ABSOLUTE_PATH = path.join(CLIENT_ABSOLUTE_PATH, file);
  const MAP_DATA = JSON.parse(fs.readFileSync(MAP_ABSOLUTE_PATH))
  console.log(`Editing ${file}`);
  MAP_DATA.sourceRoot = `webpack:///${CONFIGS.app}`;
  fs.writeFileSync(MAP_ABSOLUTE_PATH, JSON.stringify(MAP_DATA));
});

console.log('Source map editing has been finished')
