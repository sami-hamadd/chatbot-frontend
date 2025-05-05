// src/app/utils/parser.ts (continued)
// src/app/utils/parser.ts (or your chosen file name)

// Helper to check if a line looks like a Markdown table row (| col | col |)
function isMarkdownTableRow(line: string): boolean {
  const trimmed = line.trim();
  // Ensure it starts and ends with '|' and has at least one '|' inside
  return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2 && trimmed.slice(1, -1).includes('|');
}

// Helper to check if a line is a Markdown table separator (|---|---|)
function isMarkdownTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  // Must be a table row, and the content between pipes must only be '-', ':', or '|' and spaces
  return isMarkdownTableRow(line) && /^[|:-\s]+$/.test(trimmed.slice(1, -1));
}

// Helper to parse the collected markdown table lines into structured data
// Output format matches what DynamicTable expects via convertJsonToTableData
function parseMarkdownTable(lines: string[]): { data: any[] } | null {
  if (lines.length < 2 || !isMarkdownTableRow(lines[0]) || !isMarkdownTableSeparator(lines[1])) {
    // Needs at least a valid header and separator
    return null;
  }

  const headerLine = lines[0];
  const dataLines = lines.slice(2).filter(line => isMarkdownTableRow(line)); // Only process valid data rows

  // Extract headers: split by '|', trim, filter out empty strings resulting from start/end pipes
  const headers = headerLine.split('|')
    .map(h => h.trim())
    .filter((h, index, arr) => h !== '' || (index > 0 && index < arr.length - 1)); // Keep only non-empty segments between pipes

  if (headers.length === 0) return null; // No valid headers found

  // Parse data rows
  const tableData = dataLines.map(rowLine => {
    // Extract cells: split by '|', trim, filter out empty strings from start/end pipes
    const cells = rowLine.split('|')
      .map(c => c.trim())
      .filter((c, index, arr) => index > 0 && index < arr.length - 1); // Keep only segments between pipes

    const rowObj: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      // Handle cases where a row might have fewer columns than the header
      rowObj[header] = cells[index] !== undefined ? cells[index] : '';
    });
    return rowObj;
  });

  // Return in the format expected by DynamicTable (similar to convertJsonToTableData output)
  return { data: tableData };
}

// ... (Keep convertJsonToTableData and the modified parseFinalReply below)
export function parseFinalReply(content: string): { type: 'table' | 'json' | 'text'; content: any }[] {
  const parts: { type: 'table' | 'json' | 'text'; content: any }[] = [];
  // Normalize line breaks and split
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  let currentText = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 1. Check for JSON block start
    if (trimmedLine.startsWith("```json")) {
      if (currentText.trim() !== "") {
        parts.push({ type: 'text', content: currentText.trimEnd() }); // Trim trailing newline
        currentText = "";
      }
      const jsonLines: string[] = [];
      i++; // Move past ```json
      while (i < lines.length && lines[i].trim() !== "```") {
        jsonLines.push(lines[i]);
        i++;
      }
      // Process the captured JSON block
      let jsonString = jsonLines.join("\n").replace(/\bNaN\b/g, 'null');
      try {
        const jsonParsed = JSON.parse(jsonString);
        parts.push({ type: 'json', content: jsonParsed });
      } catch (err) {
        // Keep invalid JSON as text for display
        parts.push({ type: 'text', content: "```json\n" + jsonLines.join("\n") + "\n```" });
        console.error("Invalid JSON block encountered:", err);
      }
      if (i < lines.length) i++; // Move past closing ```
      continue; // Process next line/block
    }

    // 2. Check for Markdown Table start
    // Look ahead one line to see if it's a separator
    if (isMarkdownTableRow(line) && (i + 1 < lines.length) && isMarkdownTableSeparator(lines[i + 1])) {
      if (currentText.trim() !== "") {
        parts.push({ type: 'text', content: currentText.trimEnd() }); // Trim trailing newline
        currentText = "";
      }
      const tableLines: string[] = [line]; // Start with header
      i++; // Move to separator
      tableLines.push(lines[i]); // Add separator
      i++; // Move to first potential data row

      // Collect all subsequent valid table rows
      while (i < lines.length && isMarkdownTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }

      // Parse the collected table lines
      const parsedTable = parseMarkdownTable(tableLines);
      if (parsedTable && parsedTable.data.length > 0) {
        // Push the structured table data
        parts.push({ type: 'table', content: parsedTable });
      } else {
        // If parsing fails or table is empty, treat the lines as plain text
        currentText += tableLines.join('\n') + '\n';
      }
      continue; // Continue main loop from the line after the table
    }

    // 3. If it's not a special block, accumulate as plain text
    // Add the newline back unless it's the very last line and empty
    currentText += line + ((i < lines.length - 1 || line !== '') ? '\n' : '');
    i++;
  }

  // Add any remaining accumulated text
  if (currentText.trim()) {
    parts.push({ type: 'text', content: currentText.trimEnd() });
  }

  // If the entire content was just an empty string or whitespace,
  // ensure we return at least one empty text part if parts is empty.
  if (parts.length === 0 && content.trim() === '') {
    parts.push({ type: 'text', content: '' });
  }


  return parts;
}

// Keep this function as DynamicTable uses it for JSON parts
export function convertJsonToTableData(json: any): any[] {
  // Ensure it handles cases where json or json.data might not exist or not be an array
  if (json && typeof json === 'object' && Array.isArray(json.data)) {
    return json.data;
  }
  // Handle case where the JSON itself might be the array
  if (Array.isArray(json)) {
    return json;
  }
  return []; // Default to empty array if structure is unexpected
}