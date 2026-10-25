
import type { Lot } from '../types/lot';

export const mockLots: Lot[] = [
  {
    id: 1,
    ownerId: 1,
    title: 'Горный велосипед',
    description: 'В хорошем состоянии, использовался один сезон.',
    type: 'product',
    categoryId: 1,
    imageUrls: [],
    estimatedPrice: 15000,
    desiredExchange: 'Смартфон или ноутбук',
  },
  {
    id: 2,
    ownerId: 2,
    title: 'Уроки английского языка',
    description: 'Индивидуальные занятия для начинающих.',
    type: 'service',
    categoryId: 2,
    imageUrls: [],
    estimatedPrice: 1500,
    desiredExchange: 'Услуги дизайнера',
  },
  {
    id: 3,
    ownerId: 3,
    title: 'Набор инструментов',
    description: 'Набор ручных инструментов для ремонта дома.',
    type: 'product',
    categoryId: 3,
    imageUrls: [],
    estimatedPrice: 5000,
    desiredExchange: 'Товары для спорта',
  },
];
