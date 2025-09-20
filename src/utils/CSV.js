import { translationsStore } from "@/stores";

function parseCSV(csvText) {
  const lines = csvText.split("\n");
  // Parse headers (language codes)
  const headers = lines[0].split(",").map((h) => h.trim());
  const languages = headers.slice(1); // Skip the first empty header
  let values = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    let cells = [];
    let currentCell = "";
    let insideQuotes = false;

    // Parse CSV line considering quoted values
    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        // Remove surrounding quotes if present and add to cells
        cells.push(currentCell.trim().replace(/^"(.*)"$/, "$1"));
        currentCell = "";
      } else {
        currentCell += char;
      }
    }

    // Add the last cell
    cells.push(currentCell.trim().replace(/^"(.*)"$/, "$1"));

    // if (cells.length < 1) continue;
    values.push(cells);
  }
  return { languages, values };
}

function stringsFromCSV(csvData) {
  const { languages, values } = parseCSV(csvData);

  // Import languages
  languages.forEach((lang) => translationsStore.methods.addLanguage(lang));

  // Import strings
  values.forEach((line) => {
    const stringLabel = line[0];
    if (stringLabel) {
      const strings = line.slice(1);
      const translations = {};
      languages.forEach((l, i) => {
        translations[l] = strings[i];
      });
      translationsStore.methods.addTranslation(stringLabel, translations);
    }
  });
}

function stringsToCSV(labelStore, stringTable) {
  // Get all unique language codes
  const languageCodes = new Set();
  Object.values(stringTable).forEach((translations) => {
    Object.keys(translations).forEach((lang) => languageCodes.add(lang));
  });

  // Convert Set to Array and sort
  const languages = Array.from(languageCodes).sort();

  // Create CSV content
  let csvContent = "";

  // Create header row (first cell is empty)
  csvContent += "Key,";
  csvContent += languages.join(",") + "\n";

  // Create data rows
  Object.entries(labelStore).forEach(([id, label]) => {
    // Add label in first column (quote if contains comma)
    const formattedLabel = label.includes(",") ? `"${label}"` : label;
    csvContent += formattedLabel + ",";

    // Add translations for each language (quote if contains comma)
    const translations = stringTable[id] || {};
    const rowData = languages.map((lang) => {
      const text = translations[lang] || "";
      return text.includes(",") ? `"${text}"` : text;
    });

    csvContent += rowData.join(",") + "\n";
  });
  console.log(csvContent);
  return csvContent;
}

export { stringsFromCSV, stringsToCSV };
