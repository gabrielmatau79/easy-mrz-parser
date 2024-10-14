
# MRZParser

A JavaScript module for parsing Machine Readable Zone (MRZ) data from ID documents, such as passports, ID cards, and visas.
Supports MRZ formats TD1, TD2, and TD3.

## Supported Document Types

- **TD1**: ID cards with 3 lines, 30 characters each.
- **TD2**: ID cards with 2 lines, 36 characters each.
- **TD3**: Passports with 2 lines, 44 characters each.

## Installation

To install the package, use:

```bash
npm install mrz-parser
```

## Usage

Here's an example of how to use the `MRZParser` class to parse MRZ data:

```javascript
const MRZParser = require('mrz-parser');

const mrz = "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<
L898902C36UTO7408122F1204159ZE184226B<<<<<10";
const parser = new MRZParser(mrz);
const parsedData = parser.parse();

console.log("Extracted MRZ data with validation:", parsedData);
```

### Sample Output

This will log the parsed MRZ data:

```json
{
  "documentType": "P",
  "documentSubtype": "UTO",
  "issuingCountry": "UTO",
  "documentNumber": "L898902C3",
  "documentNumberCheck": 6,
  "birthDate": "1974-08-12",
  "birthDateCheck": 2,
  "expiryDate": "2012-04-15",
  "expiryDateCheck": 9,
  "nationality": "UTO",
  "lastName": "ERIKSSON",
  "firstName": "ANNA MARIA",
  "personalNumber": "ZE184226B",
  "personalNumberCheck": 1,
  "finalCheck": 0
}
```

### Methods

#### `parse()`

Parses the MRZ data and returns an object with fields like `documentType`, `documentNumber`, `expiryDate`, `lastName`, `firstName`, and validation results for each field's check digit.

#### `calculateCheckDigit(input)`

Utility function to calculate check digits for MRZ fields.

## GitHub Repository

The source code is available on GitHub. You can contribute to the project, report issues, or view the full documentation there.

### Cloning the Repository

To clone the repository and get started with development:

```bash
git clone https://github.com/yourusername/mrz-parser.git
cd mrz-parser
npm install
```

## License

MIT