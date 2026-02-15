# CURA E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15, designed for beauty and wellness products. Features a seamless shopping experience with real-time cart management, secure checkout, and comprehensive order tracking.

## Features

- **Product Catalog**: Browse products by category with detailed product pages
- **Smart Cart System**: Real-time cart synchronization for both authenticated and guest users
- **Secure Checkout**: Multiple payment methods including cash on delivery, Vodafone Cash, and Instapay
- **Order Management**: Track orders with detailed status updates
- **User Profiles**: Manage personal information, saved addresses, and order history
- **Promo Codes**: Apply discount codes at checkout
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Image Optimization**: Automatic image compression for faster uploads

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Form Management**: Formik + Yup
- **State Management**: React Context API
- **UI Components**: Radix UI, Headless UI
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project set up

### Installation

1. Clone the repository
```bash
git clone https://github.com/mohamed-hossam1/cura_store
cd cura_store
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes
│   ├── (auth)/            # Authentication pages
│   ├── (store)/           # Main store pages
│   └── actions/           # Server actions
├── components/            # React components
│   ├── cart/             # Cart-related components
│   ├── checkout/         # Checkout flow
│   ├── forms/            # Form components
│   ├── navbar/           # Navigation
│   ├── orders/           # Order management
│   ├── profile/          # User profile
│   └── ui/               # Reusable UI components
├── stores/               # Zustand stores
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase client setup
│   └── validation/       # Form validation schemas
├── types/                # TypeScript type definitions
└── constants/            # App constants
```

## Key Features Explained

### Cart Management

The cart system handles both authenticated and guest users:
- Guest carts are stored in localStorage
- User carts are synced with the database
- Automatic cart merging when guest users sign in
- Real-time stock validation

### Checkout Flow

Multi-step checkout process:
1. **Address Selection**: Choose from saved addresses or add new ones
2. **Payment Method**: Select payment option (cash, Vodafone Cash, or Instapay)
3. **Order Review**: Final review before placing order

### Payment Integration

- Cash on delivery
- Vodafone Cash (with receipt upload)
- Instapay (with receipt upload)
- Automatic image compression for payment receipts

### Order Tracking

Users can:
- View all past orders
- Track order status (pending, delivered, cancelled)
- View order details including items and shipping information

## Database Schema

Key tables:
- `users` - User profiles
- `products` - Product catalog
- `categories` - Product categories
- `cart_items` - User cart items
- `orders` - Order records
- `order_items` - Order line items
- `addresses` - Saved shipping addresses
- `coupons` - Promotional codes
- `delivery` - Delivery fee by city

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Demo

https://www.mycurawellness.com/
---

Built with ❤️ using Next.js and Supabase
 
