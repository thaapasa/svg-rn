import { svgToReactNative } from './svg-to-rn';

import * as fs from 'fs';
import { log } from './util/logger';

function output(data: string) {
  console.log(data);
}

async function run() {
  log('svg-rn starts');

  const data = fs.readFileSync('test/wikimedia-test.svg').toString();
  output(await svgToReactNative(data));
}

run().catch(e => log(`Error when running svg-rn: ${e}`));
