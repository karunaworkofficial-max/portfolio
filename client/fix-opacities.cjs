const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.jsx')) results.push(file);
  });
  return results;
}
walk('./src').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;
  
  content = content.replace(/text-text\/(?!\d)/g, 'text-text/70');
  content = content.replace(/text-white\/(?!\d)/g, 'text-white/70');
  
  content = content.replace(/bg-text\/(?!\d)/g, 'bg-text/10');
  content = content.replace(/bg-white\/(?!\d)/g, 'bg-white/10');
  
  content = content.replace(/border-text\/(?!\d)/g, 'border-text/20');
  content = content.replace(/border-white\/(?!\d)/g, 'border-white/20');
  
  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
