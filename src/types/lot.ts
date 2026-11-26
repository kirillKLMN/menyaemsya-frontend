export type Lot = {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  type: 'product' | 'service';
  categoryId: number;
  imageUrls: string[];
  imagePosition?: string;
  mobileImagePosition?: string;
  mobileImageScale?: number;
  mobileImageOffsetX?: string;
  estimatedPrice: number | null;
  desiredExchange: string;
};
