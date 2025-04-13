import "node_modules/sonner/dist/styles.css";

import { createPortal } from "react-dom";
import { Toaster as SonnerToaster } from "sonner";

function Toaster() {
  const Toast = createPortal(
    <SonnerToaster richColors closeButton />,
    document.body,
  );

  return Toast;
}

export default Toaster;
