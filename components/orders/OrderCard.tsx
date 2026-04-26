import React from "react";
import Orderitems from "./Orderitems";
import { Data } from "@/lib/data";
import { Order } from "@/types/Order";

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-pribg-primary"
              aria-hidden
            >
              <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
              <path d="M12 22V12"></path>
              <polyline points="3.29 7 12 12 20.71 7"></polyline>
              <path d="m7.5 4.27 9 5.15"></path>
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {`Order ${order.id ?? ""}`}
            </h3>

            <div className="flex items-center  space-x-4 text-sm text-gray-600">
              <span className="items-center hidden md:flex ">
                <svg
                  className="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                </svg>
                {Data(order?.created_at?.toString())?.["12h"]}
              </span>

              <span className="flex justify-center items-center">
                <svg
                  className="w-4 h-4 mr-1 -translate-y-0.5 md:translate-y-0 "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="20" height="12" x="2" y="6" rx="2"></rect>
                  <circle cx="12" cy="12" r="2"></circle>
                  <path d="M6 12h.01M18 12h.01"></path>
                </svg>
                <p>{order.total_price} EGP</p>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status?.toLowerCase() === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.status?.toLowerCase() === "delivered"
                ? "bg-green-100 text-green-800"
                : order.status?.toLowerCase() === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Orderitems order={order} />
        </div>
      </div>
    </div>
  );
}
