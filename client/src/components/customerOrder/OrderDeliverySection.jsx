import { MapPin, Package, Phone } from "lucide-react";

export default function OrderDeliverySection({ receiver }) {
  const location = receiver?.location;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#d7c9b8] bg-[#ead9c4]">
          <Package size={13} className="text-[#8f8376]" />
        </div>
        <p className="pt-0.5 text-sm font-semibold text-[#2c2b28]">
          {receiver?.firstName} {receiver?.lastName}
        </p>
      </div>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#d7c9b8] bg-[#ead9c4]">
          <MapPin size={13} className="text-[#8f8376]" />
        </div>
        <p className="text-sm leading-6 text-[#5f564d]">
          {location?.address}
          <br />
          {[location?.district, location?.province].filter(Boolean).join(", ")}
          <br />
          {[location?.postalCode, location?.country].filter(Boolean).join(", ")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#d7c9b8] bg-[#ead9c4]">
          <Phone size={13} className="text-[#8f8376]" />
        </div>
        <div className="text-sm text-[#5f564d]">
          <p>{receiver?.phoneNumber}</p>
          {receiver?.secondaryPhoneNumber && (
            <p>{receiver.secondaryPhoneNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
}
