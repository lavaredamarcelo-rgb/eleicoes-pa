const xlsx = require('xlsx');
const workbook = xlsx.readFile('./temp-candidatos.xlsx');
const sheetNames = workbook.SheetNames;

console.log('Abas:', sheetNames);

sheetNames.forEach(sheet => {
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
  console.log(`\n=== ${sheet} ===`);
  if (data.length > 0) {
    console.log('Colunas:', Object.keys(data[0]));
    console.log('Primeiros 2:');
    data.slice(0, 2).forEach((row, i) => console.log(row));
  }
});
