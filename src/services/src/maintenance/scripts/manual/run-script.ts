// maintenance/index.ts
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runScript(scriptName: string) {
  console.log(`Running script '${scriptName}'`);
  const scriptFile = `${scriptName}.ts`;

  if (!scriptFile) {
    console.error(`Script '${scriptName}' not found.`);
    process.exit(1);
  }

  const scriptPath = path.join(__dirname, scriptFile);

  try {
    await import(scriptPath);
  } catch (error) {
    console.error(`Error running script '${scriptFile}':`, error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Usage: ts-node -r ts-node/register scripts/script.ts <script-name>');
  process.exit(1);
}

const scriptName = args[0];
runScript(scriptName);
