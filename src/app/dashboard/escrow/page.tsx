"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CustomSidebar } from "@/components/CustomSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, User, Building2, DollarSign, RefreshCw, FileText, Plus, X, Calendar, CheckCircle, AlertCircle } from "lucide-react";

interface EscrowData {
  tokenId: string;
  lockedAmount: string;
  supplier: string;
  receiver: string;
  status: "Locked" | "Released";
  lastUpdated: string;
  nftOwner: string;
}

interface ContractData {
  contractId: string;
  partyA: string;
  partyB: string;
  amount: string;
  terms: string;
  status: "Active" | "Completed" | "Cancelled";
  createdAt: string;
  expiresAt: string;
}

export default function Escrow() {
  const params = useParams();
  const tokenId = params?.tokenId as string;
  
  const [escrowData, setEscrowData] = useState<EscrowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Contract creation state
  const [showContractForm, setShowContractForm] = useState(false);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [contractForm, setContractForm] = useState({
    partyA: "",
    partyB: "",
    amount: "",
    terms: "",
    expiresIn: "30" // days
  });

  // Escrow editing state
  const [isEditingEscrow, setIsEditingEscrow] = useState(false);
  const [isSavingEscrow, setIsSavingEscrow] = useState(false);
  const [escrowFormData, setEscrowFormData] = useState<EscrowData | null>(null);

  // Mock data - replace with actual API call
  const mockEscrowData: EscrowData = {
    tokenId: tokenId || "12345",
    lockedAmount: "1000.00",
    supplier: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    receiver: "0x8ba1f109551bD432803012645Hac136c",
    status: "Locked",
    lastUpdated: new Date().toISOString(),
    nftOwner: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
  };

  useEffect(() => {
    fetchEscrowData();
  }, [tokenId]);

  useEffect(() => {
    if (escrowData) {
      setEscrowFormData(escrowData);
    }
  }, [escrowData]);

  const fetchEscrowData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would call your API here:
      // const response = await axios.get(`/api/escrow/${tokenId}`);
      // setEscrowData(response.data);
      
      setEscrowData(mockEscrowData);
    } catch (err) {
      setError("Failed to fetch escrow data");
      console.error("Error fetching escrow data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEscrowData();
    setIsRefreshing(false);
  };

  const handleContractInputChange = (field: keyof typeof contractForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContractForm(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingContract(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newContract: ContractData = {
        contractId: `CONTRACT-${Date.now()}`,
        partyA: contractForm.partyA,
        partyB: contractForm.partyB,
        amount: contractForm.amount,
        terms: contractForm.terms,
        status: "Active",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + parseInt(contractForm.expiresIn) * 24 * 60 * 60 * 1000).toISOString()
      };

      setContracts(prev => [newContract, ...prev]);
      setContractForm({
        partyA: "",
        partyB: "",
        amount: "",
        terms: "",
        expiresIn: "30"
      });
      setShowContractForm(false);
    } catch (err) {
      console.error("Error creating contract:", err);
    } finally {
      setIsCreatingContract(false);
    }
  };

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="warning" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>;
      case "Completed":
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive" className="flex items-center gap-1"><X className="h-3 w-3" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleEscrowInputChange = (field: keyof EscrowData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (escrowFormData) {
      setEscrowFormData(prev => ({
        ...prev!,
        [field]: e.target.value,
      }));
    }
  };

  const handleSaveEscrow = async () => {
    if (!escrowFormData) return;
    
    setIsSavingEscrow(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the escrow data
      setEscrowData(escrowFormData);
      setIsEditingEscrow(false);
    } catch (err) {
      console.error("Error saving escrow data:", err);
    } finally {
      setIsSavingEscrow(false);
    }
  };

  const handleCancelEdit = () => {
    if (escrowData) {
      setEscrowFormData(escrowData);
    }
    setIsEditingEscrow(false);
  };

  // Group contracts by party pairs
  const getContractGroups = () => {
    const groups: { [key: string]: ContractData[] } = {};
    
    contracts.forEach(contract => {
      // Create a consistent key for the pair regardless of order
      const parties = [contract.partyA, contract.partyB].sort().join('|');
      if (!groups[parties]) {
        groups[parties] = [];
      }
      groups[parties].push(contract);
    });
    
    return groups;
  };

  const getStatusIcon = (status: string) => {
    return status === "Locked" ? (
      <Lock className="h-4 w-4" />
    ) : (
      <Unlock className="h-4 w-4" />
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "Locked" ? (
      <Badge variant="warning" className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    ) : (
      <Badge variant="success" className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <CustomSidebar>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span>Loading escrow details...</span>
            </div>
          </div>
        </div>
      </CustomSidebar>
    );
  }

  if (error) {
    return (
      <CustomSidebar>
        <div className="p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <RefreshCw className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Error Loading Escrow Data</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleRefresh} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CustomSidebar>
    );
  }

  if (!escrowData) {
    return (
      <CustomSidebar>
        <div className="p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Escrow Not Found</h3>
                <p className="text-muted-foreground">No escrow data found for token ID: {tokenId}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CustomSidebar>
    );
  }

  return (
    <CustomSidebar>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Escrow Details</h1>
            <p className="text-muted-foreground">Token ID: {escrowData.tokenId}</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Main Escrow Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Escrow Information
                </CardTitle>
                <CardDescription>
                  {isEditingEscrow ? "Edit escrow details" : `Current escrow status and details for token ${escrowData.tokenId}`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingEscrow && getStatusBadge(escrowData.status)}
                {!isEditingEscrow ? (
                  <Button 
                    onClick={() => setIsEditingEscrow(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveEscrow}
                      disabled={isSavingEscrow}
                      className="flex items-center gap-2"
                    >
                      {isSavingEscrow ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Token ID */}
            <div className="space-y-2">
              <Label htmlFor="tokenId" className="text-base font-semibold">
                Token ID
              </Label>
              <Input
                id="tokenId"
                value={escrowFormData?.tokenId || ""}
                onChange={handleEscrowInputChange("tokenId")}
                disabled={!isEditingEscrow}
                className="font-mono"
                placeholder="Enter token ID"
              />
            </div>

            {/* Locked Amount */}
            <div className="space-y-2">
              <Label htmlFor="lockedAmount" className="text-base font-semibold">
                Locked Amount
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="lockedAmount"
                  value={escrowFormData?.lockedAmount || ""}
                  onChange={handleEscrowInputChange("lockedAmount")}
                  disabled={!isEditingEscrow}
                  className="text-lg font-mono"
                  placeholder="Enter amount"
                />
                <span className="text-sm text-muted-foreground">USD</span>
              </div>
            </div>

            {/* Supplier */}
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Supplier Address
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="supplier"
                  value={escrowFormData?.supplier || ""}
                  onChange={handleEscrowInputChange("supplier")}
                  disabled={!isEditingEscrow}
                  className="font-mono"
                  placeholder="Enter supplier address"
                />
                {!isEditingEscrow && escrowFormData?.supplier && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(escrowFormData.supplier)}
                  >
                    Copy
                  </Button>
                )}
              </div>
              {!isEditingEscrow && escrowFormData?.supplier && (
                <p className="text-sm text-muted-foreground">
                  Display: {formatAddress(escrowFormData.supplier)}
                </p>
              )}
            </div>

            {/* Receiver */}
            <div className="space-y-2">
              <Label htmlFor="receiver" className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Receiver Address
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="receiver"
                  value={escrowFormData?.receiver || ""}
                  onChange={handleEscrowInputChange("receiver")}
                  disabled={!isEditingEscrow}
                  className="font-mono"
                  placeholder="Enter receiver address"
                />
                {!isEditingEscrow && escrowFormData?.receiver && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(escrowFormData.receiver)}
                  >
                    Copy
                  </Button>
                )}
              </div>
              {!isEditingEscrow && escrowFormData?.receiver && (
                <p className="text-sm text-muted-foreground">
                  Display: {formatAddress(escrowFormData.receiver)}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-base font-semibold">Status</Label>
              <div className="flex items-center space-x-2">
                {isEditingEscrow ? (
                  <select
                    id="status"
                    value={escrowFormData?.status || "Locked"}
                    onChange={handleEscrowInputChange("status")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Locked">Locked</option>
                    <option value="Released">Released</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(escrowFormData?.status || "Locked")}
                    <span className="text-lg font-medium">{escrowFormData?.status}</span>
                  </div>
                )}
              </div>
              {!isEditingEscrow && (
                <p className="text-sm text-muted-foreground">
                  {escrowFormData?.status === "Locked" 
                    ? "Funds are currently locked in escrow" 
                    : "Funds have been released from escrow"
                  }
                </p>
              )}
            </div>

            {/* NFT Owner */}
            <div className="space-y-2">
              <Label htmlFor="nftOwner" className="text-base font-semibold">NFT Owner Address</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="nftOwner"
                  value={escrowFormData?.nftOwner || ""}
                  onChange={handleEscrowInputChange("nftOwner")}
                  disabled={!isEditingEscrow}
                  className="font-mono"
                  placeholder="Enter NFT owner address"
                />
                {!isEditingEscrow && escrowFormData?.nftOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(escrowFormData.nftOwner)}
                  >
                    Copy
                  </Button>
                )}
              </div>
              {!isEditingEscrow && escrowFormData?.nftOwner && (
                <p className="text-sm text-muted-foreground">
                  Display: {formatAddress(escrowFormData.nftOwner)}
                </p>
              )}
            </div>

            {/* Last Updated */}
            {!isEditingEscrow && (
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-base font-semibold">Last Updated</Label>
                <div className="text-lg font-medium">
                  {formatDate(escrowData.lastUpdated)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Updates automatically when NFT ownership changes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auto-Update Notice */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                  Automatic Updates
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  This escrow information updates automatically when NFT ownership changes. 
                  The status will change from "Locked" to "Released" when the receiver takes 
                  ownership of the NFT, triggering the escrow release mechanism.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Management Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Contract Management
                </CardTitle>
                <CardDescription>
                  Create unlimited contracts between any two addresses - no restrictions
                </CardDescription>
              </div>
              <Button 
                onClick={() => setShowContractForm(!showContractForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {showContractForm ? 'Cancel' : 'Create Contract'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Contract Creation Form */}
            {showContractForm && (
              <Card className="mb-6 border-2 border-dashed border-gray-300">
                <CardHeader>
                  <CardTitle className="text-lg">Create New Contract</CardTitle>
                  <CardDescription>
                    Fill in the details to create a contract between two addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateContract} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="partyA">Party A Address</Label>
                        <Input
                          id="partyA"
                          placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                          value={contractForm.partyA}
                          onChange={handleContractInputChange("partyA")}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="partyB">Party B Address</Label>
                        <Input
                          id="partyB"
                          placeholder="0x8ba1f109551bD432803012645Hac136c"
                          value={contractForm.partyB}
                          onChange={handleContractInputChange("partyB")}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Contract Amount (USD)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="1000.00"
                          value={contractForm.amount}
                          onChange={handleContractInputChange("amount")}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiresIn">Expires In (Days)</Label>
                        <Input
                          id="expiresIn"
                          type="number"
                          placeholder="30"
                          value={contractForm.expiresIn}
                          onChange={handleContractInputChange("expiresIn")}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terms">Contract Terms</Label>
                      <textarea
                        id="terms"
                        placeholder="Enter contract terms and conditions..."
                        value={contractForm.terms}
                        onChange={handleContractInputChange("terms")}
                        className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={isCreatingContract}
                        className="flex items-center gap-2"
                      >
                        {isCreatingContract ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" />
                            Create Contract
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowContractForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Contract Statistics */}
            {contracts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{contracts.length}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Total Contracts</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {contracts.filter(c => c.status === "Active").length}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">Active Contracts</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ${contracts.reduce((sum, c) => sum + parseFloat(c.amount || "0"), 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Total Value</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Contracts List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  All Contracts ({contracts.length})
                </h3>
                {contracts.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Create as many contracts as needed between any addresses
                  </div>
                )}
              </div>
              {contracts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No contracts created yet</p>
                  <p className="text-sm">Click "Create Contract" to get started</p>
                  <p className="text-xs mt-2">You can create unlimited contracts between any two addresses</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(getContractGroups()).map(([parties, contractList]) => {
                    const [partyA, partyB] = parties.split('|');
                    return (
                      <div key={parties} className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-lg">
                              Contracts Between Same Parties
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatAddress(partyA)} ↔ {formatAddress(partyB)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {contractList.length} contract{contractList.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="space-y-2 ml-4">
                          {contractList.map((contract) => (
                            <Card key={contract.contractId} className="border-l-4 border-l-blue-500">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h5 className="font-semibold">{contract.contractId}</h5>
                                      {getContractStatusBadge(contract.status)}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-muted-foreground">Amount:</p>
                                        <p className="font-semibold">${contract.amount} USD</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Expires:</p>
                                        <p className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          {formatDate(contract.expiresAt)}
                                        </p>
                                      </div>
                                    </div>
                                    {contract.terms && (
                                      <div className="mt-3">
                                        <p className="text-muted-foreground text-sm">Terms:</p>
                                        <p className="text-sm bg-muted p-2 rounded mt-1">{contract.terms}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </CustomSidebar>
  );
}