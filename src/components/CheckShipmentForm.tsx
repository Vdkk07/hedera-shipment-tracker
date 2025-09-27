"use client";

import { useState } from "react";
import { CheckShipmentData } from "@/types/shipment";
import { Search, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CheckShipmentFormProps {
  onSubmit: (data: CheckShipmentData) => Promise<void>;
  isLoading: boolean;
}

export function CheckShipmentForm({ onSubmit, isLoading }: CheckShipmentFormProps) {
  const [formData, setFormData] = useState({
    shipmentId: "",
    tokenId: "",
    location: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shipmentId.trim() || !formData.tokenId.trim() || !formData.location.trim()) {
      return;
    }

    await onSubmit({
      shipmentId: formData.shipmentId,
      tokenId: formData.tokenId,
      location: formData.location,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-foreground">Verify Shipment</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your shipment details to verify the status and location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipment ID */}
          <div className="space-y-2">
            <label htmlFor="shipmentId" className="text-sm font-medium text-foreground">
              Shipment ID
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                id="shipmentId"
                name="shipmentId"
                value={formData.shipmentId}
                onChange={handleInputChange}
                placeholder="Enter shipment ID (e.g., ship-1003)"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Token ID */}
          <div className="space-y-2">
            <label htmlFor="tokenId" className="text-sm font-medium text-foreground">
              Token ID
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                id="tokenId"
                name="tokenId"
                value={formData.tokenId}
                onChange={handleInputChange}
                placeholder="Enter token ID"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Current Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-foreground">
              Current Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your current location (e.g., New York, NY or London, UK)"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !formData.shipmentId.trim() || !formData.tokenId.trim() || !formData.location.trim()}
            className="w-full bg-white text-black font-semibold cursor-pointer"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Verifying Shipment...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Verify Shipment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
