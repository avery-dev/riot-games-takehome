const Simulator = require('../simulator');

var simulator = new Simulator()

test('Test cellIsAliveNextGeneration with dead unit that will revive', () => {
    /*
        Not going to mock fs as it's a huge hassle.
        Initial state:
        [
            [ '0', '0' ],
            [ '0', '2' ],
            [ '2', '0' ]
        ]
    */
        simulator.coordinates = { '0': [ '0', '2' ], '2': [ '0' ] }
        expect(simulator.cellIsAliveNextGeneration('1', '1', true)).toBe(true)
})

test('Test cellIsAliveNextGeneration with Glider Pattern', () => {
    // 
    /*
        Not going to mock fs as it's a huge hassle.
        Glider Pattern
        Initial state:
        [
            [ '0', '0' ],
            [ '1', '0' ],
            [ '1', '2' ],
            [ '2', '0' ],
            [ '2', '1' ]
        ]
    */
    simulator.coordinates = { '0': [ '0' ], '1': [ '0', '2' ], '2': [ '0', '1' ] }
    
    expect(simulator.cellIsAliveNextGeneration('0', '1', true)).toBe(true)
    expect(simulator.cellIsAliveNextGeneration('1', '-1', true)).toBe(true)
    expect(simulator.cellIsAliveNextGeneration('1', '0', true)).toBe(true)
    expect(simulator.cellIsAliveNextGeneration('2', '0', true)).toBe(true)
    expect(simulator.cellIsAliveNextGeneration('2', '1', true)).toBe(true)
    expect(simulator.cellIsAliveNextGeneration('0', '0', true)).toBe(false)
    expect(simulator.cellIsAliveNextGeneration('10', '10', true)).toBe(false)
})

test('Test simulate() -  a board that will all be dead next generation', () => {
    /*
        Not going to mock fs as it's a huge hassle.
        Initial state:
        [
            [ '0', '0' ],
            [ '0', '2' ],
            [ '2', '0' ],
            [ '2', '2' ]
        ]
    */
    simulator.coordinates = { '0': [ '0', '2' ], '2': [ '0', '2' ] }
    simulator.simulate()
    expect(Object.keys(simulator.coordinates).length).toBe(0)
})

test('Test simulate() - with Glider Pattern (Big Numbers)', () => {
    // 
    /*
        Not going to mock fs as it's a huge hassle.
        Glider Pattern
        Initial state:
        [
            [ '1000000000000000000000000', '0' ],
            [ '1000000000000000000000001', '0' ],
            [ '1000000000000000000000001', '2' ],
            [ '1000000000000000000000002', '0' ],
            [ '1000000000000000000000002', '1' ]
        ]
    */
    simulator.coordinates = { '1000000000000000000000000': [ '0' ], '1000000000000000000000001': [ '0', '2' ], '1000000000000000000000002': [ '0', '1' ] }
    simulator.simulate()

    expect(Object.keys(simulator.coordinates).length).toEqual(3);
    expect(simulator.coordinates["1000000000000000000000000"]).toEqual(expect.arrayContaining(['1']));
    expect(simulator.coordinates["1000000000000000000000001"]).toEqual(expect.arrayContaining(['-1', '0']));
    expect(simulator.coordinates["1000000000000000000000002"]).toEqual(expect.arrayContaining(['0', '1']));
})

test('Test simulate() -  Reviving a dead unit', () => {
    /*
        Not going to mock fs as it's a huge hassle.
        Initial state:
        [
            [ '0', '0' ],
            [ '0', '2' ],
            [ '2', '0' ]
        ]
    */
    simulator.coordinates = { '0': [ '0', '2' ], '2': [ '0' ] }
    simulator.simulate()
    expect(Object.keys(simulator.coordinates).length).toBe(1)
    expect(simulator.coordinates["1"]).toEqual(expect.arrayContaining(['1']));
})


test('Test add (-1 + 1) = 0', () => {
    expect(simulator.add("-1", "1")).toBe("0")
})

test('Test add (0 + -1) = -1', () => {
    expect(simulator.add("0", "-1")).toBe("-1")
})

test('Test add (0 + 1) = 1', () => {
    expect(simulator.add("0", "1")).toBe("1")
})

test('Test add (123 + -1) = 122', () => {
    expect(simulator.add("123", "-1")).toBe("122")
})

test('Test add (100 + 1) = 101', () => {
    expect(simulator.add("100", "1")).toBe("101")
})

test('Test add (100 + -1) = 99', () => {
    expect(simulator.add("100", "-1")).toBe("99")
})
test('Test add (-100 + 1) = -99', () => {
    expect(simulator.add("-100", "1")).toBe("-99")
})

test('Test add (-100 + -1) = -101', () => {
    expect(simulator.add("-100", "-1")).toBe("-101")
})

test('Big Number Test - add (10000000000000000000 + 1) = 10000000000000000001', () => {
    expect(simulator.add("10000000000000000000", "1")).toBe("10000000000000000001")
})

test('Big Number Test - add (10000000000000000000 + -1) = 9999999999999999999', () => {
    expect(simulator.add("10000000000000000000", "-1")).toBe("9999999999999999999")
})

test('Big Number Test - add (-10000000000000000000 + 1) = -9999999999999999999', () => {
    expect(simulator.add("-10000000000000000000", "1")).toBe("-9999999999999999999")
})

test('Big Number Test - add (-10000000000000000000 + -1) = -10000000000000000001', () => {
    expect(simulator.add("-10000000000000000000", "-1")).toBe("-10000000000000000001")
})