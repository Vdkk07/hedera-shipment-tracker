"use client";

import { useState, useEffect } from "react";
import { ShipmentTable } from "@/components/ShipmentTable";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { CustomSidebar } from "@/components/CustomSidebar";

export default function CheckStatus() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockShipments: Shipment[] = [
    {
      id: "1",
      tokenName: "Digital Gold",
      tokenSymbol: "DGOLD",
      shipmentId: "SHIP-001",
      from: "New York, NY",
      to: "Los Angeles, CA",
      contents: "Electronics and gadgets",
      receiverAccountId: "0.0.123456",
      status: ShipmentStatus.IN_TRANSIT,
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-16T14:20:00"),
    },
    {
      id: "2",
      tokenName: "Silver Token",
      tokenSymbol: "SILVER",
      shipmentId: "SHIP-002",
      from: "Chicago, IL",
      to: "Miami, FL",
      contents: "Medical supplies",
      receiverAccountId: "0.0.789012",
      status: ShipmentStatus.DELIVERED,
      createdAt: new Date("2024-01-10T08:15:00"),
      updatedAt: new Date("2024-01-12T16:45:00"),
    },
    {
      id: "3",
      tokenName: "Platinum Coin",
      tokenSymbol: "PLAT",
      shipmentId: "SHIP-003",
      from: "Seattle, WA",
      to: "Boston, MA",
      contents: "Luxury items",
      receiverAccountId: "0.0.345678",
      status: ShipmentStatus.CREATED,
      createdAt: new Date("2024-01-20T12:00:00"),
      updatedAt: new Date("2024-01-20T12:00:00"),
    },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShipments(mockShipments);
    setIsLoading(false);
  };

  // Initialize with mock data on first render
  useEffect(() => {
    if (shipments.length === 0 && !isLoading) {
      setShipments(mockShipments);
    }
  }, [shipments.length, isLoading]);

  return (
    <CustomSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Shipment Status</h1>
        <ShipmentTable 
          shipments={shipments} 
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </div>
    </CustomSidebar>
  );
}
