"use client";

import { useCart } from "@/stores/cartStore";
import { useState, useEffect } from "react";
import CartSkeleton from "../skeleton/CartSkeleton";
import OrderSummary from "../cart/OrderSummary";
import Steps from "./Steps";
import AddressStep from "./Address/AddressStep";
import { getAddresses } from "@/actions/addressAction";
import { getDeliveryFee } from "@/actions/deliveryAction";
import PaymentStep from "./Payment/PaymentStep";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/ordersAction";
import ROUTES from "@/constants/routes";
import { useUser } from "@/stores/userStore";
import ReviewStep from "./Reviewstep";
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  // Guest address data
  const [guestAddress, setGuestAddress] = useState({
    name: "",
    phone: "",
    city: "",
    area: "",
    street: "",
    building_number: "",
  });

  const [selectedPayment, onSelectPayment] = useState<string | null>(null);
  const [vodafoneFile, setVodafoneFile] = useState<File | null>(null);
  const [instapayFile, setInstapayFile] = useState<File | null>(null);

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [stepNumber, setStepNumber] = useState(1);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const router = useRouter();

  const fetchAddresses = async () => {
    if (!user) {
      setIsLoadingAddresses(false);
      return;
    }
    
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
  }, [user]);

  const handleAddressSelected = async (address: Address | null) => {
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

  const handleGuestAddressChange = async (addressData: typeof guestAddress) => {
    setGuestAddress(addressData);
    
    if (addressData.city) {
      setIsLoadingFee(true);
      try {
        const fee = await getDeliveryFee(addressData.city);
        setDeliveryFee(fee);
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
    if (stepNumber === 1) {
      if (user) {
        return selectedAddress === null;
      } else {
        return !guestAddress.name || 
               !guestAddress.phone || 
               !guestAddress.city || 
               !guestAddress.area || 
               !guestAddress.street || 
               !guestAddress.building_number;
      }
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
    if (!selectedPayment || !cart) {
      alert("Please complete all steps");
      return;
    }

    if (user && !selectedAddress) {
      alert("Please select an address");
      return;
    }

    if (!user) {
      if (!guestAddress.name || !guestAddress.phone || 
          !guestAddress.city || !guestAddress.area || !guestAddress.street || 
          !guestAddress.building_number) {
        alert("Please fill in all address fields");
        return;
      }
    }

    setIsPlacingOrder(true);

    try {
      const isConditionMet = appliedPromo ? price >= appliedPromo.min_purchase : true;
      const discountAmount = (appliedPromo && isConditionMet)
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

      const orderItems = Object.values(cart).map((item) => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
        price_at_purchase: item.variant.price,
        product_title: item.variant.product.title,
        product_image: item.variant.product.image_cover,
        variant_snapshot: {
          color: item.variant.color,
          size: item.variant.size,
          sku: item.variant.sku
        }
      }));

      // For logged in users, we Snapshot the address into guest_info as well if needed, 
      // or just pass it as is. 
      // The createOrder action currently takes guest_info.
      const finalGuestInfo = user 
        ? {
            name: user.name,
            phone: selectedAddress?.phone || user.phone,
            city: selectedAddress?.city,
            area: selectedAddress?.area,
            street: selectedAddress?.street,
            building_number: selectedAddress?.building_number
          }
        : guestAddress;

      const result = await createOrder(
        {
          subtotal: price,
          discount_amount: discountAmount,
          total_price: total,
          delivery_fee: deliveryFee,
          payment_method: selectedPayment,
          payment_image_file: paymentFile,
          coupon_id: appliedPromo?.id,
          guest_info: finalGuestInfo,
        },
        orderItems,
        !user // isGuest
      );

      if (result.success) {
        await clearCart();
        setAppliedPromo(null);
        
        router.push(`${ROUTES.ORDER_SUCCESS}?orderId=${result.orderId}&isGuest=${!user}`);
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
        {!user && (
          <p className="text-sm text-gray-600 mt-2">
            Checking out as guest. 
            <a href={ROUTES.SIGNIN} className="text-primary hover:underline ml-1">
              Sign in
            </a> to track your orders.
          </p>
        )}
      </div>

      <Steps number={stepNumber} />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:flex-[4]">
          <div className="border shadow-xl rounded-xl">
            {stepNumber === 1 ? (
              user ? (
                <AddressStep
                  addresses={addresses}
                  onAddressSelected={handleAddressSelected}
                  onRefresh={fetchAddresses}
                  selectedAddress={selectedAddress || null}
                />
              ) : (
                <GuestAddressStep
                  guestAddress={guestAddress}
                  onAddressChange={handleGuestAddressChange}
                />
              )
            ) : stepNumber === 2 ? (
              <PaymentStep
                onSelectPayment={onSelectPayment}
                selectedPayment={selectedPayment}
                onVodafoneFileChange={setVodafoneFile}
                onInstapayFileChange={setInstapayFile}
                vodafoneNumber="01092288325"
                instapayLink="https://ipn.eg/S/mahmoud.ashraf3420/instapay/27tw6b"
              />
            ) : (
              <ReviewStep
                cart={cart}
                selectedAddress={selectedAddress}
                guestAddress={user ? null : guestAddress}
                selectedPayment={selectedPayment}
                vodafoneFile={vodafoneFile}
                instapayFile={instapayFile}
                isGuest={!user}
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
                className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#394867]  text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base cursor-pointer"
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
          hasAddress={user ? !!selectedAddress : !!guestAddress.city}
          isLoadingFee={isLoadingFee}
        />
      </div>
    </div>
  );
}
