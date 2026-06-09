import { MapPin, Package, Phone } from "lucide-react";

export default function OrderDeliverySection({ receiver }) {
  const location = receiver?.location;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#e5ddd5] bg-[#f8f5f2]">
          <Package size={13} className="text-[#7d746c]" />
        </div>
        <p className="pt-0.5 text-sm font-semibold text-[#3b302a]">
          {receiver?.firstName} {receiver?.lastName}
        </p>
      </div>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#e5ddd5] bg-[#f8f5f2]">
          <MapPin size={13} className="text-[#7d746c]" />
        </div>
        <p className="text-sm leading-6 text-[#6b5e55]">
          {location?.address}
          <br />
          {[location?.district, location?.province].filter(Boolean).join(", ")}
          <br />
          {[location?.postalCode, location?.country].filter(Boolean).join(", ")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#e5ddd5] bg-[#f8f5f2]">
          <Phone size={13} className="text-[#7d746c]" />
        </div>
        <div className="text-sm text-[#6b5e55]">
          <p>{receiver?.phoneNumber}</p>
          {receiver?.secondaryPhoneNumber && (
            <p>{receiver.secondaryPhoneNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
}
