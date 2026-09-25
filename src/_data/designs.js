const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

module.exports = function() {
  const dir = path.join(__dirname, '../_designs');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => /\.(yaml|yml)$/.test(f))
    .map(f => yaml.load(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => a.name.localeCompare(b.name));
};
