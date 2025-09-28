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

export interface CheckShipmentData {
  shipmentId: string;
  tokenId: string;
  location: string;
}

export interface ShipmentData {
  id: number;
  shipment_id: string;
  token_id: string;
  nft_mint_tx_id: string;
  shipment_cid: string;
  sender: string;
  receiver: string;
  contents: string;
  created_at: string;
  current_location: string;
  status: string;
  current_owner: string;
  receiver_account_id: string;
  mintTxUrl: string;
  metadataUrl: string;
  updated_at: string | null;
}

export interface AllShipmentsResponse {
  success: boolean;
  data: ShipmentData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    status: string | null;
    startDate: string | null;
    endDate: string | null;
    sortBy: string;
    sortOrder: string;
  };
}

export interface VerifyShipmentResponse {
  success: boolean;
  message: string;
  shipment?: ShipmentData;
}