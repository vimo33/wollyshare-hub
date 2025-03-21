
import { Users, Calendar, Package, RefreshCw } from "lucide-react";
import StepCard from "@/components/how-it-works/StepCard";
import FAQ from "@/components/how-it-works/FAQ";
import CommunityGuidelines from "@/components/how-it-works/CommunityGuidelines";

const HowItWorks = () => {
  const stepCards = [
    {
      title: "1. Getting Started",
      icon: <Users />,
      iconBgColor: "bg-wolly-green/30",
      iconTextColor: "text-green-700",
      checkColor: "text-green-600",
      borderColor: "border-wolly-green/50",
      items: [
        "Join the App: You'll receive an invitation from your community administrator.",
        "Access the Dashboard: Once signed up, you'll land on the main dashboard—the heart of the app."
      ]
    },
    {
      title: "2. Setting Up Your Profile",
      icon: <Calendar />,
      iconBgColor: "bg-wolly-blue/30",
      iconTextColor: "text-blue-700",
      checkColor: "text-blue-600",
      borderColor: "border-wolly-blue/50",
      items: [
        "Add Your Details: Fill in your name, door number, and building number.",
        "Set Convenient Times: Specify when you're available for item pickups and drop-offs."
      ]
    },
    {
      title: "3. Sharing Items",
      icon: <Package />,
      iconBgColor: "bg-wolly-yellow/30",
      iconTextColor: "text-yellow-700",
      checkColor: "text-yellow-600",
      borderColor: "border-wolly-yellow/50",
      items: [
        "List an Item: Tap \"Add Item\" to list something you own, like a ladder or a blender.",
        "Provide Details: Add the item's name, description, and pick a category."
      ]
    },
    {
      title: "4. Finding and Borrowing Items",
      icon: <RefreshCw />,
      iconBgColor: "bg-wolly-purple/30",
      iconTextColor: "text-purple-700",
      checkColor: "text-purple-600",
      borderColor: "border-wolly-purple/50",
      items: [
        "Search or Browse: Use the search bar or filters to find what you need.",
        "Check the Details: View the owner's profile with name, location, and convenient times.",
        "Pick It Up: Visit the owner during their convenient times to borrow the item."
      ]
    }
  ];

  const returnStep = {
    title: "5. Returning Items",
    icon: <RefreshCw />,
    iconBgColor: "bg-wolly-pink/30",
    iconTextColor: "text-pink-700",
    checkColor: "text-pink-600",
    borderColor: "border-wolly-pink/50",
    items: [
      "Return the Item: When finished, drop the item back off with the owner during their convenient times."
    ]
  };

  const communityGuidelines = [
    {
      title: "Be Respectful",
      description: "Show up on time and treat your neighbors kindly."
    },
    {
      title: "Take Care",
      description: "Look after borrowed items and return them in the same condition."
    },
    {
      title: "Communicate",
      description: "Let your neighbors know when you'll pick up or return an item."
    },
    {
      title: "Build Trust",
      description: "This app thrives on trust—be reliable and considerate."
    }
  ];

  const faqs = [
    {
      id: "item-1",
      question: "What if I can't find the item I need?",
      answer: "Check back later or ask your neighbors—they might have it but haven't listed it yet."
    },
    {
      id: "item-2",
      question: "How do I report a problem with an item?",
      answer: "Reach out to the owner through the app, or contact your community administrator if you need extra help."
    },
    {
      id: "item-3",
      question: "Can I share more than one item?",
      answer: "Yes! List as many items as you'd like to share with the community."
    }
  ];

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
        {stepCards.map((card, index) => (
          <StepCard
            key={index}
            title={card.title}
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            iconTextColor={card.iconTextColor}
            checkColor={card.checkColor}
            borderColor={card.borderColor}
            items={card.items}
          />
        ))}
      </div>

      <div className="mb-16">
        <StepCard
          title={returnStep.title}
          icon={returnStep.icon}
          iconBgColor={returnStep.iconBgColor}
          iconTextColor={returnStep.iconTextColor}
          checkColor={returnStep.checkColor}
          borderColor={returnStep.borderColor}
          items={returnStep.items}
        />
      </div>

      <CommunityGuidelines guidelines={communityGuidelines} />

      <FAQ faqs={faqs} />

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
