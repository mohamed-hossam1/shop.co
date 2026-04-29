"use client";

import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { adminInputClassName } from "@/components/admin/AdminUI";

interface GalleryEditorProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export default function GalleryEditor({ urls, onChange }: GalleryEditorProps) {
  const addUrl = () => {
    onChange([...urls, ""]);
  };

  const updateUrl = (index: number, value: string) => {
    const next = [...urls];
    next[index] = value;
    onChange(next);
  };

  const removeUrl = (index: number) => {
    const next = [...urls];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-black/55">
          Gallery Images
        </h3>
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-2 border border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
        >
          <Plus className="h-3 w-3" />
          Add Image URL
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {urls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <div className="relative flex-1">
              <ImageIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
              <input
                type="text"
                placeholder="https://..."
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                className={`${adminInputClassName} pl-12`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeUrl(index)}
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center border border-black transition hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {urls.length === 0 && (
          <div className="col-span-full border border-dashed border-black/20 p-8 text-center">
            <p className="text-sm font-medium text-black/40">
              No gallery images added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
