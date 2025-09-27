"use client";

import { useState } from "react";
import { CheckShipmentForm } from "@/components/CheckShipmentForm";
import { CheckShipmentData, VerifyShipmentResponse } from "@/types/shipment";
import { CustomSidebar } from "@/components/CustomSidebar";
import axios from "axios";

export default function CheckShipment() {
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerifyShipment = async (data: CheckShipmentData) => {
        setIsVerifying(true);

        try {
            const response = await axios.get<VerifyShipmentResponse>(
                `http://localhost:4000/api/verify-shipment`,
                {
                    params: {
                        shipmentId: data.shipmentId,
                        tokenId: data.tokenId,
                        location: data.location,
                    }
                }
            );

            if (response.data.success) {
                console.log("✅ It's a success! Shipment verification completed successfully.");
                console.log("Verification details:", response.data);
                
                // Show success message to user
                alert(`✅ Shipment verification successful!\n\nShipment ID: ${data.shipmentId}\nToken ID: ${data.tokenId}\nStatus: ${response.data.data?.status || 'Verified'}`);
            } else {
                console.error("❌ It's an error! Shipment verification failed.");
                console.error("Error details:", response.data.message);
                
                // Show error message to user
                alert(`❌ Shipment verification failed!\n\nError: ${response.data.message}`);
            }

        } catch (error) {
            console.error("❌ It's an error! Failed to verify shipment:", error);
            
            // Show error message to user
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                alert(`❌ Failed to verify shipment!\n\nError: ${errorMessage}`);
            } else {
                alert("❌ Failed to verify shipment! Please try again.");
            }
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <CustomSidebar>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Check Shipment Status</h1>
                <p className="text-gray-600 mb-8">
                    Enter your shipment ID and token ID to verify the shipment status and location.
                </p>
                <CheckShipmentForm
                    onSubmit={handleVerifyShipment}
                    isLoading={isVerifying}
                />
            </div>
        </CustomSidebar>
    );
}