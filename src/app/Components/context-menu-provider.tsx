import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ReactNode } from "react";
import { useTextArea } from "../hooks/use-textarea";
import { useAlertDialog } from "../hooks/use-alert";

const ContextMenuProvider = ({ children }: { children: ReactNode }) => {
  const { ref, setBold, setHeader, setItalic } = useTextArea();
  const undo = () => {
    const textarea = ref.current;
    if (textarea) {
      textarea.focus();
      document.execCommand("undo");
    }
  };
  const redo = () => {
    const textarea = ref.current;
    if (textarea) {
      textarea.focus();
      document.execCommand("redo");
    }
  };
  const { setIsSaveAsOpen, setIsSaveOpen } = useAlertDialog();
  const handleOpenSave = () => {
    setIsSaveOpen(true);
  };
  const handleOpenSaveAs = () => {
    setIsSaveAsOpen(true);
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={undo}>
          Back
          <ContextMenuShortcut>Ctrl + Z</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={redo} inset>
          Forward
          <ContextMenuShortcut>Ctrl + Y</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>Ctrl +R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Heading</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem
              onClick={() => {
                setHeader(1);
              }}
            >
              Heading 1
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                setHeader(2);
              }}
            >
              Heading 2
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                setHeader(3);
              }}
            >
              Heading 3
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem onClick={setBold} inset>
          Bold
        </ContextMenuItem>
        <ContextMenuItem onClick={setItalic} inset>
          Italic
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleOpenSave} inset>
          Save
          <ContextMenuShortcut>Ctrl + S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onCanPlay={handleOpenSaveAs} inset>
          Save As
          <ContextMenuShortcut>Ctrl + Shift + S</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ContextMenuProvider;
