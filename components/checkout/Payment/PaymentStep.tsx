"use client";

import React, { useState, useEffect, useRef } from "react";
import Cash from "./Cash";
import VodafoneCash from "./VodafoneCash";
import Instapay from "./Instapay";
import { Check } from "lucide-react";

type Props = {
  onSelectPayment: (p: string) => void;
  selectedPayment: string | null;
  vodafoneNumber?: string;
  instapayLink?: string;
  onVodafoneFileChange?: (file: File | null) => void;
  onInstapayFileChange?: (file: File | null) => void;
};

export default function PaymentStep({
  onSelectPayment,
  selectedPayment,
  vodafoneNumber = "0100 123 4567",
  instapayLink = "https://instapay.com",
  onVodafoneFileChange,
  onInstapayFileChange,
}: Props) {
  const payments = ["cash", "vodafone cash", "instapay"];

  const [vodafoneImage, setVodafoneImage] = useState<File | null>(null);
  const [vodafonePreview, setVodafonePreview] = useState<string | null>(null);

  const [instapayImage, setInstapayImage] = useState<File | null>(null);
  const [instapayPreview, setInstapayPreview] = useState<string | null>(null);

  const [isCopyed, setIsCopyed] = useState(false);

  const vodafoneInputRef = useRef<HTMLInputElement | null>(null);
  const instapayInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (vodafoneImage) {
      const url = URL.createObjectURL(vodafoneImage);
      setVodafonePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVodafonePreview(null);
    }
  }, [vodafoneImage]);

  useEffect(() => {
    if (instapayImage) {
      const url = URL.createObjectURL(instapayImage);
      setInstapayPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setInstapayPreview(null);
    }
  }, [instapayImage]);

  useEffect(() => {
    if (onVodafoneFileChange) onVodafoneFileChange(vodafoneImage);
  }, [vodafoneImage, onVodafoneFileChange]);

  useEffect(() => {
    if (onInstapayFileChange) onInstapayFileChange(instapayImage);
  }, [instapayImage, onInstapayFileChange]);

  const handleVodafoneFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setVodafoneImage(f);
  };

  const handleInstapayFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setInstapayImage(f);
  };

  const clearVodafoneFile = () => {
    setVodafoneImage(null);
    setVodafonePreview(null);
    if (vodafoneInputRef.current) vodafoneInputRef.current.value = "";
    if (onVodafoneFileChange) onVodafoneFileChange(null);
  };

  const clearInstapayFile = () => {
    setInstapayImage(null);
    setInstapayPreview(null);
    if (instapayInputRef.current) instapayInputRef.current.value = "";
    if (onInstapayFileChange) onInstapayFileChange(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-7">Payment Method</h2>

      <div className="flex flex-col gap-3">
        <div
          onClick={() => onSelectPayment(payments[0])}
          className={`flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedPayment === payments[0]
              ? "border-primary bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center flex-1">
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 md:mr-3 flex items-center justify-center flex-shrink-0 ${
                selectedPayment === payments[0]
                  ? "border-primary"
                  : "border-gray-300"
              }`}
            >
              {selectedPayment === payments[0] && (
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              )}
            </div>
            <Cash />
          </div>
        </div>

        <div
          onClick={() => onSelectPayment(payments[1])}
          className={`flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedPayment === payments[1]
              ? "border-primary bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center flex-1">
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 md:mr-3 flex items-center justify-center flex-shrink-0 ${
                selectedPayment === payments[1]
                  ? "border-primary"
                  : "border-gray-300"
              }`}
            >
              {selectedPayment === payments[1] && (
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              )}
            </div>
            <VodafoneCash />
          </div>
        </div>

        <div
          onClick={() => onSelectPayment(payments[2])}
          className={`flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedPayment === payments[2]
              ? "border-primary bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center flex-1">
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 md:mr-3 flex items-center justify-center flex-shrink-0 ${
                selectedPayment === payments[2]
                  ? "border-primary"
                  : "border-gray-300"
              }`}
            >
              {selectedPayment === payments[2] && (
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              )}
            </div>
            <Instapay />
          </div>
        </div>

        {selectedPayment === payments[1] && (
          <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-white">
            <p className="text-gray-700 mb-2">Send the amount to:</p>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-lg text-gray-900">
                {vodafoneNumber}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard?.writeText(vodafoneNumber);
                  setIsCopyed(true);
                  setTimeout(() => setIsCopyed(false), 1000);
                }}
                className="text-sm px-3 py-1 h-9 border rounded-md hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              >
                {isCopyed ? <Check className="w-4 h-4" /> : "Copy"}
              </button>
            </div>

            <label className="block text-xs text-gray-600 mb-2">
              Upload payment screenshot (so we can verify)
            </label>

            <label
              htmlFor="vodafone-upload"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer select-none ${
                vodafoneImage
                  ? "bg-green-50 border-green-200"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m0 0h8"
                />
              </svg>
              <span className="text-sm">
                {vodafoneImage ? vodafoneImage.name : "Upload screenshot"}
              </span>
            </label>
            <input
              id="vodafone-upload"
              ref={vodafoneInputRef}
              type="file"
              accept="image/*"
              onChange={handleVodafoneFile}
              className="sr-only"
            />

            {vodafonePreview && (
              <div className="flex items-start gap-3 mt-3">
                <img
                  src={vodafonePreview}
                  alt="vodafone payment preview"
                  className="w-28 h-28 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">
                    Preview of uploaded receipt
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearVodafoneFile();
                      }}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedPayment === payments[2] && (
          <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-white ">
            <p className="text-gray-700 mb-5">
              Pay using Instapay.{" "}
              {instapayLink ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(instapayLink, "_blank", "noopener,noreferrer");
                    }}
                    className=" font-semibold cursor-pointer px-3 py-1 ml-2 border rounded-md hover:bg-gray-50"
                  >
                    Open Instapay
                  </button>
                </>
              ) : (
                <span className="text-xs text-gray-500">
                  (No link provided)
                </span>
              )}
            </p>

            <label className="block text-xs text-gray-600 mb-2">
              After paying, upload the payment screenshot
            </label>

            <label
              htmlFor="instapay-upload"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer select-none ${
                instapayImage
                  ? "bg-green-50 border-green-200"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4"
                />
              </svg>
              <span className="text-sm">
                {instapayImage ? instapayImage.name : "Upload screenshot"}
              </span>
            </label>
            <input
              id="instapay-upload"
              ref={instapayInputRef}
              type="file"
              accept="image/*"
              onChange={handleInstapayFile}
              className="sr-only"
            />

            {instapayPreview && (
              <div className="flex items-start gap-3 mt-3">
                <img
                  src={instapayPreview}
                  alt="instapay payment preview"
                  className="w-28 h-28 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">Preview</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearInstapayFile();
                      }}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
