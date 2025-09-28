"use client";

import { useState } from "react";
import { CreateShipmentForm } from "@/components/CreateShipmentForm";
import { CreateShipmentData, ShipmentStatus } from "@/types/shipment";
import { CustomSidebar } from "@/components/CustomSidebar";
import axios from "axios";

export default function CreateShipment() {
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateShipment = async (data: CreateShipmentData) => {
        setIsCreating(true);

        try {
            const response = await axios.post(
                `${process.env.BACKEND_URL}/api/create-nft`,
                {
                    tokenName: data.tokenName,
                    tokenSymbol: data.tokenSymbol,
                    shipmentId: data.shipmentId,
                    from: data.from,
                    to: data.to,
                    contents: data.contents,
                    receiverAccountId: data.receiverAccountId,
                }
            );

            console.log("Shipment created successfully:", response.data);

            // TODO: Add success toast/notification and redirect
            alert("Shipment created successfully!");

        } catch (error) {
            console.error("Error creating shipment:", error);
            alert("Failed to create shipment. Please try again.");
        } finally {
            setIsCreating(false);
        }
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
