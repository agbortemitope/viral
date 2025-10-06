import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, ArrowUpCircle, ArrowDownCircle, Loader2, Wallet, CreditCard, Building2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserLocation, convertCurrency, formatCurrency, getAllCurrencies, coinsToFiat, fiatToCoins } from "@/lib/currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
}

const WalletPage = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCurrency, setUserCurrency] = useState("USD");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [locationLoading, setLocationLoading] = useState(true);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [bankAccountDialogOpen, setBankAccountDialogOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
  });

  // Conversion rate info: 100 coins = ₦500
  const conversionInfo = {
    base: "100 coins = ₦500",
    note: "Conversion rates are calculated based on current exchange rates"
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      detectUserLocation();
    }
  }, [user]);

  const detectUserLocation = async () => {
    try {
      const location = await getUserLocation();
      setUserCurrency(location.currency);
      setSelectedCurrency(location.currency);
    } catch (error) {
      console.error("Failed to detect location:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const calculateCoins = (fiatAmount: number, currency: string) => {
    return Math.round(fiatToCoins(fiatAmount, currency));
  };

  const handlePurchaseCoins = async () => {
    const fiatAmount = parseFloat(purchaseAmount);
    
    if (!fiatAmount || fiatAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid purchase amount",
        variant: "destructive",
      });
      return;
    }

    const coinsToAdd = calculateCoins(fiatAmount, selectedCurrency);
    setLoading(true);
    
    try {
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user?.id,
          transaction_type: "purchase",
          amount: coinsToAdd,
          description: `Purchased ${coinsToAdd} coins for ${formatCurrency(fiatAmount, selectedCurrency)}`,
          status: "completed",
          currency: selectedCurrency,
          fiat_amount: fiatAmount,
          exchange_rate: `100 coins = ₦500 (base rate)`,
          payment_method: "card"
        });

      if (transactionError) throw transactionError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          coins: (profile?.coins || 0) + coinsToAdd,
        })
        .eq("user_id", user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Purchase successful!",
        description: `${coinsToAdd} coins have been added to your wallet`,
      });

      setPurchaseAmount("");
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkBankAccount = async () => {
    if (!bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankName) {
      toast({
        title: "Missing information",
        description: "Please fill in all bank account details",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      toast({
        title: "Bank account linked!",
        description: "Your bank account has been successfully linked",
      });
      
      setBankAccountDialogOpen(false);
      setBankDetails({ accountNumber: "", accountName: "", bankName: "" });
    } catch (error) {
      toast({
        title: "Link failed",
        description: "There was an error linking your bank account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    const displayAmount = parseFloat(withdrawAmount);
    const amount = processWithdrawal(displayAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > (profile?.coins || 0)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough coins for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user?.id,
          transaction_type: "withdrawal",
          amount: -amount,
          description: `Withdrawal of ${formatCurrency(displayAmount, selectedCurrency)}`,
          status: "pending"
        });

      if (transactionError) throw transactionError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          coins: (profile?.coins || 0) - amount,
        })
        .eq("user_id", user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Withdrawal request submitted!",
        description: `Your request for ${formatCurrency(displayAmount, selectedCurrency)} is being processed`,
      });

      setWithdrawAmount("");
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: "There was an error processing your withdrawal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const walletBalance = profile?.coins || 0;
  const pendingEarnings = transactions
    .filter(t => t.status === 'pending' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const withdrawableAmount = walletBalance - pendingEarnings;

  const convertedBalance = coinsToFiat(walletBalance, selectedCurrency);
  const convertedPending = coinsToFiat(pendingEarnings, selectedCurrency);
  const convertedWithdrawable = coinsToFiat(Math.max(0, withdrawableAmount), selectedCurrency);

  const processWithdrawal = (fiatAmount: number) => {
    return Math.round(fiatToCoins(fiatAmount, selectedCurrency));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'reward':
        return <Coins className="h-5 w-5 text-primary" />;
      case 'purchase':
        return <ArrowUpCircle className="h-5 w-5 text-success" />;
      case 'earning':
      case 'deposit':
        return <ArrowUpCircle className="h-5 w-5 text-success" />;
      case 'withdrawal':
        return <ArrowDownCircle className="h-5 w-5 text-destructive" />;
      case 'spend':
        return <ArrowDownCircle className="h-5 w-5 text-accent" />;
      default:
        return <Coins className="h-5 w-5 text-primary" />;
    }
  };

  const getAmountColor = (type: string, amount: number) => {
    if (type === 'withdrawal' || type === 'spend' || amount < 0) return 'text-destructive';
    if (type === 'reward') return 'text-primary';
    return 'text-success';
  };

  if (locationLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-page">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-page">
        <Header />
        
        <main className="container mx-auto px-4 py-4 md:py-8">
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <Wallet className="h-6 md:h-8 w-6 md:w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Wallet</h1>
          </div>

          {/* Currency Selector */}
          <Card className="p-3 md:p-4 mb-4 md:mb-6 bg-gradient-card border-border/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-sm md:text-base text-foreground">Display Currency</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Auto-detected: {userCurrency}
                </p>
              </div>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAllCurrencies().map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="p-4 md:p-6 bg-gradient-card border-border/50">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/20 p-2 md:p-3 rounded-lg">
                  <Coins className="h-5 md:h-6 w-5 md:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">
                    {formatCurrency(convertedBalance, selectedCurrency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {walletBalance} coins
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6 bg-gradient-card border-border/50">
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 p-2 md:p-3 rounded-lg">
                  <ArrowUpCircle className="h-5 md:h-6 w-5 md:w-6 text-accent" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Pending Earnings</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">
                    {formatCurrency(convertedPending, selectedCurrency)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6 bg-gradient-card border-border/50">
              <div className="flex items-center space-x-3">
                <div className="bg-success/20 p-2 md:p-3 rounded-lg">
                  <ArrowDownCircle className="h-5 md:h-6 w-5 md:w-6 text-success" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Withdrawable</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">
                    {formatCurrency(convertedWithdrawable, selectedCurrency)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Purchase Coins */}
            <Card className="p-4 md:p-6 bg-gradient-card border-border/50">
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                Purchase Coins
              </h2>
              
              <div className="space-y-4">
                <div className="bg-primary/10 p-3 md:p-4 rounded-lg border border-primary/20">
                  <p className="text-xs md:text-sm font-medium text-foreground mb-2">Base Conversion Rate:</p>
                  <div className="text-center">
                    <p className="text-base md:text-lg font-bold text-primary">100 coins = ₦500</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Other currencies calculated at current exchange rates
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Amount ({selectedCurrency})
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    min="0"
                    step={selectedCurrency === "NGN" ? "100" : "1"}
                  />
                  {purchaseAmount && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">
                      You will receive: <span className="font-bold text-primary">
                        {calculateCoins(parseFloat(purchaseAmount), selectedCurrency)} coins
                      </span>
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handlePurchaseCoins} 
                  disabled={loading || !purchaseAmount}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Purchase Coins"}
                </Button>
              </div>
            </Card>

            {/* Withdrawal Section */}
            <Card className="p-4 md:p-6 bg-gradient-card border-border/50">
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <ArrowDownCircle className="h-4 md:h-5 w-4 md:w-5 text-success" />
                Withdraw Funds
              </h2>

              <div className="space-y-4">
                <div className="bg-success/10 p-3 md:p-4 rounded-lg border border-success/20">
                  <p className="text-xs md:text-sm font-medium text-foreground mb-2">Withdrawal Rate:</p>
                  <div className="text-center">
                    <p className="text-base md:text-lg font-bold text-success">100 coins = ₦500</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Withdrawals processed in your selected currency
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <Dialog open={bankAccountDialogOpen} onOpenChange={setBankAccountDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" size="sm">
                        <Building2 className="h-4 w-4 mr-2" />
                        Link Bank Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-4">
                      <DialogHeader>
                        <DialogTitle>Link Bank Account</DialogTitle>
                        <DialogDescription>
                          Add your bank account details for withdrawals
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Account Number
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter account number"
                            value={bankDetails.accountNumber}
                            onChange={(e) => setBankDetails({
                              ...bankDetails,
                              accountNumber: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Account Name
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter account name"
                            value={bankDetails.accountName}
                            onChange={(e) => setBankDetails({
                              ...bankDetails,
                              accountName: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Bank Name
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter bank name"
                            value={bankDetails.bankName}
                            onChange={(e) => setBankDetails({
                              ...bankDetails,
                              bankName: e.target.value
                            })}
                          />
                        </div>
                        <Button 
                          onClick={handleLinkBankAccount}
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link Account"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Withdraw Amount ({selectedCurrency})
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="0"
                      max={walletBalance}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleWithdrawal} 
                      disabled={loading || !withdrawAmount || processWithdrawal(parseFloat(withdrawAmount)) > walletBalance}
                      variant="outline"
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Withdraw"}
                    </Button>
                  </div>
                  {withdrawAmount && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">
                      Deduct: <span className="font-bold text-destructive">
                        {processWithdrawal(parseFloat(withdrawAmount))} coins
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="p-4 md:p-6 bg-gradient-card border-border/50 mt-6 md:mt-8">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Recent Transactions</h2>
            
            <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-sm md:text-base text-muted-foreground text-center py-8">
                  No transactions yet. Start earning or make a deposit!
                </p>
              ) : (
                transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-background/50 border border-border/30"
                  >
                    <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                      {getTransactionIcon(transaction.transaction_type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium text-foreground truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()} •{" "}
                          <span className={`font-medium ${
                            transaction.status === 'completed' 
                              ? 'text-success' 
                              : transaction.status === 'pending'
                              ? 'text-accent'
                              : 'text-destructive'
                          }`}>
                            {transaction.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm md:text-base font-bold whitespace-nowrap ml-2 ${getAmountColor(transaction.transaction_type, transaction.amount)}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(coinsToFiat(transaction.amount, selectedCurrency)), selectedCurrency)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default WalletPage;
