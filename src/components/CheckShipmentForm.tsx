"use client";

import { useState } from "react";
import { CheckShipmentData } from "@/types/shipment";
import { Search, MapPin, Package } from "lucide-react";

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
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipment ID */}
        <div>
          <label htmlFor="shipmentId" className="block text-sm font-medium text-gray-700 mb-2">
            Shipment ID
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="shipmentId"
              name="shipmentId"
              value={formData.shipmentId}
              onChange={handleInputChange}
              placeholder="Enter shipment ID (e.g., ship-1003)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Token ID */}
        <div>
          <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700 mb-2">
            Token ID
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="tokenId"
              name="tokenId"
              value={formData.tokenId}
              onChange={handleInputChange}
              placeholder="Enter token ID"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Current Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Current Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter your current location (e.g., New York, NY or London, UK)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.shipmentId.trim() || !formData.tokenId.trim() || !formData.location.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Verifying Shipment...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              Verify Shipment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
