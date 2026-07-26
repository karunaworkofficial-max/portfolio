const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.jsx')) {
      callback(dirPath);
    }
  });
}

walkDir('C:/Users/ADMIN/.gemini/antigravity/scratch/portfolio/client/src', file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/(<(?:input|textarea)[^>]*className=[\"'][^\"']*?)(bg-bg(?:\/50)?|bg-surface(?:\/50)?)([^>]*>)/g, '$1bg-transparent$3');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
