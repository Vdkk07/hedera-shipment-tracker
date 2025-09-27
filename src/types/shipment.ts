export interface Shipment {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  shipmentId: string;
  from: string;
  to: string;
  contents: string;
  receiverAccountId: string;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ShipmentStatus {
  CREATED = "CREATED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface CreateShipmentData {
  tokenName: string;
  tokenSymbol: string;
  shipmentId: string;
  from: string;
  to: string;
  contents: string;
  receiverAccountId: string;
}

export interface ShipmentFilters {
  status?: ShipmentStatus;
  searchTerm?: string;
}
