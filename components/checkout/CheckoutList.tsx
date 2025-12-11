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
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/ordersAction";
import ROUTES from "@/constants/routes";

export default function CheckoutList() {
  const { cart, price, isLoading: cartLoading, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [selectedPayment, onSelectPayment] = useState<string | null>(null);
  const [vodafoneFile, setVodafoneFile] = useState<File | null>(null);
  const [instapayFile, setInstapayFile] = useState<File | null>(null);

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [stepNumber, setStepNumber] = useState(1);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const router = useRouter();


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

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment || !cart) {
      alert("Please complete all steps");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const getPromoDiscount = () => {
        try {
          const appliedPromo = localStorage.getItem("appliedPromo");
          if (appliedPromo) {
            const promo = JSON.parse(appliedPromo);
            return {
              amount: (price * promo.discount_percentage) / 100,
              couponId: promo.id,
            };
          }
        } catch (e) {
          return { amount: 0, couponId: null };
        }
        return { amount: 0, couponId: null };
      };

      const discount = getPromoDiscount();
      const total = price - discount.amount + deliveryFee;

      let paymentFile: File | undefined = undefined;
      if (selectedPayment.toLowerCase() === "vodafone cash" && vodafoneFile) {
        paymentFile = vodafoneFile;
      } else if (selectedPayment.toLowerCase() === "instapay" && instapayFile) {
        paymentFile = instapayFile;
      }

      const cartItems = Object.values(cart).map((item) => ({
        productId: item.products.id,
        productTitle: item.products.title,
        quantity: item.quantity,
        priceAtPurchase: item.products.price_after,
        productImage: item.products.image_cover
      }));

      const result = await createOrder(
        {
          addressId: selectedAddress.id,
          paymentMethod: selectedPayment,
          paymentImageFile: paymentFile,
          subtotal: price,
          deliveryFee: deliveryFee,
          discountAmount: discount.amount,
          totalPrice: total,
          couponId: discount.couponId,
        },
        cartItems
      );

      if (result.success) {
        await clearCart();
        localStorage.removeItem("checkoutPaymentData");
        localStorage.removeItem("promoCode");
        localStorage.removeItem("appliedPromo");
        router.push(ROUTES.ORDERS);

      } else {
        alert(`Failed to place order: ${result.error}`);
      }
    } catch (error) {
      console.error("Place order error:", error);
      alert("An error occurred while placing your order");
    } finally {
      setIsPlacingOrder(false);
    }
  };


  return (
    <div className="max-w-[1450px] px-3 md:px-5 m-auto mt-6 md:mt-12 mb-10 min-h-screen">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
      </div>

      <Steps number={stepNumber} />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:flex-[4]">
          <div className="border shadow-xl rounded-xl">
            {stepNumber === 1 ? (
              <AddressStep
                addresses={addresses}
                onAddressSelected={handleAddressSelected}
                onRefresh={fetchAddresses}
                selectedAddress={selectedAddress}
              />
            ) : stepNumber === 2 ? (
              <PaymentStep
                onSelectPayment={onSelectPayment}
                selectedPayment={selectedPayment}
                onVodafoneFileChange={setVodafoneFile}
                onInstapayFileChange={setInstapayFile}
                vodafoneNumber="0100 123 4567"
                instapayLink="https://instapay.com"
              />
            ) : (
              <ReviewStep
                cart={cart}
                selectedAddress={selectedAddress}
                selectedPayment={selectedPayment}
                vodafoneFile={vodafoneFile}
                instapayFile={instapayFile}
              />
            )}
          </div>

          <div className="flex justify-between mt-6 md:mt-8 gap-3">
            <button
              disabled={stepNumber === 1}
              className={`px-4 md:px-6 py-2.5 md:py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base cursor-pointer`}
              onClick={() => setStepNumber(Math.max(1, stepNumber - 1))}
            >
              Previous
            </button>

            {stepNumber === 3 ? (
              <button
                disabled={isPlacingOrder}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base cursor-pointer flex items-center gap-2"
                onClick={handlePlaceOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            ) : (
              <button
                disabled={isNextDisabled}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base cursor-pointer"
                onClick={() => {
                  if (!isNextDisabled) setStepNumber(stepNumber + 1);
                }}
              >
                Next
              </button>
            )}
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
