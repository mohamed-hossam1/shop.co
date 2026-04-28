"use client";

import { useCart } from "@/stores/cartStore";
import { useState, useEffect } from "react";
import CartSkeleton from "../skeleton/CartSkeleton";
import OrderSummary from "../cart/OrderSummary";
import AddressStep from "./Address/AddressStep";
import { getAddresses } from "@/actions/addressAction";
import { getDeliveryFee } from "@/actions/deliveryAction";
import { useQuery } from "@tanstack/react-query";

import PaymentStep from "./Payment/PaymentStep";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/ordersAction";
import ROUTES from "@/constants/routes";
import { useUser } from "@/stores/userStore";
import GuestAddressStep from "./Address/Guestaddressstep";
import { Address } from "@/types/Address";

export default function CheckoutList() {
  const {
    cart,
    price,
    isLoading: cartLoading,
    clearCart,
    appliedPromo,
    setAppliedPromo,
  } = useCart();

  const { user } = useUser();
  const { 
    data: addresses = [], 
    isLoading: isLoadingAddresses,
    refetch: refetchAddresses
  } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await getAddresses();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!user
  });

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Guest address data
  const [guestAddress, setGuestAddress] = useState({
    name: "",
    phone: "",
    city: "",
    area: "",
    address_line: "",
  });

  const [selectedPayment, onSelectPayment] = useState<string | null>(null);
  const [vodafoneFile, setVodafoneFile] = useState<File | null>(null);
  const [instapayFile, setInstapayFile] = useState<File | null>(null);

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [stepNumber, setStepNumber] = useState(1);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const router = useRouter();

  const handleAddressSelected = async (address: Address | null) => {
    setSelectedAddress(address);
    setIsLoadingFee(true);
    if (address) {
      try {
        const fee = await getDeliveryFee(address.city);
        if (fee && fee.success) {
          setDeliveryFee(fee.data);
        } else {
          setDeliveryFee(0);
        }
      } catch (error) {
        console.error("Error fetching delivery fee:", error);
        setDeliveryFee(0);
      }
    } else {
      setDeliveryFee(0);
    }
    setIsLoadingFee(false);
  };

  const handleGuestAddressChange = async (addressData: typeof guestAddress) => {
    setGuestAddress(addressData);

    if (addressData.city) {
      setIsLoadingFee(true);
      try {
        const fee = await getDeliveryFee(addressData.city);
        if (fee && fee.success) {
          setDeliveryFee(fee.data);
        } else {
          setDeliveryFee(0);
        }
      } catch (error) {
        console.error("Error fetching delivery fee:", error);
        setDeliveryFee(0);
      }
      setIsLoadingFee(false);
    } else {
      setDeliveryFee(0);
    }
  };

  if (cartLoading || isLoadingAddresses || cart === null) {
    return <CartSkeleton />;
  }

  const isNextDisabled = (() => {
    if (user) {
      return selectedAddress === null || !selectedPayment;
    } else {
      return (
        !guestAddress.name ||
        !guestAddress.phone ||
        !guestAddress.city ||
        !guestAddress.area ||
        !guestAddress.address_line ||
        !selectedPayment
      );
    }
  })();

  const handlePlaceOrder = async () => {
    if (!selectedPayment || !cart) {
      alert("Please complete all steps");
      return;
    }

    if (user && !selectedAddress) {
      alert("Please select an address");
      return;
    }

    if (!user) {
      if (
        !guestAddress.name ||
        !guestAddress.phone ||
        !guestAddress.city ||
        !guestAddress.area ||
        !guestAddress.address_line
      ) {
        alert("Please fill in all address fields");
        return;
      }
    }

    setIsPlacingOrder(true);

    try {
      const isConditionMet = appliedPromo
        ? price >= appliedPromo.min_purchase
        : true;
      const discountAmount =
        appliedPromo && isConditionMet
          ? appliedPromo.type === "percentage"
            ? (price * (appliedPromo.value || 0)) / 100
            : Math.min(price, appliedPromo.value || 0)
          : 0;

      const subtotalAfterDiscount = Math.max(0, price - discountAmount);
      const total = subtotalAfterDiscount + deliveryFee;

      let paymentFile: File | undefined = undefined;
      const p = selectedPayment.toLowerCase();
      if (p === "vodafone cash" && vodafoneFile) {
        paymentFile = vodafoneFile;
      } else if (p === "instapay" && instapayFile) {
        paymentFile = instapayFile;
      }

      // For logged in users, we Snapshot the address into guest_info as well if needed
      const result = await createOrder(
        {
          subtotal: price,
          discount_amount: discountAmount,
          total_price: total,
          delivery_fee: deliveryFee,
          payment_method: selectedPayment as string,
          payment_image: paymentFile ? paymentFile.name : undefined, // Simplify file upload handling for now if it requires a cloud store step
          coupon_id: appliedPromo?.id,
          user_id: user?.id,
          guest_id: !user ? "guest_" + Date.now() : undefined,
          city: user ? selectedAddress?.city! : guestAddress.city,
          area: user ? selectedAddress?.area! : guestAddress.area,
          address_line: user
            ? selectedAddress?.address_line!
            : guestAddress.address_line,
          user_name: user ? user.name || "" : guestAddress.name,
        },
        Object.values(cart),
      );

      if (result.success) {
        await clearCart();
        setAppliedPromo(null);

        router.push(
          `${ROUTES.ORDER_SUCCESS}?orderId=${result.data.id}&isGuest=${!user}`,
        );
      } else {
        alert(`Failed to place order: ${result.message}`);
      }
    } catch (error) {
      console.error("Place order error:", error);
      alert("An error occurred while placing your order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-[1400px] px-4 sm:px-6 lg:px-8 m-auto mt-6 md:mt-12 mb-20 min-h-screen">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-integral font-black tracking-wider uppercase">
          Checkout
        </h1>
        {!user && (
          <p className="text-sm md:text-base text-gray-600 mt-3 font-medium">
            Checking out as guest.
            <a
              href={ROUTES.SIGNIN}
              className="text-black font-bold hover:underline ml-1"
            >
              Sign in
            </a>{" "}
            to track your orders.
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        {/* Left Column - Information */}
        <div className="w-full lg:flex-[1.5] space-y-10">
          {/* Delivery Details Section */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-none border border-black bg-black text-white flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                1
              </span>
              Delivery Details
            </h2>
            <div className="border border-black rounded-none bg-white p-6 sm:p-8">
              {user ? (
                <AddressStep
                  addresses={addresses}
                  onAddressSelected={handleAddressSelected}
                  onRefresh={refetchAddresses}
                  selectedAddress={selectedAddress || null}
                />

              ) : (
                <GuestAddressStep
                  guestAddress={guestAddress}
                  onAddressChange={handleGuestAddressChange}
                />
              )}
            </div>
          </section>

          {/* Payment Method Section */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-none border border-black bg-black text-white flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                2
              </span>
              Payment Method
            </h2>
            <div className="border border-black rounded-none bg-white p-6 sm:p-8">
              <PaymentStep
                onSelectPayment={onSelectPayment}
                selectedPayment={selectedPayment}
                onVodafoneFileChange={setVodafoneFile}
                onInstapayFileChange={setInstapayFile}
                vodafoneNumber="01092288325"
                instapayLink="https://ipn.eg/S/mahmoud.ashraf3420/instapay/27tw6b"
              />
            </div>
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="w-full lg:flex-1">
          <div className="sticky top-28 space-y-6">
            <OrderSummary
              price={price}
              isCart={false}
              deliveryFee={deliveryFee}
              hasAddress={user ? !!selectedAddress : !!guestAddress.city}
              isLoadingFee={isLoadingFee}
            />

            <button
              disabled={isPlacingOrder || isNextDisabled}
              className="w-full py-4 bg-black text-white font-bold border border-black hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-none"
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
          </div>
        </div>
      </div>
    </div>
  );
}
