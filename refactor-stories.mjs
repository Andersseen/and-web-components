import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(
  __dirname,
  "packages/web-components/src/components",
);

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk(targetDir, (file) => {
  if (file.endsWith(".stories.ts")) {
    let content = fs.readFileSync(file, "utf-8");

    // Find where `export const ` starts
    const exportConstIndex = content.indexOf("export const ");

    if (exportConstIndex !== -1) {
      // Keep everything before the first `export const `
      const baseContent = content.substring(0, exportConstIndex);

      // Attempt to preserve the args definition from the first Default export
      // if it exists, otherwise just default to empty
      const defaultArgsMatch = content.match(/Default\.args\s*=\s*({[^}]*});/s);
      let defaultArgs = defaultArgsMatch ? defaultArgsMatch[1] : "{}";

      const newContent = `${baseContent}export const Default = Template.bind({});
Default.args = ${defaultArgs};
`;

      fs.writeFileSync(file, newContent);
      console.log(`Refactored: ${file}`);
    }
  }
});
