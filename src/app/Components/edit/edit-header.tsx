import { Button } from "@/components/ui/button";
import { Noto_Sans_Hatran } from "next/font/google";

const notoSansHatran = Noto_Sans_Hatran({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: "400",
});

const EditorHeader = () => {
  return (
    <div
      className={`${notoSansHatran.variable} flex flex-row justify-end gap-4 p-4 items-center border-b-2 border-[#e5e7eb]`}
      style={{ fontFamily: "var(--font-noto-sans)" }}
    >
      <Button>H1</Button>
      <Button>H2</Button>
      <Button>H3</Button>
      <Button className="font-bold">B</Button>
      <Button className="italic">I</Button>
    </div>
  );
};

export default EditorHeader;
