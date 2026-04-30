# Quickstart: Hardening, Integrity, and Launch Readiness

## Overview
This feature introduces security and integrity hardening for the shop.co application, focusing on order access controls, checkout pricing authority, and admin mutation security.

## How to Verify Access Controls

1. **Order Ownership**:
   - Place an order as a guest. Copy the `orderId` from the success page URL.
   - Open an incognito window and attempt to visit the same URL. You should be denied access (redirected or shown an error).
2. **Admin Mutation Security**:
   - Log in with a standard user account.
   - Attempt to directly trigger an admin server action (e.g., `updateFullProduct` or `deletePromoCode`) via console or network replay.
   - The action should be rejected on the server side.

## How to Verify Integrity & Stock

1. **Checkout Pricing**:
   - Start a checkout process.
   - Using browser dev tools, modify the network payload to send an artificially low `subtotal`.
   - Submit the order. Check the resulting order in the database or UI—it should reflect the true calculation, ignoring your payload modification.
2. **Stock Visibility**:
   - Navigate to the admin product catalog.
   - Find a product variant with 0 stock. It should clearly indicate "Out of Stock".
   - Find a variant with 1-5 stock. It should indicate "Low Stock" in admin views.

## How to Verify Cache Revalidation

1. **Catalog Updates**:
   - Update a product's name in the admin panel.
   - Open a new tab to the storefront homepage or product listing.
   - The updated name should be visible immediately, without needing a full hard-refresh or waiting for a cache TTL.
