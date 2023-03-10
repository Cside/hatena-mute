const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('./dist/manifest.json').toString());
manifest.background = { page: 'background.html' };
for (const resource of manifest.web_accessible_resources) {
  delete resource.use_dynamic_url;
}
manifest.browser_specific_settings = {
  gecko: {
    id: 'hatena-mute@github.com',
  },
};

console.info(JSON.stringify(manifest, null, 2));
