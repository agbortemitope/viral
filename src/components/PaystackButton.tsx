import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaystackButtonProps {
  config: {
    publicKey: string;
    email: string;
    amount: number;
    reference: string;
    onSuccess: (reference: any) => void;
    onClose: () => void;
  } | null;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

const PaystackButton = ({ config, disabled, children, className }: PaystackButtonProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!config || !window.PaystackPop) return;

    const handler = window.PaystackPop.setup(config);
    handler.openIframe();
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || !config}
      className={className}
    >
      {disabled ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default PaystackButton;
