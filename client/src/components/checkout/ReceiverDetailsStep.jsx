import { DISTRICTS, PROVINCES } from "./constants";
import SearchableDropdown from "./SearchableDropdown";

export default function ReceiverDetailsStep({
  receiverDetails,
  onInputChange,
  onSelectChange,
}) {
  return (
    <>
      <h2 className="checkout-section-title">Receiver Details</h2>

      <div className="checkout-row">
        <div className="checkout-field">
          <input className="checkout-input" name="firstName" type="text" placeholder="First name" value={receiverDetails.firstName} onChange={onInputChange} required />
        </div>
        <div className="checkout-field">
          <input className="checkout-input" name="lastName" type="text" placeholder="Last name" value={receiverDetails.lastName} onChange={onInputChange} required />
        </div>
      </div>

      <div className="checkout-field">
        <input className="checkout-input" name="address" type="text" placeholder="Address" value={receiverDetails.address} onChange={onInputChange} required />
      </div>

      <div className="checkout-row">
        <div className="checkout-field">
          <SearchableDropdown value={receiverDetails.district} onChange={(value) => onSelectChange("district", value)} options={DISTRICTS} placeholder="District" />
        </div>
        <div className="checkout-field">
          <SearchableDropdown value={receiverDetails.province} onChange={(value) => onSelectChange("province", value)} options={PROVINCES} placeholder="Province" />
        </div>
      </div>

      <div className="checkout-row">
        <div className="checkout-field">
          <input className="checkout-input" name="country" type="text" placeholder="Country" value={receiverDetails.country} onChange={onInputChange} required />
        </div>
        <div className="checkout-field">
          <input className="checkout-input" name="postalCode" type="text" placeholder="Postal code" value={receiverDetails.postalCode} onChange={onInputChange} required />
        </div>
      </div>

      <div className="checkout-row">
        <div className="checkout-field">
          <input className="checkout-input" name="phoneNumber" type="tel" placeholder="Phone number" value={receiverDetails.phoneNumber} onChange={onInputChange} required />
        </div>
        <div className="checkout-field">
          <input className="checkout-input" name="secondaryPhoneNumber" type="tel" placeholder="Secondary phone number (optional)" value={receiverDetails.secondaryPhoneNumber} onChange={onInputChange} />
        </div>
      </div>
    </>
  );
}
