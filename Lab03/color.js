const readline = require('readline');
const NAMED_COLORS = {
    "red":   { r: 255, g: 0,   b: 0 },
    "green": { r: 0,   g: 128, b: 0 },
    "blue":  { r: 0,   g: 0,   b: 255 },
    "white": { r: 255, g: 255, b: 255 },
    "black": { r: 0,   g: 0,   b: 0 }
};

function parseHex(str) {
    const hex = str.slice(1).toLowerCase();
    if (hex.length === 6) {
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }
    if (hex.length === 3) {
        return {
            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16)
        };
    }
    return null;
}

function parseRgb(str) {
    const match = str.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (!match) return null;
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);   
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        return { r, g, b };
    }    
    return null;
}

function parseColor(str) {
    if (!str || typeof str !== 'string') return null;
    const trimmed = str.trim();
    if (trimmed.startsWith('#')) return parseHex(trimmed);
    if (trimmed.toLowerCase().startsWith('rgb')) return parseRgb(trimmed);
    const namedColor = trimmed.toLowerCase();
    if (NAMED_COLORS.hasOwnProperty(namedColor)) return NAMED_COLORS[namedColor];
    return null;
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Введіть колір (наприклад, #FF8800 або rgb(255,136,0)): ', (userInput) => {
    const result = parseColor(userInput);
    
    if (result) {
        console.log('Результат:', result);
        console.log(`Колір: \x1b[48;2;${result.r};${result.g};${result.b}m      \x1b[0m`);
    } else {
        console.log('null (Некоректний колір)');
    }
    rl.close();
});