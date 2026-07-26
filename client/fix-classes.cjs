const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/text-white\/(?!\d)/g, 'text-white/70');
  content = content.replace(/text-text\/(?!\d)/g, 'text-text/70');
  
  content = content.replace(/bg-white\/(?!\d)/g, 'bg-white/10');
  content = content.replace(/bg-text\/(?!\d)/g, 'bg-text/10');
  
  content = content.replace(/border-white\/(?!\d)/g, 'border-white/20');
  content = content.replace(/border-text\/(?!\d)/g, 'border-text/20');

  // Ensure Save Theme button has text-white!
  content = content.replace(/bg-primary font-accent/g, 'bg-primary text-white font-accent');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed broken classes in', file);
    changedCount++;
  }
});
console.log('Total files fixed:', changedCount);
