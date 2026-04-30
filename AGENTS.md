<!-- SPECKIT START -->
<!-- Current feature plan: specs/004-promos-delivery-settings/plan.md -->
# AI_CONTEXT

Note: This file reflects the current repo state. Branding/content is inconsistent across the codebase: `Cura` appears in README/SEO/auth metadata, while `ELARIS` and `SHOP.CO` appear in UI copy, and parts of the home page still use fashion-template content.

## 1. Project Overview

- **What the project does**: App Router e-commerce storefront that lets users browse products, view product details, manage a cart, apply promo codes, check out, review orders, and manage profile/address data.
- **Current product reality**: The implementation is a generic storefront with manual-payment checkout rather than a polished single-brand product. Product/domain copy is mixed between beauty/wellness and fashion.
- **Main customer flows**: home discovery, category/search-based browsing, product variant selection, guest or authenticated cart usage, checkout, order confirmation, order history, profile settings, saved addresses.
- **Checkout model**: supports cash on delivery, Vodafone Cash, and Instapay. Payment proof is collected as a local file input in the browser; there is no upload pipeline in the repo.
- **External integrations**: Supabase Auth and PostgreSQL, Vercel Analytics, next-themes for theme toggling, Radix UI and Headless UI primitives, Motion-based UI animation.
- **Tech stack**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Supabase Auth/Postgres, Zustand, React Query, Formik, Yup, Radix UI, Headless UI, Motion, Vercel Analytics.
- **Important env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, optional `NEXT_PUBLIC_APP_URL`.

## 2. Architecture

- **Frontend/backend split**: Single Next.js app. Server Components handle page shells and data loading by default; client components handle interactive UI, local state, and browser APIs.
- **Service boundary**: `actions/*.ts` server actions are the de facto backend layer. There is no separate REST or GraphQL service, and no `app/api` route handlers.
- **Data layer**: Supabase is used directly from server actions and some server pages through `lib/supabase/server.ts`. Auth is session-cookie based through Supabase SSR helpers.
- **Auth gating**: Root `middleware.ts` protects `/profile` and `/settings`, redirects unauthenticated users to `/sign-in`, and redirects authenticated users away from `/sign-in` and `/sign-up`.
- **State split**: Zustand owns cross-route client state that must survive navigation, especially cart state and current user state. React Query handles fetch/mutation flows for addresses, cities, and some client-triggered mutations.
- **Composition pattern**: pages are thin wrappers around feature components; actions bundle persistence and domain rules; `types/*` define shared contracts; `providers/*` wire global behavior.
- **Rendering pattern**: Home, product listing, product details, and orders use Server Components with `Suspense` fallbacks. Cart, checkout, auth forms, and most profile settings are client-driven.
- **Layout pattern**: `app/layout.tsx` wraps everything with Query, Zustand bootstrap, theme provider, and Vercel Analytics. `app/(store)/layout.tsx` adds the site navbar/footer. `app/(auth)/layout.tsx` provides a focused auth shell.
- **Route groups**: route groups are used for organization rather than URL segments: `(auth)`, `(store)`, and nested `(user)`.
- **Public route surfaces**: `/`, `/products`, `/products/[id]`, `/cart`, `/checkout`, `/orders`, `/order-success`, `/profile`, `/profile/settings`, `/sign-in`, `/sign-up`.
- **Public client store surfaces**: `useCartStore` manages cart items, totals, promo state, hydration, guest persistence, and server sync; `useUserStore` manages current profile caching and one-time user initialization.

## 3. Folder Structure Explained

- **`app/`**: App Router entrypoints and layouts.
- **`app/(store)/page.tsx`**: home page with hero, new arrivals, top selling, categories, reviews.
- **`app/(store)/products/page.tsx`**: product listing page. Reads `search`, `category`, `is_top_selling`, and `is_new_arrival` from query params.
- **`app/(store)/products/[id]/page.tsx`**: product detail page for a single product ID.
- **`app/(store)/cart/page.tsx`**: cart page.
- **`app/(store)/checkout/page.tsx`**: checkout page; client-rendered and guarded by local cart state.
- **`app/(store)/orders/page.tsx`**: order history page.
- **`app/(store)/order-success/page.tsx`**: post-checkout confirmation page that loads an order by query string `orderId`.
- **`app/(store)/(user)/profile/page.tsx`**: profile dashboard and saved addresses.
- **`app/(store)/(user)/profile/settings/page.tsx`**: profile settings and password update page.
- **`app/(auth)/sign-in/page.tsx`**: sign-in page.
- **`app/(auth)/sign-up/page.tsx`**: sign-up page.
- **`actions/`**: server actions acting as combined controllers/services for auth, products, categories, cart, orders, addresses, promo codes, and delivery fees.
- **`components/`**: feature-organized UI modules: `home`, `showProducts`, `productDetails`, `cart`, `checkout`, `orders`, `profile`, `navbar`, `footer`, `forms`, `ui`, `skeleton`.
- **`stores/`**: Zustand stores. `cartStore.ts` handles cart persistence/sync/promo state. `userStore.ts` initializes and caches the signed-in profile.
- **`providers/`**: app-wide wrappers. Query provider, state bootstrapper, theme provider.
- **`lib/`**: shared helpers and infra. Includes Supabase client factories, image compression, date formatting, Tailwind class merging, validation schemas, and an unused SEO config.
- **`types/`**: TypeScript contracts for address, cart, order, product, promo code, user, and delivery data.
- **`constants/`**: route constants used across client and server code.
- **`public/`**: static assets, custom fonts, category imagery, hero imagery, and payment method logos.
- **`middleware.ts`**: active request middleware for auth redirects.
- **`.specify/`**: Spec-Kit workflow scaffolding, templates, and scripts. This is project process tooling, not runtime application code.

## 4. Database Schema

- **Schema status**: inferred from TypeScript types, Supabase queries, README notes, and DB object names referenced in code. No migrations or SQL definitions are present in the repo.
- **`users`**: app-level profile table keyed by Supabase auth user ID. Important fields: `id`, `name`, `email`, `phone`, `role`, `created_at`. Used by auth/profile flows and `order-success` phone lookup.
- **`categories`**: product categorization table. Important fields: `id`, `title`, `slug`, `image`. Related to `products.category_id`.
- **`products`**: canonical product record. Important fields: `id`, `title`, `description`, `category_id`, `image_cover`, `is_deleted`, `created_at`, `new_arrival_rank`, `top_selling_rank`, `category_rank`.
- **`product_variants`**: sellable variant table. Important fields: `id`, `product_id`, `color`, `size`, `price`, `price_before`, `stock`, `sku`. Used by cart, PDP selection, and order snapshot creation.
- **`product_images`**: additional product gallery images. Important fields: `id`, `product_id`, `url`.
- **`products_with_min_price`**: inferred database view for listing pages. Exposes product summary fields plus `min_price` and `min_price_before` for cards and listing filters.
- **`carts`**: cart owner container. Important fields inferred from usage: `id`, `user_id`, `guest_id`, `created_at`. One logical active cart is selected by latest `created_at`.
- **`cart_items`**: cart line items. Important fields: `id`, `cart_id`, `variant_id`, `quantity`. Joined to `product_variants` and then `products`.
- **`addresses`**: saved delivery addresses for authenticated users only. Important fields: `id`, `user_id`, `full_name`, `phone`, `city`, `area`, `address_line`, `notes`, `is_default`.
- **`coupons`**: promo code table. Important fields: `id`, `code`, `type`, `value`, `used_count`, `max_uses`, `min_purchase`, `is_active`, `expires_at`, `created_at`.
- **`delivery`**: city-to-fee lookup table. Important fields: `id`, `city`, `delivery_fee`, `created_at`.
- **`orders`**: order header table supporting both users and guests. Important fields: `id`, `user_id`, `guest_id`, `status`, `subtotal`, `discount_amount`, `total_price`, `payment_method`, `payment_image`, `delivery_fee`, `city`, `area`, `address_line`, `notes`, `user_name`, `created_at`.
- **`order_items`**: order line snapshot table. Important fields: `id`, `order_id`, `variant_id`, `quantity`, `price_at_purchase`, `product_title`, `product_image`, `variant_color`, `variant_size`. This stores historical snapshots instead of rejoining live product data later.
- **`update_full_product`**: inferred Supabase/Postgres RPC used by `actions/productsAction.ts` to update product core fields, variants, and image lists in one database-side operation.
- **Core relationships**: `categories -> products -> product_variants/product_images`; `users -> carts/addresses/orders`; `carts -> cart_items -> product_variants`; `orders -> order_items`; `coupons` influence `orders.discount_amount`; `delivery.city` drives checkout delivery price.

## 5. Core Modules

### Catalog

- **Purpose**: product discovery across home sections, category browsing, search, filtered listing, detail page, and related products.
- **Key files**: `actions/productsAction.ts`, `actions/categoriesAction.ts`, `app/(store)/page.tsx`, `app/(store)/products/page.tsx`, `app/(store)/products/[id]/page.tsx`, `components/home/*`, `components/showProducts/*`, `components/productDetails/*`.
- **How it works**: list pages query `products_with_min_price`; category filtering resolves a slug to category ID first; PDP loads one product plus variants and gallery images from `products`, `product_variants`, and `product_images`.

### Cart

- **Purpose**: support guest and authenticated carts, optimistic quantity changes, totals, and promo state.
- **Key files**: `stores/cartStore.ts`, `actions/cartAction.ts`, `components/cart/*`, `components/navbar/CartIcon.tsx`.
- **How it works**: `useCartStore` is the main cart interface; guest cart persists locally through Zustand `persist`; signed-in cart syncs to Supabase; on login, local guest items are merged into the server cart before a fresh cart pull; totals are derived client-side from stored items.

### Checkout

- **Purpose**: collect address, delivery fee, payment method, optional payment proof, promo usage, and final order submission.
- **Key files**: `app/(store)/checkout/page.tsx`, `components/checkout/*`, `actions/ordersAction.ts`, `actions/addressAction.ts`, `actions/deliveryAction.ts`, `actions/promoCodeAction.ts`.
- **How it works**: authenticated users choose saved addresses or add one inline; guests fill a dedicated form; city drives delivery fee; payment selection may attach a local image file; order submission creates `orders` and `order_items`, then clears cart/promo state and redirects.

### Orders

- **Purpose**: show order history, item previews, detail modal, and success page confirmation.
- **Key files**: `app/(store)/orders/page.tsx`, `app/(store)/order-success/page.tsx`, `components/orders/*`, `actions/ordersAction.ts`.
- **How it works**: order history uses current auth user or `guest-id` cookie; detail modal loads line items separately; success page refetches order header and items by `orderId` query param.

### Auth / User

- **Purpose**: sign up, sign in, sign out, load current profile, update profile, update password, and delete users through admin client if needed.
- **Key files**: `app/(auth)/*`, `components/forms/AuthForm.tsx`, `actions/userAction.ts`, `stores/userStore.ts`, `middleware.ts`, `lib/supabase/admin.ts`.
- **How it works**: `useUserStore` is the main client auth/profile interface; sign-up creates a Supabase auth user and then inserts a `users` row; `GetUser()` reads the current Supabase session and fetches the profile row; the store initializes once on app boot.

### Profile / Addresses

- **Purpose**: present current user data, manage saved addresses, and handle settings/password changes.
- **Key files**: `app/(store)/(user)/profile/*`, `components/profile/*`, `actions/addressAction.ts`, `actions/userAction.ts`.
- **How it works**: profile page is client-rendered from `userStore`; addresses are fetched client-side and edited through server actions; settings page server-loads the current user and renders Formik-based update forms.

### Navigation / Layout

- **Purpose**: global structure, navigation, theme toggle, search, and footer shell.
- **Key files**: `app/layout.tsx`, `app/(store)/layout.tsx`, `app/(auth)/layout.tsx`, `components/navbar/*`, `components/footer/*`, `providers/*`.
- **How it works**: the root layout mounts providers; store routes get navbar/footer; auth routes get a full-screen auth shell; navigation search updates the product listing query string after a debounce.

### Shared UI

- **Purpose**: reusable presentational primitives and UX helpers.
- **Key files**: `components/ProductCard.tsx`, `components/ui/Toast.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/button.tsx`, `components/skeleton/*`, `lib/utils.ts`.
- **How it works**: feature modules reuse common card, toast, dropdown, skeleton, and utility patterns rather than a large design-system layer.

### Hidden Admin / Data Management

- **Purpose**: support product/category/promo/order mutations without a checked-in admin UI.
- **Key files**: `actions/productsAction.ts`, `actions/categoriesAction.ts`, `actions/promoCodeAction.ts`, `actions/ordersAction.ts`.
- **How it works**: create/update/delete actions exist for products, categories, and promo codes, plus order status updates, but no in-repo route or dashboard currently calls them.

## 6. API Layer

- **API style**: There are no `app/api` route handlers. Server actions are the effective API surface and return union-style objects such as `{ success: true, data }` or `{ success: false, message }`.
- **`actions/userAction.ts`**: Auth and profile API. `SignUpSupabase`, `SignInSupabase`, `SignOutSupabase`, `DeleteUser`, `GetUser`, `UpdateUserProfile`, `UpdateUserPassword`. Touches `users` plus Supabase Auth.
- **`actions/productsAction.ts`**: Catalog and hidden product-management API. `getProducts`, `getProductById`, `getNewArrivals`, `getTopSelling`, `getRelatedProducts`, `createProduct`, `updateFullProduct`, `deleteProduct`. Touches `products_with_min_price`, `products`, `product_variants`, `product_images`, `update_full_product`.
- **`actions/categoriesAction.ts`**: Category read/write API. `getAllCategories`, `getCategoryById`, `getCategoryBySlug`, `createCategory`, `updateCategory`, `deleteCategory`. Touches `categories`.
- **`actions/cartAction.ts`**: Cart API. `getOrCreateCart`, `addToCart`, `getCart`, `removeFromCart`, `updateQuantity`, `clearCart`. Touches `carts`, `cart_items`, `product_variants`.
- **`actions/ordersAction.ts`**: Order API. `createOrder`, `getUserOrders`, `getOrderItems`, `getOrderById`, `updateOrderStatus`. Touches `orders`, `order_items`, `coupons`.
- **`actions/addressAction.ts`**: Saved-address API for authenticated users. `getAddresses`, `addAddress`, `updateAddress`, `deleteAddress`. Touches `addresses`.
- **`actions/promoCodeAction.ts`**: Promo API. `validatePromoCode`, `createPromoCode`, `updatePromoCode`, `deletePromoCode`. Touches `coupons`.
- **`actions/deliveryAction.ts`**: Delivery-fee API. `getDeliveryFee`, `getCities`. Touches `delivery`.
- **Request shape pattern**: actions generally accept typed POJOs or simple primitives and return a `success` boolean plus either `data` or `message`.
- **Response shape caveat**: order and cart reads sometimes return nested Supabase relation data that is richer than the static TypeScript types suggest.

## 7. Business Logic

- **Browse / filter / search**: product listing reads query params from `/products`; search is title-only via `ilike`; `is_top_selling` and `is_new_arrival` map to rank-based filters; category filtering goes through category slug lookup first.
- **Product details**: the PDP starts with the first variant as the default selected color/size and limits quantity to current variant stock.
- **Cart initialization**: `StateProvider` initializes user state first, then cart state once hydration and user init are complete.
- **Guest cart behavior**: guest cart lives in local persisted Zustand state and is usable without auth.
- **Guest-to-user cart merge**: when a user session appears and a guest cart exists, `cartStore` replays guest items through `addToCart()` server actions, then reloads the Supabase cart.
- **Cart stock checks**: `addToCart` and server-side `updateQuantity` query `product_variants.stock` and reject quantities above stock.
- **Promo validation**: promo code flow checks existence, `is_active`, `expires_at`, `used_count < max_uses`, and `min_purchase`. Discount can be percentage or fixed amount.
- **Delivery fee lookup**: checkout loads fee by city from `delivery`; authenticated and guest flows both use the same city-based lookup.
- **Authenticated checkout**: user picks a saved address or creates one inline, chooses payment, optionally attaches a screenshot, then creates an order with `user_id`.
- **Guest checkout**: guest fills address data directly, a synthetic `guest_id` is generated at order placement time, and a `guest-id` cookie is written only after a successful order.
- **Order creation**: `createOrder` recalculates subtotal from submitted cart items, inserts `orders`, snapshots `order_items`, and increments `coupons.used_count` only after order creation succeeds.
- **Order history retrieval**: `getUserOrders()` uses the current auth user if available, otherwise falls back to the `guest-id` cookie and filters guest orders where `user_id` is null.
- **Profile updates**: profile edits update `users.name` and `users.phone`; there is email-update logic in the action layer, but the current settings form disables the email input.
- **Password updates**: password change reauthenticates with the old password, updates the Supabase auth password, then signs the user out.
- **Address rules**: addresses are auth-only and always scoped by `user_id`. Guest checkout never writes guest addresses to the database.

## 8. Reusable Components / Utilities

- **`components/ProductCard.tsx`**: shared product summary card used in home sections and listing rows.
- **`components/cart/OrderSummary.tsx`**: shared cart/checkout pricing summary with promo application and total calculation logic.
- **`components/ui/Toast.tsx`**: reusable transient feedback component used by product add-to-cart and profile forms.
- **`components/ui/dropdown-menu.tsx`**: Radix-based dropdown primitives used by the user menu.
- **`components/ui/button.tsx`**: shadcn-style button primitive available for reuse, though most current feature UIs still use direct Tailwind class strings.
- **`components/productDetails/ImageSlider.tsx`**: reusable product gallery slider with thumbnail navigation and touch/mouse swipe behavior.
- **`components/checkout/Payment/*`**: payment method panels shared within the checkout flow.
- **`components/skeleton/*`**: loading placeholders for cart, product details, home sections, and orders.
- **`lib/Imagecompression.ts`**: client-side image compression helper used before storing payment screenshot files in component state.
- **`lib/data.ts`**: `Data()` helper formats timestamps for Cairo time in 12h and 24h forms.
- **`lib/utils.ts`**: `cn()` helper merges class names with `clsx` and `tailwind-merge`.
- **`lib/validation/authValidations.ts`**: Yup schemas for sign-in, sign-up, and password-change validation.
- **`lib/supabase/server.ts`**: server-side Supabase client factory tied to request cookies.
- **`lib/supabase/client.ts`**: browser Supabase client factory, currently not central to major flows.
- **`lib/supabase/admin.ts`**: service-role Supabase client for admin-only operations such as auth user deletion.
- **`providers/query-provider.tsx`**: global React Query client setup.
- **`providers/state-provider.tsx`**: bootstraps user/cart initialization order.
- **`providers/theme-provider.tsx`**: next-themes wrapper used by the root layout.

## 9. Conventions

- **Imports**: the repo uses the `@/*` path alias from `tsconfig.json`.
- **Routing**: App Router route groups organize code by concern without changing URLs.
- **Client/server split**: interactive components declare `"use client"`; server actions declare `"use server"`; many pages remain Server Components.
- **Action contract style**: most actions return discriminated-ish unions with `success` plus either `data` or `message`.
- **Type organization**: shared contracts live in `types/*` and are imported directly across actions, stores, and components.
- **State pattern**: use Zustand for cross-route client state that must persist or hydrate, especially user/cart. Use React Query for server-derived collections and mutation orchestration in client components.
- **Query keys**: current React Query conventions include `["addresses", user?.id]` and `["cities"]`.
- **Persistence pattern**: guest cart persistence is handled by Zustand `persist`; authenticated cart data is reloaded from Supabase.
- **Store export pattern**: both stores export named hooks and aliases. `useCartStore`/`useCart` expose cart state and mutations; `useUserStore`/`useUser` expose current user state and initialization/update helpers.
- **Styling**: Tailwind-first styling with custom fonts `Satoshi` and `Integral CF`, strong borders, mostly monochrome surfaces, and minimal abstraction around utility classes.
- **Animation**: Motion is used for mobile menu, toast, address transitions, and some reveal interactions; Headless UI is used for order details dialog.
- **Suspense usage**: server-loaded sections often use `Suspense` plus skeleton components instead of explicit loading routes.
- **Routes/constants**: user-facing URLs should use `constants/routes.ts` where possible.

## 10. Known Constraints

- **Branding drift**: code and copy do not represent a single stable product identity. `Cura`, `ELARIS`, and `SHOP.CO` all exist in the repo.
- **No HTTP API layer**: there are no route handlers in `app/api`; future integrations must use server actions or add new route handlers intentionally.
- **Payment screenshot limitation**: payment screenshots are not uploaded or persisted as files anywhere in the repo. Only the local file name is written to `orders.payment_image`.
- **Order stock limitation**: order creation does not decrement `product_variants.stock`. Stock checks happen earlier in cart operations, not at final order creation.
- **Order integrity limitation**: `createOrder()` computes totals from the submitted cart payload rather than refetching canonical variant prices from the database during checkout.
- **Order access limitation**: `app/(store)/order-success/page.tsx` fetches by `orderId` query string without validating ownership against the current user or the `guest-id` cookie.
- **Guest tracking limitation**: guest order history depends on a `guest-id` cookie that is set only after successful guest checkout.
- **Hidden admin surface**: create/update/delete actions for products, categories, promo codes, and order status already exist without an in-repo admin UI or admin-route protection model.
- **Database object dependency**: `products_with_min_price` view and `update_full_product` RPC are required by the app but are not defined anywhere in this repo.
- **Stale/unused artifacts**: `lib/supabase/middleware.ts` is not used by root middleware, `lib/seo-config.ts` is unused, `components/profile/UserIcon.tsx` is unused, and `@imagekit/next` is installed but unused.
- **Template residue**: home page, footer, navbar promo bar, and auth shell still contain template/fashion copy that does not match the README or SEO language.
- **Duplicate address-form logic**: checkout and profile maintain separate address form components with overlapping validation and behavior.
- **Cache invalidation caveat**: `actions/addressAction.ts` revalidates `/profile/addresses`, but that route does not exist in the checked-in app; client-side React Query invalidation is doing most of the visible refresh work.
- **Testing status**: no automated test suite is present in the repo.
- **Lint status**: `npm run lint` does not currently pass cleanly. The repo has existing TypeScript ESLint, hook, and unused-code issues.
- **Do not change blindly**: preserve dual guest/auth flows, server-action return shapes, snapshot-based `order_items`, route-group structure, and Supabase view/RPC dependencies unless the change intentionally redesigns them.

## 11. How to Extend This Project

- **Add a new page**: place it under the relevant `app/` route group, keep the page shell server-rendered when possible, and move browser-only interaction into child client components.
- **Add new data access**: create a new server action in `actions/`, use `lib/supabase/server.ts`, return the existing `{ success, data?, message? }` shape, and add/update `types/*` alongside it.
- **Add a new authenticated feature**: wire route protection through `middleware.ts` if the route must be blocked before render, not just hidden in the client.
- **Add a new database table/view/RPC**: document it in `types/*`, update the relevant action module, and note any required Supabase-side object that does not live in the repo.
- **Add new client state**: prefer Zustand only for persistent or cross-route state. Prefer React Query for server-backed collections, cache invalidation, and client-triggered mutations.
- **Extend catalog logic**: reuse `productsAction.ts` and the `products_with_min_price` listing model; keep query-param-driven filters aligned with `/products`.
- **Extend checkout**: preserve both authenticated and guest order paths, delivery-fee lookup by city, promo semantics, and cart clearing/redirect behavior after success.
- **Extend profile/address flows**: keep address writes scoped by `user_id` and avoid introducing guest-address persistence unless the schema and UX are intentionally expanded.
- **Extend admin capabilities**: build a dedicated admin route group or separate app surface instead of exposing existing write actions directly in public client UI.
- **Extend UI safely**: reuse `ProductCard`, `OrderSummary`, `Toast`, dropdown primitives, skeletons, and font/color patterns before inventing a second UI system.
- **Harden sensitive flows**: if you touch orders, checkout, or profile access, prefer adding server-side ownership validation and DB-backed price/stock verification rather than relying on current client assumptions.

<!-- SPECKIT END -->
