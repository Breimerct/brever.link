import { createPortal } from "react-dom";
import { Toaster as SonnerToaster, toast } from "sonner";

function Toaster() {
  const Toast = createPortal(
    <SonnerToaster richColors closeButton />,
    document.body,
  );

  return Toast;
}

export default Toaster;

export const showToast = (message: string, type: "error" | "success") => {
  toast[type](message);
};
