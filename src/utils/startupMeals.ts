const demoMeals = [
  {
    _id: "1",
    name: "Classic Burger",
    description:
      "Juicy classic beef burger with crispy fries and seasoned chips – a timeless favorite.",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749631882/7be96cd7-07f4-4e7f-aed1-6821ce1ff362_wllfm8.jpg",
    category: "BURGER",
    unit: "gm",
    translations: {
      العربية: {
        name: "برجر كلاسيكي",
        description:
          "برجر لحم بقري كلاسيكي شهي مع بطاطس مقلية مقرمشة ورقائق متبلة",
        category: "برجر",
        unit: "جرام",
      },
    },
    size: [
      {
        size: "120",
        price: 22.99,
        stock: true,
        _id: "68309d481e9a081a82820954",
      },
      {
        size: "250",
        price: 27.99,
        stock: true,
        _id: "68309d481e9a081a82820955",
      },
      {
        size: "300",
        price: 32.99,
        stock: true,
      },
      {
        size: "500",
        price: 42.99,
        stock: true,
        _id: "68309d481e9a081a82820956",
      },
    ],
    isAvailable: true,
  },
  {
    _id: "2",
    name: "American Burger",
    description:
      "New York-style american burger with a juicy beef patty, lettuce, tomato, and special sauce.",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749458848/s6aocqsche3l8j3mft0p_pyngiy.png",
    category: "BURGER",
    unit: "gm",
    translations: {
      العربية: {
        name: "برجر أمريكي",
        description:
          "برجر أمريكي على الطريقة النيويوركية مع لحم بقري طازج وخس وطماطم وصلصة خاصة.",
        category: "برجر",
        unit: "جرام",
      },
    },
    size: [
      {
        size: "150",
        price: 24.99,
        stock: true,
      },
      {
        size: "300",
        price: 34.99,
        stock: true,
      },
      {
        size: "500",
        price: 44.99,
        stock: true,
      },
    ],
  },
  {
    _id: "3",
    name: "double cheese burger",
    description:
      "A double patty burger with two layers of cheese, served with crispy fries.",
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749631800/ilnkqs3eibvmglmtqp5l_oeyyor.png",
    category: "BURGER",
    translations: {
      العربية: {
        name: "برجر دبل تشيز",
        description: "برجر بطبقتين من الجبن، يقدم مع بطاطس مقلية مقرمشة.",
        category: "برجر",
        unit: "جرام",
      },
    },
    size: [
      {
        size: "200",
        price: 29.99,
        stock: true,
      },
      {
        size: "400",
        price: 37.99,
        stock: true,
      },
    ],
  },
  {
    _id: "4",
    name: "cheesy smash burger",
    description:
      "A delicious smash burger with melted cheese, grilled onions, and special sauce.",
    category: "BURGER",
    unit: "gm",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749631814/rgmyr9zef6cglulhiaze_grztxh.png",
    translations: {
      العربية: {
        name: "برجر سماش بالجبنة",
        description: "برجر لذيذ مع جبنة مذابة وبصل مشوي وصلصة خاصة.",
        category: "برجر",
        unit: "جرام",
      },
    },
    size: [
      {
        size: "150",
        price: 25.99,
        stock: true,
      },
      {
        size: "300",
        price: 35.99,
        stock: true,
      },
    ],
  },
  {
    _id: "5",
    name: "crispy chicken burger",
    description: "A crispy chicken burger with lettuce, tomato, and mayo.",
    category: "CHICKEN",
    unit: "slices",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749631827/uvjag7mjeirbnpv2w4qj_nbxhhg.png",
    translations: {
      العربية: {
        name: "برجر دجاج مقرمش",
        description: "برجر دجاج مقرمش مع خس وطماطم ومايونيز.",
        category: "دجاج",
        unit: "شرائح",
      },
    },
    size: [
      {
        size: "2",
        price: 19.99,
        stock: true,
      },
      {
        size: "3",
        price: 23.99,
        stock: true,
      },
    ],
  },
  {
    _id: "6",
    name: "spicy chicken burger",
    description: "A spicy chicken burger with jalapeños and spicy mayo.",
    category: "CHICKEN",
    unit: "slices",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749631827/uvjag7mjeirbnpv2w4qj_nbxhhg.png",
    translations: {
      العربية: {
        name: "برجر دجاج حار",
        description: "برجر دجاج حار مع هالبينو ومايونيز حار.",
        category: "دجاج",
        unit: "شرائح",
      },
    },
    size: [
      {
        size: "2",
        price: 20.99,
        stock: true,
      },
      {
        size: "3",
        price: 24.99,
        stock: true,
      },
    ],
  },
  {
    _id: "7",
    name: "checken nuggets",
    description: "Crispy chicken nuggets served with a side of dipping sauce.",
    category: "CHICKEN",
    unit: "pieces",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749633326/gazfgeplyf3hgdotnnec_vh8ipj.png",
    translations: {
      العربية: {
        name: "قطع دجاج مقلية",
        description: "قطع دجاج مقلية مقرمشة تقدم مع صلصة غمس.",
        category: "دجاج",
        unit: "قطع",
      },
    },
    size: [
      {
        size: "4",
        price: 5.99,
        stock: true,
      },
      {
        size: "9",
        price: 12.99,
        stock: true,
      },
      {
        size: "12",
        price: 15.99,
        stock: true,
      },
      {
        size: "24",
        price: 29.99,
        stock: true,
      },
    ],
  },
  {
    _id: "8",
    name: "chicken wings",
    description: "Spicy chicken wings served with a side of ranch dressing.",
    category: "CHICKEN",
    unit: "pieces",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749633313/daexuhfpwvgd5akud2px_memdpz.png",
    translations: {
      العربية: {
        name: "أجنحة دجاج حارة",
        description: "أجنحة دجاج حارة تقدم مع صلصة رانش.",
        category: "دجاج",
        unit: "قطع",
      },
    },
    size: [
      {
        size: "6",
        price: 8.99,
        stock: true,
      },
      {
        size: "12",
        price: 16.99,
        stock: true,
      },
      {
        size: "15",
        price: 24.99,
        stock: true,
      },
    ],
  },
  {
    _id: "9",
    name: "Arabic Salad",
    description: "A refreshing mix of fresh vegetables, herbs, and spices.",
    price: 12.99,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749458926/arabic_salad_q5vu8u.jpg",
    category: "SIDES",
    translations: {
      العربية: {
        name: "سلطة عربية",
        description: "مزيج منعش من الخضروات الطازجة والأعشاب والتوابل.",
        category: "مقبلات",
      },
    },
    size: [],
    isAvailable: true,
    createdAt: "2025-05-23T17:49:32.623Z",
    updatedAt: "2025-05-23T17:49:32.623Z",
    __v: 0,
  },
  {
    _id: "10",
    name: "salad with crispy chicken slices",
    description: "A fresh salad topped with crispy chicken slices.",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749631918/crispy_salad_cw6cpr.jpg",
    category: "SIDES",
    unit: "slices",
    translations: {
      العربية: {
        name: "سلطة مع شرائح دجاج مقرمشة",
        description: "سلطة طازجة مغطاة بشرائح دجاج مقرمشة.",
        category: "مقبلات",
        unit: "شرائح",
      },
    },
    size: [
      {
        size: "3",
        price: 14.99,
        stock: true,
      },
      {
        size: "5",
        price: 19.99,
        stock: true,
      },
    ],
  },
  {
    _id: 11,
    name: "French Fries",
    description: "Crispy golden French fries, a perfect side dish.",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749633920/sy3qrvmk29oldtfyenej_ccnruq.png",
    category: "SIDES",
    translations: {
      العربية: {
        name: "بطاطس مقلية",
        description: "بطاطس مقلية ذهبية مقرمشة، طبق جانبي مثالي.",
        category: "مقبلات",  
      },
    },
    size: [
      {
        size: "S",
        price: 4.99,
        stock: true,
      },
      {
        size: "M",
        price: 6.99,
        stock: true,
      },
      {
        size: "L",
        price: 8.99,
        stock: true,
      },
    ],
  },
  {
    _id: "12",
    name: "sweet potato fries",
    description: "Crispy sweet potato fries, a delicious alternative.",
    price: null,
    imageUrl:
      "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749634317/ChatGPT_Image_Jun_11_2025_12_31_41_PM_u5a5ii.png",
    category: "SIDES",
    translations: {
      العربية: {
        name: "بطاطس حلوة مقلية",
        description: "بطاطس حلوة مقلية مقرمشة، بديل لذيذ.",
        category: "مقبلات",
      },
    },
    size: [
      {
        size: "S",
        price: 5.99,
        stock: true,
      },
      {
        size: "M",
        price: 7.99,
        stock: true,
      },
      {
        size: "L",
        price: 9.99,
        stock: true,
      },
    ],
  },
  {
    _id: "13",
    name: "coca-cola",
    description: "",
    price: 2.99,
    imageUrl: null,
    category: "DRINKS",
    translations: {
      العربية: {
        name: "كوكاكولا",
        description: "",
        category: "مشروبات",
      },
    },
    size: [],
    isAvailable: true,
  },
  {
    _id: "14",
    name: "pepsi",
    description: "",
    price: 2.99,
    imageUrl: null,
    category: "DRINKS",
    translations: {
      العربية: {
        name: "بيبسي",
        description: "",
        category: "مشروبات",
      },
    },
    size: [],
    isAvailable: true,
  },
  {
    _id: "15",
    name: "7up",
    description: "",
    price: 2.99,
    imageUrl: null,
    category: "DRINKS",
    translations: {
      العربية: {
        name: "سبرايت",
        description: "",
        category: "مشروبات",
      },
    },
    size: [],
    isAvailable: true,
  },
  {
    _id: "16",
    name: "water",
    description: "",
    price: 1.99,
    imageUrl: null,
    category: "DRINKS",
    translations: {
      العربية: {
        name: "ماء",
        description: "",
        category: "مشروبات",
      },
    },
    size: [],
    isAvailable: true,
  },
  {
    _id: "17",
    name: "orange juice",
    description: "",
    price: 3.99,
    imageUrl: null,
    category: "DRINKS",
    translations: {
      العربية: {
        name: "عصير برتقال",
        description: "",
        category: "مشروبات",
      },
    },
    size: [],
    isAvailable: true,
  },
];

export default demoMeals;
