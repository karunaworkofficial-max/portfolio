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

const adminDirs = ['./src/components/admin', './src/pages/admin', './src/components/layout'];
let files = [];
adminDirs.forEach(dir => {
  files = files.concat(walk(dir));
});

let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Change text-white back to text-text
  content = content.replace(/text-white\/([0-9]+)/g, 'text-text/');
  content = content.replace(/text-white(?![-\/a-zA-Z])/g, 'text-text');
  
  content = content.replace(/bg-white\/([0-9]+)/g, 'bg-text/');
  content = content.replace(/border-white\/([0-9]+)/g, 'border-text/');

  // Fix buttons that should explicitly be text-white
  content = content.replace(/bg-primary text-text font-accent/g, 'bg-primary text-white font-accent');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Made admin dynamic in', file);
    changedCount++;
  }
});
console.log('Total admin files updated:', changedCount);
