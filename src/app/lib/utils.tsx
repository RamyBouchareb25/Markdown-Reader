import { open } from "@tauri-apps/plugin-dialog";
import { FileHandle, open as openFile } from "@tauri-apps/plugin-fs";
import {
  Anchor,
  Code,
  Em,
  Header1,
  Header2,
  Header3,
  InlineCode,
  Paragraph,
  Strong,
} from "./custom-html";
import { Fragment } from "react";

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
  console.log(data);
  return data;
};

// export const transformMarkdownToText = (markdown: string) => {
//   const lines = markdown.split("\n");
//   const elements = lines.map((line, index) => {
//     if (/^# /.test(line)) {
//       return <Header1 key={index}>{line.replace(/^# /, "")}</Header1>;
//     } else if (/^## /.test(line)) {
//       return <Header2 key={index}>{line.replace(/^## /, "")}</Header2>;
//     } else if (/^### /.test(line)) {
//       return <Header3 key={index}>{line.replace(/^### /, "")}</Header3>;
//     } else if (/\*\*(\S(.*?\S)?)\*\*/gim.test(line)) {
//       return (
//         <Paragraph key={index}>
//           {line
//             .split(/(\*\*(\S(.*?\S)?)\*\*)/gim)
//             .map((part, i) =>
//               /\*\*(\S(.*?\S)?)\*\*/gim.test(part) ? (
//                 <Strong key={i}>{part.replace(/\*\*/g, "")}</Strong>
//               ) : undefined
//             )}
//         </Paragraph>
//       );
//     } else if (/`([^`]+)`/gim.test(line)) {
//       return (
//         <Fragment key={index}>
//           {line
//             .split(/(`[^`]+`)/g)
//             .map((part, i) =>
//               /`[^`]+`/g.test(part) ? (
//                 <Code
//                   key={i}
//                   code={part.replace(/`/g, "").trim()}
//                   language="sh"
//                 />
//               ) : (
//                 part
//               )
//             )}
//         </Fragment>
//       );
//     } else if (/\*(\S(.*?\S)?)\*/gim.test(line)) {
//       return (
//         <Paragraph key={index}>
//           {line
//             .split(/(\*\S(.*?\S)?\*)/gim)
//             .map((part, i) =>
//               /\*\S(.*?\S)?\*/gim.test(part) ? (
//                 <Em key={i}>{part.replace(/\*/g, "")}</Em>
//               ) : undefined
//             )}
//         </Paragraph>
//       );
//     } else if (line.trim() === "") {
//       return <Paragraph key={index} style={{ height: "1lh" }}></Paragraph>;
//     } else {
//       return <Paragraph key={index}>{line}</Paragraph>;
//     }
//   });

//   return elements;
// };
const parseInlineElements = (text: string) => {
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  const elements: (string | React.JSX.Element)[] = [];
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(text)) !== null) {
    // Add the text before the match
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    // Handle valid markdown matches
    if (match[1]?.startsWith("**") && match[2]) {
      elements.push(<Strong key={elements.length}>{match[2]}</Strong>);
    } else if (match[1]?.startsWith("*") && match[3]) {
      elements.push(<Em key={elements.length}>{match[3]}</Em>);
    } else if (match[1]?.startsWith("`") && match[4]) {
      elements.push(<InlineCode key={elements.length}>{match[4]}</InlineCode>);
    } else if (match[1]?.startsWith("[") && match[5] && match[6]) {
      elements.push(
        <Anchor key={elements.length} href={match[6]}>
          {match[5]}
        </Anchor>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
};

export const transformMarkdownToText = (markdown: string) => {
  const lines = markdown.split("\n");
  console.log(lines);
  const elements = lines.map((line, index) => {
    const parsedElements = parseInlineElements(line);
    const containsCode =
      Array.isArray(parsedElements) &&
      parsedElements.some(
        (element) => (element as React.JSX.Element)?.type === Code
      );

    if (/^# /.test(line)) {
      return (
        <Header1 key={index}>
          {parseInlineElements(line.replace(/^# /, ""))}
        </Header1>
      );
    } else if (/^## /.test(line)) {
      return (
        <Header2 key={index}>
          {parseInlineElements(line.replace(/^## /, ""))}
        </Header2>
      );
    } else if (/^### /.test(line)) {
      return (
        <Header3 key={index}>
          {parseInlineElements(line.replace(/^### /, ""))}
        </Header3>
      );
    } else if (line.trim() === "") {
      return <Paragraph key={index} style={{ height: "1lh" }}></Paragraph>;
    } else if (containsCode) {
      return <Fragment key={index}>{parsedElements}</Fragment>;
    } else {
      return <Paragraph key={index}>{parsedElements}</Paragraph>;
    }
  });

  return elements;
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
