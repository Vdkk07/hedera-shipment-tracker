"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateShipmentForm } from "@/components/CreateShipmentForm";
import { ShipmentTable } from "@/components/ShipmentTable";
import { CreateShipmentData, Shipment, ShipmentStatus } from "@/types/shipment";
import { Plus, Search } from "lucide-react";
import { CustomSidebar } from "@/components/CustomSidebar";

export default function Dashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const searchParams = useSearchParams();

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

  const handleCreateShipment = async (data: CreateShipmentData) => {
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newShipment: Shipment = {
      id: Date.now().toString(),
      ...data,
      status: ShipmentStatus.CREATED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setShipments(prev => [newShipment, ...prev]);
    setIsCreating(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShipments(mockShipments);
    setIsLoading(false);
  };

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'create' || tab === 'status') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Initialize with mock data on first render
  if (shipments.length === 0 && !isLoading) {
    setShipments(mockShipments);
  }

  return (
    <CustomSidebar>
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Shipment
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Check Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <CreateShipmentForm 
              onSubmit={handleCreateShipment} 
              isLoading={isCreating}
            />
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <ShipmentTable 
              shipments={shipments} 
              isLoading={isLoading}
              onRefresh={handleRefresh}
            />
          </TabsContent>
        </Tabs>
      </div>
    </CustomSidebar>
  );
}