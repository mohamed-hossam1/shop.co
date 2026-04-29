"use client";

import { Plus, Trash2 } from "lucide-react";
import { adminInputClassName } from "@/components/admin/AdminUI";

export interface VariantDraft {
  color: string;
  size: string;
  sku: string;
  price: number | "";
  price_before: number | "";
  stock: number | "";
}

interface VariantEditorProps {
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
  errors?: Record<string, string>;
}

export default function VariantEditor({
  variants,
  onChange,
  errors = {},
}: VariantEditorProps) {
  const addVariant = () => {
    onChange([
      ...variants,
      { color: "", size: "", sku: "", price: "", price_before: "", stock: "" },
    ]);
  };

  const updateVariant = (index: number, field: keyof VariantDraft, value: string | number) => {
    const next = [...variants];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const removeVariant = (index: number) => {
    const next = [...variants];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-black/55">
          Product Variants
        </h3>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-2 border border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
        >
          <Plus className="h-3 w-3" />
          Add Variant
        </button>
      </div>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="relative border border-black p-4 pt-10 sm:pt-4"
          >
            <button
              type="button"
              onClick={() => removeVariant(index)}
              disabled={variants.length === 1}
              className="absolute right-4 top-4 text-black/35 transition hover:text-red-600 disabled:opacity-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Red"
                  value={variant.color}
                  onChange={(e) => updateVariant(index, "color", e.target.value)}
                  className={adminInputClassName}
                />
                {errors[`variant.${index}.color`] && (
                  <p className="text-[10px] font-bold text-red-600">Required</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. XL"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                  className={adminInputClassName}
                />
                {errors[`variant.${index}.size`] && (
                  <p className="text-[10px] font-bold text-red-600">Required</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                  className={adminInputClassName}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, "price", e.target.value ? parseFloat(e.target.value) : "")}
                  className={adminInputClassName}
                />
                {errors[`variant.${index}.price`] && (
                  <p className="text-[10px] font-bold text-red-600">Required</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Price Before
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price_before}
                  onChange={(e) => updateVariant(index, "price_before", e.target.value ? parseFloat(e.target.value) : "")}
                  className={adminInputClassName}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, "stock", e.target.value ? parseInt(e.target.value) : "")}
                  className={adminInputClassName}
                />
                {errors[`variant.${index}.stock`] && (
                  <p className="text-[10px] font-bold text-red-600">Required</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {variants.length === 0 && (
          <div className="border border-dashed border-black/20 p-8 text-center">
            <p className="text-sm font-medium text-black/40">
              No variants added. At least one is required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
