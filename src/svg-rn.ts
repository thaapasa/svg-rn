import { svgToReactNative } from './svg-to-rn';

import * as fs from 'fs';
import { log } from './util/logger';
import { cliOptions } from './cli';
import { promisify } from 'util';

const readFileP = promisify(fs.readFile);
const writeFileP = promisify(fs.writeFile);

async function getInput(): Promise<string> {
  if (cliOptions.input) {
    // Read input file
    const buf = await readFileP(cliOptions.input, { encoding: 'utf-8' });
    return buf.toString();
  }
  // Read stdin
  // See https://stackoverflow.com/questions/30441025/read-all-text-from-stdin
  const buf = await readFileP(0);
  return buf.toString();
}

async function doOutput(data: string) {
  if (cliOptions.output) {
    await writeFileP(cliOptions.output, data, { encoding: 'utf-8' });
  } else {
    process.stdout.write(data);
  }
}

async function run() {
  const inputSvg = await getInput();
  const outputJsx = await svgToReactNative(inputSvg);
  await doOutput(outputJsx);
}

run().catch(e => log(`Error when running svg-rn: ${e}`));
