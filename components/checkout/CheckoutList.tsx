"use client";

import { useCart } from "@/Context/CartContext";
import { useState, useEffect } from "react";
import CartSkeleton from "../skeleton/CartSkeleton";
import OrderSummary from "../cart/OrderSummary";
import Steps from "./Steps";
import AddressStep from "./Address/AddressStep";
import { getAddresses } from "@/app/actions/addressAction";
import { getDeliveryFee } from "@/app/actions/deliveryAction";
import PaymentStep from "./Payment/PaymentStep";
import ReviewStep from "./ReviewStep";

export default function CheckoutList() {
  const { cart, price, isLoading: cartLoading } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [selectedPayment, onSelectPayment] = useState<string | null>(null);
  const [vodafoneFile, setVodafoneFile] = useState<File | null>(null);
  const [instapayFile, setInstapayFile] = useState<File | null>(null);

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [stepNumber, setStepNumber] = useState(1);

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressSelected = async (address: Address) => {
    setSelectedAddress(address);
    setIsLoadingFee(true);
    if (address) {
      try {
        const fee = await getDeliveryFee(address.city);
        setDeliveryFee(fee);
      } catch (error) {
        console.error("Error fetching delivery fee:", error);
        setDeliveryFee(0);
      }
    } else {
      setDeliveryFee(0);
    }
    setIsLoadingFee(false);
  };

  if (cartLoading || isLoadingAddresses || cart === null) {
    return <CartSkeleton />;
  }

  const isNextDisabled = (() => {
    if (stepNumber === 1) {
      return selectedAddress === null;
    }

    if (stepNumber === 2) {
      if (!selectedPayment) return true;

      const p = selectedPayment.toLowerCase();
      if (p === "vodafone cash") {
        return vodafoneFile === null;
      }
      if (p === "instapay") {
        return instapayFile === null;
      }
      return false;
    }

    return false;
  })();

  return (
    <div className="max-w-[1450px] px-3 md:px-5 m-auto mt-6 md:mt-12 mb-10 min-h-screen">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
      </div>

      <Steps number={stepNumber} />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:flex-[4]">
          <div className="border shadow-xl rounded-xl">
            {stepNumber == 1 ? (
              <AddressStep
                addresses={addresses}
                onAddressSelected={handleAddressSelected}
                onRefresh={fetchAddresses}
                selectedAddress={selectedAddress}
              />
            ) : stepNumber == 2 ? (
              <PaymentStep
                onSelectPayment={(p: string) => {
                  if (selectedPayment && selectedPayment !== p) {
                    setVodafoneFile(null);
                    setInstapayFile(null);
                  }
                  onSelectPayment(p);
                }}
                selectedPayment={selectedPayment}
                onVodafoneFileChange={(file) => setVodafoneFile(file)}
                onInstapayFileChange={(file) => setInstapayFile(file)}
                initialVodafoneFile={vodafoneFile ?? null} 
                initialInstapayFile={instapayFile ?? null}
                vodafoneNumber="0100 123 4567"
                instapayLink="https://instapay.com"
              />
            ) : (
              <ReviewStep />
            )}
          </div>

          <div className="flex justify-between mt-6 md:mt-8 gap-3">
            <button
              disabled={stepNumber == 1}
              className={`px-4 md:px-6 py-2.5 md:py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base cursor-pointer`}
              onClick={() => setStepNumber(Math.max(1, stepNumber - 1))}
            >
              Previous
            </button>

            <button
              disabled={isNextDisabled}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base cursor-pointer"
              onClick={() => {
                if (!isNextDisabled) setStepNumber(stepNumber + 1);
              }}
            >
              Next
            </button>
          </div>
        </div>

        <OrderSummary
          price={price}
          isCart={false}
          deliveryFee={deliveryFee}
          hasAddress={!!selectedAddress}
          isLoadingFee={isLoadingFee}
        />
      </div>
    </div>
  );
}
