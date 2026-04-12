# PetShop — Website bán phụ kiện thú cưng

Giao diện phân hệ khách hàng cho hệ thống thương mại điện tử bán phụ kiện thú cưng, tích hợp AI cá nhân hóa.

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** — styling
- **Zustand** — state management (giỏ hàng, auth, wishlist)
- **React Router v6** — routing
- **Framer Motion** — animation
- **Axios** — HTTP client

## Cài đặt

```bash
# Cài dependencies
npm install

# Copy file môi trường
cp .env.example .env

# Chạy dev server (port 5174)
npm run dev
```

## Tài khoản demo

```
Email:    an.nguyen@email.com
Password: 123456
```

## Cấu trúc thư mục

```
src/
├── components/       # Shared components (layout, ui)
├── mocks/            # Mock data & API (VITE_USE_MOCK=true)
├── pages/            # Các trang theo route
├── services/         # API services
├── store/            # Zustand stores
└── utils/            # Helpers (format, ...)
```

## Biến môi trường

| Biến | Mô tả | Mặc định |
|------|-------|---------|
| `VITE_USE_MOCK` | Dùng mock data thay API thật | `true` |
| `VITE_API_URL` | URL backend API | `http://localhost:3000/api` |
