class Simulator {
    constructor(fileName) {
		// coordinates map x(string form) to y(number) 
		this.coordinates = {}
		this.nextCoordinates = {}
		this.directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    }

	async parseFile(fileName) {
		// Pull in the file and parse it
		var fs = require('fs').promises;
		const data = await (await fs.readFile(fileName, 'utf8')).split('\n')
		
		// Basic check for file format
		if (data[0] != '#Life 1.06') {
			throw 'Invalid File Format / Unknown File Format'
		}
		
		// create coordinates
		for(var i = 1; i < data.length; ++i) {
			var coordinate = data[i].split(" ")
			var x = coordinate[0] // want in string form
			var y = parseInt(coordinate[1]) // want in number form
			
			if(this.coordinates[x] == null) {
				this.coordinates[x] = []
			}
			this.coordinates[x].push(y)
		}
	}

	printCoordinates() {
		var toPrint = []
		for(var key of Object.keys(this.coordinates)) {
			var x = parseInt(key)
			for(var y of this.coordinates[key]) {
				toPrint.push([x,y])
			}
		}
		console.log(toPrint)
	}

	simulate() {
		// keep track of where we've been to prevent duplicates
		var visited = new Set() 

		for(var key of Object.keys(this.coordinates)) {
			var x = parseInt(key)
			for(var y of this.coordinates[key]) {
				var visitKey = `${key},${y}`
				if (visited.has(visitKey)) {continue}
				visited.add(visitKey)

				if (this.cellIsAliveNextGeneration(x, y, true)) {
					// add to next generation
					if(this.nextCoordinates[key] == null) {
						this.nextCoordinates[key] = []
					}
					this.nextCoordinates[key].push(y)
				}

				// Check to see if any of the neighbors need reviving:
				// 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
				for(var dir of this.directions) {
					var newX = x + dir[0]
					var newY = y + dir[1]

					var neighborKey = `${newX},${newY}`
					// continue if neighbor has been visited OR is alive
					if (visited.has(neighborKey) 
						|| (this.coordinates[newX] != null && this.coordinates[newX].includes(newY))
					) {continue}
					visited.add(neighborKey)

					if (this.cellIsAliveNextGeneration(newX, newY, false)) {
						// add to next generation
						if(this.nextCoordinates[newX.toString()] == null) {
							this.nextCoordinates[newX.toString()] = []
						}
						this.nextCoordinates[newX.toString()].push(newY)
					}
				}
			}
		}
		this.coordinates = this.nextCoordinates
		this.nextCoordinates = {}
	}

	cellIsAliveNextGeneration(x, y, isAlive) {
		var numLiveNeighbors = 0 

		for(var dir of this.directions) {
			var newX = x + dir[0]
			var newY = y + dir[1]
			if(this.coordinates[newX.toString()] && this.coordinates[newX.toString()].includes(newY)) {
				numLiveNeighbors++
			}
		}

		if (isAlive) {
			// 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
			// 2. Any live cell with two or three live neighbours lives on to the next generation.
			// 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
			return numLiveNeighbors == 2 || numLiveNeighbors == 3
		} else {
			// 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
			return numLiveNeighbors == 3
		}
	}
}

module.exports = Simulator