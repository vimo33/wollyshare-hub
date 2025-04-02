
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    color?: string;
  };
  children?: ReactNode;
}

const PageHeader = ({
  title,
  description,
  badge,
  children
}: PageHeaderProps) => {
  return (
    <div className="text-center mb-12">
      {badge && (
        <div className={`inline-block mb-4 px-4 py-2 rounded-full ${badge.color || "bg-wolly-blue/30 backdrop-blur-sm"}`}>
          <span className="text-sm font-medium text-blue-800">{badge.text}</span>
        </div>
      )}
      
      <h1 className="text-4xl font-bold mb-4">LendTogether</h1>
      
      {description && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
};

export default PageHeader;
