
export interface PaymentRequest {
  amount: number;
  method: string;       // e.g. "CARD", "PAYPAL", "APPLEPAY"
  paymentStatus: string; // "COMPLETED" | "PENDING"
  paymentDate: string;  // LocalDateTime → "2026-04-09T10:00:00"
}

export interface OrderRequest {
  userId: string;
  totalPrice: number;
  status: string;       // "PENDING"
  createdAt: string;    // LocalDateTime → "2026-04-09T10:00:00"
  payment: PaymentRequest;
}


export interface PaymentResponse {
  id: number;
  amount: number;
  method: string;
  paymentStatus: string;
  paymentDate: string;
}

export interface OrderResponse {
  id: number;
  userId: string;       // String on backend, not number
  totalPrice: number;
  status: string;
  createdAt: string;
  payment: PaymentResponse;
}
