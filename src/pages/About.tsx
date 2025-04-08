
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-4">Built for Communities, Powered by Communities</h2>
        <p className="text-muted-foreground leading-relaxed">
          WollyShare isn't just an app—it's an open-source tool that any community can
          <span className="font-semibold">&nbsp;set up, host, and use for free</span>. Whether you're 
          part of a neighborhood association, a housing cooperative, or a local sustainability 
          initiative, you can take control by running WollyShare on your own infrastructure, 
          ensuring privacy and autonomy.
        </p>
      </CardContent>
    </Card>
  );
};

export default About;
