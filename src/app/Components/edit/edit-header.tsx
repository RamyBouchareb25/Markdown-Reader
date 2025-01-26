import { useTextArea } from "@/app/hooks/use-textarea";
import { Button } from "@/components/ui/button";
import { Noto_Sans_Hatran } from "next/font/google";

const notoSansHatran = Noto_Sans_Hatran({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: "400",
});
const EditorHeader = () => {
  const { setItalic, setBold, setHeader } = useTextArea();
  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "BUTTON") {
      const index = Array.from(target.parentNode!.children).indexOf(target);
      setHeader(index + 1); // Call setHeader with the index + 1 (H1, H2, H3)
    }
  };
  return (
    <div
      className={`${notoSansHatran.variable} flex flex-row justify-end gap-4 p-4 items-center border-b-2 border-[#e5e7eb]`}
      style={{ fontFamily: "var(--font-noto-sans)" }}
    >
      <div className="flex flex-row gap-4" onClick={handleHeaderClick}>
        <Button>H1</Button>
        <Button>H2</Button>
        <Button>H3</Button>
      </div>
      <Button className="font-bold" onClick={setBold}>
        B
      </Button>
      <Button className="italic" onClick={setItalic}>
        I
      </Button>
    </div>
  );
};

export default EditorHeader;
