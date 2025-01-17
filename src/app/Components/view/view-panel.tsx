import { useText } from "@/app/hooks/use-text";
import { Textarea } from "@/components/ui/textarea";

const ViewPanel = () => {
  const { text } = useText();
  return (
    <div className="flex-1 text-xl border-[#e5e7eb] border-2 rounded-lg p-4 bg-white h-[85%]">
      <Textarea className="h-full" readOnly value={text} />
    </div>
  );
};

export default ViewPanel;
