import type { Lot } from '../types/lot'
import { mockLots } from './mockLots'
import headphonesPhoto from '../assets/catalog/lot-headphones.png'
import coffeeMachinePhoto from '../assets/catalog/lot-coffee-machine.png'
import cameraPhoto from '../assets/catalog/lot-camera.png'

export type CatalogLot = Lot & {
  category: string
  city: string
  publishedAt: 'сегодня' | 'вчера'
  condition: 'new' | 'like-new' | 'used'
  acceptsExtraPayment: boolean
  hasPhoto: boolean
  embeddedImageDecorations?: boolean
}

const featuredLots: CatalogLot[] = [
  {
    ...mockLots[0],
    category: 'sport',
    city: 'Москва',
    publishedAt: 'сегодня',
    condition: 'used',
    acceptsExtraPayment: false,
    hasPhoto: true,
  },
  {
    ...mockLots[1],
    category: 'services',
    city: 'Онлайн',
    publishedAt: 'сегодня',
    condition: 'new',
    acceptsExtraPayment: false,
    hasPhoto: true,
  },
  {
    ...mockLots[2],
    category: 'tools',
    city: 'Казань',
    publishedAt: 'сегодня',
    condition: 'like-new',
    acceptsExtraPayment: true,
    hasPhoto: true,
  },
  {
    id: 4,
    ownerId: 4,
    title: 'Беспроводные наушники',
    description: 'Беспроводные наушники в хорошем состоянии.',
    type: 'product',
    categoryId: 4,
    category: 'electronics',
    city: 'Москва',
    publishedAt: 'вчера',
    condition: 'used',
    acceptsExtraPayment: true,
    hasPhoto: true,
    imageUrls: [headphonesPhoto],
    embeddedImageDecorations: true,
    estimatedPrice: 8000,
    desiredExchange: 'портативную колонку',
  },
  {
    id: 5,
    ownerId: 5,
    title: 'Кофемашина с капучинатором',
    description: 'Кофемашина с функцией приготовления капучино.',
    type: 'product',
    categoryId: 5,
    category: 'home',
    city: 'Санкт-Петербург',
    publishedAt: 'вчера',
    condition: 'like-new',
    acceptsExtraPayment: true,
    hasPhoto: true,
    imageUrls: [coffeeMachinePhoto],
    embeddedImageDecorations: true,
    estimatedPrice: 18000,
    desiredExchange: 'робот-пылесос',
  },
  {
    id: 6,
    ownerId: 6,
    title: 'Зеркальный фотоаппарат с объективом',
    description: 'Зеркальная камера с объективом.',
    type: 'product',
    categoryId: 6,
    category: 'electronics',
    city: 'Екатеринбург',
    publishedAt: 'вчера',
    condition: 'used',
    acceptsExtraPayment: false,
    hasPhoto: true,
    imageUrls: [cameraPhoto],
    embeddedImageDecorations: true,
    estimatedPrice: 24000,
    desiredExchange: 'планшет',
  },
]

// Демо-набор содержит четыре страницы, как в макете. После подключения API
// сервер будет отдавать реальные лоты и их общее количество.
export const catalogLots: CatalogLot[] = Array.from({ length: 24 }, (_, index) => {
  const lot = featuredLots[index % featuredLots.length]

  return index < featuredLots.length
    ? lot
    : { ...lot, id: index + 1, publishedAt: 'вчера' }
})
