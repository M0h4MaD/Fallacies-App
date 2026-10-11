const fs = require('fs');
const path = require('path');

function removeComments(content) {
  const lines = content.split('\n');
  const result = [];
  
  for (const line of lines) {
    const commentIndex = line.indexOf('//');
    if (commentIndex === -1) {
      result.push(line);
    } else {
      // Check if // is inside a string
      const beforeComment = line.substring(0, commentIndex);
      const singleQuotes = (beforeComment.match(/'/g) || []).length;
      const doubleQuotes = (beforeComment.match(/"/g) || []).length;
      const backticks = (beforeComment.match(/`/g) || []).length;
      
      // If odd number of quotes, // is inside a string - keep the line as is
      if (singleQuotes % 2 === 1 || doubleQuotes % 2 === 1 || backticks % 2 === 1) {
        result.push(line);
      } else {
        // Remove the comment part, keep code before //
        const codePart = line.substring(0, commentIndex).trimEnd();
        if (codePart.length > 0) {
          result.push(codePart);
        }
        // If line becomes empty after removing comment, skip it (don't add empty line)
      }
    }
  }
  
  // Remove trailing empty lines
  while (result.length > 0 && result[result.length - 1].trim() === '') {
    result.pop();
  }
  
  // Ensure file ends with newline
  return result.join('\n') + '\n';
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const newContent = removeComments(content);
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        console.log(`Processed: ${fullPath}`);
      }
    }
  }
}

const backendSrc = path.join(__dirname, 'src');
processDirectory(backendSrc);
console.log('Done!');