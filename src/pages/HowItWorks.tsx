
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, Calendar, Package, RefreshCw, HelpCircle } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to Community Share, your neighborhood sharing hub! This app lets you lend and borrow items like tools, 
          appliances, and household goods with your neighbors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="border-2 border-wolly-green/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-wolly-green/30 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Getting Started</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-green-600 mt-0.5" />
                    <span>Join the App: You'll receive an invitation from your community administrator.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-green-600 mt-0.5" />
                    <span>Access the Dashboard: Once signed up, you'll land on the main dashboard—the heart of the app.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-wolly-blue/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-wolly-blue/30 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Setting Up Your Profile</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-blue-600 mt-0.5" />
                    <span>Add Your Details: Fill in your name, door number, and building number.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-blue-600 mt-0.5" />
                    <span>Set Convenient Times: Specify when you're available for item pickups and drop-offs.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-wolly-yellow/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-wolly-yellow/30 p-3 rounded-full">
                <Package className="h-6 w-6 text-yellow-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Sharing Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-yellow-600 mt-0.5" />
                    <span>List an Item: Tap "Add Item" to list something you own, like a ladder or a blender.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-yellow-600 mt-0.5" />
                    <span>Provide Details: Add the item's name, description, and pick a category.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-wolly-purple/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-wolly-purple/30 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">4. Finding and Borrowing Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-purple-600 mt-0.5" />
                    <span>Search or Browse: Use the search bar or filters to find what you need.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-purple-600 mt-0.5" />
                    <span>Check the Details: View the owner's profile with name, location, and convenient times.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-purple-600 mt-0.5" />
                    <span>Pick It Up: Visit the owner during their convenient times to borrow the item.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16">
        <Card className="border-2 border-wolly-pink/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-wolly-pink/30 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-pink-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">5. Returning Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-pink-600 mt-0.5" />
                    <span>Return the Item: When finished, drop the item back off with the owner during their convenient times.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-4">6. Community Guidelines</h2>
        <p className="mb-4 text-muted-foreground">To keep Community Share running smoothly, here are a few friendly rules:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Be Respectful</h4>
              <p className="text-sm text-muted-foreground">Show up on time and treat your neighbors kindly.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Take Care</h4>
              <p className="text-sm text-muted-foreground">Look after borrowed items and return them in the same condition.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Communicate</h4>
              <p className="text-sm text-muted-foreground">Let your neighbors know when you'll pick up or return an item.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Build Trust</h4>
              <p className="text-sm text-muted-foreground">This app thrives on trust—be reliable and considerate.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg p-2">
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <span>What if I can't find the item I need?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              Check back later or ask your neighbors—they might have it but haven't listed it yet.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border rounded-lg p-2">
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <span>How do I report a problem with an item?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              Reach out to the owner through the app, or contact your community administrator if you need extra help.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border rounded-lg p-2">
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <span>Can I share more than one item?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              Yes! List as many items as you'd like to share with the community.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="text-center mb-12">
        <p className="text-lg text-muted-foreground">
          That's it! With Community Share, you're all set to start borrowing, lending, and connecting with your neighbors. 
          If you have any questions, your community administrator is here to help. Happy sharing!
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
