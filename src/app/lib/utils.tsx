import { open } from "@tauri-apps/plugin-dialog";
import { FileHandle, open as openFile } from "@tauri-apps/plugin-fs";
import {
  Anchor,
  Blockquote,
  Code,
  Em,
  Header1,
  Header2,
  Header3,
  InlineCode,
  Paragraph,
  Strong,
  UnorderdList,
} from "./custom-html";
import { Fragment } from "react";

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
  return { data, fileName };
};
const parseInlineElements = (text: string) => {
  const regex =
    /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)|^(>+)\s(.+)|^(\-|\*|\+)\s(.+))/gm;
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
      elements.push(
        <Strong
          key={elements
            .map((e) => {
              if (typeof e !== "string") {
                return e.type;
              }
              return e;
            })
            .join("")}
        >
          {match[2]}
        </Strong>
      );
    } else if (match[1]?.startsWith("*") && match[3]) {
      elements.push(
        <Em
          key={elements
            .map((e) => {
              if (typeof e !== "string") {
                return e.type;
              }
              return e;
            })
            .join("")}
        >
          {match[3]}
        </Em>
      );
    } else if (match[1]?.startsWith("`") && match[4]) {
      elements.push(
        <InlineCode
          key={elements
            .map((e) => {
              if (typeof e !== "string") {
                return e.type;
              }
              return e;
            })
            .join("")}
        >
          {match[4]}
        </InlineCode>
      );
    } else if (match[1]?.startsWith("[") && match[5] && match[6]) {
      elements.push(
        <Anchor
          key={elements
            .map((e) => {
              if (typeof e !== "string") {
                return e.type;
              }
              return e;
            })
            .join("")}
          href={match[6]}
        >
          {match[5]}
        </Anchor>
      );
    } else if (match[7]?.startsWith(">") && match[8]) {
      const nestedContent = match[8];
      const nestedElements = parseInlineElements(nestedContent);
      let nestedBlockquote = nestedElements;
      for (let i = 0; i < match[7].length; i++) {
        nestedBlockquote = [
          <Blockquote
            key={elements
              .map((e) => {
                if (typeof e !== "string") {
                  return e.type;
                }
                return e;
              })
              .join("")}
          >
            {nestedBlockquote}
          </Blockquote>,
        ];
      }
      elements.push(nestedBlockquote[0]);
    } else if (match[9] && match[10]) {
      elements.push(
        <li
          key={elements
            .map((e) => {
              if (typeof e !== "string") {
                return e.type;
              }
              return e;
            })
            .join("")}
        >
          {match[10]}
        </li>
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
  const elements: (string | React.JSX.Element)[] = [];
  let currentListItems: React.JSX.Element[] = [];

  lines.forEach((line, index) => {
    const parsedElements = parseInlineElements(line);
    const containsCode =
      Array.isArray(parsedElements) &&
      parsedElements.some(
        (element) =>
          (element as React.JSX.Element)?.type === Code ||
          (element as React.JSX.Element)?.type === Blockquote
      );

    if (/^# /.test(line)) {
      if (currentListItems.length > 0) {
        elements.push(
          <UnorderdList
            key={elements
              .map((e) => {
                if (typeof e !== "string") {
                  return e.type;
                }
                return e;
              })
              .join("")}
          >
            {currentListItems}
          </UnorderdList>
        );
        currentListItems = [];
      }
      elements.push(
        <Header1 key={index}>
          {parseInlineElements(line.replace(/^# /, ""))}
        </Header1>
      );
    } else if (/^## /.test(line)) {
      if (currentListItems.length > 0) {
        elements.push(
          <UnorderdList
            key={elements
              .map((e) => {
                if (typeof e !== "string") {
                  return e.type;
                }
                return e;
              })
              .join("")}
          >
            {currentListItems}
          </UnorderdList>
        );
        currentListItems = [];
      }
      elements.push(
        <Header2 key={index}>
          {parseInlineElements(line.replace(/^## /, ""))}
        </Header2>
      );
    } else if (/^### /.test(line)) {
      if (currentListItems.length > 0) {
        elements.push(
          <UnorderdList
            key={elements
              .map((e) => {
                if (typeof e !== "string") {
                  return e.type;
                }
                return e;
              })
              .join("")}
          >
            {currentListItems}
          </UnorderdList>
        );
        currentListItems = [];
      }
      elements.push(
        <Header3 key={index}>
          {parseInlineElements(line.replace(/^### /, ""))}
        </Header3>
      );
    } else if (line.trim() === "") {
      if (currentListItems.length > 0) {
        elements.push(
          <UnorderdList
            key={elements
              .map((e) => {
                if (typeof e !== "string") {
                  return e.type;
                }
                return e;
              })
              .join("")}
          >
            {currentListItems}
          </UnorderdList>
        );
        currentListItems = [];
      }
      elements.push(
        <Paragraph key={index} style={{ height: "1lh" }}></Paragraph>
      );
    } else if (containsCode) {
      if (currentListItems.length > 0) {
        elements.push(
          <UnorderdList
            key={elements
              .map((e) => {
                if (typeof e !== "string") {
                  return e.type;
                }
                return e;
              })
              .join("")}
          >
            {currentListItems}
          </UnorderdList>
        );
        currentListItems = [];
      }
      elements.push(<Fragment key={index}>{parsedElements}</Fragment>);
    } else if (/^(\-|\*|\+)\s/.test(line)) {
      currentListItems.push(
        <li key={index}>
          {parseInlineElements(line.replace(/^(\-|\*|\+)\s/, ""))}
        </li>
      );
    } else {
      if (currentListItems.length > 0) {
        elements.push(
          <UnorderdList
            key={elements
              .map((e) => {
                if (typeof e !== "string") {
                  return e.type;
                }
                return e;
              })
              .join("")}
          >
            {currentListItems}
          </UnorderdList>
        );
        currentListItems = [];
      }
      elements.push(<Paragraph key={index}>{parsedElements}</Paragraph>);
    }
  });

  if (currentListItems.length > 0) {
    elements.push(
      <UnorderdList
        key={elements
          .map((e) => {
            if (typeof e !== "string") {
              return e.type;
            }
            return e;
          })
          .join("")}
      >
        {currentListItems}
      </UnorderdList>
    );
  }

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
