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
  vodafoneNumber = "01013429234",
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
    <div className="space-y-6">
      <div className="p-4 bg-gray-100 border border-black flex items-start gap-3 rounded-none">
        <span className="text-xl">🎁</span>
        <p className="text-sm font-medium text-black">
          Special gift: Pay using Vodafone Cash or Instapay and get a free gift!
        </p>
      </div>

      {compressionError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-none flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{compressionError}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div
          onClick={() => onSelectPayment(payments[0])}
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all rounded-none ${
            selectedPayment === payments[0]
              ? "border-black border-2 bg-gray-50"
              : "border-gray-200 hover:border-black/50"
          }`}
        >
          <div className="flex items-center flex-1 gap-3">
            <div
              className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedPayment === payments[0]
                  ? "border-black bg-black"
                  : "border-black bg-white"
              }`}
            >
              {selectedPayment === payments[0] && (
                <div className="w-2.5 h-2.5 bg-white"></div>
              )}
            </div>
            <Cash />
          </div>
        </div>

        <div
          onClick={() => onSelectPayment(payments[1])}
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all rounded-none ${
            selectedPayment === payments[1]
              ? "border-black border-2 bg-gray-50"
              : "border-gray-200 hover:border-black/50"
          }`}
        >
          <div className="flex items-center flex-1 gap-3">
            <div
              className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedPayment === payments[1]
                  ? "border-black bg-black"
                  : "border-black bg-white"
              }`}
            >
              {selectedPayment === payments[1] && (
                <div className="w-2.5 h-2.5 bg-white"></div>
              )}
            </div>
            <VodafoneCash />
          </div>
        </div>

        {selectedPayment === payments[1] && (
          <div className="mt-2 p-5 border border-black rounded-none bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Send the amount to:</p>
            <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-none border border-gray-200">
              <span className="font-bold tracking-wider text-xl text-black">
                {vodafoneNumber}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard?.writeText(vodafoneNumber);
                  setIsCopyed(true);
                  setTimeout(() => setIsCopyed(false), 1500);
                }}
                className="text-xs font-bold px-4 py-2 border border-black rounded-none hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-wider"
              >
                {isCopyed ? <Check className="w-4 h-4" /> : "Copy"}
              </button>
            </div>

            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Upload payment screenshot
            </label>

            {isCompressingVodafone && (
              <div className="mb-4 p-3 bg-gray-50 rounded-none flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Compressing...</span>
              </div>
            )}

            <label
              htmlFor="vodafone-upload"
              onClick={(e) => e.stopPropagation()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 border border-black border-dashed rounded-none cursor-pointer transition-colors ${
                vodafoneImage
                  ? "bg-gray-100"
                  : "bg-white hover:bg-gray-50"
              } ${isCompressingVodafone ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
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
              <span className="text-sm font-medium text-gray-700">
                {vodafoneImage ? `${vodafoneImage.name}` : "Browse files"}
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
              <div className="flex items-center gap-4 mt-4">
                <img
                  src={vodafonePreview}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-none border border-black/10"
                />
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearVodafoneFile();
                    }}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          onClick={() => onSelectPayment(payments[2])}
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all rounded-none ${
            selectedPayment === payments[2]
              ? "border-black border-2 bg-gray-50"
              : "border-gray-200 hover:border-black/50"
          }`}
        >
          <div className="flex items-center flex-1 gap-3">
            <div
              className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedPayment === payments[2]
                  ? "border-black bg-black"
                  : "border-black bg-white"
              }`}
            >
              {selectedPayment === payments[2] && (
                <div className="w-2.5 h-2.5 bg-white"></div>
              )}
            </div>
            <Instapay />
          </div>
        </div>

        {selectedPayment === payments[2] && (
          <div className="mt-2 p-5 border border-black rounded-none bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">
                Pay using Instapay.
              </p>
              {instapayLink ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(instapayLink, "_blank", "noopener,noreferrer");
                  }}
                  className="text-sm font-bold bg-black text-white px-4 py-2 rounded-none hover:bg-white hover:text-black border border-black transition-colors uppercase tracking-wider"
                >
                  Open App
                </button>
              ) : (
                <span className="text-xs text-gray-500">
                  (No link provided)
                </span>
              )}
            </div>

            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Upload payment screenshot
            </label>

            {isCompressingInstapay && (
              <div className="mb-4 p-3 bg-gray-50 rounded-none flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Compressing...</span>
              </div>
            )}

            <label
              htmlFor="instapay-upload"
              onClick={(e) => e.stopPropagation()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 border border-black border-dashed rounded-none cursor-pointer transition-colors ${
                instapayImage
                  ? "bg-gray-100"
                  : "bg-white hover:bg-gray-50"
              } ${isCompressingInstapay ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
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
              <span className="text-sm font-medium text-gray-700">
                {instapayImage ? `${instapayImage.name}` : "Browse files"}
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
              <div className="flex items-center gap-4 mt-4">
                <img
                  src={instapayPreview}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-none border border-black/10"
                />
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearInstapayFile();
                    }}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}