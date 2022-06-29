#!/usr/bin/env node

/**
 * game-of-life
 * Riot Games - Conway's Game of Life
 *
 * @author Avery Ni <N/A>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);
})();
