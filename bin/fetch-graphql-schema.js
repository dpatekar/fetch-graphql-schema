#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const meow = require('meow');
const mkdirp = require('mkdirp');
const fetchSchema = require('../src'); // eslint-disable-line import/no-unresolved

const cli = meow(`

    Usage
      $ fetch-graphql-schema <schemaUrl>

    Options
      -o, --output    Specify an output filename.
      -r, --readable  Resolve .graphql instead of .json.
      -t, --token     Specify an authorization token. (e.g. 'Bearer xxxxxxxxxxxxxxxxxxxxxxxx')

    Examples
      $ fetch-graphql-schema http://api.server/graphql -o schema.json
      $ fetch-graphql-schema http://api.server/graphql -o schema.graphql -r

`);

if (cli.input.length === 0) {
  console.log(cli.help);
  process.exit(0);
}

const schemaUrl = cli.input[0];
const output = cli.flags.o || cli.flags.output;
const token = cli.flags.t || cli.flags.token;

if (!output) {
  fetchSchema(schemaUrl, { readable: cli.flags.r || cli.flags.readable, token: token })
    .then(console.log);
}

if (output && typeof output === 'string') {
  const outputPath = path.resolve(output);

  console.log(chalk.yellow(`Start fetching "${schemaUrl}"...`));

  fetchSchema(schemaUrl, { readable: cli.flags.r || cli.flags.readable, token: token }).then(schemaJSON => {
    mkdirp.sync((path.dirname(outputPath)));
    fs.writeFileSync(outputPath, schemaJSON);

    console.log(chalk.green(`Successfully fetched "${schemaUrl}" and saved to "${outputPath}"`));
  });
}
