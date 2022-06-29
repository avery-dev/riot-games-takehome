class Simulator {
    constructor(fileName) {
		// coordinates map x(string form) to y(number) 
		this.coordinates = {}
		this.nextCoordinates = {}
		this.directions = [['-1', '-1'], ['-1', '0'], ['-1', '1'], ['0', '-1'], ['0', '1'], ['1', '-1'], ['1', '0'], ['1', '1']]
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
			var x = coordinate[0]
			var y = coordinate[1]
			
			if(this.coordinates[x] == null) {
				this.coordinates[x] = []
			}
			this.coordinates[x].push(y)
		}
	}

	printCoordinates() {
		var toPrint = []
		for(var x of Object.keys(this.coordinates)) {
			for(var y of this.coordinates[x]) {
				toPrint.push([x,y])
			}
		}
		console.log(toPrint)
	}

	simulate() {
		// keep track of where we've been to prevent duplicates
		var visited = new Set() 

		for(var x of Object.keys(this.coordinates)) {
			for(var y of this.coordinates[x]) {
				var visitKey = `${x},${y}`
				if (visited.has(visitKey)) {continue}
				visited.add(visitKey)

				if (this.cellIsAliveNextGeneration(x, y, true)) {
					// add to next generation
					if(this.nextCoordinates[x] == null) {
						this.nextCoordinates[x] = []
					}
					this.nextCoordinates[x].push(y)
				}

				// Check to see if any of the neighbors need reviving:
				// 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
				for(var dir of this.directions) {
					var newX = this.add(x, dir[0])
					var newY = this.add(y, dir[1])

					var neighborKey = `${newX},${newY}`
					// continue if neighbor has been visited OR is alive
					if (visited.has(neighborKey) 
						|| (this.coordinates[newX] != null && this.coordinates[newX].includes(newY))
					) {continue}
					visited.add(neighborKey)

					if (this.cellIsAliveNextGeneration(newX, newY, false)) {
						// add to next generation
						if(this.nextCoordinates[newX] == null) {
							this.nextCoordinates[newX] = []
						}
						this.nextCoordinates[newX].push(newY)
					}
				}
			}
		}
		this.coordinates = this.nextCoordinates
		this.nextCoordinates = {}
	}

	cellIsAliveNextGeneration(x, y, isAlive) {
		var numLiveNeighbors = 0 
        //console.log(`${isAlive ? "ALIVE ": "DEAD "} ${x}, ${y} :`)
		for(var dir of this.directions) {
            var newX = this.add(x, dir[0])
            var newY = this.add(y, dir[1])
            //console.log(`${newX}, ${newY}`)
			if(this.coordinates[newX] && this.coordinates[newX].includes(newY)) {
				numLiveNeighbors++
			}
		}
        //console.log(`${isAlive ? "ALIVE ": "DEAD "} ${x}, ${y} has ${numLiveNeighbors} neighbors`)
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

    add(str1, str2)
    {
        // str2 will either be -1, 0, or 1
        if (str2 == '0') { 
            return str1 
        } 
        // Number.MAX_SAFE_INTEGER = 9007199254740991
        // If the value is shorter than this (16 digits), just do normal math
        else if (str1.length < 16) {
            return ((+str1) + (+str2)).toString()
        }
        // Let's handle the big numbers!
        else {
            var result = ''
            if ((str2 == '1' && str1[0] != '-') || (str2 == '-1' && str1[0] == '-')) {
                // increment
                var carry = 1
                for(var i = str1.length - 1; i >= (str1[0] == '-' ? 1 : 0); --i) {
                    if(carry == 0) { 
                        result = str1[i] + result
                        continue;
                    }
                    var num = (+str1[i]) + carry
                    result = (num%10).toString() + result
                    carry = Math.floor(num / 10)
                }
                if (carry == 1) {result = "1" + result}
                return (str1[0] == '-') ? '-' + result : result
            } 
            // decrement
            else {
                var decrement = true
                for(var i = str1.length - 1; i >= (str1[0] == '-' ? 1 : 0); --i) {
                    if(!decrement) { 
                        result = str1[i] + result
                        continue;
                    }
                    var num = (+str1[i]) - 1
                    decrement = num < 0 
                    if (num < 0) { num = 9 }
                    result = num.toString() + result
                }
                
                if ((str1[0] == '-' && result[0] == '0') || (result[0] == '0')) {
                    result = result.substring(1)
                } 
                return (str1[0] == '-') ? '-' + result : result
            }
        }
    }
}

module.exports = Simulator