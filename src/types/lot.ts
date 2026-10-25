export type Lot = {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  type: 'product' | 'service';
  categoryId: number;
  imageUrls: string[];
  estimatedPrice: number | null;
  desiredExchange: string;
};