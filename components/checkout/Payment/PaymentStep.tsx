"use client";

import React, { useState, useEffect, useRef } from "react";
import Cash from "./Cash";
import VodafoneCash from "./VodafoneCash";
import Instapay from "./Instapay";
import { Check, AlertCircle } from "lucide-react";
import { compressImage, formatFileSize } from "@/lib/Imagecompression";

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
  
  // Compression states
  const [isCompressingVodafone, setIsCompressingVodafone] = useState(false);
  const [isCompressingInstapay, setIsCompressingInstapay] = useState(false);
  const [compressionError, setCompressionError] = useState<string | null>(null);

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

  const handleVodafoneFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressionError(null);
    setIsCompressingVodafone(true);

    try {
      console.log(`Original size: ${formatFileSize(file.size)}`);

      let processedFile = file;
      if (file.size > 500 * 1024) {
        processedFile = await compressImage(file, 0.5, 1920);
        console.log(`Compressed size: ${formatFileSize(processedFile.size)}`);
      }

      setVodafoneImage(processedFile);
    } catch (error) {
      console.error('Compression error:', error);
      setCompressionError('Failed to process image. Please try a smaller file.');
      if (vodafoneInputRef.current) vodafoneInputRef.current.value = '';
    } finally {
      setIsCompressingVodafone(false);
    }
  };

  const handleInstapayFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressionError(null);
    setIsCompressingInstapay(true);

    try {
      console.log(`Original size: ${formatFileSize(file.size)}`);

      let processedFile = file;
      if (file.size > 500 * 1024) {
        processedFile = await compressImage(file, 0.5, 1920);
        console.log(`Compressed size: ${formatFileSize(processedFile.size)}`);
      }

      setInstapayImage(processedFile);
    } catch (error) {
      console.error('Compression error:', error);
      setCompressionError('Failed to process image. Please try a smaller file.');
      if (instapayInputRef.current) instapayInputRef.current.value = '';
    } finally {
      setIsCompressingInstapay(false);
    }
  };

  const clearVodafoneFile = () => {
    setVodafoneImage(null);
    setVodafonePreview(null);
    if (vodafoneInputRef.current) vodafoneInputRef.current.value = "";
    if (onVodafoneFileChange) onVodafoneFileChange(null);
    setCompressionError(null);
  };

  const clearInstapayFile = () => {
    setInstapayImage(null);
    setInstapayPreview(null);
    if (instapayInputRef.current) instapayInputRef.current.value = "";
    if (onInstapayFileChange) onInstapayFileChange(null);
    setCompressionError(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-7">Payment Method</h2>
      <div className="mb-6 p-5 rounded-lg bg-blue-50 border border-blue-200 font-bold text-primary text-xl">
        🎁 Special gift: Pay using Vodafone Cash or Instapay and get a free
        gift!
      </div>

      {compressionError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{compressionError}</p>
        </div>
      )}

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
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E]"></div>
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
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E]"></div>
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
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E]"></div>
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
              Upload payment screenshot (will be compressed automatically)
            </label>

            {isCompressingVodafone && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-700">Compressing image...</span>
              </div>
            )}

            <label
              htmlFor="vodafone-upload"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer select-none ${
                vodafoneImage
                  ? "bg-green-50 border-green-200"
                  : "bg-white hover:bg-gray-50"
              } ${isCompressingVodafone ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                {vodafoneImage ? `${vodafoneImage.name} (${formatFileSize(vodafoneImage.size)})` : "Upload screenshot"}
              </span>
            </label>
            <input
              id="vodafone-upload"
              ref={vodafoneInputRef}
              type="file"
              accept="image/*"
              onChange={handleVodafoneFile}
              className="sr-only"
              disabled={isCompressingVodafone}
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
                      window.open(
                        instapayLink,
                        "_blank",
                        "noopener,noreferrer"
                      );
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
              After paying, upload the payment screenshot (will be compressed automatically)
            </label>

            {isCompressingInstapay && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-700">Compressing image...</span>
              </div>
            )}

            <label
              htmlFor="instapay-upload"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer select-none ${
                instapayImage
                  ? "bg-green-50 border-green-200"
                  : "bg-white hover:bg-gray-50"
              } ${isCompressingInstapay ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                {instapayImage ? `${instapayImage.name} (${formatFileSize(instapayImage.size)})` : "Upload screenshot"}
              </span>
            </label>
            <input
              id="instapay-upload"
              ref={instapayInputRef}
              type="file"
              accept="image/*"
              onChange={handleInstapayFile}
              className="sr-only"
              disabled={isCompressingInstapay}
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