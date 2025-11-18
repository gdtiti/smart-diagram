#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to check syntax
const filesToCheck = [
  'app/draw/page.js',
  'components/FloatingChat.jsx',
  'components/HistoryModal.jsx',
  'components/DrawioCanvas.jsx',
  'hooks/useDrawioEngine.js',
  'hooks/useExcalidrawEngine.js'
];

console.log('🔍 Checking JavaScript syntax...\n');

let hasErrors = false;

filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');

    // Basic syntax check using eval in try-catch
    try {
      // Remove JSX and other non-JS constructs for basic checking
      const jsContent = content
        .replace(/<[^>]*>/g, '') // Remove JSX tags
        .replace(/import.*from.*/g, '') // Remove imports
        .replace(/export.*/g, ''); // Remove exports

      // Basic validation
      new Function(jsContent);
      console.log(`✅ ${file} - Syntax OK`);
    } catch (syntaxError) {
      console.log(`❌ ${file} - Syntax Error: ${syntaxError.message}`);
      hasErrors = true;
    }
  } catch (readError) {
    console.log(`❌ ${file} - Read Error: ${readError.message}`);
    hasErrors = true;
  }
});

console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Syntax errors found!');
  process.exit(1);
} else {
  console.log('✅ All files have valid syntax!');
  process.exit(0);
}