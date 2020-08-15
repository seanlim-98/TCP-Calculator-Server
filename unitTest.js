/*UNIT TESTING - comment out units not being tested*/
/* In this file, I tested out each unit of functions/associated functions individually. 
These units were then used in my larger computeData function which I tested only 
after testing all units individually. The testing for the computeData function was an
integrated test done in a separate testing file, interatedTest.js */

// UNIT 1 - hasWhiteSpace
// Takes string and check if there is white space
function hasWhiteSpace(string) {
	for (char of string) {
		if (char === " ") {
			return true;
		}
	}
	return false;
}
console.log(hasWhiteSpace('1+1')); // false
console.log(hasWhiteSpace('1 + 1')); // true
console.log(hasWhiteSoace('   1+1')); // true

/*-------------------------------------------------------------------*/

// UNIT 2 - isLetter, checkForLetter
// Takes string and checks if it is an alphabet
function isLetter(str) {
	if (str.length === 1 && str.match(/[a-z]/i)) {
		return true;
	} else {
		return false;
	}
}
console.log(isLetter('a')); // true
console.log(isLetter('b')); // true
console.log(isLetter('1')); // false
console.log(isLetter('%')); // false

// Uses isLetter function and checks if a string contains letters
function checkForLetter(str) {
	for (char of str) {
		if (isLetter(char)) {
			return true;
		}
	}
	return false;
}
console.log(checkForLetter('teststring')); // true
console.log(checkForLetter('12345')); // false
console.log(checkForLetter('128df')); // true
console.log(checkForLetter('0.5')); // false

/*-------------------------------------------------------------------*/

// UNIT 3 - splitBySymbol, checkDecimalMisc
// Split expression to get array of individual elements of expressions 
function splitBySymbol(str) {
	return str.split(/(?<=[-+*/%])|(?=[-+*/%])/); // splits by symbol
}
console.log(splitBySymbol('1+1')); // ["1", "+", "1"]
console.log(splitBySymbol('45*29')); // ["45", "*", "29"]
console.log(splitBySymbol('9/0')); // ["9", "/", "0"]
console.log(splitBySymbol('10%0')); // ["10", "%", "0"]

// Uses splitBySymbol and after spltting expression, check if they contain decimal or non-operator symbols
function checkDecimalMisc(op) {
	for (element of splitBySymbol(op)) {
		if (!element.match(/[-+*/%]/) && element % 1 != 0) {
			return true;
		}
	} 
	return false;
}
console.log(checkDecimalMisc('1+1')); // false
console.log(checkDecimalMisc('45*29')); // false
console.log(checkDecimalMisc('9.1/0')); // true
console.log(checkDecimalMisc('10$0')); // true

/*-------------------------------------------------------------------*/

// UNIT 4 - evaluate
// Evaluate expressions whilst following semantics of 32 bit unsigned long numbers
function evaluate(op) {
	if (eval(op) > 4294967295) {
		return (eval(op) % 4294967296); // Account for 'overflow numbers'
	} else if (eval(op) < 0) {
		return ((eval(op) % 4294967296) + 4294967296); // Account for 'underflow' numbers
	}
	return Math.floor(eval(op)); // Round down
}
console.log(evaluate('3+3')); // 6
console.log(evaluate('12*13')); // 156
console.log(evaluate('14/2')); // 7
console.log(evaluate('80%3')); // 2
console.log(evaluate('3-4')); // 4294967295
console.log(evaluate('4294967295+1')); // 0

/*-------------------------------------------------------------------*/

// UNIT 5 - checkValidityExp
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
console.log(checkValidityExp(['1', '*', '2'])); // true
console.log(checkValidityExp(['10', '%', '3'])); // true
console.log(checkValidityExp(['1', '+', '+'])); // false
console.log(checkValidityExp(['1', '+', '\n'])); // false
