import {
  Anchor,
  Blockquote,
  Code,
  Em,
  Header1,
  Header2,
  Header3,
  Horizontal,
  InlineCode,
  Paragraph,
  Strong,
  UnorderdList,
} from "./custom-html";
import { Fragment } from "react";
import { v4 as uuidv4 } from "uuid";

const parseInlineElements = (text: string) => {
  const regex =
    /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)|^(>+)\s(.+)|^(\-|\*|\+)\s(.+)|^---$)/gm;
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
      elements.push(<Strong key={uuidv4()}>{match[2]}</Strong>);
    } else if (match[1]?.startsWith("*") && match[3]) {
      elements.push(<Em key={uuidv4()}>{match[3]}</Em>);
    } else if (match[1]?.startsWith("`") && match[4]) {
      elements.push(<InlineCode key={uuidv4()}>{match[4]}</InlineCode>);
    } else if (match[1]?.startsWith("[") && match[5] && match[6]) {
      elements.push(
        <Anchor key={uuidv4()} href={match[6]}>
          {match[5]}
        </Anchor>
      );
    } else if (match[7]?.startsWith(">") && match[8]) {
      const nestedContent = match[8];
      const nestedElements = parseInlineElements(nestedContent);
      let nestedBlockquote = nestedElements;
      for (let i = 0; i < match[7].length; i++) {
        nestedBlockquote = [
          <Blockquote key={uuidv4()}>{nestedBlockquote}</Blockquote>,
        ];
      }
      elements.push(nestedBlockquote[0]);
    } else if (match[9] && match[10]) {
      elements.push(<li key={uuidv4()}>{match[10]}</li>);
    } else if (match[0] === "---") {
      elements.push(<Horizontal key={uuidv4()} />);
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
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/gm;
  const elements: (string | React.JSX.Element)[] = [];
  let currentListItems: React.JSX.Element[] = [];
  let lastIndex = 0;

  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    // Add the text before the match
    if (match.index > lastIndex) {
      const textBeforeCodeBlock = markdown.slice(lastIndex, match.index);
      const lines = textBeforeCodeBlock.split("\n");
      lines.forEach((line) => {
        const parsedElements = parseInlineElements(line);
        const containsCode =
          Array.isArray(parsedElements) &&
          parsedElements.some(
            (element) =>
              (element as React.JSX.Element)?.type === Code ||
              (element as React.JSX.Element)?.type === Horizontal ||
              (element as React.JSX.Element)?.type === Blockquote
          );

        if (/^# /.test(line)) {
          if (currentListItems.length > 0) {
            elements.push(
              <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
            );
            currentListItems = [];
          }
          elements.push(
            <Header1 key={uuidv4()}>
              {parseInlineElements(line.replace(/^# /, ""))}
            </Header1>
          );
        } else if (/^## /.test(line)) {
          if (currentListItems.length > 0) {
            elements.push(
              <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
            );
            currentListItems = [];
          }
          elements.push(
            <Header2 key={uuidv4()}>
              {parseInlineElements(line.replace(/^## /, ""))}
            </Header2>
          );
        } else if (/^### /.test(line)) {
          if (currentListItems.length > 0) {
            elements.push(
              <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
            );
            currentListItems = [];
          }
          elements.push(
            <Header3 key={uuidv4()}>
              {parseInlineElements(line.replace(/^### /, ""))}
            </Header3>
          );
        } else if (line.trim() === "") {
          if (currentListItems.length > 0) {
            elements.push(
              <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
            );
            currentListItems = [];
          }
          elements.push(
            <Paragraph key={uuidv4()} style={{ height: "1lh" }}></Paragraph>
          );
        } else if (containsCode) {
          if (currentListItems.length > 0) {
            elements.push(
              <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
            );
            currentListItems = [];
          }
          elements.push(<Fragment key={uuidv4()}>{parsedElements}</Fragment>);
        } else if (/^(\-|\*|\+)\s/.test(line)) {
          currentListItems.push(
            <li key={uuidv4()}>
              {parseInlineElements(line.replace(/^(\-|\*|\+)\s/, ""))}
            </li>
          );
        } else {
          if (currentListItems.length > 0) {
            elements.push(
              <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
            );
            currentListItems = [];
          }
          elements.push(<Paragraph key={uuidv4()}>{parsedElements}</Paragraph>);
        }
      });
    }

    // Handle code block
    const language = match[1] || "";
    elements.push(
      <Code code={match[2]} key={uuidv4()} language={fileTypeMap[language]} />
    );

    lastIndex = codeBlockRegex.lastIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < markdown.length) {
    const textAfterLastCodeBlock = markdown.slice(lastIndex);
    const lines = textAfterLastCodeBlock.split("\n");
    lines.forEach((line) => {
      const parsedElements = parseInlineElements(line);
      const containsCode =
        Array.isArray(parsedElements) &&
        parsedElements.some(
          (element) =>
            (element as React.JSX.Element)?.type === Code ||
            (element as React.JSX.Element)?.type === Horizontal ||
            (element as React.JSX.Element)?.type === Blockquote
        );

      if (/^# /.test(line)) {
        if (currentListItems.length > 0) {
          elements.push(
            <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
          );
          currentListItems = [];
        }
        elements.push(
          <Header1 key={uuidv4()}>
            {parseInlineElements(line.replace(/^# /, ""))}
          </Header1>
        );
      } else if (/^## /.test(line)) {
        if (currentListItems.length > 0) {
          elements.push(
            <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
          );
          currentListItems = [];
        }
        elements.push(
          <Header2 key={uuidv4()}>
            {parseInlineElements(line.replace(/^## /, ""))}
          </Header2>
        );
      } else if (/^### /.test(line)) {
        if (currentListItems.length > 0) {
          elements.push(
            <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
          );
          currentListItems = [];
        }
        elements.push(
          <Header3 key={uuidv4()}>
            {parseInlineElements(line.replace(/^### /, ""))}
          </Header3>
        );
      } else if (line.trim() === "") {
        if (currentListItems.length > 0) {
          elements.push(
            <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
          );
          currentListItems = [];
        }
        elements.push(
          <Paragraph key={uuidv4()} style={{ height: "1lh" }}></Paragraph>
        );
      } else if (containsCode) {
        if (currentListItems.length > 0) {
          elements.push(
            <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
          );
          currentListItems = [];
        }
        elements.push(<Fragment key={uuidv4()}>{parsedElements}</Fragment>);
      } else if (/^(\-|\*|\+)\s/.test(line)) {
        currentListItems.push(
          <li key={uuidv4()}>
            {parseInlineElements(line.replace(/^(\-|\*|\+)\s/, ""))}
          </li>
        );
      } else {
        if (currentListItems.length > 0) {
          elements.push(
            <UnorderdList key={uuidv4()}>{currentListItems}</UnorderdList>
          );
          currentListItems = [];
        }
        elements.push(<Paragraph key={uuidv4()}>{parsedElements}</Paragraph>);
      }
    });
  }

  return elements;
};

const fileTypeMap: { [key: string]: string } = {
  abap: "abap",
  ada: "ada",
  ahk: "autohotkey",
  apacheconf: "apache",
  applescript: "applescript",
  as: "actionscript",
  as3: "actionscript",
  bash: "bash",
  bat: "dos",
  brainfuck: "brainfuck",
  c: "c",
  cfm: "php",
  cl: "lisp",
  clojure: "clojure",
  cmake: "cmake",
  coffeescript: "coffeescript",
  cpp: "cpp",
  csharp: "csharp",
  css: "css",
  cython: "python",
  d: "d",
  delphi: "delphi",
  diff: "diff",
  erb: "erb",
  erlang: "erlang",
  fortran: "fortran",
  glsl: "glsl",
  go: "go",
  haskell: "haskell",
  html: "xml",
  ini: "ini",
  java: "java",
  js: "javascript",
  lua: "lua",
  make: "makefile",
  markdown: "markdown",
  matlab: "matlab",
  nasm: "x86asm",
  nginx: "nginx",
  objectivec: "objectivec",
  ocaml: "ocaml",
  perl: "perl",
  php: "php",
  prolog: "prolog",
  properties: "properties",
  python: "python",
  r: "r",
  rb: "ruby",
  rst: "plaintext",
  sass: "scss",
  scala: "scala",
  scheme: "scheme",
  scss: "scss",
  shell: "bash",
  sql: "sql",
  tcl: "tcl",
  tex: "latex",
  text: "plaintext",
  typescript: "typescript",
  vala: "vala",
  vbnet: "vbnet",
  vim: "vim",
  xml: "xml",
  yaml: "yaml",
};
