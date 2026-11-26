import type { Lot } from '../types/lot'

import bikeImage from '../assets/figma/lot-bike-raw.png'
import englishImage from '../assets/figma/lot-english-raw.png'
import toolsImage from '../assets/figma/lot-tools-raw.png'

export const mockLots: Lot[] = [
  {
    id: 1,
    ownerId: 1,
    title: 'Горный велосипед, 21 скорость',
    description: 'В хорошем состоянии, использовался один сезон.',
    type: 'product',
    categoryId: 1,
    imageUrls: [bikeImage],
    imagePosition: 'center 65%',
    mobileImagePosition: 'left 66%',
    mobileImageScale: 1.136,
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
    imagePosition: 'center',
    mobileImagePosition: 'left center',
    mobileImageScale: 1.208,
    mobileImageOffsetX: '-7px',
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
    imagePosition: 'center 78%',
    mobileImagePosition: 'left 80%',
    mobileImageScale: 1.136,
    estimatedPrice: 6000,
    desiredExchange: 'садовая техника',
  },
]
