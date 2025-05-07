// src/app/utils/parser.ts (continued)
// src/app/utils/parser.ts (or your chosen file name)

// 1) Row detector: is there a '|' … later another '|' ?
function isMarkdownTableRow(line: string): boolean {
  const first = line.indexOf('|');
  const last = line.lastIndexOf('|');
  return first !== -1 && last !== -1 && last > first;
}

// 2) Separator detector: same, but the between-pipes must only be -, :, | or space
function isMarkdownTableSeparator(line: string): boolean {
  const first = line.indexOf('|');
  const last = line.lastIndexOf('|');
  if (first === -1 || last === -1 || last <= first) return false;
  const between = line.slice(first + 1, last).trim();
  return /^[\s|:-]+$/.test(between);
}

// 3) Table parser: slice out header, then each data row
function parseMarkdownTable(lines: string[]): { data: any[] } | null {
  if (lines.length < 2) return null;
  if (!isMarkdownTableRow(lines[0]) || !isMarkdownTableSeparator(lines[1])) return null;

  // extract headers
  const hFirst = lines[0].indexOf('|');
  const hLast = lines[0].lastIndexOf('|');
  const headers = lines[0]
    .slice(hFirst + 1, hLast)
    .split('|')
    .map(h => h.trim());

  // extract each data row
  const data = lines
    .slice(2)
    .filter(isMarkdownTableRow)
    .map(row => {
      const rFirst = row.indexOf('|');
      const rLast = row.lastIndexOf('|');
      const cells = row
        .slice(rFirst + 1, rLast)
        .split('|')
        .map(c => c.trim());

      // build object (missing cells → empty string)
      const obj: Record<string, string> = {};
      headers.forEach((hdr, i) => {
        obj[hdr] = cells[i] ?? '';
      });
      return obj;
    });

  return { data };
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