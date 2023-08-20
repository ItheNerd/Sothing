import CheckoutComponent, { CheckoutForm, CheckoutOrderSummary } from "@/components/checkout/CheckoutComponent";
import MainLayout from "@/layouts/MainLayout";

function Checkout() {
  return (
    <MainLayout>
      <CheckoutComponent
        checkoutOrderSummary={<CheckoutOrderSummary />}
        checkoutForm={<CheckoutForm />}
      />
    </MainLayout>
  );
}

export default Checkout;
