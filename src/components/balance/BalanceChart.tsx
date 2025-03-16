
import { Card } from "@/components/ui/card";
import { Friend } from "@/types/expense";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CreditCard, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface BalanceChartProps {
  balances: Record<string, number>;
  friends: Friend[];
  formatCurrency: (amount: number) => string;
}

export const BalanceChart = ({ balances, friends, formatCurrency }: BalanceChartProps) => {
  // Find the "You" friend to correctly calculate user's perspective
  const youFriend = friends.find(friend => friend.name === "You");
  
  // Calculate total payable to you and by you from the user's perspective
  const payableTotals = Object.entries(balances).reduce(
    (acc, [friendId, balance]) => {
      // Skip the user's own balance in the calculation
      if (youFriend && friendId === youFriend.id) {
        return acc;
      }
      
      if (balance > 0) {
        // Positive balance means this friend owes you money
        acc.payableToYou += balance;
      } else if (balance < 0) {
        // Negative balance means you owe this friend money
        acc.payableByYou += Math.abs(balance);
      }
      return acc;
    },
    { payableToYou: 0, payableByYou: 0 }
  );

  // Prepare data for pie chart
  const chartData = [
    { name: "Payable to you", value: payableTotals.payableToYou, color: "#10b981" }, // green
    { name: "Payable to others", value: payableTotals.payableByYou, color: "#ef4444" }, // red
  ].filter(item => item.value > 0); // Only show segments with value

  const COLORS = ["#10b981", "#ef4444"];

  // If there's no data, show a message
  if (chartData.length === 0 || (payableTotals.payableToYou === 0 && payableTotals.payableByYou === 0)) {
    return (
      <Card className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Balance Summary</h2>
        <p className="text-muted-foreground">No balances to display</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary" />
        Balance Summary
      </h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => formatCurrency(Number(value))} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {payableTotals.payableToYou > 0 && (
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="text-green-500 h-5 w-5" />
              <span className="font-medium">Payable to you</span>
            </div>
            <span className="font-bold text-green-600">{formatCurrency(payableTotals.payableToYou)}</span>
          </div>
        )}
        
        {payableTotals.payableByYou > 0 && (
          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <ArrowUpFromLine className="text-red-500 h-5 w-5" />
              <span className="font-medium">Payable to others</span>
            </div>
            <span className="font-bold text-red-600">{formatCurrency(payableTotals.payableByYou)}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
