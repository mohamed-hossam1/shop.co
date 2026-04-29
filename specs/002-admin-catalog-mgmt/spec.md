# Feature Specification: Admin Catalog Management

**Feature Branch**: `002-admin-catalog-mgmt`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "Admin Catalog Management only"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Product Listing and Search (Priority: P1)

An admin wants to quickly find and review any product in the store. They land on the products admin screen where they see a paginated table of all products (including soft-deleted ones toggled off by default). They can type in a search term to filter by product title, filter by category, and toggle a flag to show only new-arrival or top-selling products. Each row shows the product title, category, cover image thumbnail, minimum variant price, stock summary, and current status (active / deleted).

**Why this priority**: Without the ability to locate products efficiently, every subsequent action (edit, delete, publish) is blocked. This is the foundational screen for all catalog management.

**Independent Test**: Can be verified end-to-end by navigating to `/admin/products`, observing the product table populated with live data, entering a search term, and confirming only matching products appear.

**Acceptance Scenarios**:

1. **Given** a signed-in admin user on `/admin/products`, **When** the page loads, **Then** a paginated list of all active products is displayed with title, category, minimum price, and cover image thumbnail.
2. **Given** the admin enters a title keyword in the search field, **When** the search is submitted, **Then** only products whose titles contain that keyword are shown.
3. **Given** the admin selects a category from the filter dropdown, **When** the filter is applied, **Then** only products belonging to that category are listed.
4. **Given** the admin toggles the "New Arrivals" filter, **When** the filter is active, **Then** only products with a `new_arrival_rank` are shown.
5. **Given** the admin toggles the "Top Selling" filter, **When** the filter is active, **Then** only products with a `top_selling_rank` are shown.

---

### User Story 2 — Product Create (Priority: P1)

An admin wants to add a new product to the catalog. They click "Add Product", fill in the product title, description, and category, then define at least one variant (color, size, SKU, price, compare-at price, stock). They can also add a cover image URL and one or more gallery image URLs. Finally they set optional merchandising ranks for new-arrival, top-selling, and category placement and submit the form.

**Why this priority**: Creating products is a core write operation the dashboard must support from day one. Without it, admins cannot populate the storefront.

**Independent Test**: Create a brand new product with one variant and a cover image URL; confirm it appears in the storefront product listing after submission.

**Acceptance Scenarios**:

1. **Given** the admin submits a valid product form with title, category, and at least one variant, **When** the form is submitted, **Then** the new product is saved and the admin is returned to the product list where the new product appears.
2. **Given** the admin submits the form with the title field empty, **When** the form is submitted, **Then** an inline validation error appears and the product is not saved.
3. **Given** the admin adds a variant with a negative or non-numeric price, **When** the form is submitted, **Then** a validation error appears for that variant's price field.
4. **Given** the admin sets a `new_arrival_rank` value, **When** the product is saved, **Then** the product appears in the storefront new-arrival section at the expected rank position after a storefront page refresh.
5. **Given** the admin does not set any merchandising ranks, **When** the product is saved, **Then** the product appears in the general product listing but not in new-arrival or top-selling homepage sections.

---

### User Story 3 — Product Edit (Priority: P1)

An admin wants to update an existing product's details. They click "Edit" on a product row and land on a pre-filled edit form identical in structure to the create form. They can change the title, description, category, cover image, gallery images, variant details (including stock levels and pricing), and merchandising ranks. On save, changes immediately take effect on the storefront.

**Why this priority**: Editing is required for day-to-day operations such as stock corrections, price changes, and category reorganization.

**Independent Test**: Edit an existing product's price for one variant; confirm the new price is reflected on the product detail page after saving.

**Acceptance Scenarios**:

1. **Given** the admin opens the edit form for an existing product, **When** the page loads, **Then** all current product data including variants and gallery images is pre-populated in the form.
2. **Given** the admin updates the price of an existing variant and saves, **When** the save succeeds, **Then** the variant's new price is reflected on the storefront product detail page.
3. **Given** the admin adds a new variant to an existing product and saves, **When** the save succeeds, **Then** the new variant is selectable on the storefront product detail page.
4. **Given** the admin removes a gallery image and saves, **When** the save succeeds, **Then** the removed image no longer appears in the storefront gallery slider.
5. **Given** the admin updates `top_selling_rank` and saves, **When** the storefront home page reloads, **Then** the product appears in the correct position in the top-selling section.
6. **Given** the admin saves without changing anything, **When** the save completes, **Then** no data is altered and the admin returns to the product list.

---

### User Story 4 — Product Soft Delete (Priority: P2)

An admin wants to remove a product from the storefront without permanently destroying its data. They click "Delete" on a product row, confirm the deletion in a confirmation dialog, and the product is soft-deleted — it disappears from all shopper-facing listing pages but its data is preserved.

**Why this priority**: Soft delete is safer than hard delete and preserves order history integrity, making it the required deletion approach in this system.

**Independent Test**: Soft-delete a product; verify it vanishes from the storefront listing page and the product detail page returns a not-found state, while the product still appears in the admin list under a "Show deleted" toggle.

**Acceptance Scenarios**:

1. **Given** the admin clicks "Delete" on a product, **When** they confirm in the dialog, **Then** the product is marked deleted and no longer appears in shopper-facing pages.
2. **Given** the admin clicks "Delete" and the confirmation dialog appears, **When** the admin clicks "Cancel", **Then** the product is not deleted and the list is unchanged.
3. **Given** a deleted product, **When** the admin enables the "Show deleted" toggle on the product list, **Then** the soft-deleted product is visible in the list with a "Deleted" status badge.
4. **Given** a deleted product, **When** a shopper visits its direct URL, **Then** the shopper sees a not-found or unavailable page.

---

### User Story 5 — Category Management (Priority: P2)

An admin wants to manage the list of categories the storefront uses to group products. They can view all categories, add a new one with a title, slug, and image URL, edit an existing category's details, and delete a category that has no associated products.

**Why this priority**: Categories underpin product organization and storefront navigation. Without category management, admins must use direct database access for category changes.

**Independent Test**: Create a new category with a title and slug; assign it to a product and confirm the category filter on the storefront products page includes the new category.

**Acceptance Scenarios**:

1. **Given** the admin is on `/admin/categories`, **When** the page loads, **Then** all categories are listed with title, slug, and image thumbnail.
2. **Given** the admin submits a new category with title and slug, **When** the form is submitted, **Then** the category is saved and appears in the category list and in product category dropdowns.
3. **Given** the admin edits a category's title and saves, **When** the save completes, **Then** the updated title is reflected wherever the category name is displayed.
4. **Given** the admin attempts to delete a category that has one or more products assigned to it, **When** the delete is attempted, **Then** the system prevents deletion and shows an explanatory message.
5. **Given** the admin deletes a category with no products, **When** the deletion is confirmed, **Then** the category is removed from all dropdowns and the category list.
6. **Given** the admin enters a duplicate slug for a new category, **When** the form is submitted, **Then** a validation error appears and the category is not saved.

---

### Edge Cases

- What happens when a product has zero variants at the time of save? The form must prevent saving and show an error requiring at least one variant.
- What happens when a variant's stock is set to zero? The product should remain listed on the storefront with an out-of-stock indicator on the affected variant; it should not be automatically hidden.
- What happens when the admin sets two products to the same `new_arrival_rank`? The system should accept the value without error, rendering order by insertion or secondary sort — this is a display concern, not a validation block.
- What happens when the cover image URL is left blank? The product can be saved, but a placeholder image should appear on the storefront card.
- What happens when a network error occurs during product save? The form should display an error message, remain populated with the admin's input, and allow retry without data loss.
- What happens when a category slug contains uppercase letters or spaces? The system should normalize or reject the slug and show validation guidance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Admins MUST be able to view a paginated list of all products, with search by title, filter by category, and filter by merchandising placement (new arrival, top selling).
- **FR-002**: Admins MUST be able to create a new product with a title, description, category, cover image URL, gallery image URLs, one or more variants, and optional merchandising ranks.
- **FR-003**: Each product variant MUST include color, size, SKU, price, compare-at price, and stock quantity; price and stock MUST be validated as non-negative numbers.
- **FR-004**: Admins MUST be able to edit all fields of an existing product, including adding, updating, and removing variants and gallery images, and updating merchandising ranks.
- **FR-005**: Admins MUST be able to soft-delete a product through a confirmation dialog; soft-deleted products MUST be hidden from all shopper-facing pages immediately.
- **FR-006**: Admins MUST be able to view soft-deleted products in the admin list via a toggle, clearly labeled with a "Deleted" status badge.
- **FR-007**: Admins MUST be able to set and update `new_arrival_rank`, `top_selling_rank`, and `category_rank` for each product from the create and edit forms.
- **FR-008**: Storefront pages affected by product and category writes (home, product listing, product detail) MUST reflect changes without requiring a manual server restart.
- **FR-009**: Admins MUST be able to view a list of all categories with title, slug, and image.
- **FR-010**: Admins MUST be able to create a new category with title, slug, and image URL; the slug MUST be unique and contain only lowercase alphanumeric characters and hyphens.
- **FR-011**: Admins MUST be able to edit a category's title, slug, and image URL.
- **FR-012**: Admins MUST NOT be able to delete a category that has one or more products assigned to it; the system MUST display a clear prevention message.
- **FR-013**: Admins MUST be able to delete a category with no assigned products after explicit confirmation.
- **FR-014**: All catalog write operations MUST be accessible only to users with admin role; non-admin callers MUST be rejected server-side regardless of the UI state.
- **FR-015**: Product and category forms MUST display inline validation errors for invalid or missing required fields before submission is processed.

### Key Entities

- **Product**: Represents a catalog item. Key attributes: title, description, category assignment, cover image URL, active/deleted status, and three optional merchandising rank values (new arrival, top selling, category).
- **Product Variant**: A sellable configuration of a product. Key attributes: color, size, SKU, price, compare-at price, and stock quantity. A product must have at least one variant.
- **Product Image**: An additional gallery image for a product. Key attribute: image URL. A product can have zero or more gallery images.
- **Category**: A grouping for products used in storefront navigation and filtering. Key attributes: title, unique slug, image URL. A category can have zero or more products.
- **Merchandising Rank**: An optional integer assigned to a product that controls its position in curated homepage sections (new arrivals, top selling) and within a category's sorted listing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can locate any product by title search in under 5 seconds with a catalog of up to 500 products.
- **SC-002**: Admins can complete the full product creation flow — including one variant and a cover image URL — in under 3 minutes from form open to confirmed save.
- **SC-003**: Storefront product listing and home sections reflect admin catalog changes within 10 seconds of a successful save, without any manual intervention.
- **SC-004**: 100% of admin catalog write operations (create, edit, delete) are rejected server-side for non-admin callers, with no reliance on UI-only guards.
- **SC-005**: Soft-deleted products are invisible to shoppers within one page load after the admin confirms deletion.
- **SC-006**: All product and category forms display inline validation feedback before form submission reaches the server for any invalid or missing required field.
- **SC-007**: Admins can manage up to 20 variants per product without UI degradation or data loss.
- **SC-008**: Category creation and edit operations apply successfully and the new or updated category appears in product assignment dropdowns within the same session.

## Assumptions

- Phase 1 (Admin Foundation and Access Control) is complete and the admin shell, sidebar, and `requireAdmin()` guard are in place.
- Product and category images are managed as URL or path strings only in this release; no file-upload pipeline is included.
- The `update_full_product` database procedure exists and handles atomic updates for product core fields, variants, and gallery images in a single operation.
- The `products_with_min_price` view exists and powers the product listing table.
- Product deletion remains a soft delete throughout this feature; hard delete is explicitly out of scope.
- The admin landing page module index already links to `/admin/products` and `/admin/categories`.
- Stock management from the admin UI is manual — admins set stock values directly; no automatic deduction on order creation is introduced in this phase.
- The category slug is expected to be unique at the database level; the UI enforces the format constraint before submission.
- Storefront page revalidation after admin writes uses the existing Next.js on-demand revalidation mechanism already available in the project.
- No bulk operations (bulk delete, bulk edit) are included in this phase; all operations are per-product or per-category.
- The admin user acting on the catalog has `users.role === "admin"` in the existing users table; no new role values are introduced.
