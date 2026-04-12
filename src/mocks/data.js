// ============================================================
// MOCK DATA - Dữ liệu giả cho toàn bộ hệ thống
// ============================================================
import { extraProducts } from './products_extra'
import { applyImages } from './images'

export const mockPetTypes = [
  { pk_pet_type_id: 1, name: 'Chó', icon_url: '🐶' },
  { pk_pet_type_id: 2, name: 'Mèo', icon_url: '🐱' },
  { pk_pet_type_id: 3, name: 'Cá', icon_url: '🐟' },
  { pk_pet_type_id: 4, name: 'Chim', icon_url: '🐦' },
  { pk_pet_type_id: 5, name: 'Thỏ', icon_url: '🐰' },
]

export const mockCategories = [
  // ── Cha ──────────────────────────────────────────────────
  { pk_category_id: 1,  fk_parent_id: null, name: 'Thức ăn',           slug: 'thuc-an',          sort_order: 1, is_active: 1, product_count: 45 },
  { pk_category_id: 4,  fk_parent_id: null, name: 'Phụ kiện',          slug: 'phu-kien',         sort_order: 2, is_active: 1, product_count: 60 },
  { pk_category_id: 7,  fk_parent_id: null, name: 'Đồ chơi',           slug: 'do-choi',          sort_order: 3, is_active: 1, product_count: 35 },
  { pk_category_id: 8,  fk_parent_id: null, name: 'Vệ sinh & Chăm sóc',slug: 'cham-soc',         sort_order: 4, is_active: 1, product_count: 28 },
  { pk_category_id: 9,  fk_parent_id: null, name: 'Thời trang',        slug: 'thoi-trang',       sort_order: 5, is_active: 1, product_count: 30 },
  { pk_category_id: 10, fk_parent_id: null, name: 'Chuồng & Nhà',      slug: 'chuong-nha',       sort_order: 6, is_active: 1, product_count: 20 },
  // ── Con của Thức ăn (1) ───────────────────────────────────
  { pk_category_id: 2,  fk_parent_id: 1,    name: 'Thức ăn cho chó',   slug: 'thuc-an-cho-cho',  sort_order: 1, is_active: 1, product_count: 25 },
  { pk_category_id: 3,  fk_parent_id: 1,    name: 'Thức ăn cho mèo',   slug: 'thuc-an-cho-meo',  sort_order: 2, is_active: 1, product_count: 20 },
  // ── Con của Phụ kiện (4) ──────────────────────────────────
  { pk_category_id: 5,  fk_parent_id: 4,    name: 'Vòng cổ & Dây dắt', slug: 'vong-co-day-dat',  sort_order: 1, is_active: 1, product_count: 30 },
  { pk_category_id: 6,  fk_parent_id: 4,    name: 'Bát & Máng ăn',     slug: 'bat-mang-an',      sort_order: 2, is_active: 1, product_count: 15 },
  { pk_category_id: 11, fk_parent_id: 4,    name: 'Túi & Ba lô',       slug: 'tui-ba-lo',        sort_order: 3, is_active: 1, product_count: 15 },
]


export const _rawProducts = [
  {
    pk_product_id: 1,
    fk_category_id: 1,
    name: 'Thức ăn hạt Royal Canin cho chó trưởng thành',
    slug: 'thuc-an-hat-royal-canin-cho-cho-truong-thanh',
    description: 'Thức ăn hạt cao cấp Royal Canin dành cho chó trưởng thành từ 1 tuổi trở lên. Công thức đặc biệt giúp duy trì cân nặng lý tưởng, hỗ trợ tiêu hóa và tăng cường hệ miễn dịch.\n\nThành phần: Thịt gà, gạo, ngô, dầu cá hồi, vitamin và khoáng chất thiết yếu.',
    price: 450000, sale_price: 380000, stock: 50, sku: 'RC-DOG-001',
    brand: 'Royal Canin', weight_gram: 3000, is_consumable: 1, is_active: 1,
    created_at: '2025-01-10T08:00:00',
    primary_image: 'https://placehold.co/400x400/FFF7ED/EA580C?text=Royal+Canin',
    avg_rating: 4.7, review_count: 128,
    pet_types: [1],
    images: [
      { pk_image_id: 1, image_url: 'https://placehold.co/400x400/FFF7ED/EA580C?text=Royal+Canin', is_primary: 1, sort_order: 1 },
      { pk_image_id: 2, image_url: 'https://placehold.co/400x400/FED7AA/C2410C?text=Mat+sau', is_primary: 0, sort_order: 2 },
      { pk_image_id: 3, image_url: 'https://placehold.co/400x400/FDBA74/9A3412?text=Chi+tiet', is_primary: 0, sort_order: 3 },
    ],
    variants: [
      { pk_variant_id: 1, name: '1.5 kg', sku: 'RC-DOG-001-1.5', price: 220000, sale_price: 190000, stock: 20 },
      { pk_variant_id: 2, name: '3 kg', sku: 'RC-DOG-001-3', price: 450000, sale_price: 380000, stock: 15 },
      { pk_variant_id: 3, name: '7.5 kg', sku: 'RC-DOG-001-7.5', price: 980000, sale_price: 850000, stock: 10 },
    ],
    specs: [
      { pk_spec_id: 1, spec_name: 'Thương hiệu', spec_value: 'Royal Canin', sort_order: 1 },
      { pk_spec_id: 2, spec_name: 'Xuất xứ', spec_value: 'Pháp', sort_order: 2 },
      { pk_spec_id: 3, spec_name: 'Đối tượng', spec_value: 'Chó trưởng thành (>1 tuổi)', sort_order: 3 },
      { pk_spec_id: 4, spec_name: 'Thành phần chính', spec_value: 'Thịt gà, gạo, ngô', sort_order: 4 },
      { pk_spec_id: 5, spec_name: 'Hạn sử dụng', spec_value: '18 tháng', sort_order: 5 },
    ],
  },
  {
    pk_product_id: 2,
    fk_category_id: 1,
    name: 'Pate mèo Whiskas vị cá ngừ (12 gói)',
    slug: 'pate-meo-whiskas-vi-ca-ngu',
    description: 'Pate Whiskas vị cá ngừ thơm ngon, giàu protein và taurine giúp mèo khỏe mạnh, lông bóng mượt. Phù hợp cho mèo từ 1 tuổi trở lên.',
    price: 120000, sale_price: null, stock: 200, sku: 'WH-CAT-002',
    brand: 'Whiskas', weight_gram: 1200, is_consumable: 1, is_active: 1,
    created_at: '2025-01-15T08:00:00',
    primary_image: 'https://placehold.co/400x400/FFF0F6/BE185D?text=Whiskas+Pate',
    avg_rating: 4.5, review_count: 89,
    pet_types: [2],
    images: [
      { pk_image_id: 4, image_url: 'https://placehold.co/400x400/FFF0F6/BE185D?text=Whiskas+Pate', is_primary: 1, sort_order: 1 },
      { pk_image_id: 5, image_url: 'https://placehold.co/400x400/FCE7F3/9D174D?text=Hop+12+goi', is_primary: 0, sort_order: 2 },
    ],
    variants: [],
    specs: [
      { pk_spec_id: 6, spec_name: 'Thương hiệu', spec_value: 'Whiskas', sort_order: 1 },
      { pk_spec_id: 7, spec_name: 'Hương vị', spec_value: 'Cá ngừ', sort_order: 2 },
      { pk_spec_id: 8, spec_name: 'Số lượng', spec_value: '12 gói x 85g', sort_order: 3 },
    ],
  },
  {
    pk_product_id: 3,
    fk_category_id: 2,
    name: 'Bóng đồ chơi tương tác cho mèo có lông vũ',
    slug: 'bong-do-choi-tuong-tac-cho-meo-co-long-vu',
    description: 'Đồ chơi bóng lông vũ kích thích bản năng săn mồi của mèo. Chất liệu an toàn, không độc hại. Giúp mèo vận động và giảm stress.',
    price: 85000, sale_price: 65000, stock: 150, sku: 'TOY-CAT-003',
    brand: 'PetPlay', weight_gram: 100, is_consumable: 0, is_active: 1,
    created_at: '2025-02-01T08:00:00',
    primary_image: 'https://placehold.co/400x400/F0FDF4/15803D?text=Cat+Toy',
    avg_rating: 4.3, review_count: 56,
    pet_types: [2],
    images: [
      { pk_image_id: 6, image_url: 'https://placehold.co/400x400/F0FDF4/15803D?text=Cat+Toy', is_primary: 1, sort_order: 1 },
    ],
    variants: [
      { pk_variant_id: 4, name: 'Màu xanh', sku: 'TOY-CAT-003-BL', price: 85000, sale_price: 65000, stock: 50 },
      { pk_variant_id: 5, name: 'Màu đỏ', sku: 'TOY-CAT-003-RD', price: 85000, sale_price: 65000, stock: 60 },
      { pk_variant_id: 6, name: 'Màu vàng', sku: 'TOY-CAT-003-YL', price: 85000, sale_price: 65000, stock: 40 },
    ],
    specs: [
      { pk_spec_id: 9, spec_name: 'Chất liệu', spec_value: 'Nhựa ABS + Lông vũ tự nhiên', sort_order: 1 },
      { pk_spec_id: 10, spec_name: 'Kích thước', spec_value: '5cm x 15cm', sort_order: 2 },
    ],
  },
  {
    pk_product_id: 4,
    fk_category_id: 3,
    name: 'Vòng cổ da thật cho chó có khóa an toàn',
    slug: 'vong-co-da-that-cho-cho-co-khoa-an-toan',
    description: 'Vòng cổ da bò thật cao cấp, bền đẹp, có khóa an toàn chống tuột. Phù hợp cho chó cỡ vừa và lớn.',
    price: 180000, sale_price: null, stock: 80, sku: 'ACC-DOG-004',
    brand: 'PetStyle', weight_gram: 150, is_consumable: 0, is_active: 1,
    created_at: '2025-02-10T08:00:00',
    primary_image: 'https://placehold.co/400x400/FEF3C7/B45309?text=Dog+Collar',
    avg_rating: 4.6, review_count: 43,
    pet_types: [1],
    images: [
      { pk_image_id: 7, image_url: 'https://placehold.co/400x400/FEF3C7/B45309?text=Dog+Collar', is_primary: 1, sort_order: 1 },
      { pk_image_id: 8, image_url: 'https://placehold.co/400x400/FDE68A/92400E?text=Chi+tiet', is_primary: 0, sort_order: 2 },
    ],
    variants: [
      { pk_variant_id: 7, name: 'Size S (25-35cm)', sku: 'ACC-DOG-004-S', price: 180000, sale_price: null, stock: 30 },
      { pk_variant_id: 8, name: 'Size M (35-45cm)', sku: 'ACC-DOG-004-M', price: 200000, sale_price: null, stock: 30 },
      { pk_variant_id: 9, name: 'Size L (45-55cm)', sku: 'ACC-DOG-004-L', price: 220000, sale_price: null, stock: 20 },
    ],
    specs: [
      { pk_spec_id: 11, spec_name: 'Chất liệu', spec_value: 'Da bò thật', sort_order: 1 },
      { pk_spec_id: 12, spec_name: 'Màu sắc', spec_value: 'Nâu, Đen', sort_order: 2 },
    ],
  },
  {
    pk_product_id: 5,
    fk_category_id: 4,
    name: 'Dầu gội khử mùi cho chó mèo hương lavender',
    slug: 'dau-goi-khu-mui-cho-cho-meo-huong-lavender',
    description: 'Dầu gội chuyên dụng cho chó mèo, công thức nhẹ nhàng không gây kích ứng da. Hương lavender thơm mát, khử mùi hiệu quả lên đến 7 ngày.',
    price: 95000, sale_price: 79000, stock: 120, sku: 'CARE-PET-005',
    brand: 'PetClean', weight_gram: 300, is_consumable: 1, is_active: 1,
    created_at: '2025-02-20T08:00:00',
    primary_image: 'https://placehold.co/400x400/EFF6FF/1D4ED8?text=Pet+Shampoo',
    avg_rating: 4.4, review_count: 72,
    pet_types: [1, 2],
    images: [
      { pk_image_id: 9, image_url: 'https://placehold.co/400x400/EFF6FF/1D4ED8?text=Pet+Shampoo', is_primary: 1, sort_order: 1 },
    ],
    variants: [
      { pk_variant_id: 10, name: '200ml', sku: 'CARE-PET-005-200', price: 95000, sale_price: 79000, stock: 60 },
      { pk_variant_id: 11, name: '500ml', sku: 'CARE-PET-005-500', price: 180000, sale_price: 149000, stock: 60 },
    ],
    specs: [
      { pk_spec_id: 13, spec_name: 'Thể tích', spec_value: '200ml / 500ml', sort_order: 1 },
      { pk_spec_id: 14, spec_name: 'Hương', spec_value: 'Lavender', sort_order: 2 },
      { pk_spec_id: 15, spec_name: 'pH', spec_value: '6.5 - 7.0 (trung tính)', sort_order: 3 },
    ],
  },
  {
    pk_product_id: 6,
    fk_category_id: 1,
    name: 'Thức ăn hạt Purina Pro Plan cho mèo con',
    slug: 'thuc-an-hat-purina-pro-plan-cho-meo-con',
    description: 'Thức ăn hạt Purina Pro Plan dành riêng cho mèo con dưới 12 tháng tuổi. Giàu DHA hỗ trợ phát triển não bộ và thị lực.',
    price: 320000, sale_price: 280000, stock: 60, sku: 'PP-CAT-006',
    brand: 'Purina Pro Plan', weight_gram: 1500, is_consumable: 1, is_active: 1,
    created_at: '2025-03-01T08:00:00',
    primary_image: 'https://placehold.co/400x400/FDF4FF/7E22CE?text=Pro+Plan',
    avg_rating: 4.8, review_count: 95,
    pet_types: [2],
    images: [
      { pk_image_id: 10, image_url: 'https://placehold.co/400x400/FDF4FF/7E22CE?text=Pro+Plan', is_primary: 1, sort_order: 1 },
    ],
    variants: [
      { pk_variant_id: 12, name: '400g', sku: 'PP-CAT-006-400', price: 150000, sale_price: 130000, stock: 30 },
      { pk_variant_id: 13, name: '1.5kg', sku: 'PP-CAT-006-1500', price: 320000, sale_price: 280000, stock: 30 },
    ],
    specs: [
      { pk_spec_id: 16, spec_name: 'Đối tượng', spec_value: 'Mèo con < 12 tháng', sort_order: 1 },
      { pk_spec_id: 17, spec_name: 'Thành phần', spec_value: 'Thịt gà, cá hồi, DHA', sort_order: 2 },
    ],
  },
  {
    pk_product_id: 7,
    fk_category_id: 2,
    name: 'Cần câu đồ chơi cho mèo có chuột nhồi bông',
    slug: 'can-cau-do-choi-cho-meo-co-chuot-nhoi-bong',
    description: 'Cần câu đồ chơi tương tác cho mèo, đầu cần có chuột nhồi bông dễ thương. Giúp tăng cường vận động và gắn kết với chủ.',
    price: 55000, sale_price: null, stock: 200, sku: 'TOY-CAT-007',
    brand: 'PetPlay', weight_gram: 80, is_consumable: 0, is_active: 1,
    created_at: '2025-03-10T08:00:00',
    primary_image: 'https://placehold.co/400x400/F0FDF4/166534?text=Cat+Wand',
    avg_rating: 4.2, review_count: 38,
    pet_types: [2],
    images: [
      { pk_image_id: 11, image_url: 'https://placehold.co/400x400/F0FDF4/166534?text=Cat+Wand', is_primary: 1, sort_order: 1 },
    ],
    variants: [],
    specs: [
      { pk_spec_id: 18, spec_name: 'Chiều dài cần', spec_value: '40cm', sort_order: 1 },
      { pk_spec_id: 19, spec_name: 'Chất liệu', spec_value: 'Nhựa + Vải nhung', sort_order: 2 },
    ],
  },
  {
    pk_product_id: 8,
    fk_category_id: 6,
    name: 'Chuồng chó inox gấp gọn size XL',
    slug: 'chuong-cho-inox-gap-gon-size-xl',
    description: 'Chuồng chó inox cao cấp, dễ gấp gọn và di chuyển. Thiết kế thoáng khí, an toàn cho thú cưng. Phù hợp cho chó cỡ lớn.',
    price: 1200000, sale_price: 980000, stock: 25, sku: 'CAGE-DOG-008',
    brand: 'PetHome', weight_gram: 8000, is_consumable: 0, is_active: 1,
    created_at: '2025-03-15T08:00:00',
    primary_image: 'https://placehold.co/400x400/F8FAFC/334155?text=Dog+Cage',
    avg_rating: 4.5, review_count: 21,
    pet_types: [1],
    images: [
      { pk_image_id: 12, image_url: 'https://placehold.co/400x400/F8FAFC/334155?text=Dog+Cage', is_primary: 1, sort_order: 1 },
    ],
    variants: [
      { pk_variant_id: 14, name: 'Size L (80x55x60cm)', sku: 'CAGE-DOG-008-L', price: 950000, sale_price: 780000, stock: 10 },
      { pk_variant_id: 15, name: 'Size XL (100x65x75cm)', sku: 'CAGE-DOG-008-XL', price: 1200000, sale_price: 980000, stock: 15 },
    ],
    specs: [
      { pk_spec_id: 20, spec_name: 'Chất liệu', spec_value: 'Inox 304', sort_order: 1 },
      { pk_spec_id: 21, spec_name: 'Kích thước XL', spec_value: '100 x 65 x 75 cm', sort_order: 2 },
      { pk_spec_id: 22, spec_name: 'Trọng lượng', spec_value: '8 kg', sort_order: 3 },
    ],
  },
  {
    pk_product_id: 9,
    fk_category_id: 5,
    name: 'Áo len mùa đông cho chó nhỏ họa tiết xương',
    slug: 'ao-len-mua-dong-cho-cho-nho-hoa-tiet-xuong',
    description: 'Áo len ấm áp dành cho chó nhỏ trong mùa đông. Chất liệu len mềm mại, họa tiết xương dễ thương. Dễ mặc và tháo ra.',
    price: 145000, sale_price: 120000, stock: 90, sku: 'CLOTH-DOG-009',
    brand: 'PetFashion', weight_gram: 200, is_consumable: 0, is_active: 1,
    created_at: '2025-03-20T08:00:00',
    primary_image: 'https://placehold.co/400x400/FFF1F2/BE123C?text=Dog+Sweater',
    avg_rating: 4.4, review_count: 67,
    pet_types: [1],
    images: [
      { pk_image_id: 13, image_url: 'https://placehold.co/400x400/FFF1F2/BE123C?text=Dog+Sweater', is_primary: 1, sort_order: 1 },
    ],
    variants: [
      { pk_variant_id: 16, name: 'Size XS (1-2kg)', sku: 'CLOTH-DOG-009-XS', price: 145000, sale_price: 120000, stock: 25 },
      { pk_variant_id: 17, name: 'Size S (2-4kg)', sku: 'CLOTH-DOG-009-S', price: 155000, sale_price: 130000, stock: 35 },
      { pk_variant_id: 18, name: 'Size M (4-6kg)', sku: 'CLOTH-DOG-009-M', price: 165000, sale_price: 140000, stock: 30 },
    ],
    specs: [
      { pk_spec_id: 23, spec_name: 'Chất liệu', spec_value: 'Len acrylic cao cấp', sort_order: 1 },
      { pk_spec_id: 24, spec_name: 'Màu sắc', spec_value: 'Đỏ, Xanh navy, Xám', sort_order: 2 },
    ],
  },
  {
    pk_product_id: 10,
    fk_category_id: 4,
    name: 'Cát vệ sinh cho mèo khử mùi than hoạt tính 5L',
    slug: 'cat-ve-sinh-cho-meo-khu-mui-than-hoat-tinh-5l',
    description: 'Cát vệ sinh mèo với công nghệ than hoạt tính khử mùi vượt trội. Vón cục nhanh, dễ dọn, ít bụi. Phù hợp cho mọi loại khay vệ sinh.',
    price: 89000, sale_price: null, stock: 300, sku: 'CARE-CAT-010',
    brand: 'CatSand Pro', weight_gram: 5000, is_consumable: 1, is_active: 1,
    created_at: '2025-04-01T08:00:00',
    primary_image: 'https://placehold.co/400x400/FAFAF9/57534E?text=Cat+Litter',
    avg_rating: 4.6, review_count: 154,
    pet_types: [2],
    images: [
      { pk_image_id: 14, image_url: 'https://placehold.co/400x400/FAFAF9/57534E?text=Cat+Litter', is_primary: 1, sort_order: 1 },
    ],
    variants: [
      { pk_variant_id: 19, name: '5L', sku: 'CARE-CAT-010-5L', price: 89000, sale_price: null, stock: 150 },
      { pk_variant_id: 20, name: '10L', sku: 'CARE-CAT-010-10L', price: 165000, sale_price: 149000, stock: 150 },
    ],
    specs: [
      { pk_spec_id: 25, spec_name: 'Thể tích', spec_value: '5L / 10L', sort_order: 1 },
      { pk_spec_id: 26, spec_name: 'Công nghệ', spec_value: 'Than hoạt tính khử mùi', sort_order: 2 },
      { pk_spec_id: 27, spec_name: 'Loại cát', spec_value: 'Vón cục', sort_order: 3 },
    ],
  },
  {
    pk_product_id: 11,
    fk_category_id: 3,
    name: 'Bát ăn đôi inox chống trượt cho chó mèo',
    slug: 'bat-an-doi-inox-chong-truot-cho-cho-meo',
    description: 'Bát ăn đôi inox 304 cao cấp, đế cao su chống trượt. Dễ vệ sinh, không gỉ sét, an toàn cho thú cưng.',
    price: 75000, sale_price: 59000, stock: 180, sku: 'ACC-PET-011',
    brand: 'PetBowl', weight_gram: 400, is_consumable: 0, is_active: 1,
    created_at: '2025-04-05T08:00:00',
    primary_image: 'https://placehold.co/400x400/F0F9FF/0369A1?text=Pet+Bowl',
    avg_rating: 4.3, review_count: 88,
    pet_types: [1, 2],
    images: [
      { pk_image_id: 15, image_url: 'https://placehold.co/400x400/F0F9FF/0369A1?text=Pet+Bowl', is_primary: 1, sort_order: 1 },
    ],
    variants: [
      { pk_variant_id: 21, name: 'Size S (2x200ml)', sku: 'ACC-PET-011-S', price: 75000, sale_price: 59000, stock: 90 },
      { pk_variant_id: 22, name: 'Size L (2x500ml)', sku: 'ACC-PET-011-L', price: 95000, sale_price: 79000, stock: 90 },
    ],
    specs: [
      { pk_spec_id: 28, spec_name: 'Chất liệu', spec_value: 'Inox 304 + Đế cao su', sort_order: 1 },
      { pk_spec_id: 29, spec_name: 'Dung tích', spec_value: '2 x 200ml hoặc 2 x 500ml', sort_order: 2 },
    ],
  },
  {
    pk_product_id: 12,
    fk_category_id: 2,
    name: 'Xương gặm nhai cho chó vị thịt bò (10 cái)',
    slug: 'xuong-gam-nhai-cho-cho-vi-thit-bo',
    description: 'Xương gặm nhai tự nhiên giúp làm sạch răng, giảm mảng bám và hơi thở hôi cho chó. Vị thịt bò thơm ngon, chó rất thích.',
    price: 65000, sale_price: null, stock: 250, sku: 'TOY-DOG-012',
    brand: 'DogChew', weight_gram: 500, is_consumable: 1, is_active: 1,
    created_at: '2025-04-08T08:00:00',
    primary_image: 'https://placehold.co/400x400/FEF9C3/854D0E?text=Dog+Chew',
    avg_rating: 4.5, review_count: 112,
    pet_types: [1],
    images: [
      { pk_image_id: 16, image_url: 'https://placehold.co/400x400/FEF9C3/854D0E?text=Dog+Chew', is_primary: 1, sort_order: 1 },
    ],
    variants: [],
    specs: [
      { pk_spec_id: 30, spec_name: 'Số lượng', spec_value: '10 cái/gói', sort_order: 1 },
      { pk_spec_id: 31, spec_name: 'Hương vị', spec_value: 'Thịt bò', sort_order: 2 },
      { pk_spec_id: 32, spec_name: 'Phù hợp', spec_value: 'Chó từ 3 tháng tuổi', sort_order: 3 },
    ],
  },
  ...extraProducts,
]

export const mockProducts = applyImages(_rawProducts)

export const mockUser = {
  pk_user_id: 1,
  full_name: 'Nguyễn Văn An',
  email: 'an.nguyen@email.com',
  phone: '0901234567',
  avatar_url: null,
  role: 'customer',
  is_active: 1,
  created_at: '2024-01-15T00:00:00',
}

export const mockAddresses = [
  {
    pk_address_id: 1,
    fk_user_id: 1,
    receiver: 'Nguyễn Văn An',
    phone: '0901234567',
    province: 'TP. Hồ Chí Minh',
    commune: 'Phường Bến Nghé, Quận 1',
    street: '123 Lê Lợi',
    is_default: 1,
  },
  {
    pk_address_id: 2,
    fk_user_id: 1,
    receiver: 'Nguyễn Văn An',
    phone: '0901234567',
    province: 'TP. Hồ Chí Minh',
    commune: 'Phường 12, Quận Bình Thạnh',
    street: '456 Đinh Bộ Lĩnh',
    is_default: 0,
  },
]

export const mockOrders = [
  {
    pk_order_id: 1001,
    fk_user_id: 1,
    receiver: 'Nguyễn Văn An',
    phone: '0901234567',
    shipping_address: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    subtotal: 850000, discount_amount: 50000, shipping_fee: 30000, total: 830000,
    payment_method: 'momo', payment_status: 'paid', order_status: 'delivered',
    note: '', created_at: '2025-03-01T10:00:00', updated_at: '2025-03-05T16:00:00',
    item_count: 2,
    items: [
      { pk_order_item_id: 1, product_name: 'Thức ăn hạt Royal Canin cho chó trưởng thành (3kg)', unit_price: 380000, quantity: 1 },
      { pk_order_item_id: 2, product_name: 'Bóng cao su đồ chơi cho chó', unit_price: 65000, quantity: 1 },
    ],
    status_logs: [
      { status: 'pending',    note: 'Đơn hàng mới',                          changed_at: '2025-03-01T10:00:00' },
      { status: 'confirmed',  note: 'Đã xác nhận',                           changed_at: '2025-03-01T11:00:00' },
      { status: 'processing', note: 'Đang đóng gói',                         changed_at: '2025-03-02T08:00:00' },
      { status: 'shipping',   note: 'Đã bàn giao cho đơn vị vận chuyển',     changed_at: '2025-03-03T09:00:00' },
      { status: 'delivered',  note: 'Giao thành công',                       changed_at: '2025-03-05T16:00:00' },
    ],
  },
  {
    pk_order_id: 1007,
    fk_user_id: 1,
    receiver: 'Nguyễn Văn An',
    phone: '0901234567',
    shipping_address: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    subtotal: 95000, discount_amount: 0, shipping_fee: 25000, total: 120000,
    payment_method: 'cod', payment_status: 'pending', order_status: 'shipping',
    note: '', created_at: '2025-03-10T09:00:00', updated_at: '2025-03-12T08:00:00',
    item_count: 1,
    items: [
      { pk_order_item_id: 3, product_name: 'Cát vệ sinh cho mèo khử mùi than hoạt tính 5L', unit_price: 89000, quantity: 1 },
    ],
    status_logs: [
      { status: 'pending',   note: 'Đơn hàng mới',                        changed_at: '2025-03-10T09:00:00' },
      { status: 'confirmed', note: 'Đã xác nhận',                         changed_at: '2025-03-10T10:00:00' },
      { status: 'processing',note: 'Đang đóng gói',                       changed_at: '2025-03-11T08:00:00' },
      { status: 'shipping',  note: 'Đã bàn giao cho đơn vị vận chuyển',   changed_at: '2025-03-12T08:00:00' },
    ],
  },
  {
    pk_order_id: 1003,
    fk_user_id: 1,
    receiver: 'Nguyễn Văn An',
    phone: '0901234567',
    shipping_address: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    subtotal: 780000, discount_amount: 0, shipping_fee: 30000, total: 810000,
    payment_method: 'vnpay', payment_status: 'failed', order_status: 'cancelled',
    note: '', created_at: '2025-03-11T14:00:00', updated_at: '2025-03-11T15:00:00',
    item_count: 2,
    items: [
      { pk_order_item_id: 4, product_name: 'Nhà gỗ cho mèo 2 tầng có cột cào móng', unit_price: 550000, quantity: 1 },
      { pk_order_item_id: 5, product_name: 'Dầu gội khử mùi cho chó mèo hương lavender (200ml)', unit_price: 79000, quantity: 1 },
    ],
    status_logs: [
      { status: 'pending',   note: 'Đơn hàng mới',              changed_at: '2025-03-11T14:00:00' },
      { status: 'cancelled', note: 'Thanh toán thất bại',        changed_at: '2025-03-11T15:00:00' },
    ],
  },
]

export const mockNotifications = [
  {
    pk_notif_id: 1,
    type: 'repurchase_reminder',
    title: 'Đã đến lúc mua lại thức ăn cho bé!',
    message: 'Thức ăn hạt Royal Canin của bạn sắp hết rồi. Đặt hàng ngay để không bị gián đoạn nhé!',
    is_read: 0, ref_id: 1,
    created_at: '2025-03-12T08:00:00',
  },
  {
    pk_notif_id: 2,
    type: 'order_update',
    title: 'Đơn hàng #1007 đang được giao',
    message: 'Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển. Dự kiến giao trong 1-2 ngày.',
    is_read: 0, ref_id: 1007,
    created_at: '2025-03-12T08:00:00',
  },
  {
    pk_notif_id: 3,
    type: 'promotion',
    title: 'Khuyến mãi cuối tuần - Giảm 20% toàn bộ đồ chơi!',
    message: 'Chỉ trong 2 ngày cuối tuần, tất cả sản phẩm đồ chơi giảm 20%. Dùng mã WEEKEND20.',
    is_read: 1, ref_id: null,
    created_at: '2025-03-10T07:00:00',
  },
  {
    pk_notif_id: 4,
    type: 'order_update',
    title: 'Đơn hàng #1001 đã giao thành công',
    message: 'Đơn hàng #1001 đã được giao thành công. Hãy để lại đánh giá để giúp người mua khác nhé!',
    is_read: 1, ref_id: 1001,
    created_at: '2025-03-05T16:00:00',
  },
]

export const mockWishlist = [
  { pk_wishlist_id: 1, fk_user_id: 1, fk_product_id: 3, added_at: '2026-04-01T10:00:00', product: mockProducts[2] },
  { pk_wishlist_id: 2, fk_user_id: 1, fk_product_id: 8, added_at: '2026-04-05T14:00:00', product: mockProducts[7] },
  { pk_wishlist_id: 3, fk_user_id: 1, fk_product_id: 9, added_at: '2026-04-08T09:00:00', product: mockProducts[8] },
]

export const mockRepurchasePredictions = [
  {
    pk_pred_id: 1,
    fk_user_id: 1,
    fk_product_id: 1,
    predicted_date: '2026-04-15',
    confidence: 0.92,
    notified: 0,
    product: { ...mockProducts[0] },
  },
  {
    pk_pred_id: 2,
    fk_user_id: 1,
    fk_product_id: 10,
    predicted_date: '2026-04-13',
    confidence: 0.87,
    notified: 0,
    product: { ...mockProducts[9] },
  },
]

export const mockReviews = {
  1: [
    {
      pk_review_id: 1, fk_product_id: 1, fk_user_id: 2, fk_parent_id: null,
      rating: 5, comment: 'Sản phẩm rất tốt, chó nhà mình rất thích ăn. Lông bóng mượt hơn hẳn sau 1 tháng dùng.',
      created_at: '2026-03-15T10:00:00',
      user: { full_name: 'Trần Thị Mai' },
      replies: [],
    },
    {
      pk_review_id: 2, fk_product_id: 1, fk_user_id: 3, fk_parent_id: null,
      rating: 4, comment: 'Chất lượng ổn, giao hàng nhanh. Giá hơi cao nhưng xứng đáng.',
      created_at: '2026-03-20T14:00:00',
      user: { full_name: 'Lê Văn Hùng' },
      replies: [
        {
          pk_review_id: 5, fk_parent_id: 2, rating: null,
          comment: 'Cảm ơn bạn đã tin tưởng sản phẩm! Chúng tôi sẽ cố gắng cải thiện giá hơn nữa.',
          created_at: '2026-03-21T09:00:00',
          user: { full_name: 'PetShop Support' },
        },
      ],
    },
    {
      pk_review_id: 3, fk_product_id: 1, fk_user_id: 4, fk_parent_id: null,
      rating: 5, comment: 'Mua lần thứ 3 rồi, chất lượng ổn định. Sẽ tiếp tục ủng hộ!',
      created_at: '2026-04-01T08:00:00',
      user: { full_name: 'Phạm Thị Lan' },
      replies: [],
    },
  ],
  2: [
    {
      pk_review_id: 4, fk_product_id: 2, fk_user_id: 5, fk_parent_id: null,
      rating: 5, comment: 'Mèo nhà mình mê cái này lắm, ăn hết sạch mỗi bữa. Mùi thơm, không tanh.',
      created_at: '2026-04-05T11:00:00',
      user: { full_name: 'Nguyễn Thị Hoa' },
      replies: [],
    },
  ],
}
