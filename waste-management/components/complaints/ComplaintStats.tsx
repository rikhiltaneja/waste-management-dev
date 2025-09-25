import { Card } from "@/components/ui/card";
import { Complaint } from "@/types";

interface ComplaintStatsProps {
  complaints: Complaint[];
}

export function ComplaintStats({ complaints }: ComplaintStatsProps) {
  const stats = [
    {
      label: "Pending",
      count: complaints.filter(c => c.status === 'PENDING').length,
      color: "text-yellow-600"
    },
    {
      label: "In Progress", 
      count: complaints.filter(c => c.status === 'IN_PROGRESS').length,
      color: "text-blue-600"
    },
    {
      label: "Resolved",
      count: complaints.filter(c => c.status === 'RESOLVED').length,
      color: "text-green-600"
    },
    {
      label: "Total",
      count: complaints.length,
      color: "text-gray-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
}