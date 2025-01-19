import { Icon as MdiIcon } from "@mdi/react";
import { mdiFountainPenTip } from "@mdi/js";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "700",
});
const Icon = () => {
  return (
    <div className="flex flex-row text-black dark:text-white items-center">
      <MdiIcon path={mdiFountainPenTip} size={2} />
      <h2 className={`font-extrabold ${poppins.variable} text-lg `}>MarkdownPro</h2>
    </div>
  );
};

export default Icon;
