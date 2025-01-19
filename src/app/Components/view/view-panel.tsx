import { useText } from "@/app/hooks/use-text";

const ViewPanel = () => {
  const { text } = useText();
  return (
    <main className="flex-1 overflow-y-scroll text-xl border-[#e5e7eb] border-2 rounded-lg p-4 bg-white h-[85%]">
      {text}
    </main>
  );
};

export default ViewPanel;
