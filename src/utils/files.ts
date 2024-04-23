import fs from "node:fs/promises";

export async function loadData(fileName) {
  const data = await fs.readFile(fileName, "utf8");
  console.log("Loaded data from the file");
  return JSON.parse(data);
}

export function exportData(fileName, content) {
  fs.writeFile(fileName, JSON.stringify(content), "utf8");
}
