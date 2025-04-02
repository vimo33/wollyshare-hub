
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";

const About = () => {
  return (
    <main className="container max-w-5xl mx-auto py-12 px-4 space-y-16">
      {/* Page Header */}
      <PageHeader
        title="About WollyShare"
        description="A community-driven platform designed to make sharing simple, sustainable, and accessible."
        badge={{ text: "Open Source", color: "bg-wolly-green/40" }}
      />

      {/* Main Content */}
      <div className="space-y-12">
        {/* Mission Section */}
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-gradient-to-r from-wolly-green/20 to-wolly-blue/20 p-1"></div>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Empowering Communities Through Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe that the best way to build a greener, more connected world is by making 
              better use of what we already have. Many of us own tools, appliances, and household 
              items that sit unused for most of the year—while someone just next door might need them. 
              WollyShare helps existing communities come together, share resources, and reduce 
              unnecessary consumption, fostering a culture of trust and collaboration.
            </p>
          </CardContent>
        </Card>

        {/* Built for Communities Section */}
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-gradient-to-r from-wolly-blue/20 to-wolly-purple/20 p-1"></div>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Built for Communities, Powered by Communities</h2>
            <p className="text-muted-foreground leading-relaxed">
              WollyShare isn't just an app—it's an open-source tool that any community can 
              <span className="font-semibold"> set up, host, and use for free</span>. Whether you're 
              part of a neighborhood association, a housing cooperative, or a local sustainability 
              initiative, you can take control by running WollyShare on your own infrastructure, 
              ensuring privacy and autonomy.
            </p>
          </CardContent>
        </Card>

        {/* Why WollyShare Section */}
        <div className="py-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why WollyShare?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-none bg-wolly-green/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-wolly-green rounded-full p-3 text-xl">🌱</div>
                <div>
                  <h3 className="font-bold mb-2">Sustainable Living</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce waste, save resources, and make sharing the norm.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-none bg-wolly-blue/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-wolly-blue rounded-full p-3 text-xl">🏡</div>
                <div>
                  <h3 className="font-bold mb-2">Stronger Communities</h3>
                  <p className="text-sm text-muted-foreground">
                    Encourage real connections with neighbors through trust and generosity.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-none bg-wolly-yellow/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-wolly-yellow rounded-full p-3 text-xl">🔓</div>
                <div>
                  <h3 className="font-bold mb-2">Open & Free</h3>
                  <p className="text-sm text-muted-foreground">
                    No hidden costs, no centralized control—just a tool designed to serve communities.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-none bg-wolly-purple/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-wolly-purple rounded-full p-3 text-xl">🔧</div>
                <div>
                  <h3 className="font-bold mb-2">Easy to Set Up</h3>
                  <p className="text-sm text-muted-foreground">
                    WollyShare is built for communities of all sizes, with a simple onboarding process.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-8">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 border-none shadow-sm bg-gradient-to-b from-background to-wolly-green/5">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-wolly-green flex items-center justify-center mb-4 text-xl">
                  1️⃣
                </div>
                <h3 className="font-bold mb-2">Set Up</h3>
                <p className="text-sm text-muted-foreground">
                  Your community administrator installs and configures the app.
                </p>
              </div>
            </Card>
            <Card className="p-6 border-none shadow-sm bg-gradient-to-b from-background to-wolly-blue/5">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-wolly-blue flex items-center justify-center mb-4 text-xl">
                  2️⃣
                </div>
                <h3 className="font-bold mb-2">Join</h3>
                <p className="text-sm text-muted-foreground">
                  Members create their profiles and list items they are willing to share.
                </p>
              </div>
            </Card>
            <Card className="p-6 border-none shadow-sm bg-gradient-to-b from-background to-wolly-yellow/5">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-wolly-yellow flex items-center justify-center mb-4 text-xl">
                  3️⃣
                </div>
                <h3 className="font-bold mb-2">Borrow & Share</h3>
                <p className="text-sm text-muted-foreground">
                  Search for items, connect with the owner, and arrange pickup.
                </p>
              </div>
            </Card>
            <Card className="p-6 border-none shadow-sm bg-gradient-to-b from-background to-wolly-pink/5">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-wolly-pink flex items-center justify-center mb-4 text-xl">
                  4️⃣
                </div>
                <h3 className="font-bold mb-2">Give Back</h3>
                <p className="text-sm text-muted-foreground">
                  Return items in good condition and keep the sharing cycle going.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* A Movement for Change Section */}
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-gradient-to-r from-wolly-purple/20 to-wolly-green/20 p-1"></div>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">A Movement for Change</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              WollyShare is more than an app—it's a statement that <span className="font-semibold">we don't need to own everything individually to have access to what we need.</span> By sharing within our communities, we reduce overconsumption, minimize waste, and build stronger relationships.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We invite you to be part of this movement. <span className="font-semibold">Host it. Share it. Make it yours.</span>
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-8">
          <p className="text-lg font-semibold mb-6">
            👉 Join WollyShare and start building a sharing culture in your community today!
          </p>
          <div className="flex justify-center">
            <a href="/how-it-works" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
