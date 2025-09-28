"use client";

import { CustomSidebar } from "@/components/CustomSidebar";
import { 
  Plus, 
  Search, 
  Package, 
  BarChart3, 
  List, 
  Clock, 
  Activity, 
  Shield, 
  Zap, 
  TrendingUp,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  User
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShipmentData, AllShipmentsResponse } from "@/types/shipment";
import axios from "axios";

export default function Dashboard() {
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkStatus, setNetworkStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    created: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<AllShipmentsResponse>(`${process.env.BACKEND_URL}/api/all-shipments`);
      
      if (response.data.success) {
        const shipmentData = response.data.data;
        setShipments(shipmentData);
        
        // Calculate stats
        const stats = {
          total: shipmentData.length,
          inTransit: shipmentData.filter(s => s.status.toLowerCase() === 'not delivered').length,
          delivered: shipmentData.filter(s => s.status.toLowerCase() === 'delivered').length,
          created: shipmentData.filter(s => s.status.toLowerCase() === 'created').length
        };
        setStats(stats);
        
        // Simulate network status check
        setNetworkStatus('connected');
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setNetworkStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  const recentShipments = shipments.slice(0, 5);
  const recentActivity = shipments.slice(0, 4);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'not delivered':
        return <Activity className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getNetworkStatusIcon = () => {
    switch (networkStatus) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'disconnected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-yellow-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <CustomSidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        
        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Create Shipment Card */}
          <Link href="/dashboard/create-shipment">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create Shipment</h2>
                  <p className="text-gray-600 mt-1">Create a new NFT shipment on Hedera</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Check Status Card */}
          <Link href="/dashboard/check-shipment">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Check Status</h2>
                  <p className="text-gray-600 mt-1">Look up specific shipment details</p>
                </div>
              </div>
            </div>
          </Link>

          {/* All Shipments Card */}
          <Link href="/dashboard/check-all-shipments">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <List className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">All Shipments</h2>
                  <p className="text-gray-600 mt-1">View and manage all shipments</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Network Status Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                {getNetworkStatusIcon()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Network Status</h2>
                <p className="text-gray-600 mt-1 capitalize">
                  Hedera {networkStatus === 'checking' ? 'Checking...' : networkStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Shipments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">In Transit</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.created}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Shipments */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Recent Shipments</h2>
                <Link href="/dashboard/check-all-shipments" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  View All <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-200">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading shipments...</p>
                  </div>
                ) : recentShipments.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No shipments found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {recentShipments.map((shipment) => (
                      <div key={shipment.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getStatusIcon(shipment.status)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-black">{shipment.shipment_id}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{shipment.contents}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {shipment.sender} → {shipment.receiver}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(shipment.created_at)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium capitalize">{shipment.status}</div>
                            <div className="text-xs text-gray-500">{shipment.current_location}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-3">
                <Link href="/dashboard/create-shipment" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-black">New Shipment</span>
                </Link>
                <Link href="/dashboard/check-shipment" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-black">Track Shipment</span>
                </Link>
                <Link href="/dashboard/check-all-shipments" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-black">View Analytics</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-black">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-4">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((shipment) => (
                      <div key={shipment.id} className="flex items-start gap-3 text-black">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Package className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{shipment.shipment_id}</div>
                          <div className="text-xs text-gray-500">
                            Status updated to <span className="capitalize">{shipment.status}</span>
                          </div>
                          <div className="text-xs text-gray-400">{formatDate(shipment.created_at)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Network Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Network Info</h2>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hedera Network</span>
                  <div className="flex items-center gap-2">
                    {getNetworkStatusIcon()}
                    <span className="text-sm font-medium capitalize">{networkStatus}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blockchain</span>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Immutable</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">NFTs Minted</span>
                  <span className="text-sm font-medium">{stats.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomSidebar>
  );
}