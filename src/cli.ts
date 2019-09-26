import program from 'commander';

interface CommandLineOptions {
  output?: string;
  input?: string;
  help?: boolean;
}

program
  .option('-o, --output [file]', 'print output to a file')
  .option('-i, --input [file]', 'read input from a file');

program.parse(process.argv);

export const cliOptions = program.opts() as CommandLineOptions;
