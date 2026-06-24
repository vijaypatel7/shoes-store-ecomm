const brands = [
  'Nike',
  'Adidas',
  'Puma',
  'Reebok',
  'New Balance',
  'Converse',
  'Vans',
  'Jordan',
  'Under Armour',
  'Asics',
  'Skechers',
  'Fila',
  'Bata',
  'Woodland',
  'Red Tape',
];

const categories = [
  'Running',
  'Casual',
  'Formal',
  'Sports',
  'Sneakers',
  'Boots',
  'Sandals',
  'Loafers',
  'Slip-Ons',
  'Training',
];

const genders = ['Men', 'Women', 'Unisex', 'Kids'];

const colorOptions = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Brown', hex: '#92400E' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Beige', hex: '#D4A574' },
  { name: 'Olive', hex: '#84CC16' },
];

const materials = [
  'Mesh',
  'Leather',
  'Synthetic',
  'Canvas',
  'Suede',
  'Knit',
  'Flyknit',
  'Primeknit',
  'Rubber',
  'EVA Foam',
];

const nikeModels = [
  'Air Max 90',
  'Air Max 97',
  'Air Max 270',
  'Air Force 1',
  'Dunk Low',
  'Dunk High',
  'Air Jordan 1',
  'Air Jordan 4',
  'React Infinity',
  'ZoomX Vaporfly',
  'Pegasus 40',
  'Blazer Mid',
  'Cortez',
  'Waffle One',
  'Free Run 5.0',
  'Metcon 9',
  'Air Huarache',
  'Air Presto',
  'Zoom Fly 5',
  'InfinityRN 4',
];

const adidasModels = [
  'Ultraboost 23',
  'Stan Smith',
  'Superstar',
  'NMD R1',
  'Gazelle',
  'Samba OG',
  'Forum Low',
  'Continental 80',
  'Ozweego',
  'ZX 750',
  'Adizero SL',
  'Adizero Boston 12',
  'Duramo Speed',
  'Runfalcon 3.0',
  'Campus 00s',
  'Handball Spezial',
  'Response CL',
  'Yeezy 350',
  'Yeezy 500',
  'Yeezy 700',
];

const pumaModels = [
  'RS-X',
  'Suede Classic',
  'Cali Dream',
  'Future Rider',
  'Clyde All-Pro',
  'Velocity Nitro 2',
  'Deviate Nitro 2',
  'Magnify Nitro 2',
  'Court Rider',
  'Roma Classic',
  'Electrify Nitro 3',
  'FastTrac Nitro',
  'Mayze Stack',
  'Rider FV',
  'Palermo',
];

const reebokModels = [
  'Classic Leather',
  'Club C 85',
  'Question Mid',
  'Answer IV',
  'Nano X3',
  'Floatride Energy 5',
  'Zig Kinetica 3',
  'Classic Nylon',
  'LT Court',
  'Energen Tech Plus',
];

const nbModels = [
  '574',
  '990v6',
  '2002R',
  '550',
  '327',
  '1080v13',
  'Fresh Foam X 860v14',
  'FuelCell Rebel v4',
  'FuelCell SuperComp Elite v4',
  '530',
];

const converseModels = [
  'Chuck Taylor All Star',
  'Chuck 70',
  'One Star',
  'Jack Purcell',
  'Star Player',
  'All Star BB Jet Mid',
  'Run Star Hike',
  'Chuck Taylor All Star Lift',
  'Pro Leather',
  'Weapon',
];

const vansModels = [
  'Old Skool',
  'Sk8-Hi',
  'Authentic',
  'Era',
  'Slip-On',
  'Classic Slip-On',
  'Ultrarange EXO',
  'SK8-Low',
  'Style 36',
  'Lowland CC',
];

const jordanModels = [
  'Air Jordan 1 Retro High OG',
  'Air Jordan 1 Low',
  'Air Jordan 3 Retro',
  'Air Jordan 4 Retro',
  'Air Jordan 5 Retro',
  'Air Jordan 6 Retro',
  'Air Jordan 11 Retro',
  'Air Jordan 12 Retro',
  'Air Jordan 13 Retro',
  'Jordan Max Aura 5',
];

const uaModels = [
  'HOVR Phantom 3',
  'HOVR Machina 3',
  'Curry 11',
  'SlipSpeed',
  'Charged Assert 10',
  'UA Flow Velociti Wind 2',
  'Tribase Reign 6',
  'UA Charged Pursuit 3',
  'UA HOVR Infinite 5',
  'UA Charged Rogue 4',
];

const asicsModels = [
  'GEL-Kayano 30',
  'GEL-Nimbus 26',
  'GEL-1130',
  'GEL-NYC',
  'GT-2000 12',
  'NOVABLAST 4',
  'GEL-Cumulus 26',
  'GEL-Quantum 360',
  'GEL-Excite 10',
  'GEL-Lyte III',
];

const skechersModels = [
  'Go Walk 7',
  'Max Cushioning Elite',
  'D\'Lites',
  'Arch Fit',
  'Ultra Flex 3.0',
  'Go Run Ride 11',
  'Slip-ins',
  'Stamina Airy',
  'Track Scloric',
  'Razor Excess',
];

const filaModels = [
  'Disruptor 2',
  'Ray Tracer',
  'Renno',
  'Grant Hill 2',
  'Oakmont TR',
  'Mindblower',
  'V94M',
  'Dragster 98',
  'Alpha Ray Linear',
  'Memory Workshift',
];

const bataModels = [
  'Comfit Stride',
  'Power Drift',
  'North Star Runner',
  'Sparx Classic',
  'Hush Puppies Derby',
  'Ambassador Slip-On',
  'Bata Red Label Oxford',
  'Bata Industrial Safety',
  'Weinbrenner Trail',
  'Mocassino Flex',
];

const woodlandModels = [
  'Woodland Adventure',
  'ProPlanet Hiker',
  'GC Urban',
  'Woodland Trekker',
  'Woodland Casual Lace',
  'OGC Sneaker',
  'Woodland Sandal Pro',
  'Woodland Derby Classic',
  'Woodland Boots Pro',
  'Eco Trail Runner',
];

const redTapeModels = [
  'RSC Sneaker',
  'Classic Oxford',
  'Athleisure Walk',
  'Derby Formal',
  'Slip-On Comfort',
  'Sports Runner',
  'Monk Strap',
  'Brogue Classic',
  'Loafer Tassel',
  'Chelsea Boot',
];

const modelsByBrand = {
  Nike: nikeModels,
  Adidas: adidasModels,
  Puma: pumaModels,
  Reebok: reebokModels,
  'New Balance': nbModels,
  Converse: converseModels,
  Vans: vansModels,
  Jordan: jordanModels,
  'Under Armour': uaModels,
  Asics: asicsModels,
  Skechers: skechersModels,
  Fila: filaModels,
  Bata: bataModels,
  Woodland: woodlandModels,
  'Red Tape': redTapeModels,
};

const generateDescription = (brand, model, category, gender) => {
  const descriptions = [
    `Step up your game with the ${brand} ${model}. Designed for ${category.toLowerCase()} enthusiasts, this ${gender.toLowerCase()}'s shoe combines cutting-edge technology with timeless style. Features premium cushioning for all-day comfort and a durable outsole for excellent traction.`,
    `The ${brand} ${model} redefines ${category.toLowerCase()} footwear with its innovative design and superior comfort. Perfect for ${gender.toLowerCase()}, it features breathable upper construction and responsive midsole technology.`,
    `Experience unmatched performance with the ${brand} ${model}. Crafted for the modern ${gender.toLowerCase()}, this ${category.toLowerCase()} shoe delivers exceptional support, lightweight feel, and eye-catching aesthetics.`,
    `Introducing the ${brand} ${model} - where style meets functionality. This ${category.toLowerCase()} shoe for ${gender.toLowerCase()} features advanced cushioning technology, premium materials, and a design that turns heads on and off the court.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const generateImages = (brand, index) => {
  // Using picsum for placeholder images - in production replace with real shoe images
  const seed = `${brand}-${index}`;
  return [
    {
      url: `https://picsum.photos/seed/${seed}-1/600/600`,
      alt: `${brand} shoe view 1`,
    },
    {
      url: `https://picsum.photos/seed/${seed}-2/600/600`,
      alt: `${brand} shoe view 2`,
    },
    {
      url: `https://picsum.photos/seed/${seed}-3/600/600`,
      alt: `${brand} shoe view 3`,
    },
    {
      url: `https://picsum.photos/seed/${seed}-4/600/600`,
      alt: `${brand} shoe view 4`,
    },
  ];
};

const generatePrice = (brand) => {
  const priceRanges = {
    Nike: { min: 3999, max: 18999 },
    Adidas: { min: 3499, max: 22999 },
    Puma: { min: 2999, max: 14999 },
    Reebok: { min: 2499, max: 12999 },
    'New Balance': { min: 4999, max: 24999 },
    Converse: { min: 2999, max: 8999 },
    Vans: { min: 3499, max: 9999 },
    Jordan: { min: 8999, max: 29999 },
    'Under Armour': { min: 4999, max: 16999 },
    Asics: { min: 4499, max: 19999 },
    Skechers: { min: 2999, max: 9999 },
    Fila: { min: 2499, max: 8999 },
    Bata: { min: 999, max: 5999 },
    Woodland: { min: 2999, max: 8999 },
    'Red Tape': { min: 1999, max: 6999 },
  };

  const range = priceRanges[brand] || { min: 2000, max: 10000 };
  const price =
    Math.round(
      (Math.random() * (range.max - range.min) + range.min) / 100
    ) * 100 - 1;
  const discountPercent = Math.floor(Math.random() * 40) + 5; // 5-45%
  const originalPrice = Math.round(price / (1 - discountPercent / 100) / 100) * 100;

  return { price, originalPrice, discount: discountPercent };
};

const generateSizes = (gender) => {
  let sizeRange;
  if (gender === 'Men') {
    sizeRange = [6, 7, 8, 9, 10, 11, 12];
  } else if (gender === 'Women') {
    sizeRange = [4, 5, 6, 7, 8, 9];
  } else if (gender === 'Kids') {
    sizeRange = [1, 2, 3, 4, 5, 6];
  } else {
    sizeRange = [5, 6, 7, 8, 9, 10, 11];
  }

  return sizeRange.map((size) => ({
    size,
    stock: Math.floor(Math.random() * 50) + 5,
  }));
};

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateProducts = () => {
  const products = [];
  let id = 0;

  for (const brand of brands) {
    const models = modelsByBrand[brand];

    for (const model of models) {
      for (let variant = 0; variant < 3; variant++) {
        id++;
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const { price, originalPrice, discount } = generatePrice(brand);
        const selectedColors = getRandomItems(
          colorOptions,
          Math.floor(Math.random() * 4) + 2
        );
        const selectedMaterial =
          materials[Math.floor(Math.random() * materials.length)];
        const sizes = generateSizes(gender);

        const colorSuffix =
          selectedColors[0]?.name || '';
        const fullName = `${brand} ${model} ${colorSuffix}`.trim();

        products.push({
          name: fullName,
          description: generateDescription(brand, model, category, gender),
          shortDescription: `Premium ${category.toLowerCase()} shoe from ${brand} collection`,
          brand,
          category,
          gender,
          price,
          originalPrice,
          discount,
          images: generateImages(brand, id),
          colors: selectedColors,
          sizes,
          material: selectedMaterial,
          weight: `${Math.floor(Math.random() * 200) + 200}g`,
          rating: {
            average: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
            count: Math.floor(Math.random() * 500) + 10,
          },
          tags: [
            brand.toLowerCase(),
            category.toLowerCase(),
            gender.toLowerCase(),
            selectedMaterial.toLowerCase(),
          ],
          isFeatured: Math.random() < 0.15,
          isNewArrival: Math.random() < 0.2,
          isBestseller: Math.random() < 0.15,
          isActive: true,
        });
      }
    }
  }

  return products;
};

export default generateProducts;