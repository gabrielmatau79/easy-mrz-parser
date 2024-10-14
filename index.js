
class MRZParser {
    constructor(mrz) {
        this.mrz = mrz.replace(/\s+/g, ""); // Clean MRZ input by removing extra spaces
        console.log("MRZ after cleaning:", this.mrz);
        
    }

    parse() {
        let lines, format;

        // Determine MRZ format based on length and split accordingly
        if (this.mrz.length === 90) {
            lines = [this.mrz.slice(0, 30), this.mrz.slice(30, 60), this.mrz.slice(60, 90)];
            format = "TD1";
            console.log("Detected TD1 MRZ format (3 lines, 30 characters each).");
        } else if (this.mrz.length === 72) {
            lines = [this.mrz.slice(0, 36), this.mrz.slice(36, 72)];
            format = "TD2";
            console.log("Detected TD2 MRZ format (2 lines, 36 characters each).");
        } else if (this.mrz.length === 88) {
            lines = [this.mrz.slice(0, 44), this.mrz.slice(44, 88)];
            format = "TD3";
            console.log("Detected TD3 MRZ format (2 lines, 44 characters each).");
        } else {
            console.error("Invalid MRZ length for TD1, TD2, or TD3 formats. Expected 90, 72, or 88 characters.");
            console.log("MRZ legth:", this.mrz.length)
            return null;
        }

        // Define regex patterns for TD1, TD2, and TD3 MRZ formats
        const patterns = {
            TD1: /^(?<type>[A-Za-z]{1})(?<subtype>[A-Za-z<]{1})(?<issuingCountry>[A-Za-z]{3})(?<docNumber>[0-9A-Za-z<]{9})(?<docNumberCheck>[0-9]{1})(?<complement>[0-9a-zA-Z<]{15})\n(?<birthDate>[0-9]{6})(?<birthDateCheck>[0-9]{1})(?<sex>[mfMF]{1})(?<expiryDate>[0-9]{6})(?<expiryDateCheck>[0-9]{1})(?<nationality>[A-Za-z]{3})(?<optionalData>[a-zA-Z0-9<]{11})(?<lineCheck>[0-9]{1})\n(?<lastName>[A-Z]+)(?<lastName2><[A-Z]+){0,}<<(?<spacing>[<]{0,})(?<firstName>[A-Z]+)(?<middleName1><[A-Z]+){0,}(?<nameComplement>[a-zA-Z<]+){0,}$/,
            TD2: /^(?<type>[A|C|I][A-Z0-9<])(?<issuingCountry>[A-Z]{3})(?<lastName>[A-Z]+)(?<lastName2><[A-Z]+){0,}<<(?<firstName>[A-Z]+)(?<middleName><[A-Z]+){0,}<{0,}\n(?<docNumber>[A-Z0-9<]{9})(?<docNumberCheck>[0-9])(?<nationality>[A-Z]{3})(?<birthDate>[0-9]{6})(?<birthDateCheck>[0-9])(?<sex>[MFX<])(?<expiryDate>[0-9]{6})(?<expiryDateCheck>[0-9])(?<optionalData>[A-Z0-9<]{7})(?<finalCheck>[0-9])$/,
            TD3: /^(?<type>[A-Z])(?<subtype>[<A-Z])(?<issuingCountry>\w{3})(?<lastName>[A-Z]+)(?<lastName2><[A-Z]+){0,}<<(?<firstName>[A-Z]+)(?<middleName1><[A-Z]+){0,}(?<nameComplement><){0,}\n(?<docNumber>[\d\w]{9})(?<docNumberCheck>\d{1})(?<nationality>\w{3})(?<birthYear>\d{2})(?<birthMonth>\d{2})(?<birthDay>\d{2})(?<birthDateCheck>\d{1})(?<sex>[MF<]{1})(?<expiryYear>\d{2})(?<expiryMonth>\d{2})(?<expiryDay>\d{2})(?<expiryDateCheck>\d{1})(?<personalNumber>[\d\w<]{14})(?<personalNumberCheck>\d{1})(?<finalCheck>\d{1})$/
        };

        const mrzPattern = patterns[format];
        const fullMRZ = lines.join("\n");
        const match = fullMRZ.match(mrzPattern);

        if (!match) {
            console.error(`The provided MRZ does not match the expected ${format} format.`);
            return null;
        }

        const {
            type, subtype, issuingCountry, lastName, lastName2, firstName, middleName1, docNumber,
            docNumberCheck, birthYear, birthMonth, birthDay, birthDateCheck, sex, expiryYear,
            expiryMonth, expiryDay, expiryDateCheck, nationality, personalNumber, personalNumberCheck,
            finalCheck
        } = match.groups;

        const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;
        const expiryDate = `${expiryYear}-${expiryMonth}-${expiryDay}`;

        return {
            documentType: type || "Passport",
            documentSubtype: subtype || "",
            issuingCountry,
            documentNumber: docNumber,
            documentNumberCheck: parseInt(docNumberCheck),
            birthDate: birthDate,
            birthDateCheck: parseInt(birthDateCheck),
            expiryDate: expiryDate,
            expiryDateCheck: parseInt(expiryDateCheck),
            nationality,
            lastName: lastName.replace(/</g, " ") + (lastName2 ? lastName2.replace(/</g, " ") : ""),
            firstName: firstName.replace(/</g, " ") + (middleName1 ? middleName1.replace(/</g, " ") : ""),
            personalNumber: personalNumber || "",
            personalNumberCheck: personalNumberCheck ? parseInt(personalNumberCheck) : null,
            finalCheck: finalCheck ? parseInt(finalCheck) : null
        };
    }

    calculateCheckDigit(input) {
        if (typeof input !== "string") {
            console.error("Expected input to be a string, got:", typeof input, input);
            return null;
        }
        const weights = [7, 3, 1];
        const charValues = {
            "<": 0, ...Object.fromEntries(Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((c, i) => [c, i + 10])),
            ...Object.fromEntries(Array.from("0123456789").map((c, i) => [c, i]))
        };
        return input.split('').reduce((sum, char, index) => sum + (charValues[char] * weights[index % 3]), 0) % 10;
    }
}

module.exports = MRZParser;
