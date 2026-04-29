"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { Data } from "@/lib/data";
import { Order, OrderItem } from "@/types/Order";
import { X, MapPin, CreditCard, Info, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function OrderDetails({
  order,
  items,
}: {
  order: Order;
  items: OrderItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-black hover:opacity-70 transition-all cursor-pointer"
      >
        View Details
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-[60]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <DialogPanel
              transition
              className="relative transform overflow-hidden border border-black bg-white text-left transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-full max-w-2xl font-satoshi"
            >
              <div className="absolute top-0 right-0 p-4 z-10">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 sm:p-12">
                <div className="mb-10">
                  <h2 className="text-3xl sm:text-4xl font-integral font-black tracking-wider uppercase text-black mb-2">
                    Order Details
                  </h2>
                  <div className="h-1 w-20 bg-black" />
                  <p className="text-black/40 text-xs uppercase tracking-widest font-bold mt-4">
                    Reference: #{order.id}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-black text-black/40 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Delivery Information
                    </h3>
                    <div className="text-sm font-bold text-black uppercase tracking-wide leading-relaxed">
                      <p>{order.user_name}</p>
                      <p>{order.address_line}</p>
                      <p>{order.area}, {order.city}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-black text-black/40 flex items-center gap-2">
                      <CreditCard className="w-3 h-3" /> Payment Method
                    </h3>
                    <div className="text-sm font-bold text-black uppercase tracking-wide">
                      <p>{order.payment_method}</p>
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] uppercase font-black tracking-widest">
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-black text-black/40 mb-6 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Order Items
                  </h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-6 p-4 border border-black/5">
                        <div className="w-16 h-16 border border-black bg-white shrink-0 relative overflow-hidden">
                          {item.product_image && (
                            <Image
                              src={item.product_image}
                              alt={item.product_title}
                              fill
                              className="object-contain"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-black text-black uppercase tracking-tight truncate">
                            {item.product_title}
                          </h4>
                          <p className="text-[10px] text-black/50 uppercase tracking-widest font-bold mt-1">
                            {item.variant_size} / {item.variant_color} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-black">
                            {(item.price_at_purchase * item.quantity).toFixed(0)} EGP
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t-[3px] border-black pt-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-black/50">
                      <span>Subtotal</span>
                      <span>{order.subtotal.toFixed(0)} EGP</span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-red-600">
                        <span>Discount</span>
                        <span>- {order.discount_amount.toFixed(0)} EGP</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-black/50">
                      <span>Delivery Fee</span>
                      <span>{order.delivery_fee.toFixed(0)} EGP</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-black/10">
                      <span className="text-sm uppercase tracking-[0.3em] font-black text-black">Total Amount</span>
                      <span className="text-2xl font-black text-black">
                        {order.total_price.toFixed(0)} EGP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
