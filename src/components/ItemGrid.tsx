
import { useEffect } from "react";
import ItemGridContainer from "./items/ItemGridContainer";

// This component should ensure we're showing ALL users' items on the homepage
const ItemGrid = () => {
  useEffect(() => {
    // Add explicit debugging for the ItemGrid component
    console.log("ItemGrid component rendered - this should display ALL items");
  }, []);
  
  return <ItemGridContainer showAllItems={true} />;
};

export default ItemGrid;
