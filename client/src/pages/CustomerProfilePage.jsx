import { useEffect, useState } from "react";
import { Loader2, Save, User } from "lucide-react";
import { Navigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../services/customerApi";

const emptyProfile = {
  firstName: "", lastName: "", email: "", phone: "",
  currentPassword: "", password: "",
  addressLine1: "", addressLine2: "", city: "", district: "",
  postalCode: "", country: "Sri Lanka",
};

const createProfileDraft = (profile) => {
  const address = profile?.addresses?.find((item) => item.isDefault) || profile?.addresses?.[0];
  return {
    firstName:    profile?.firstName    || "",
    lastName:     profile?.lastName     || "",
    email:        profile?.email        || "",
    phone:        profile?.phone        || "",
    currentPassword: "",
    password:     "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city:         address?.city         || "",
    district:     address?.district     || "",
    postalCode:   address?.postalCode   || "",
    country:      address?.country      || "Sri Lanka",
  };
};

const buildProfilePayload = (draft) => ({
  firstName: draft.firstName,
  lastName:  draft.lastName,
  email:     draft.email,
  phone:     draft.phone,
  currentPassword: draft.currentPassword,
  password:  draft.password,
  addresses:
    draft.addressLine1 || draft.city || draft.district
      ? [{
          fullName:     `${draft.firstName} ${draft.lastName}`.trim(),
          phone:        draft.phone,
          addressLine1: draft.addressLine1,
          addressLine2: draft.addressLine2,
          city:         draft.city,
          district:     draft.district,
          postalCode:   draft.postalCode,
          country:      draft.country || "Sri Lanka",
          isDefault:    true,
        }]
      : [],
});

const CustomerProfilePage = () => {
  const token = localStorage.getItem("customerToken");
  const [draft, setDraft]     = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getMyProfile(token);
        setDraft(createProfileDraft(response.data));
        localStorage.setItem("customerUser", JSON.stringify(response.data));
        window.dispatchEvent(new Event("kamari:user-updated"));
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const response = await updateMyProfile(buildProfilePayload(draft), token);
      setDraft(createProfileDraft(response.data));
      localStorage.setItem("customerUser", JSON.stringify(response.data));
      window.dispatchEvent(new Event("kamari:user-updated"));
      setSuccess("Profile updated successfully");
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] pt-28 pb-16 px-4 font-['Poppins']">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3b302a] text-white">
            <User size={26} strokeWidth={1.6} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#3b302a]">My Profile</h1>
            <p className="text-base text-[#a3948b] mt-1">Manage your KAMARI account details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#e5ddd5] bg-white p-8 md:p-10 shadow-[0_20px_60px_rgba(59,48,42,0.10)]">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-base text-[#6b5e55]">
              <Loader2 size={22} className="animate-spin" />
              Loading profile...
            </div>
          ) : (
            <div className="space-y-10">
              <section className="space-y-5">
                <SectionTitle>Personal Details</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="First Name" name="firstName" value={draft.firstName} onChange={handleChange} />
                  <Field label="Last Name"  name="lastName"  value={draft.lastName}  onChange={handleChange} />
                  <Field label="Email"      name="email"     type="email" value={draft.email} onChange={handleChange} required />
                  <Field label="Phone"      name="phone"     value={draft.phone}     onChange={handleChange} />
                </div>
              </section>

              <section className="space-y-5">
                <SectionTitle>Default Address</SectionTitle>
                <Field label="Address Line 1" name="addressLine1" value={draft.addressLine1} onChange={handleChange} />
                <Field label="Address Line 2" name="addressLine2" value={draft.addressLine2} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="City"        name="city"       value={draft.city}       onChange={handleChange} />
                  <Field label="District"    name="district"   value={draft.district}   onChange={handleChange} />
                  <Field label="Postal Code" name="postalCode" value={draft.postalCode} onChange={handleChange} />
                  <Field label="Country"     name="country"    value={draft.country}    onChange={handleChange} />
                </div>
              </section>

              <section className="space-y-5">
                <SectionTitle>Password</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Current Password" name="currentPassword" type="password" value={draft.currentPassword} onChange={handleChange} />
                  <Field label="New Password" name="password" type="password" value={draft.password} onChange={handleChange} placeholder="Leave blank to keep current" />
                </div>
              </section>

              {error   && <p className="rounded-2xl border border-rose-100    bg-rose-50    px-5 py-4 text-base text-rose-600">{error}</p>}
              {success && <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-base text-emerald-700">{success}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3b302a] px-8 py-3.5 text-base font-semibold text-white hover:bg-[#2e2622] disabled:opacity-60 transition"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Profile
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 className="border-b border-[#e5ddd5] pb-2 text-sm font-bold uppercase tracking-wider text-[#a3948b]">
    {children}
  </h2>
);

const Field = ({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[#a3948b]">
      {label}
    </span>
    <input
      name={name} type={type} value={value} onChange={onChange}
      required={required} placeholder={placeholder}
      className="w-full rounded-xl border border-[#e5ddd5] bg-white px-4 py-3 text-base text-[#3b302a] outline-none focus:ring-1 focus:ring-[#c2b2a6]"
    />
  </label>
);

export default CustomerProfilePage;
