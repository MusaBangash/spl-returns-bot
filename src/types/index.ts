// User-related types
export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  customerCardcode: string;
  isFirstLogin: boolean;
  acceptedTerms: boolean;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Product/Order-related types
export interface Product {
  partNumber: string;
  description: string;
  serialNumber: string;
  quantity: number;
  price: number;
  stockType: 'stock' | 'non-stock';
}

export interface Order {
  salesOrderNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerPO: string;
  customerName: string;
  customerCardcode: string;
  salesPerson: string;
  products: Product[];
}

// Return-related types
export type ReturnReason = 
  | 'wrong_part_supplied' 
  | 'wrong_part_in_box' 
  | 'item_faulty' 
  | 'order_cancelled' 
  | 'incorrect_part_ordered';

export interface ReturnReasonDetail {
  id: ReturnReason;
  label: string;
  description: string;
  noFee: boolean;
  requiresReplacement: boolean;
  maxDays?: number;
}

export interface ReturnItem {
  productId: string;
  partNumber: string;
  serialNumber: string;
  returnReason: ReturnReason;
  details: string;
  quantity: number;
  restockFee?: number;
  restockFeePercentage?: number;
  relatedProducts?: Product[];
}

export interface ReturnRequest {
  id: string;
  sapcNumber: string;
  userId: string;
  customerCardcode: string;
  customerName: string;
  salesOrderNumber: string;
  invoiceNumber: string;
  customerPO: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  returnItems: ReturnItem[];
  createdAt: string;
  updatedAt: string;
  totalRestockFee: number;
  requiresReplacement: boolean;
  comments?: string[];
  images?: string[];
}

// Chat/Message types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  userId: string;
  messages: ChatMessage[];
  relatedReturnId?: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
} 