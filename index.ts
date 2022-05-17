#!/usr/bin/env node

import cli from './src/services/cli';
import './src/commands';

const [, , ...args] = process.argv;

cli.runExit(args);
