"use client";

import { useState } from "react";
import { CreateShipmentForm } from "@/components/CreateShipmentForm";
import { CreateShipmentData, ShipmentStatus } from "@/types/shipment";
import { CustomSidebar } from "@/components/CustomSidebar";

export default function CreateStatusPage() {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateShipment = async (data: CreateShipmentData) => {
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, just show success - in a real app, you'd redirect or show a success message
    console.log("Shipment created:", data);
    setIsCreating(false);
  };

  return (
    <CustomSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Shipment</h1>
        <CreateShipmentForm 
          onSubmit={handleCreateShipment} 
          isLoading={isCreating}
        />
      </div>
    </CustomSidebar>
  );
}
