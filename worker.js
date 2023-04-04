const { parentPort } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');

parentPort.on('message', (filePath) => {
  // Replace 'your-script.js' with the name of your Node.js script
//   const scriptPath = path.join(__dirname, 'your-script.js');
  const scriptPath = path.join('./scripts/', 'nodeXmlParser.js');
  const script = spawn('node', ['--experimental-modules', scriptPath, filePath]);

  script.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  script.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  script.on('close', (code) => {
    console.log(`child process (from worker) exited with code ${code}`);
    parentPort.postMessage('script-finished'); // Post the message when the script has closed
  });
});
