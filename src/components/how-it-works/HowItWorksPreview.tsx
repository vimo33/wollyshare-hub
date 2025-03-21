
import { ArrowRight, Users, Calendar, Package, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorksPreview = () => {
  const steps = [
    {
      title: "Join Community",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      description: "Sign up and connect with your neighbors"
    },
    {
      title: "Share Items",
      icon: <Package className="h-6 w-6 text-green-600" />,
      description: "List items you're willing to lend"
    },
    {
      title: "Borrow Items",
      icon: <Calendar className="h-6 w-6 text-yellow-600" />,
      description: "Find and borrow what you need"
    },
    {
      title: "Return & Review",
      icon: <RefreshCw className="h-6 w-6 text-purple-600" />,
      description: "Return items and build trust"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            WollyShare makes it easy to share resources with your community. Here's how to get started:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-primary/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/how-it-works" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
            Learn more about how it works
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksPreview;
