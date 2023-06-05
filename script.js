import { readFile } from './utils/fileUtils.js';
import { displayResults } from './utils/displayUtils.js';
import { detectLanguage } from './utils/languageUtils.js';
import { calculateHalsteadMetrics } from './utils/metricsUtils.js';

async function handleFileUpload(event) {
  event.preventDefault();
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file.');
    return;
  }

  try {
    textarea.value = '';
    const code = await readFile(file);
    const language = detectLanguage(code);
    const metrics = calculateHalsteadMetrics(code, language);
    displayResults('.results_display_0', file.name, code, metrics);
    displayCode('.item_display_0', code);
  } catch (error) {
    alert(`An error occurred while reading the file: ${error.message}`);
  }
}

async function handleFolderUpload(event) {
  event.preventDefault();
  const folderInput = document.getElementById('folder-input');
  const files = folderInput.files;
  if (files.length === 0) {
    alert('Please select a folder.');
    return;
  }

  const resultsContainer = document.getElementById('results-wrapper');
  resultsContainer.innerHTML = ''; // Clear previous results
  let temp = '';
  for (let i = 0; i < files.length; i++) {
    temp += `<div class="results-wrapper-item">
        <div id="code-display" class="language-none item_display_${i}"></div>
        <div id="results" class="item_results_${i}"></div>
        </div>`;
  }
  console.log(temp);
  resultsContainer.innerHTML = temp;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.type !== 'text/javascript' && file.type !== 'text/java' && file.type !== 'text/plain') {
      alert(`Invalid file type: ${file.name}`);
      continue;
    }

    try {
      const code = await readFile(file);
      const language = detectLanguage(code);
      const metrics = calculateHalsteadMetrics(code, language);
      displayResults(`.item_results_${i}`, file.name, code, metrics);
      displayCode(`.item_display_${i}`, code);
    } catch (error) {
      alert(`An error occurred while reading the file: ${error.message}`);
    }
  }
}

function displayCode(id, code) {
  console.log('code:', code);
  const codeDisplay = document.querySelector(id);
  codeDisplay.innerHTML = `<pre><code class="language-javascript">${Prism.highlight(code, Prism.languages.javascript, 'javascript')}</code></pre>`;
}

const form = document.querySelector('form');
const textarea = form.querySelector('textarea');
const fileInput = form.querySelector('input[type="file"]');
const results = document.querySelector('#results');
const exportButton = document.getElementById('export-button');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const code = textarea.value.trim();
  if (!code) {
    alert('Please enter some code.');
    return;
  }
  try {
    // document.getElementById('code-display').style.display = 'none';
    document.getElementById('code-display').innerHTML = ' ';
    const language = detectLanguage(code);
    const metrics = calculateHalsteadMetrics(code, language);
    displayResults('.results_display_0', null, null, metrics);
  } catch (error) {
    alert(`An error occurred: ${error.message}`);
  }
});

fileInput.addEventListener('change', handleFileUpload);
// exportButton.addEventListener('click', exportToPDF);

const folderUploadButton = document.getElementById('upload-folder');
folderUploadButton.addEventListener('click', handleFolderUpload);

const folderInput = document.getElementById('folder-input');
folderInput.addEventListener('change', handleFolderUpload);
