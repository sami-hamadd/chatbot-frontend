export function parseFinalReply(content: string) {
  const parts: { type: 'json' | 'text'; content: any }[] = [];
  const lines = content.split(/\r?\n/);
  let inJsonBlock = false;
  let jsonLines: string[] = [];
  let currentText = "";

  for (const line of lines) {
    if (inJsonBlock) {
      if (line.trim() === "```") {
        inJsonBlock = false;
        let jsonString = jsonLines.join("\n");

        // Replace NaN with null (safely)
        jsonString = jsonString.replace(/\bNaN\b/g, 'null');

        try {
          const jsonParsed = JSON.parse(jsonString);
          parts.push({ type: 'json', content: jsonParsed });
        } catch (err) {
          parts.push({ type: 'text', content: "⚠️ Invalid JSON block:\n" + jsonString });
        }
        jsonLines = [];
      } else {
        jsonLines.push(line);
      }
    } else {
      if (line.trim().startsWith("```json")) {
        if (currentText.trim() !== "") {
          parts.push({ type: 'text', content: currentText.trim() });
          currentText = "";
        }
        inJsonBlock = true;
      } else {
        currentText += line + "\n";
      }
    }
  }

  if (currentText.trim()) {
    parts.push({ type: 'text', content: currentText.trim() });
  }

  return parts;
}
export function convertJsonToTableData(json: any) {
  return Array.isArray(json?.data) ? json.data : [];
}