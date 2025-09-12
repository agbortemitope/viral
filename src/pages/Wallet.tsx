import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, ArrowUpCircle, ArrowDownCircle, Loader2, Wallet } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserLocation, convertCurrency, formatCurrency, getAllCurrencies } from "@/lib/currency";

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

  const handleDeposit = async () => {
    const displayAmount = parseFloat(depositAmount);
    const amount = processDeposit(displayAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create deposit transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user?.id,
          transaction_type: "deposit",
          amount: amount,
          description: `Deposit of ${formatCurrency(displayAmount, selectedCurrency)}`,
          status: "completed"
        });

      if (transactionError) throw transactionError;

      // Update user's coin balance
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          coins: (profile?.coins || 0) + amount,
        })
        .eq("user_id", user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Deposit successful!",
        description: `${formatCurrency(displayAmount, selectedCurrency)} has been added to your wallet`,
      });

      setDepositAmount("");
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Deposit failed",
        description: "There was an error processing your deposit",
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
      // Create withdrawal transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user?.id,
          transaction_type: "withdrawal",
          amount: -amount, // Negative for withdrawal
          description: `Withdrawal of ${formatCurrency(displayAmount, selectedCurrency)}`,
          status: "pending" // Withdrawals start as pending for review
        });

      if (transactionError) throw transactionError;

      // Update user's coin balance
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

  const convertedBalance = convertCurrency(walletBalance, "USD", selectedCurrency);
  const convertedPending = convertCurrency(pendingEarnings, "USD", selectedCurrency);
  const convertedWithdrawable = convertCurrency(Math.max(0, withdrawableAmount), "USD", selectedCurrency);

  // Convert deposit/withdrawal amounts for processing
  const processDeposit = (amount: number) => {
    // Convert from selected currency to USD (base currency)
    return Math.round(convertCurrency(amount, selectedCurrency, "USD"));
  };

  const processWithdrawal = (amount: number) => {
    // Convert from selected currency to USD (base currency)
    return Math.round(convertCurrency(amount, selectedCurrency, "USD"));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning':
      case 'deposit':
        return <ArrowUpCircle className="h-4 w-4 text-success" />;
      case 'withdrawal':
        return <ArrowDownCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Coins className="h-4 w-4 text-primary" />;
    }
  };

  const getAmountColor = (type: string, amount: number) => {
    if (type === 'withdrawal' || amount < 0) return 'text-destructive';
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
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-8">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          </div>

          {/* Currency Selector */}
          <Card className="p-4 mb-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Display Currency</h3>
                <p className="text-sm text-muted-foreground">
                  Auto-detected: {userCurrency} (based on your location)
                </p>
              </div>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-32">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(convertedBalance, selectedCurrency)}
                  </p>
                  {selectedCurrency !== "USD" && (
                    <p className="text-xs text-muted-foreground">
                      {walletBalance} coins
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <ArrowUpCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Earnings</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(convertedPending, selectedCurrency)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center space-x-3">
                <div className="bg-success/20 p-3 rounded-lg">
                  <ArrowDownCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Withdrawable</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(convertedWithdrawable, selectedCurrency)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Deposit Amount ({selectedCurrency})
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      min="0"
                    />
                    <Button 
                      onClick={handleDeposit} 
                      disabled={loading || !depositAmount}
                      className="whitespace-nowrap"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deposit"}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Withdraw Amount ({selectedCurrency})
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="0"
                      max={walletBalance}
                    />
                    <Button 
                      onClick={handleWithdrawal} 
                      disabled={loading || !withdrawAmount || processWithdrawal(parseFloat(withdrawAmount)) > walletBalance}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Withdraw"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Transactions</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No transactions yet. Start earning or make a deposit!
                  </p>
                ) : (
                  transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30"
                    >
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.transaction_type)}
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
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
                      <div className={`font-bold ${getAmountColor(transaction.transaction_type, transaction.amount)}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(convertCurrency(transaction.amount, "USD", selectedCurrency)), selectedCurrency)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default WalletPage;