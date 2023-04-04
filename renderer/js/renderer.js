const chooseFileBtn = document.getElementById('chooseFileBtn');
const sendFileBtn = document.getElementById('sendFileBtn');
const selectedFile = document.getElementById('selectedFile');

const openOutputFolderBtn = document.getElementById('openOutputFolderBtn');
openOutputFolderBtn.style.display = 'none';

const spinner = document.getElementById('spinner');
spinner.style.display = 'none';

chooseFileBtn.addEventListener('click', () => {
  console.log("Button clicked")
  window.electron.ipcRenderer.send('open-file-dialog');
});

window.electron.ipcRenderer.on('selected-file', (filePath) => {
  const normalizedPath = filePath.replace(/\\/g, '/');
  console.log(`Selected file set to the file path ${normalizedPath}`)
  selectedFile.value = normalizedPath;
});

window.electron.ipcRenderer.on('script-finished', () => {
  console.log('script finished')
  spinner.style.display = 'none';
  openOutputFolderBtn.style.display = 'block'; // Show the button when the button is clicked
});

sendFileBtn.addEventListener('click', () => {
  console.log("Button clicked")

  // Send the file path to the main process and wait for the response
  window.electron.ipcRenderer.send('run-script', selectedFile.value);

  spinner.style.display = 'block'; // Show the spinner when the button is clicked
});

openOutputFolderBtn.addEventListener('click', () => {
  window.electron.ipcRenderer.send('open-output-folder');
});