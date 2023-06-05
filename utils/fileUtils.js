function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (event) => reject(new Error('Error reading file.'));
    reader.readAsText(file);
  });
}

export { readFile };
