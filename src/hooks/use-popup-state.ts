import { useState } from "react";

export function usePopupState(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  return { open, onOpenChange: setOpen };
}
