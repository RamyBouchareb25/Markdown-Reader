import { open, save } from "@tauri-apps/plugin-dialog";
import { FileHandle, open as openFile } from "@tauri-apps/plugin-fs";

export const saveFile = async (data: string, path: string) => {
  const file = await openFile(path, {
    write: true,
    create: true,
  });
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  await file.write(encodedData);
  await file.close();
};

export const saveFileAs = async (data: string) => {
  const filePath = await save({
    defaultPath: "untitled.md",
    filters: [{ name: "Markdown", extensions: ["md"] }],
    title: "Save markdown file",
  });
  if (filePath === null) return;
  const file = await openFile(filePath, {
    write: true,
    create: true,
  });
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  await file.write(encodedData);
  await file.close();
};

export const loadFromFile = async () => {
  const path = await open({
    filters: [{ name: "Markdown", extensions: ["md"] }],
    multiple: false,
    title: "Select a markdown file",
  });
  if (path === null) return;
  const fileName = path.split("\\").pop();
  const file = await openFile(path, {
    read: true,
    write: true,
  });
  const data = await readFile(file);
  if (!fileName) return;
  return { data, fileName, path };
};

async function readFile(file: FileHandle) {
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
  return jsonData
    .replace(/\\$/gm, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\s/g, " ");
}
