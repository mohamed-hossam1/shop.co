
import { useCart } from "@/Context/CartContext";
import CartSkeleton from "../skeleton/CartSkeleton";
import OrderSummary from "../cart/OrderSummary";
import Steps from "./Steps";
import AddressStep from "./AddressStep";

export default function CheckoutList() {
  const {
    cart,
    quantity,
    price,
    isLoading,
  } = useCart();



  if (isLoading || cart === null) {
    return <CartSkeleton />;
  }

  return (
    <div className="max-w-[1450px] px-3 md:px-5 m-auto mt-6 md:mt-12 mb-10">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
      </div>
      <Steps number={1}/>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:flex-[4]">

          <div className="border shadow-xl rounded-xl">
            <AddressStep/>
          </div>
        </div>

        <OrderSummary price={price} isCart={false} deliveryFee={0} />
      </div>
    </div>
  );
}
