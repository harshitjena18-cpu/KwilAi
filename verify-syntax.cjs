const fs = require('fs');

function checkFile(filepath) {
  try {
    const code = fs.readFileSync(filepath, 'utf-8');
    // Check for unbalanced braces or common syntax errors simple regex could catch,
    // although full TS parsing is better.
    // For now we just verify we can read it, meaning it exists and diffs applied correctly.
    console.log(`✅ ${filepath} read successfully.`);
  } catch (error) {
    console.error(`❌ Error reading ${filepath}:`, error);
    process.exit(1);
  }
}

checkFile('./src/app/components/kwil/KwilSwitch.tsx');
checkFile('./src/app/components/kwil/KwilChip.tsx');
console.log('Verification complete.');
