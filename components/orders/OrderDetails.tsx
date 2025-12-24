"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Data } from "@/lib/data";

export default function OrderDetails({
  order,
  items,
}: {
  order: OrderData;
  items: OrderItem[];
}) {
  const [open, setOpen] = useState(false);
  // const [tracking, setTracking] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex  space-x-2 items-center text-primary font-medium cursor-pointer"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span>View Details</span>
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className=" fixed inset-0  bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className=" fixed inset-0 z-10 w-full overflow-y-auto">
          <div className="flex  min-h-full justify-center m-auto  text-center items-center p-5">
            <DialogPanel transition className=" rounded-xl w-full">
              <div className=" md:w-[700px] lg:w-[800px] m-auto">
                <div className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] w-full rounded-t-xl text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                          <path d="M12 22V12"></path>
                          <polyline points="3.29 7 12 12 20.71 7"></polyline>
                          <path d="m7.5 4.27 9 5.15"></path>
                        </svg>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold">Order Details</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-b-xl  bg-white">
                  {/* <div className="border-b border-gray-200 ">
                    <nav className="flex space-x-8 px-6">
                      <button
                        onClick={() => setTracking(false)}
                        className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          !tracking
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }  cursor-pointer`}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                          <path d="M12 22V12"></path>
                          <polyline points="3.29 7 12 12 20.71 7"></polyline>
                          <path d="m7.5 4.27 9 5.15"></path>
                        </svg>
                        <span>Order Details</span>
                      </button>

                      <button
                        onClick={() => setTracking(true)}
                        className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          tracking
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }  cursor-pointer`}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>Tracking</span>
                      </button>
                    </nav>
                  </div> 
                   {tracking ? (
                    <div className="space-y-6   h-[60vh] overflow-y-auto">
                      <div className="text-center py-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Order Tracking
                        </h3>
                        <p className="text-gray-600">
                          Track your order status and delivery progress
                        </p>
                      </div>
                      <div className=" px-8 text-left ">
                        <div className="flex flex-col gap-3 mb-10">

                          <div className="space-y-4 ">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  order.status == "pending"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {order.status == "pending" ? (
                                  <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden
                                  >
                                    <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                ) : (
                                  <span className="text-xs font-bold">1</span>
                                )}
                              </div>

                              <div className="flex-1">
                                <h4
                                  className={`font-semibold ${
                                    order.status == "pending"
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Order Placed
                                </h4>
                              </div>
                            </div>
                          </div>


                          <div className="space-y-4 ">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  order.status == "pending"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {order.status == "pending" ? (
                                  <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden
                                  >
                                    <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                ) : (
                                  <span className="text-xs font-bold">1</span>
                                )}
                              </div>

                              <div className="flex-1">
                                <h4
                                  className={`font-semibold ${
                                    order.status == "pending"
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Order Placed
                                </h4>
                              </div>
                            </div>
                          </div>

                        </div>


                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-10">
                          <h4 className="font-semibold text-blue-800 mb-2">
                            Delivery Information
                          </h4>
                          <div className="space-y-1 text-sm text-blue-700">
                            <p>
                              <strong>Address:</strong> {order.addresses.city}
                            </p>
                            <p>
                              <strong>Payment Method:</strong> {order.payment_method}
                            </p>
                          </div>
                        </div>
                      </div>


                    </div>
                  ) : (
                    <div className="p-6 h-[60vh] overflow-y-auto">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <svg
                                className="w-5 h-5 text-primary"
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
                                <rect
                                  width="18"
                                  height="18"
                                  x="3"
                                  y="4"
                                  rx="2"
                                ></rect>
                                <path d="M3 10h18"></path>
                              </svg>
                              <h3 className="font-semibold text-gray-900">
                                Order Date
                              </h3>
                            </div>
                            <p className="text-gray-700">
                              {Data(order?.created_at?.toString())?.["12h"]}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <svg
                                className="w-5 h-5 text-primary"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                              >
                                <rect
                                  width="20"
                                  height="12"
                                  x="2"
                                  y="6"
                                  rx="2"
                                ></rect>
                                <circle cx="12" cy="12" r="2"></circle>
                                <path d="M6 12h.01M18 12h.01"></path>
                              </svg>
                              <h3 className="font-semibold text-gray-900">
                                Total Amount
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-primary text-left">
                              {order.total_price} EGP
                            </p>
                          </div>

                          <div className="bg-gray-50 text-left rounded-xl p-4">
                            <div className="flex  space-x-3 mb-3">
                              <svg
                                className="w-5 h-5 text-primary"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                              >
                                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                                <path d="M12 22V12"></path>
                                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                                <path d="m7.5 4.27 9 5.15"></path>
                              </svg>
                              <h3 className="font-semibold text-gray-900">
                                Status
                              </h3>
                            </div>

                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium  ${
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

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
                            Order Items
                          </h3>

                          <div className="space-y-3">
                            {items.length === 0 ? (
                              <div className="text-sm text-gray-500 ">
                                No items
                              </div>
                            ) : (
                              items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl text-left"
                                >
                                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                    {item.product_image ? (
                                      <img
                                        src={item.product_image}
                                        alt={item.product_title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                        No image
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                      {item.product_title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Quantity: {item.quantity ?? 1}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}  */}

                  <div className="p-6 h-[60vh] overflow-y-auto">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <svg
                              className="w-5 h-5 text-primary"
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
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="4"
                                rx="2"
                              ></rect>
                              <path d="M3 10h18"></path>
                            </svg>
                            <h3 className="font-semibold text-gray-900">
                              Order Date
                            </h3>
                          </div>
                          <p className="text-primary text-left text-xl font-bold">
                            {Data(order?.created_at?.toString())?.["12h"]}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <svg
                              className="w-5 h-5 text-primary"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <rect
                                width="20"
                                height="12"
                                x="2"
                                y="6"
                                rx="2"
                              ></rect>
                              <circle cx="12" cy="12" r="2"></circle>
                              <path d="M6 12h.01M18 12h.01"></path>
                            </svg>
                            <h3 className="font-semibold text-gray-900">
                              Total Amount
                            </h3>
                          </div>
                          <p className="text-xl font-bold text-primary text-left">
                            {order.total_price} EGP
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <svg
                              className="w-5 h-5 text-primary"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"></path>
                              <circle cx="12" cy="10" r="2.5"></circle>
                            </svg>
                            <h3 className="font-semibold text-gray-900">
                              Address
                            </h3>
                          </div>
                          <p className="text-xl font-bold text-primary text-left">
                            {order.addresses.city}, {order.addresses.street}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <svg
                              className="w-5 h-5 text-primary"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <rect
                                x="2"
                                y="5"
                                width="20"
                                height="14"
                                rx="2"
                              ></rect>
                              <path d="M2 10h20"></path>
                              <rect
                                x="6"
                                y="12"
                                width="6"
                                height="2"
                                rx="1"
                              ></rect>
                            </svg>
                            <h3 className="font-semibold text-gray-900">
                              Payment Method
                            </h3>
                          </div>
                          <p className="text-xl font-bold text-primary text-left">
                            {order.payment_method}
                          </p>
                        </div>

                        <div className="bg-gray-50 text-left rounded-xl p-4">
                          <div className="flex  space-x-3 mb-3">
                            <svg
                              className="w-5 h-5 text-primary"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                              <path d="M12 22V12"></path>
                              <polyline points="3.29 7 12 12 20.71 7"></polyline>
                              <path d="m7.5 4.27 9 5.15"></path>
                            </svg>
                            <h3 className="font-semibold text-gray-900">
                              Status
                            </h3>
                          </div>

                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium  ${
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

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
                          Order Items
                        </h3>

                        <div className="space-y-3">
                          {items.length === 0 ? (
                            <div className="text-sm text-gray-500 ">
                              No items
                            </div>
                          ) : (
                            items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl text-left"
                              >
                                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                  {item.product_image ? (
                                    <img
                                      src={item.product_image}
                                      alt={item.product_title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                      No image
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {item.product_title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity ?? 1}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-6">
                    <div className="flex justify-between">
                      <div className="flex space-x-3"></div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => setOpen(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                          type="button"
                        >
                          Close
                        </button>
                      </div>
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
