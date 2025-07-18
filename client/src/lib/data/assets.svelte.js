export const assets = $state({
  logos: [
    {
      id: 'adscompass-logo-light',
      name: 'Adscompass светлый логотип',
      url: '/logos/adscompass-logo-light.svg',
      background: '#5e6ad2',
      color: '#ffffff',
      extension: 'svg',
    },
    {
      id: 'adscompass-logo-dark',
      name: 'Adscompass тёмный логотип',
      url: '/logos/adscompass-logo-dark.svg',
      background: '#f4f2f4',
      color: '#000000',
      extension: 'svg',
    },
    {
      id: 'adscompass-logo-red',
      name: 'Adscompass красный логотип',
      url: '/logos/adscompass-logo-red.png',
      background: '#f4f2f4',
      color: '#ffffff',
      extension: 'png',
    },
  ],
  colors: [
    {
      groupName: 'Основные',
      items: [
        { name: 'Красный', hex: '#FF1847' },
        { name: 'Белый', hex: '#FFF8F9' },
        { name: 'Чёрный', hex: '#190000' },
      ],
    },
    {
      groupName: 'Вспомогательные',
      items: [
        { name: '', hex: '#F13194' },
        { name: '', hex: '#F6598D' },
      ],
    },
  ],
  typography: [
    {
      id: 'heading-1',
      name: 'H1 - Заголовок',
      className:
        'text-5xl md:text-6xl font-bold leading-tight tracking-tighter',
      properties: {
        'font-family': {
          css: 'Montserrat',
          display: 'Montserrat',
        },
        'font-size': { css: '3rem', display: '3rem (48px)' },
        'font-weight': { css: '700', display: '700 (Bold)' },
        'line-height': { css: '1.1', display: '1.1' },
        'letter-spacing': { css: '-0.05em', display: '-0.05em' },
      },
    },
    {
      id: 'heading-2',
      name: 'H2 - Подзаголовок',
      className:
        'text-4xl md:text-5xl font-semibold leading-tight tracking-tight',
      properties: {
        'font-family': {
          css: 'Montserrat',
          display: 'Montserrat',
        },
        'font-size': { css: '2.25rem', display: '2.25rem (36px)' },
        'font-weight': { css: '600', display: '600 (Semibold)' },
        'line-height': { css: '1.2', display: '1.2' },
      },
    },
    {
      id: 'body-text',
      name: 'Body - Основной текст',
      className: 'text-base md:text-lg font-normal leading-relaxed',
      properties: {
        'font-family': {
          css: 'Inter',
          display: 'Inter',
        },
        'font-size': { css: '1rem', display: '1rem (16px)' },
        'font-weight': { css: '400', display: '400 (Normal)' },
        'line-height': { css: '1.6', display: '1.6' },
      },
    },
    {
      id: 'caption',
      name: 'Caption - Подпись',
      className: 'text-xs md:text-sm font-light text-white/70',
      font: 'main',
      properties: {
        'font-family': {
          css: 'Inter',
          display: 'Inter',
        },
        'font-size': { css: '0.75rem', display: '0.75rem (12px)' },
        'font-weight': { css: '300', display: '300 (Light)' },
        'line-height': { css: '1.4', display: '1.4' },
      },
    },
  ],
  guidelines: [
    {
      id: 'backgrounds',
      title: 'Использование на фонах',
      description:
        'Для обеспечения максимальной читаемости и контраста, используйте светлую версию логотипа на темных и цветных фонах, а темную версию — на светлых. Избегайте использования логотипа на сложных, пестрых фонах, которые мешают его восприятию.',
      imageDo: '/guidelines/backgrounds-do.png',
      imageDont: '/guidelines/backgrounds-dont.png',
    },
    {
      id: 'stretch',
      title: 'Не искажайте пропорции',
      description:
        'Растягивание или сжатие логотипа нарушает его целостность и узнаваемость. Всегда масштабируйте его пропорционально.',
      imageDo: '/guidelines/stretch-do.png',
      imageDont: '/guidelines/stretch-dont.png',
    },
  ],
  videos: [
    {
      id: 'sample-video',
      title: 'Тестовый образец',
      thumbnailUrl: '/videos/sample-video-thumbnail.png',
      formats: [
        {
          name: 'Горизонтальное (16:9)',
          ratio: '16x9',
          resolution: '1080×566',
          urls: {
            mp4: '/videos/sample-video-16x9.mp4',
            webp: '/videos/sample-video-16x9.webp',
          },
        },
        {
          name: 'Stories (9:16)',
          ratio: '9x16',
          resolution: '1080×1920',
          urls: {
            mp4: '/videos/sample-video-9x16.mp4',
            webp: '/videos/sample-video-9x16.webp',
          },
        },
        {
          name: 'Квадрат (1:1)',
          ratio: '1x1',
          resolution: '1080×1080',
          urls: {
            mp4: '/videos/sample-video-1x1.mp4',
            webp: '/videos/sample-video-1x1.webp',
          },
        },
        {
          name: 'Портретное (4:5)',
          ratio: '4x5',
          resolution: '1080×1350',
          urls: {
            mp4: '/videos/sample-video-4x5.mp4',
            webp: '/videos/sample-video-4x5.webp',
          },
        },
      ],
    },
    {
      id: 'sample-video-2',
      title: 'Тестовый образец',
      thumbnailUrl: '/videos/sample-video-2-thumbnail.png',
      formats: [
        {
          name: 'Горизонтальное (16:9)',
          ratio: '16x9',
          resolution: '1080×566',
          urls: {
            mp4: '/videos/sample-video-2-16x9.mp4',
            webp: '/videos/sample-video-2-16x9.webp',
          },
        },
        {
          name: 'Портретное (4:5)',
          ratio: '4x5',
          resolution: '1080×1350',
          urls: {
            mp4: '/videos/sample-video-2-4x5.mp4',
            webp: '/videos/sample-video-2-4x5.webp',
          },
        },
      ],
    },
  ],
  patterns: [
    {
      id: 'mesh',
      name: 'Сетка из ромбов',
      url: '/patterns/diamond.svg',
    },
    {
      id: 'square',
      name: 'Сетка из квадратов',
      url: '/patterns/square.svg',
    },
  ],
  contacts: [
    {
      id: 'alex',
      name: 'Алекс',
      role: 'Team Lead',
      email: 'partners@adscompass.com',
      telegram: 'ads_compass',
      photoUrl: '/team/alex.jpg',
    },
    {
      id: 'alexander',
      name: 'Александр',
      role: 'Traffic Manager',
      email: 'traffic@adscompass.com',
      telegram: 'traffic_adscompass',
      photoUrl: '/team/alexander.jpg',
    },
    {
      id: 'marina',
      name: 'Марина',
      role: 'Account Manager',
      email: 'corp@adscompass.com',
      telegram: 'corp_adscompass',
      photoUrl: '/team/marina.jpg',
    },
    {
      id: 'stasya',
      name: 'Стася',
      role: 'Business Development',
      email: 'advertising@adscompass.com',
      telegram: 'adv_adscompass',
      photoUrl: '/team/support.jpg',
    },
    {
      id: 'katerina',
      name: 'Катерина',
      role: 'Account Manager',
      email: 'web@adscompass.com',
      telegram: 'web_adscompass',
      photoUrl: '/team/support.jpg',
    },
    {
      id: 'support',
      name: 'Служба поддержки',
      role: 'Dubai, UAE',
      email: 'support@adscompass.com',
      telegram: null,
      photoUrl: '/team/support.jpg',
    },
  ],
  aboutCompany: {
    heading: 'Международная рекламная сеть для покупки и продажи трафика',
    paragraphs: [
      'С 2013 года AdsCompass является экспертом в мире интернет-рекламы, предлагая выгодные условия для вебмастеров, рекламодателей, медиабайеров и рекламных сетей.',
      'Мы работаем по моделям CPC/CPM и предоставляем доступ к трафику из более чем 200 стран мира в различных форматах: от Push-уведомлений и In-Page Push до нативной рекламы и Popunder. Наша Self-Serve платформа дает полный контроль над кампаниями, а интеграция по RTB открывает доступ к аукциону в реальном времени.',
    ],
    stats: [
      { value: '9000+', label: 'Активных рекламодателей' },
      { value: '5000+', label: 'Активных вебмастеров' },
      { value: '30 млрд.', label: 'Запросов в день' },
      { value: '10+', label: 'Лет на рынке' },
    ],
  },
});

export const siteInfo = {
  companyName: 'AdsCompass',
  companyUrl: 'https://adscompass.com',
  copyrightYear: new Date().getFullYear(),
  developer: {
    name: 'Sudorgin Daniil',
    url: 'https://github.com/Zilusion',
  },
  socials: [
    { name: 'instagram', url: 'https://www.instagram.com/adscompass/' },
    { name: 'twitter', url: 'https://x.com/ads_compass' },
    {
      name: 'youtube',
      url: 'https://www.youtube.com/channel/UCZVbg0wWOLZcHrH-RIRe9XQ',
    },
    { name: 'facebook', url: 'https://www.facebook.com/adscompass' },
    { name: 'linkedin', url: 'https://www.linkedin.com/company/adscompass/' },
  ],
};
