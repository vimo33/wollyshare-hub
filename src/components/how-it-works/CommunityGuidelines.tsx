
import { CheckCircle2 } from "lucide-react";

interface GuidelineItem {
  title: string;
  description: string;
}

interface CommunityGuidelinesProps {
  guidelines: GuidelineItem[];
}

const CommunityGuidelines = ({ guidelines }: CommunityGuidelinesProps) => {
  return (
    <div className="bg-gray-50 rounded-xl p-8 mb-16">
      <h2 className="text-2xl font-bold mb-4">6. Community Guidelines</h2>
      <p className="mb-4 text-muted-foreground">To keep Community Share running smoothly, here are a few friendly rules:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidelines.map((guideline, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">{guideline.title}</h4>
              <p className="text-sm text-muted-foreground">{guideline.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityGuidelines;
