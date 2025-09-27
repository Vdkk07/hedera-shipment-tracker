"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateShipmentData } from "@/types/shipment";

interface CreateShipmentFormProps {
  onSubmit: (data: CreateShipmentData) => void;
  isLoading?: boolean;
}

export function CreateShipmentForm({ onSubmit, isLoading = false }: CreateShipmentFormProps) {
  const [formData, setFormData] = useState<CreateShipmentData>({
    tokenName: "",
    tokenSymbol: "",
    shipmentId: "",
    from: "",
    to: "",
    contents: "",
    receiverAccountId: "",
  });

  const handleInputChange = (field: keyof CreateShipmentData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== "");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
        <CardDescription>
          Fill in the details below to create a new shipment tracking entry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tokenName">Token Name</Label>
              <Input
                id="tokenName"
                type="text"
                placeholder="Enter token name"
                value={formData.tokenName}
                onChange={handleInputChange("tokenName")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenSymbol">Token Symbol</Label>
              <Input
                id="tokenSymbol"
                type="text"
                placeholder="Enter token symbol"
                value={formData.tokenSymbol}
                onChange={handleInputChange("tokenSymbol")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipmentId">Shipment ID</Label>
              <Input
                id="shipmentId"
                type="text"
                placeholder="Enter shipment ID"
                value={formData.shipmentId}
                onChange={handleInputChange("shipmentId")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverAccountId">Receiver Account ID</Label>
              <Input
                id="receiverAccountId"
                type="text"
                placeholder="Enter receiver account ID"
                value={formData.receiverAccountId}
                onChange={handleInputChange("receiverAccountId")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                type="text"
                placeholder="Enter origin location"
                value={formData.from}
                onChange={handleInputChange("from")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="text"
                placeholder="Enter destination location"
                value={formData.to}
                onChange={handleInputChange("to")}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contents">Contents</Label>
            <Input
              id="contents"
              type="text"
              placeholder="Describe the shipment contents"
              value={formData.contents}
              onChange={handleInputChange("contents")}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black font-semibold"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Creating Shipment..." : "Create Shipment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
