import { User, Order, Product, ReturnReasonDetail, ReturnRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock users for testing
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    company: 'Acme Corp',
    customerCardcode: 'ACM001',
    isFirstLogin: false,
    acceptedTerms: true,
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    company: 'Tech Solutions',
    customerCardcode: 'TEC002',
    isFirstLogin: true,
    acceptedTerms: false,
  },
];

// Mock products
export const mockProducts: Product[] = [
  {
    partNumber: 'LP-001',
    description: 'Laptop Dell XPS 13',
    serialNumber: 'DLX13-2023-001',
    quantity: 1,
    price: 1299.99,
    stockType: 'stock',
  },
  {
    partNumber: 'LP-002',
    description: 'Laptop HP Spectre',
    serialNumber: 'HPS14-2023-002',
    quantity: 1,
    price: 1399.99,
    stockType: 'stock',
  },
  {
    partNumber: 'MN-001',
    description: '24" Monitor Dell',
    serialNumber: 'DLM24-2023-003',
    quantity: 2,
    price: 199.99,
    stockType: 'stock',
  },
  {
    partNumber: 'KB-001',
    description: 'Mechanical Keyboard',
    serialNumber: 'KB-MECH-004',
    quantity: 1,
    price: 89.99,
    stockType: 'stock',
  },
  {
    partNumber: 'SW-001',
    description: 'Enterprise Software License',
    serialNumber: 'SW-ENT-005',
    quantity: 5,
    price: 299.99,
    stockType: 'non-stock',
  },
  {
    partNumber: 'HD-001',
    description: '1TB SSD Samsung',
    serialNumber: 'SS-1TB-006',
    quantity: 3,
    price: 129.99,
    stockType: 'stock',
  },
  {
    partNumber: 'PC-001',
    description: 'Power Cable',
    serialNumber: 'PC-STD-007',
    quantity: 5,
    price: 12.99,
    stockType: 'stock',
  },
  {
    partNumber: 'HD-C001',
    description: 'Hard Drive Caddy',
    serialNumber: 'HDC-STD-008',
    quantity: 2,
    price: 24.99,
    stockType: 'stock',
  },
];

// Mock orders
export const mockOrders: Order[] = [
  {
    salesOrderNumber: 'SO-2023-001',
    invoiceNumber: 'INV-2023-001',
    invoiceDate: '2023-10-15',
    customerPO: 'PO-ACM-001',
    customerName: 'Acme Corp',
    customerCardcode: 'ACM001',
    salesPerson: 'Michael Johnson',
    products: [mockProducts[0], mockProducts[3], mockProducts[6]],
  },
  {
    salesOrderNumber: 'SO-2023-002',
    invoiceNumber: 'INV-2023-002',
    invoiceDate: '2023-10-18',
    customerPO: 'PO-TEC-001',
    customerName: 'Tech Solutions',
    customerCardcode: 'TEC002',
    salesPerson: 'Sarah Williams',
    products: [mockProducts[1], mockProducts[5], mockProducts[7]],
  },
  {
    salesOrderNumber: 'SO-2023-003',
    invoiceNumber: 'INV-2023-003',
    invoiceDate: '2023-10-20',
    customerPO: 'PO-ACM-002',
    customerName: 'Acme Corp',
    customerCardcode: 'ACM001',
    salesPerson: 'Michael Johnson',
    products: [mockProducts[2], mockProducts[4]],
  },
];

// Return reason details
export const returnReasons: ReturnReasonDetail[] = [
  {
    id: 'wrong_part_supplied',
    label: 'SPL supplied wrong part',
    description: 'The part received does not match what was ordered',
    noFee: true,
    requiresReplacement: true,
    maxDays: 30,
  },
  {
    id: 'wrong_part_in_box',
    label: 'Wrong part in the box',
    description: 'The package contained a different part than what was labeled',
    noFee: true,
    requiresReplacement: true,
    maxDays: 30,
  },
  {
    id: 'item_faulty',
    label: 'Item is faulty (DOA)',
    description: 'The item is not functioning properly or is dead on arrival',
    noFee: true,
    requiresReplacement: true,
    maxDays: 365, // 1 year warranty
  },
  {
    id: 'order_cancelled',
    label: 'Order cancelled',
    description: 'The order was cancelled by the customer or their client',
    noFee: false,
    requiresReplacement: false,
  },
  {
    id: 'incorrect_part_ordered',
    label: 'Incorrect part ordered',
    description: 'Customer ordered the wrong part for their needs',
    noFee: false,
    requiresReplacement: false,
  },
];

// Sample return requests
export const mockReturnRequests: ReturnRequest[] = [
  {
    id: uuidv4(),
    sapcNumber: 'SAPC-2023-001',
    userId: '1',
    customerCardcode: 'ACM001',
    customerName: 'Acme Corp',
    salesOrderNumber: 'SO-2023-001',
    invoiceNumber: 'INV-2023-001',
    customerPO: 'PO-ACM-001',
    status: 'approved',
    returnItems: [
      {
        productId: mockProducts[0].partNumber,
        partNumber: mockProducts[0].partNumber,
        serialNumber: mockProducts[0].serialNumber,
        returnReason: 'item_faulty',
        details: 'Laptop does not power on',
        quantity: 1,
        relatedProducts: [mockProducts[6]], // Related power cable
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    totalRestockFee: 0, // No fee for faulty items
    requiresReplacement: true,
    comments: ['Customer reported issue with power button'],
  },
  {
    id: uuidv4(),
    sapcNumber: 'SAPC-2023-002',
    userId: '2',
    customerCardcode: 'TEC002',
    customerName: 'Tech Solutions',
    salesOrderNumber: 'SO-2023-002',
    invoiceNumber: 'INV-2023-002',
    customerPO: 'PO-TEC-001',
    status: 'pending',
    returnItems: [
      {
        productId: mockProducts[5].partNumber,
        partNumber: mockProducts[5].partNumber,
        serialNumber: mockProducts[5].serialNumber,
        returnReason: 'order_cancelled',
        details: 'Client cancelled their order',
        quantity: 3,
        restockFeePercentage: 20, // 20% restock fee for stock items
        restockFee: 3 * 129.99 * 0.2, // 3 items at $129.99 each with 20% fee
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    totalRestockFee: 3 * 129.99 * 0.2,
    requiresReplacement: false,
  },
]; 