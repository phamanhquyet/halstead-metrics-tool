function displayResults(id, filename, code, metrics) {
  // const resultsContainer = document.createElement('div');
  // resultsContainer.setAttribute('id', 'results');
  const resultsContainer = document.querySelector(id);
  resultsContainer.style.display = 'block';

  // Clear previous results
  resultsContainer.innerHTML = '';

  // Create table element
  const table = document.createElement('table');
  table.classList.add('results-table');

  // Create table headers
  const headers = ['Metric', 'Value'];
  const headerRow = document.createElement('tr');
  for (const header of headers) {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Create table rows for each metric
  const metricsData = [
    { label: 'Filename', value: filename },
    { label: 'Programming Language', value: metrics.language },
    { label: 'n1 (number of distinct operands)', value: metrics.n1 },
    { label: 'n2 (number of distinct operators)', value: metrics.n2 },
    { label: 'N (total number of operands and operators combined)', value: metrics.N },
    { label: 'n (total number of unique operators and operands)', value: metrics.n },
    { label: 'Difficulty ((n1/2) * (N2/n2))', value: metrics.difficulty },
    { label: 'Volume (N*log2(n))', value: metrics.volume },
    { label: 'Effort (Volume*Difficulty)', value: metrics.effort },
    { label: 'Time (effort / 18)', value: metrics.time + ' seconds' },
  ];

  for (const metric of metricsData) {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    const valueCell = document.createElement('td');
    labelCell.textContent = metric.label;
    valueCell.textContent = metric.value;
    row.appendChild(labelCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  }

  // Append the table to the results container
  resultsContainer.appendChild(table);

  // The formula "time = effort / 18" is derived from the empirical observation made by Maurice H. Halstead,
  // the creator of Halstead metrics.
  // In his research, Halstead proposed that effort can be estimated based on the number of operators and operands in a program.
  // He suggested that the effort required to write a program is proportional to the product of program length (N) and program difficulty (D).

  // Create the export button
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export to Excel';
  exportButton.addEventListener('click', () => exportToExcel(filename, code, metrics));
  resultsContainer.appendChild(exportButton);
}

function exportToExcel(filename, code, metrics) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Filename', 'Code', 'n1', 'n2', 'N', 'n', 'Difficulty', 'Volume', 'Effort', 'Time'],
    [filename, code, metrics.n1, metrics.n2, metrics.N, metrics.n, metrics.difficulty, metrics.volume, metrics.effort, metrics.time],
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
  XLSX.writeFile(workbook, 'results.xlsx');
}

export { displayResults, exportToExcel };
