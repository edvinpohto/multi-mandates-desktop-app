const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

function arrayToCSV(data) {
  // Find the maximum number of memberships among all candidates
  const maxMemberships = data.reduce((max, row) => Math.max(max, row.memberships.length), 0);

  // Create a header with separate columns for each membership
  const header = ['First Name', 'Last Name', 'Party Name', ...Array.from({ length: maxMemberships }, (_, i) => `Membership ${i + 1}`)];
  const csv = data.map(row => {
    return [
      row.firstName,
      row.lastName,
      row.nominatorName,
      ...row.memberships
    ].map(value => `"${value.replace(/"/g, '""')}"`).join(',');
  });
  csv.unshift(header.join(','));
  return csv.join('\r\n');
}

async function writeCSVFile(folderPath, fileName, data) {
  try {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Join the directory path and file name to create the full file path
    const filePath = path.join(folderPath, fileName);

    const csvContent = arrayToCSV(data);
    await writeFileAsync(filePath, csvContent);
  } catch (err) {
    console.error(err);
  }

}

module.exports = writeCSVFile;
