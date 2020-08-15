/* SERVER */ 
var net = require('net');
var server = net.createServer();
let dataStore = '';

server.on('connection', (socket) => {
	console.log('Client connection made: %s', socket.remoteAddress);
	socket.on('data', (d) => {
		let dataString = d.toString('utf8');
		if (dataStore !== '') {
			dataString = dataStore.concat(dataString); // Append to existing data from previous input (if any)
		}
		if (dataString[dataString.length - 1] === '\n') { // Process statements only when end in \n
			let resultOperations = computeData(dataString); // Run user input through compute function
			let output = resultOperations.join('\n');
			socket.write(output);
			dataStore = ''; // reset data storage
		} else {
			dataStore = dataString; // add incomplete input to data storage
		}
	});

	socket.once('close', function() {
		console.log('Connection from %s closed.', socket.remoteAddress);
	});

	socket.on('error', function (err) {
		console.log("Connection error: %s", err.message);
	});
})

server.listen(3000, 'localhost', () => {
	console.log('Server listening to 3000 port');
});

/*--------------------------------------------------------------------------------------*/

/* COMPUTATION FUNCTIONS */

// Main computation function that handles and processes incoming data
function computeData(data) {
	let operationsArr = data.split("\n"); // get array of indiv operations
	if (operationsArr[operationsArr.length - 1] === '') {
		operationsArr.pop(); // removes last whitespace
	} 

	let computedArr = operationsArr.map(operation => {
		if (checkForLetter(operation) || hasWhiteSpace(operation) || checkDecimalMisc(operation)) {
			return 'Error: incorrect syntax'; // check for alphabetical characters, extra whitespace, non-integers
		} else if (operation.indexOf('/0') !== -1) {
			return 'Error: division by 0'; 
		} else if (operation.indexOf('%0') != -1) {
			return 'Error: mod by 0';
		} else if (!checkValidityExp(splitBySymbol(operation))) {
			return 'Error: incorrect syntax'; // checks for semantic validity of expression		
		}	
		return evaluate(operation);	// evaluate if all tests passed
	})

	return computedArr; // array of results
}

// Checks if expressions contain whitespace
function hasWhiteSpace(string) {
	for (char of string) {
		if (char === " ") {
			return true;
		}
	}
	return false;
}

// Check if character is a letter
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

// Check if expressions contain letters
function checkForLetter(str) {
	for (char of str) {
		if (isLetter(char)) {
			return true;
		}
	}
	return false;
}

// Split operation by numerical symbol to get individual numbers
function splitBySymbol(str) {
	return str.split(/(?<=[-+*/%])|(?=[-+*/%])/); // splits by symbol
}

// Check if expressions contain decimal or non-operator symbols
function checkDecimalMisc(op) {
	for (element of splitBySymbol(op)) {
		if (!element.match(/[-+*/%]/) && element % 1 != 0) {
			return true;
		}
	} 
	return false;
}

// Evaluate operation (adhere to semantics of 32 bit unsigned long numbers)
function evaluate(op) {
	if (eval(op) > 4294967295) {
		return (eval(op) % 4294967296); // Account for 'overflow numbers'
	} else if (eval(op) < 0) {
		return ((eval(op) % 4294967296) + 4294967296); // Account for 'overflow' numbers
	}
	return Math.floor(eval(op)); // Round down towards 0
}

// Takes array containing the separate elements of an expression and tests for semantic validity
function checkValidityExp(arr) {
	if (arr.length < 3) {
		return false; // If expression is incomplete - doesn't have 3 elements (num, sym, num)
	}
	if (!/\d/.test(arr[0]) || !/\d/.test(arr[2])) {
		return false; // check that expression starts and ends with numbers
	}
	return true;
}
