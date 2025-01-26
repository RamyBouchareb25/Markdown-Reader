import { useContext } from "react";
import { AlertContext } from "../Context/alert-dialogue-context";

export const useAlertDialog = () => {
  const context = useContext(AlertContext);
  if (!context) throw Error("useAlertDialog must be used with ");
  return context;
};
