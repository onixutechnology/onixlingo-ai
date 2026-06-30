const fs = require('fs');
const path = require('path');

const files = [
    'curriculum.ts',
    'curriculum_fr.ts',
    'curriculum_zh.ts',
    'curriculum_pro_fr.ts'
];

for (const file of files) {
    const filePath = path.join('c:/Users/jeico/onixlingo/language-ai-tutor/frontend/data', file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove hardcoded 200/100 from function calls
    // buildLessons('a1', TEMAS_A_DATA, 200) -> buildLessons('a1', TEMAS_A_DATA)
    content = content.replace(/buildLessons\('([^']+)',\s*([^,]+),\s*\d+\)/g, "buildLessons('$1', $2)");

    // 2. Modify the function definition
    // const buildLessons = (prefix: string, rawData: string[][], count: number = 200): LessonNode[] => {
    content = content.replace(/const buildLessons = \(prefix: string, rawData: string\[\]\[\], count: number = \d+\)/g, "const buildLessons = (prefix: string, rawData: string[][])");

    // 3. Modify loop condition
    // for (let idx = 0; idx < count; idx++) {
    content = content.replace(/for \(let idx = 0; idx < count; idx\+\+\) \{/g, "for (let idx = 0; idx < rawData.length; idx++) {");

    // 4. Remove suffix logic (which appended "- Section X")
    // const suffix = idx >= rawData.length ? ` - Section ${Math.floor(idx / rawData.length) + 1}` : "";
    // const title = `${item[0]}${suffix}`;
    content = content.replace(/const suffix = idx >= rawData\.length \? `[^`]+` : "";\s*const title = `\$\{item\[0\]\}\$\{suffix\}`;/g, "const title = item[0];");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', file);
}
