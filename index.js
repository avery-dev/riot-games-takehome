#!/usr/bin/env node

/**
 * game-of-life
 * Riot Games - Conway's Game of Life
 *
 * @author Avery Ni <N/A>
 */

const Simulator = require('./simulator')
const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

// Main function
(async () => {
	// Boilerplate begin
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);
	// Boilerplate end

	if (input.length < 1 || input[0].substr(-4) != '.txt') {
		console.error('ERROR: Please provide a .txt file in Life 1.06 format')
		return
	} 
	
	var simulator = new Simulator()
	try {
		await simulator.parseFile(input[0])
	} catch (e) {
		console.error("ERROR: " + e)
		return 
	}
	
	console.log('Initial state:')
	simulator.printCoordinates()
	
	var turnsToSimulate = parseInt(input[1]) ? parseInt(input[1]) : 10
	console.log(`\nSimulating the next ${turnsToSimulate} generations...`)
	for(var i = 0; i < turnsToSimulate; ++i) {
		simulator.simulate()
		simulator.printCoordinates()
	}
})();


