"use client";

import { useState } from "react";
import { CheckShipmentForm } from "@/components/CheckShipmentForm";
import { CheckShipmentData, VerifyShipmentResponse } from "@/types/shipment";
import { CustomSidebar } from "@/components/CustomSidebar";
import axios from "axios";

export default function CheckShipment() {
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<{
        success: boolean;
        message: string;
        data?: VerifyShipmentResponse['data'];
    } | null>(null);

    const handleVerifyShipment = async (data: CheckShipmentData) => {
        setIsVerifying(true);
        setVerificationResult(null); // Clear previous results

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
                console.log("It's a success! Shipment verification completed successfully.");
                console.log("Verification details:", response.data);
                console.log("Response data:", response.data.shipment);
                
                setVerificationResult({
                    success: true,
                    message: "Shipment verification successful!",
                    data: response.data.shipment
                });
            } else {
                console.error("It's an error! Shipment verification failed.");
                console.error("Error details:", response.data.message);
                
                setVerificationResult({
                    success: false,
                    message: response.data.message
                });
            }

        } catch (error) {
            console.error("It's an error! Failed to verify shipment:", error);
            
            let errorMessage = "Failed to verify shipment! Please try again.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            }
            
            setVerificationResult({
                success: false,
                message: errorMessage
            });
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
                
                {/* Verification Result Card */}
                {verificationResult && (
                    <div className="mt-8">
                        {verificationResult.success ? (
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0">
                                        {verificationResult.data?.status === "Delivered" ? (
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 text-xl">✅</span>
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 text-xl">📦</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {verificationResult.data?.status === "Delivered" ? "DELIVERED" : "In Transits"}
                                        </h3>
                                        <p className="text-sm text-gray-600">{verificationResult.message}</p>
                                    </div>
                                </div>
                                
                                {/* Always show details section for successful verification */}
                                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                    <h4 className="text-md font-semibold text-gray-800 mb-4">Shipment Details</h4>
                                    {verificationResult.data ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">ID:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.id}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Shipment ID:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.shipment_id}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Token ID:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.token_id}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Status:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.status}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Sender:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.sender}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Receiver:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.receiver}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Contents:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.contents}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Current Location:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.current_location}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Current Owner:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.current_owner}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Receiver Account ID:</span>
                                                    <p className="text-sm text-gray-900">{verificationResult.data.receiver_account_id}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Created At:</span>
                                                    <p className="text-sm text-gray-900">{new Date(verificationResult.data.created_at).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">NFT Mint Transaction ID:</span>
                                                    <p className="text-xs text-gray-900 break-all">{verificationResult.data.nft_mint_tx_id}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Shipment CID:</span>
                                                    <p className="text-xs text-gray-900 break-all">{verificationResult.data.shipment_cid}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No shipment data available</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <span className="text-red-600 text-xl">❌</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-semibold text-red-800">Verification Failed</h3>
                                        <p className="text-sm text-red-600">{verificationResult.message}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CustomSidebar>
    );
}