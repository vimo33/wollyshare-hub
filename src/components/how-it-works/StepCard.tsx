
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StepCardProps {
  title: string;
  icon: ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  checkColor: string;
  borderColor: string;
  items: string[];
}

const StepCard = ({
  title,
  icon,
  iconBgColor,
  iconTextColor,
  checkColor,
  borderColor,
  items
}: StepCardProps) => {
  return (
    <Card className={`border-2 ${borderColor} shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <div className={`h-6 w-6 ${iconTextColor}`}>{icon}</div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <ul className="space-y-2 text-muted-foreground">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className={`h-5 w-5 min-w-5 ${checkColor} mt-0.5`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
