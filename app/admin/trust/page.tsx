import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminTrustDashboard } from "@/lib/api/trust";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// lightweight stat card
function CardStat({
  icon,
  label,
  primary,
  secondary,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary: string;
  variant?: "default" | "destructive" | "warning";
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case "destructive":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={getVariantClasses()}>
          {icon}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
      <div className="text-2xl font-bold">{primary}</div>
      <div className="text-xs text-muted-foreground">{secondary}</div>
    </div>
  );
}

// ... rest of the component implementation would go here