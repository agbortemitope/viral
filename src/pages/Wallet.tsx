import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet as WalletIcon,
  CreditCard,
  TrendingUp,
  History
} from "lucide-react";

const Wallet = () => {
  const walletBalance = 2847;
  const pendingEarnings = 523;
  
  const transactions = [
    { id: "1", type: "earned", amount: 50, description: "Event RSVP Reward", date: "2 hours ago" },
    { id: "2", type: "earned", amount: 25, description: "Ad Interaction", date: "4 hours ago" },
    { id: "3", type: "spent", amount: -100, description: "Ad Promotion", date: "1 day ago" },
    { id: "4", type: "earned", amount: 75, description: "Property View Reward", date: "2 days ago" },
    { id: "5", type: "deposit", amount: 500, description: "Wallet Top-up", date: "3 days ago" },
    { id: "6", type: "earned", amount: 120, description: "Job Application Bonus", date: "1 week ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-gradient-primary p-3 rounded-lg">
            <WalletIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Wallet</h1>
            <p className="text-muted-foreground">Manage your coins and earnings</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Cards */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <Badge className="bg-success/20 text-success border-success/30">
                Active
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-3xl font-bold text-foreground">{walletBalance.toLocaleString()}</p>
              <p className="text-xs text-success flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% this month
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-accent/20 p-3 rounded-lg">
                <ArrowDownLeft className="h-6 w-6 text-accent" />
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/30">
                Pending
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pending Earnings</p>
              <p className="text-3xl font-bold text-foreground">{pendingEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                Available in 24 hours
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary/20 p-3 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-secondary" />
              </div>
              <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                Available
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Withdrawable</p>
              <p className="text-3xl font-bold text-foreground">{(walletBalance - 1000).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                Min. withdrawal: 1,000 coins
              </p>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Actions */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Quick Actions
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Deposit Amount</label>
                <Input 
                  type="number" 
                  placeholder="Enter amount" 
                  className="bg-background/50"
                />
              </div>
              <Button variant="hero" className="w-full">
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Deposit Funds
              </Button>
              
              <div className="border-t border-border/50 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Withdrawal Amount</label>
                  <Input 
                    type="number" 
                    placeholder="Min. 1,000 coins" 
                    className="bg-background/50"
                  />
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Withdraw Earnings
                </Button>
              </div>
            </div>
          </Card>

          {/* Transaction History */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <History className="h-5 w-5 mr-2" />
                Recent Transactions
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === "earned" ? "bg-success/20" :
                      transaction.type === "spent" ? "bg-destructive/20" :
                      "bg-primary/20"
                    }`}>
                      {transaction.type === "earned" ? (
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      ) : transaction.type === "spent" ? (
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    transaction.amount > 0 ? "text-success" : "text-destructive"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;