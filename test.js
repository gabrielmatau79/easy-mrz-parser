const MRZParser = require('./index');
//MRZ TD3 
const mrz = "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<L898902C36UTO7408122F1204159ZE184226B<<<<<10";
const parser = new MRZParser(mrz);
const parsedData = parser.parse();

console.log("Extracted MRZ data with validation:", parsedData);