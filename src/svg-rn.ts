import { svgToReactNative } from './svg-to-rn';

import * as fs from 'fs';
import { log } from './util/logger';
import { cliOptions } from './cli';

function output(data: string) {
  console.log(data);
}

async function run() {
  const opts = cliOptions;
  log('svg-rn starts with opts', opts);

  const data = fs.readFileSync('test/wikimedia-test.svg').toString();
  output(await svgToReactNative(data));
}

run().catch(e => log(`Error when running svg-rn: ${e}`));
