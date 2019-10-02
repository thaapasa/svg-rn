#!/usr/bin/env node

import program from 'commander';
import { svgToReactNative } from './svg-to-rn';
import * as fs from 'fs';
import { promisify } from 'util';

import packageJson = require('../package.json');
import { logOutput, logError } from './util/logger';

const readFileP = promisify(fs.readFile);
const writeFileP = promisify(fs.writeFile);

interface CommandLineOptions {
  output?: string;
  input?: string;
  help?: boolean;
  jsx?: boolean;
  tsx?: boolean;
  removeIds: boolean;
}

let fileInput = '';

program
  .version(packageJson.version, '-v, --version', 'output the current version')
  .usage('[options] [svg-file]')
  .option('-o, --output [file]', 'print output to a file')
  .option('-i, --input [file]', 'read input from a file')
  .option('-t, --tsx', 'convert file to a .tsx file (default)')
  .option('-j, --jsx', 'convert file to a .jsx file')
  .option('--remove-ids', 'remove id attributes (caution: do not use if SVG has hrefs)')
  .arguments('[file]')
  .action(file => (fileInput = file));

program.parse(process.argv);

const cliOptions = program.opts() as CommandLineOptions;

async function getInput(): Promise<string> {
  const file = fileInput || cliOptions.input;
  if (file) {
    // Read input file
    const buf = await readFileP(file, { encoding: 'utf-8' });
    return buf.toString();
  }
  // Read stdin
  // See https://stackoverflow.com/questions/30441025/read-all-text-from-stdin
  const buf = await readFileP(0, { encoding: 'utf-8' });
  return buf.toString();
}

function getOutputFile(inputFile: string): string {
  const ext = cliOptions.jsx === true ? '.jsx' : '.tsx';
  const outFile = inputFile.replace(/[.]svg$/i, '') + ext;
  logOutput('Converting file', inputFile, 'to', outFile);
  return outFile;
}

async function doOutput(data: string) {
  const outFile = fileInput ? getOutputFile(fileInput) : cliOptions.output;
  if (outFile) {
    await writeFileP(outFile, data, { encoding: 'utf-8' });
  } else {
    process.stdout.write(data);
  }
}

async function run() {
  const inputSvg = await getInput();
  const outputJsx = await svgToReactNative(inputSvg, cliOptions);
  await doOutput(outputJsx);
}

run().catch(e => logError(`Error when running svg-rn: ${e}`));
