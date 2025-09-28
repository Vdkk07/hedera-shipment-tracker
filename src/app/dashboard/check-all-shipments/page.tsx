"use client";

import { useState, useEffect, useMemo } from "react";
import { CustomSidebar } from "@/components/CustomSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AllShipmentsResponse, ShipmentData } from "@/types/shipment";
import { ExternalLink, Package, MapPin, Calendar, User, Search, Filter, X } from "lucide-react";
import axios from "axios";

export default function AllShipments() {
    const [shipments, setShipments] = useState<ShipmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<AllShipmentsResponse['pagination'] | null>(null);
    
    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchAllShipments();
    }, []);

    const fetchAllShipments = async () => {
        try {
            setLoading(true);
            const response = await axios.get<AllShipmentsResponse>("http://localhost:4000/api/all-shipments");
            
            if (response.data.success) {
                setShipments(response.data.data);
                setPagination(response.data.pagination);
                setError(null);
            } else {
                setError("Failed to fetch shipments");
            }
        } catch (error) {
            console.error("Error fetching shipments:", error);
            setError("Failed to fetch shipments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return <Badge variant="success">Delivered</Badge>;
            case "not delivered":
                return <Badge variant="warning">In Transit</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter and search logic
    const filteredShipments = useMemo(() => {
        let filtered = [...shipments];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(shipment =>
                shipment.shipment_id.toLowerCase().includes(query) ||
                shipment.sender.toLowerCase().includes(query) ||
                shipment.receiver.toLowerCase().includes(query) ||
                shipment.contents.toLowerCase().includes(query) ||
                shipment.current_location.toLowerCase().includes(query) ||
                shipment.current_owner.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(shipment =>
                shipment.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // Date filter
        if (dateFilter !== "all") {
            const now = new Date();
            const filterDate = new Date();
            
            switch (dateFilter) {
                case "today":
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(shipment =>
                        new Date(shipment.created_at) >= filterDate
                    );
                    break;
                case "week":
                    filterDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(shipment =>
                        new Date(shipment.created_at) >= filterDate
                    );
                    break;
                case "month":
                    filterDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(shipment =>
                        new Date(shipment.created_at) >= filterDate
                    );
                    break;
            }
        }

        return filtered;
    }, [shipments, searchQuery, statusFilter, dateFilter]);

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setDateFilter("all");
    };

    const hasActiveFilters = searchQuery || statusFilter !== "all" || dateFilter !== "all";

    if (loading) {
        return (
            <CustomSidebar>
                <div className="p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2 text-muted-foreground">Loading shipments...</span>
                    </div>
                </div>
            </CustomSidebar>
        );
    }

    return (
        <CustomSidebar>
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">All Shipments</h1>
                    <p className="text-muted-foreground">
                        View and manage all shipments in the system
                    </p>
                </div>

                {error && (
                    <Card className="mb-6 border-destructive">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-destructive text-lg">⚠️</span>
                                </div>
                                <div>
                                    <p className="text-destructive font-medium">Error</p>
                                    <p className="text-sm text-muted-foreground">{error}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">Search & Filters</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    {showFilters ? 'Hide' : 'Show'} Filters
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search shipments by ID, sender, receiver, contents, location, or owner..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filters */}
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Status
                                        </label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="not delivered">In Transit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Date Range
                                        </label>
                                        <Select value={dateFilter} onValueChange={setDateFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Time</SelectItem>
                                                <SelectItem value="today">Today</SelectItem>
                                                <SelectItem value="week">Last 7 Days</SelectItem>
                                                <SelectItem value="month">Last 30 Days</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-end">
                                        <div className="text-sm text-muted-foreground">
                                            {filteredShipments.length} of {shipments.length} shipments
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-foreground">Shipments Overview</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {pagination ? `Showing ${filteredShipments.length} of ${pagination.totalItems} shipments` : 'Loading...'}
                                </CardDescription>
                            </div>
                            <Button onClick={fetchAllShipments} variant="outline" size="sm">
                                Refresh
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredShipments.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    {shipments.length === 0 ? 'No shipments found' : 'No shipments match your filters'}
                                </h3>
                                <p className="text-muted-foreground">
                                    {shipments.length === 0 
                                        ? 'No shipments have been created yet.' 
                                        : 'Try adjusting your search criteria or filters.'
                                    }
                                </p>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="mt-4"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Shipment ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Route</TableHead>
                                            <TableHead>Contents</TableHead>
                                            <TableHead>Current Location</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredShipments.map((shipment) => (
                                            <TableRow key={shipment.id}>
                                                <TableCell className="font-medium">
                                                    #{shipment.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-mono text-sm">
                                                        {shipment.shipment_id}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(shipment.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <div className="text-sm">
                                                            <div className="font-medium">{shipment.sender}</div>
                                                            <div className="text-muted-foreground">→ {shipment.receiver}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{shipment.contents}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div className="font-medium">{shipment.current_location}</div>
                                                        <div className="text-muted-foreground text-xs">
                                                            Owner: {shipment.current_owner}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{formatDate(shipment.created_at)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(shipment.mintTxUrl, '_blank')}
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-1" />
                                                            View TX
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(shipment.metadataUrl, '_blank')}
                                                        >
                                                            <Package className="h-4 w-4 mr-1" />
                                                            Metadata
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {pagination && pagination.totalPages > 1 && (
                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!pagination.hasPrevPage}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!pagination.hasNextPage}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </CustomSidebar>
    );
}
