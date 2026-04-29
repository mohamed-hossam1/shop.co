"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Category, ProductDetails, CreateProductInput } from "@/types/Product";
import { createProduct, updateFullProduct } from "@/actions/productsAction";
import {
  AdminField,
  AdminSection,
  AdminNotice,
  adminInputClassName,
  adminTextareaClassName,
  adminSelectClassName,
} from "@/components/admin/AdminUI";
import VariantEditor, { VariantDraft } from "./VariantEditor";
import GalleryEditor from "./GalleryEditor";

interface ProductFormProps {
  product?: ProductDetails;
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [categoryId, setCategoryId] = useState<number | "">(product?.category_id || "");
  const [imageCover, setImageCover] = useState(product?.image_cover || "");
  const [newArrivalRank, setNewArrivalRank] = useState(product?.new_arrival_rank?.toString() || "");
  const [topSellingRank, setTopSellingRank] = useState(product?.top_selling_rank?.toString() || "");
  const [categoryRank, setCategoryRank] = useState(product?.category_rank?.toString() || "");

  const [variants, setVariants] = useState<VariantDraft[]>(
    product?.variants.map((v) => ({
      color: v.color,
      size: v.size,
      sku: v.sku || "",
      price: v.price,
      price_before: v.price_before || "",
      stock: v.stock,
    })) || [{ color: "", size: "", sku: "", price: "", price_before: "", stock: "" }]
  );

  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    product?.images.map((img) => img.url) || []
  );

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "Required";
    if (!categoryId) errors.categoryId = "Required";
    if (!imageCover.trim()) errors.imageCover = "Required";

    if (variants.length === 0) {
      errors.variants = "At least one variant is required";
    } else {
      variants.forEach((v, i) => {
        if (!v.color.trim()) errors[`variant.${i}.color`] = "Required";
        if (!v.size.trim()) errors[`variant.${i}.size`] = "Required";
        if (v.price === "" || v.price < 0) errors[`variant.${i}.price`] = "Required";
        if (v.stock === "" || v.stock < 0) errors[`variant.${i}.stock`] = "Required";
      });
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const input: CreateProductInput = {
      title,
      description: description || undefined,
      category_id: categoryId || undefined,
      image_cover: imageCover,
      new_arrival_rank: newArrivalRank ? parseInt(newArrivalRank) : null,
      top_selling_rank: topSellingRank ? parseInt(topSellingRank) : null,
      category_rank: categoryRank ? parseInt(categoryRank) : null,
      variants: variants.map((v) => ({
        color: v.color,
        size: v.size,
        price: Number(v.price),
        price_before: v.price_before !== "" ? Number(v.price_before) : undefined,
        stock: Number(v.stock),
        sku: v.sku || undefined,
      })),
      images: galleryUrls.filter((url) => url.trim() !== ""),
    };

    startTransition(async () => {
      const res = product
        ? await updateFullProduct(product.id, input)
        : await createProduct(input);

      if (res.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <AdminNotice tone="danger" title="Server Error">
          {error}
        </AdminNotice>
      )}

      <AdminSection title="General Information" description="Basic product details shown to shoppers.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <AdminField label="Product Title" error={fieldErrors.title}>
              <input
                type="text"
                placeholder="e.g. Classic Silk Scarf"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={adminInputClassName}
              />
            </AdminField>
          </div>

          <div className="sm:col-span-2">
            <AdminField label="Description">
              <textarea
                placeholder="Detailed product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={adminTextareaClassName}
              />
            </AdminField>
          </div>

          <AdminField label="Category" error={fieldErrors.categoryId}>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : "")}
              className={adminSelectClassName}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </AdminField>

          <AdminField label="Cover Image URL" error={fieldErrors.imageCover}>
            <input
              type="text"
              placeholder="https://..."
              value={imageCover}
              onChange={(e) => setImageCover(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection title="Merchandising" description="Control product ranking in different sections.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <AdminField label="New Arrival Rank" hint="Optional">
            <input
              type="number"
              min="1"
              value={newArrivalRank}
              onChange={(e) => setNewArrivalRank(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Top Selling Rank" hint="Optional">
            <input
              type="number"
              min="1"
              value={topSellingRank}
              onChange={(e) => setTopSellingRank(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Category Rank" hint="Optional">
            <input
              type="number"
              min="1"
              value={categoryRank}
              onChange={(e) => setCategoryRank(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection title="Inventory & Pricing">
        <VariantEditor
          variants={variants}
          onChange={setVariants}
          errors={fieldErrors}
        />
        {fieldErrors.variants && (
          <p className="mt-2 text-sm font-bold text-red-600">{fieldErrors.variants}</p>
        )}
      </AdminSection>

      <AdminSection title="Media Gallery">
        <GalleryEditor urls={galleryUrls} onChange={setGalleryUrls} />
      </AdminSection>

      <div className="flex justify-end gap-4 border border-black bg-white p-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="inline-flex border border-black bg-white px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex border border-black bg-black px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black disabled:opacity-50"
        >
          {isPending ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
