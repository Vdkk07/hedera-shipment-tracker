"use client";

import { useState } from "react";
import { CheckShipmentForm } from "@/components/CheckShipmentForm";
import { CheckShipmentData, VerifyShipmentResponse } from "@/types/shipment";
import { CustomSidebar } from "@/components/CustomSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function CheckShipment() {
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<{
        success: boolean;
        message: string;
        data?: VerifyShipmentResponse["shipment"];
    } | null>(null);

    const handleVerifyShipment = async (data: CheckShipmentData) => {
        setIsVerifying(true);
        setVerificationResult(null); // Clear previous results

        try {
            const response = await axios.get<VerifyShipmentResponse>(
                `${process.env.BACKEND_URL}/api/verify-shipment`,
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Check Shipment Status</h1>
                    <p className="text-muted-foreground">
                        Enter your shipment ID and token ID to verify the shipment status and location.
                    </p>
                </div>
                <CheckShipmentForm
                    onSubmit={handleVerifyShipment}
                    isLoading={isVerifying}
                />
                
                {/* Verification Result Card */}
                {verificationResult && (
                    <div className="mt-8">
                        {verificationResult.success ? (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {verificationResult.data?.status === "Delivered" ? (
                                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                                    <span className="text-green-500 text-xl">✅</span>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-500 text-xl">📦</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <CardTitle className="text-foreground">
                                                {verificationResult.data?.status === "Delivered" ? "DELIVERED" : "In Transit"}
                                            </CardTitle>
                                            <p className="text-muted-foreground">{verificationResult.message}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {verificationResult.data ? (
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-foreground mb-4">Shipment Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">ID:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Shipment ID:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.shipment_id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Token ID:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.token_id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.status}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Sender:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.sender}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Receiver:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.receiver}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Contents:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.contents}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Current Location:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.current_location}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Current Owner:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.current_owner}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Receiver Account ID:</span>
                                                        <p className="text-sm text-foreground">{verificationResult.data.receiver_account_id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Created At:</span>
                                                        <p className="text-sm text-foreground">{new Date(verificationResult.data.created_at).toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">NFT Mint Transaction ID:</span>
                                                        <p className="text-xs text-foreground break-all">{verificationResult.data.nft_mint_tx_id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Shipment CID:</span>
                                                        <p className="text-xs text-foreground break-all">{verificationResult.data.shipment_cid}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">No shipment data available</p>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-destructive">
                                <CardHeader>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                                                <span className="text-destructive text-xl">❌</span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <CardTitle className="text-destructive">Verification Failed</CardTitle>
                                            <p className="text-muted-foreground">{verificationResult.message}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </CustomSidebar>
    );
}