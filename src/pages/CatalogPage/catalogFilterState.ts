export type LotCondition = 'new' | 'like-new' | 'used'

export type CatalogFilterState = {
  lotType: 'all' | 'product' | 'service'
  priceFrom: string
  priceTo: string
  conditions: LotCondition[]
  withPhotos: boolean
  withExtraPayment: boolean
}

export const defaultCatalogFilters: CatalogFilterState = {
  lotType: 'all',
  priceFrom: '',
  priceTo: '',
  conditions: [],
  withPhotos: true,
  withExtraPayment: false,
}
