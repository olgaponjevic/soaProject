export interface OrderItem {
  tourId: string;
  tourName: string;
  price: number;
}

export interface ShoppingCart {
  id?: string;
  touristId: number;
  items: OrderItem[];
  total: number;
}

export interface TourPurchaseToken {
  id: string;
  touristId: number;
  tourId: string;
  createdAt: string;
}
