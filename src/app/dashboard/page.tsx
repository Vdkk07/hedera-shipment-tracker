"use client";

import { CustomSidebar } from "@/components/CustomSidebar";
import { Plus, Search, Package, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <CustomSidebar>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Shipment Card */}
          <Link href="/dashboard/create-status">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create Shipment</h2>
                  <p className="text-gray-600 mt-1">Create a new shipment and track it on the Hedera network</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Check Status Card */}
          <Link href="/dashboard/check-status">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Check Status</h2>
                  <p className="text-gray-600 mt-1">View and manage existing shipments and their status</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Shipments</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center gap-3">
                <Search className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomSidebar>
  );
}