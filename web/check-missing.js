const fs = require('fs');

const content = fs.readFileSync('./src/pages/EditorPage.jsx', 'utf8');

// Get all <Component... things
const matches = content.match(/<([A-Z][a-zA-Z0-9]+)/g) || [];
const usedComponents = [...new Set(matches.map(m => m.substring(1)))];

// Get all imports
const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
if(importMatch) {
    const imported = importMatch[1].split(',').map(s => s.trim().split(' as ')[0]);
    console.log('Potentially missing lucide icons (used as components but not in any import):');
    
    // Quick check against all imports to avoid false positives
    const allImports = content.match(/import.*?from.*/g).join('\n');
    
    usedComponents.forEach(comp => {
        // If not in lucide import, AND not found in other import statements
        if(!imported.includes(comp) && !allImports.includes(comp) && comp !== 'Fragment') {
            console.log(comp);
        }
    });
}
