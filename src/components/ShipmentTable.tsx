"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { Search, RefreshCw } from "lucide-react";

interface ShipmentTableProps {
  shipments: Shipment[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function ShipmentTable({ shipments, isLoading = false, onRefresh }: ShipmentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "ALL">("ALL");

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesSearch = 
        shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.contents.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.receiverAccountId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchTerm, statusFilter]);

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.CREATED:
        return "bg-blue-100 text-blue-800";
      case ShipmentStatus.IN_TRANSIT:
        return "bg-yellow-100 text-yellow-800";
      case ShipmentStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case ShipmentStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Shipment Status</CardTitle>
            <CardDescription>
              Track and monitor all your shipments
            </CardDescription>
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <Label htmlFor="search">Search Shipments</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by shipment ID, token, location, contents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Filter by Status</Label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ShipmentStatus | "ALL")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value={ShipmentStatus.CREATED}>Created</SelectItem>
                <SelectItem value={ShipmentStatus.IN_TRANSIT}>In Transit</SelectItem>
                <SelectItem value={ShipmentStatus.DELIVERED}>Delivered</SelectItem>
                <SelectItem value={ShipmentStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredShipments.length} of {shipments.length} shipments
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Contents</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Loading shipments...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {shipments.length === 0 
                      ? "No shipments found. Create your first shipment to get started."
                      : "No shipments match your search criteria."
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">
                      {shipment.shipmentId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{shipment.tokenName}</div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.tokenSymbol}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{shipment.from}</TableCell>
                    <TableCell>{shipment.to}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {shipment.contents}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {shipment.receiverAccountId}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}
                      >
                        {shipment.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(shipment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
