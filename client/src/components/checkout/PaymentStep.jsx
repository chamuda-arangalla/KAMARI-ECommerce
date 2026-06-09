import { PAYMENT_METHODS } from "./constants";
import PaymentMethodOption from "./PaymentMethodOption";

export default function PaymentStep({ paymentMethod, onPaymentMethodChange }) {
  return (
    <>
      <h2 className="checkout-section-title">Payment</h2>
      <div className="payment-methods">
        <PaymentMethodOption checked={paymentMethod === PAYMENT_METHODS.BANK_TRANSFER} name="BANK TRANSFER" tag="Slip required" value={PAYMENT_METHODS.BANK_TRANSFER} onChange={onPaymentMethodChange}>
          Transfer to our bank account after placing the order and upload your payment slip for confirmation.
        </PaymentMethodOption>

        <PaymentMethodOption checked={paymentMethod === PAYMENT_METHODS.COD} name="CASH ON DELIVERY (COD)" tag="Pay on delivery" value={PAYMENT_METHODS.COD} onChange={onPaymentMethodChange}>
          Place your order now and pay the delivery team in cash when your order arrives.
        </PaymentMethodOption>
      </div>
    </>
  );
}
