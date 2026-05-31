import * as lucide from 'lucide-react';
import fs from 'fs';
import path from 'path';

const available = new Set(Object.keys(lucide).filter(k => k !== 'default' && k !== 'createLucideIcon'));
const templatesDir = 'C:/Projeler/CV/web/src/templates';
const files = fs.readdirSync(templatesDir, { recursive: true }).filter(f => f.endsWith('.jsx'));

const missingMap = new Map(); // file -> array of missing icons

files.forEach(f => {
    const content = fs.readFileSync(path.join(templatesDir, f), 'utf8');
    const match = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
    if (match) {
        const imports = match[1].split(',').map(i => {
            let name = i.trim();
            if (name.includes(' as ')) name = name.split(' as ')[0].trim();
            return name;
        }).filter(n => n && !available.has(n));
        if (imports.length > 0) {
            missingMap.set(f, imports);
        }
    }
});

if (missingMap.size === 0) {
    console.log('No missing icons found!');
} else {
    missingMap.forEach((icons, file) => {
        console.log(`${file}: ${icons.join(', ')}`);
    });
    console.log(`\nTotal files with missing icons: ${missingMap.size}`);
}
