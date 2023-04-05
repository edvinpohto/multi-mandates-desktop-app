const fs = require('fs');
const { DOMParser } = require('xmldom');
const { promisify } = require('util');
const iconv = require('iconv-lite');
const writeCSVFile = require('./exportToCsv.js');

// Get the path from the command line environment (?)
const filePath = process.argv[2];

const readFileAsync = promisify(fs.readFile);

async function nodeLoadAndParseXML(filePath) {
  // Read the XML file with ISO-8859-1 encoding
  const buffer = await readFileAsync(filePath);
  // console.log(buffer)
  const xmlData = iconv.decode(buffer, 'ISO-8859-1');

  // Parse the XML data
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, 'application/xml');

  // Extract election type
  let electionType;
  const electionTypeLetter = xmlDoc.getElementsByTagName('data')[0].getAttribute('election-type');
  if (electionTypeLetter === 'E') {
    electionType = "MEMBER_OF_PARLIAMENT";
  } else if (electionTypeLetter === 'K') {
    electionType = "MUNICIPAL_COUNCILOR";
  } else if (electionTypeLetter === 'EPV') {
    electionType = "MEMBER_OF_EUROPEAN_PARLIAMENT";
  } else if (electionTypeLetter === 'AV') {
    electionType = "REGIONAL_COUNCILOR";
  } else {
    electionType = "";
  }

  // Extract candidate elements
  const candidateElements = xmlDoc.getElementsByTagName('candidate');

  // Initialize an array to store the extracted data
  // const candidates: Candidate[] = [];
  const candidates = [];

  // Iterate through candidate elements
  for (let i = 0; i < candidateElements.length; i++) {
    const candidate = candidateElements[i];
    const electedInformation = candidate.getAttribute("elected-information")

    // Only process candidates with elected-information="1"
    if (electedInformation === "1") {
      const firstName = candidate.getAttribute("first-name");
      const lastName = candidate.getAttribute("last-name");
      // Access the nominator element from the candidate element
      const nominator = candidate.parentNode;
      const nominatorName = nominator.getAttribute("name");

      // Extract membership elements
      const membershipElements = candidate.getElementsByTagName("membership");

      // Initialize an array to store memberships
      // const memberships: string[] = [];
      const memberships = [];

      // Iterate through membership elements
      for (let j = 0; j < membershipElements.length; j++) {
        const membership = membershipElements[j];
        const title = membership.getAttribute("title") ?? "";
        if (electionType !== title) {
          memberships.push(title);
        }
      }

      // Add the candidate's first name, last name, and memberships to the candidates array
      candidates.push({
        firstName,
        lastName,
        nominatorName,
        memberships,
      });
    }
  }

  // Log the extracted data
  // console.log(candidates.length);
  console.log(candidates);
  // console.log(nominators)


  // Use the writeCSVFile function to write the candidates array to a CSV file
  writeCSVFile('./scripts/results/candidates.csv', candidates)
    .then(() => console.log('CSV file has been written'))
    .catch(error => console.error('Error writing CSV file:', error));
}

// Change the filepath here to choose where the data is retrieved from
// Commented out here as it is called elsewhere
// nodeLoadAndParseXML('C:/Users/epo/Documents/vaalit_projekti/test-files/testFile.xml')
nodeLoadAndParseXML(filePath)