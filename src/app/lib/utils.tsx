import { open } from "@tauri-apps/plugin-dialog";
import { FileHandle, open as openFile } from "@tauri-apps/plugin-fs";

export const loadFromFile = async () => {
  const path = await open({
    filters: [{ name: "Markdown", extensions: ["md"] }],
    multiple: false,
    title: "Select a markdown file",
  });
  if (path === null) return;
  const file = await openFile(path, {
    read: true,
    write: true,
  });
  const data = await readFile(file);
  return data;
};

export const transformMarkdownToText = (markdown: string) => {
  return markdown.replace(/[#*`]/g, "");
};

export async function readFile(file: FileHandle) {
  let buffer = new Uint8Array(1024); // Start with an initial size
  let totalBytesRead = 0;

  while (true) {
    const chunk = new Uint8Array(1024);
    const chunkBytesRead = await file.read(chunk);
    if (!chunkBytesRead) break; // End of file

    // Resize buffer if necessary
    if (totalBytesRead + chunkBytesRead > buffer.length) {
      const newBuffer = new Uint8Array(buffer.length * 2);
      newBuffer.set(buffer);
      buffer = newBuffer;
    }

    buffer.set(chunk.subarray(0, chunkBytesRead), totalBytesRead);
    totalBytesRead += chunkBytesRead;
  }

  const finalBuffer = buffer.subarray(0, totalBytesRead);
  const jsonData = new TextDecoder().decode(finalBuffer);
  await file.close();
  return jsonData;
}
