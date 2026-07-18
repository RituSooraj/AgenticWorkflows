#!/usr/bin/env node
const { Command } = require('commander');
const { convert } = require('./convert');
const { loadRates } = require('./rates');

const program = new Command();

program
  .name('currency')
  .description('Convert amounts between currencies using local exchange rate data')
  .version('1.0.0');

program
  .command('convert <amount> <from> <to>')
  .description('Convert an amount from one currency to another')
  .action((amount, from, to) => {
    const result = convert(parseFloat(amount), from, to);
    console.log(`${amount} ${from.toUpperCase()} = ${result} ${to.toUpperCase()}`);
  });

program
  .command('rates')
  .description('List the local exchange rates currently in use')
  .action(() => {
    const { base, asOf, rates } = loadRates();
    console.log(`Base: ${base} (as of ${asOf})`);
    for (const [code, rate] of Object.entries(rates)) {
      console.log(`  1 ${base} = ${rate} ${code}`);
    }
  });

program.parse();
