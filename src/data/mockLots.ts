import type { Lot } from '../types/lot'

import bikeImage from '../assets/lots/lot-bike.png'
import englishImage from '../assets/lots/lot-english.png'
import toolsImage from '../assets/lots/lot-tools.png'

export const mockLots: Lot[] = [
  {
    id: 1,
    ownerId: 1,
    title: 'Горный велосипед, 21 скорость',
    description: 'В хорошем состоянии, использовался один сезон.',
    type: 'product',
    categoryId: 1,
    imageUrls: [bikeImage],
    estimatedPrice: 12000,
    desiredExchange: 'электросамокат',
  },
  {
    id: 2,
    ownerId: 2,
    title: 'Репетитор английского, 5 занятий',
    description: 'Индивидуальные занятия английским языком.',
    type: 'service',
    categoryId: 2,
    imageUrls: [englishImage],
    estimatedPrice: 5000,
    desiredExchange: 'услуги дизайнера',
  },
  {
    id: 3,
    ownerId: 3,
    title: 'Набор инструментов, 120 предметов',
    description: 'Набор инструментов для ремонта дома.',
    type: 'product',
    categoryId: 3,
    imageUrls: [toolsImage],
    estimatedPrice: 6000,
    desiredExchange: 'садовая техника',
  },
]
