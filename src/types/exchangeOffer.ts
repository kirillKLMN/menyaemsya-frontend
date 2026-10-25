export type ExchangeOfferStatus =
  | 'pending'
  | 'accepted'
  | 'rejected';

export type ExchangeOffer = {
    id: number,
    offeredLotId: number,
    requestedLotId: number,
    status: ExchangeOfferStatus,
};