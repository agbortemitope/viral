import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number;
  reference: string;
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

export const usePaystack = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const [processing, setProcessing] = useState(false);

  const initializePayment = async (amountInNaira: number, metadata?: any) => {
    if (!user || !profile) {
      toast({
        title: "Authentication required",
        description: "Please log in to make payments",
        variant: "destructive",
      });
      return null;
    }

    setProcessing(true);

    try {
      const reference = `PAY_${Date.now()}_${user.id.slice(0, 8)}`;

      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          transaction_type: "deposit",
          amount: amountInNaira,
          description: `Paystack deposit - ${reference}`,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      const paystackConfig: PaystackConfig = {
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
        email: user.email || profile.email || "",
        amount: amountInNaira * 100,
        reference,
        onSuccess: async (response: any) => {
          await handlePaymentSuccess(response, transaction.id, amountInNaira, metadata);
        },
        onClose: () => {
          handlePaymentClosed(transaction.id);
        },
      };

      return paystackConfig;
    } catch (error: any) {
      toast({
        title: "Payment initialization failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (
    response: any,
    transactionId: string,
    amountInNaira: number,
    metadata?: any
  ) => {
    try {
      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          status: "completed",
          description: `Paystack deposit completed - ${response.reference}`,
        })
        .eq("id", transactionId);

      if (updateError) throw updateError;

      const coinsToAdd = Math.floor(amountInNaira / 10);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          coins: (profile?.coins || 0) + coinsToAdd,
        })
        .eq("user_id", user?.id);

      if (profileError) throw profileError;

      await refetchProfile();

      toast({
        title: "Payment successful!",
        description: `You've received ${coinsToAdd} coins for ₦${amountInNaira.toLocaleString()}`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Payment verification failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePaymentClosed = async (transactionId: string) => {
    try {
      await supabase
        .from("transactions")
        .update({ status: "failed" })
        .eq("id", transactionId);

      toast({
        title: "Payment cancelled",
        description: "Your payment was not completed",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const withdrawFunds = async (amountInNaira: number, bankDetails: any) => {
    if (!user || !profile) {
      toast({
        title: "Authentication required",
        description: "Please log in to withdraw funds",
        variant: "destructive",
      });
      return false;
    }

    if (profile.coins < amountInNaira * 10) {
      toast({
        title: "Insufficient coins",
        description: `You need ${amountInNaira * 10} coins to withdraw ₦${amountInNaira.toLocaleString()}`,
        variant: "destructive",
      });
      return false;
    }

    setProcessing(true);

    try {
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: user.id,
        transaction_type: "withdrawal",
        amount: -amountInNaira,
        description: `Withdrawal to ${bankDetails.bank_name} - ${bankDetails.account_number}`,
        status: "pending",
      });

      if (transactionError) throw transactionError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          coins: profile.coins - amountInNaira * 10,
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      await refetchProfile();

      toast({
        title: "Withdrawal initiated",
        description: `Your withdrawal of ₦${amountInNaira.toLocaleString()} is being processed`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Withdrawal failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return {
    initializePayment,
    withdrawFunds,
    processing,
  };
};
