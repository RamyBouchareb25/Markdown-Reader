import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
interface TagProps extends ButtonHTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}
interface CodeTagProps extends TagProps {
  language: string;
  code: string;
}

export const Header1 = forwardRef<HTMLDivElement, TagProps>(
  ({ children }, ref) => (
    <h1
      ref={ref}
      style={{
        fontWeight: 700,
        fontSize: "3rem",
        lineHeight: 1,
        marginBottom: "1rem",
      }}
    >
      {children}
    </h1>
  )
);
Header1.displayName = "Header1";
export const Header2 = ({ children }: TagProps) => (
  <h2
    style={{
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1,
      marginBottom: "1rem",
    }}
  >
    {children}
  </h2>
);
export const Header3 = ({ children }: TagProps) => (
  <h3
    style={{
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1,
      marginBottom: "1rem",
    }}
  >
    {children}
  </h3>
);
export const Paragraph = ({ children, style }: TagProps) => (
  <p style={style}>{children}</p>
);
export const Strong = ({ children }: TagProps) => <strong>{children}</strong>;
export const Em = ({ children }: TagProps) => <em>{children}</em>;
export const Code = ({ code, language }: CodeTagProps) => (
  <SyntaxHighlighter language={language} style={darcula}>
    {code}
  </SyntaxHighlighter>
);
export const InlineCode = ({ children }: TagProps) => (
  <code className="bg-[#f5f5f5] p-[0.25rem] dark:bg-black">{children}</code>
);
export const Anchor = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ children, ...props }, ref) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    className="relative text-[#007BFF] after:absolute after:w-full after:bg-[#007BFF] after:origin-center after:scale-x-0 after:rounded-full after:h-[2px] after:bottom-0 after:left-0 after:transition-transform hover:after:scale-x-100"
    ref={ref}
    {...props}
  >
    {children}
  </a>
));
Anchor.displayName = "Anchor";

export const Blockquote = ({ children }: TagProps) => (
  <blockquote className="border-l-[4px] border-l-[#6C757D] pl-4 italic bg-[#f5f5f5] dark:bg-[#0c0c0c] dark:border-l-[#d6d6d6]">
    {children}
  </blockquote>
);

export const UnorderdList = forwardRef<
  HTMLUListElement,
  React.OlHTMLAttributes<HTMLUListElement>
>(({ children }, ref) => (
  <ul className="ml-4 list-disc" ref={ref}>
    {children}
  </ul>
));

UnorderdList.displayName = "UnorderdList";

export const Horizontal = forwardRef<HTMLHRElement, TagProps>((props, ref) => (
  <hr ref={ref} className="border-[#e5e7eb] border-2 my-4" {...props} />
));
Horizontal.displayName = "Horizontal";
