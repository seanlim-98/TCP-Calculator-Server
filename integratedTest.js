/* Note: all test strings are in ASCII; every expression is chained together in a string separated by \n chars
The test strings were created to test as many successful operation and error scenarios. Expected outputs 
are written in comments. */

let testString1 = '1+1\n8-2\n13*24\n56/8\n57%9\n' // String with valid, basic arithmetic functions
let testString2 = '1+1\n9-2hello\n13* 24\n5.6/8\n57%9\n' /* String with alphabet, white space 
															and decimals in middle 3 expressions */
let testString3 = '3+2\n9%0\n12/0\n56/8\n3++\n' /* String with mod by 0 and div by 0, and incorrect semantic 
												form (e.g. '3++') in 2nd, 3rd, 5th expressions respectively */

function computeData(string) {
	let operationsArr = string.split("\n"); // get array of indiv operations
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

console.log(computeData(testString1)); // [2, 6, 312, 7, 3]
console.log(computeData(testString2)); /* [2, "Error: incorrect syntax", "Error: incorrect syntax", 
										"Error: incorrect syntax"], 3] */
console.log(computeData(testString3)); /* [5, "Error: mod by 0", "Error: division by 0", 7, "Error: incorrect syntax"] */


/*---------------------------------------------------------------------------------------*/

// Functions below were tested in the unit testing file (unitTest.js)

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
	return str.split(/(?<=[-+*/%])|(?=[-+*/%])/);
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