// Central restaurant configuration — change these values to rebrand the entire site

export const restaurantConfig = {
  name: 'وجبة',
  nameLatin: 'Wajba',
  tagline: 'نكهة تستحق التجربة',
  description: 'أشهى المأكولات الطازجة، محضّرة بعناية وتوصلك بسرعة إلى بابك.',
  logo: '/logo.svg',
  favicon: '/favicon.svg',
  phone: '+213 555 12 34 56',
  whatsapp: '213555123456',
  address: 'شارع ديدوش مراد، الجزائر العاصمة',
  addressLat: 36.7538,
  addressLng: 3.0588,
  currency: 'DZD',
  currencySymbol: 'دج',
  status: 'open' as 'open' | 'closed' | 'busy',
  announcement: 'توصيل سريع • طلب أونلاين • الدفع عند الاستلام',
  announcementActive: true,
  hero: {
    headline: 'نكهة تستحق التجربة',
    subheadline: 'أشهى المأكولات الطازجة',
    description: 'محضّرة بعناية بحب وشغف، وتوصلك بسرعة إلى باب دارك. اطلب الآن واستمتع بتجربة طعام لا تُنسى.',
    primaryCta: 'اطلب الآن',
    secondaryCta: 'اكتشف القائمة',
  },
  openingHours: [
    { day: 'السبت', hours: '11:00 - 23:00', open: true },
    { day: 'الأحد', hours: '11:00 - 23:00', open: true },
    { day: 'الإثنين', hours: '11:00 - 23:00', open: true },
    { day: 'الثلاثاء', hours: '11:00 - 23:00', open: true },
    { day: 'الأربعاء', hours: '11:00 - 23:00', open: true },
    { day: 'الخميس', hours: '11:00 - 00:00', open: true },
    { day: 'الجمعة', hours: '14:00 - 00:00', open: true },
  ],
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
  },
  delivery: {
    baseFee: 200,
    freeDeliveryThreshold: 1500,
    minOrder: 300,
    estimatedTime: '30-45',
    radius: 10,
  },
  payment: {
    cashOnDelivery: true,
    online: false,
  },
  primaryColor: '#E8521E',
  secondaryColor: '#1B1B2F',
  accentColor: '#F9A826',
}

export type RestaurantConfig = typeof restaurantConfig
