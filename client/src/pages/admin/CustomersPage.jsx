import { useState } from "react";
import { Edit2, Loader2, Mail, MapPin, Phone, Plus, Search, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAdmin } from "../../context/AdminContext";

const createCustomerDraft = (customer) => ({
  firstName:    customer?.firstName || "",
  lastName:     customer?.lastName || "",
  email:        customer?.email || "",
  phone:        customer?.phone === "No phone" ? "" : customer?.phone || "",
  password:     "",
  addressLine1: customer?.defaultAddress?.addressLine1 || "",
  addressLine2: customer?.defaultAddress?.addressLine2 || "",
  city:         customer?.defaultAddress?.city || "",
  district:     customer?.defaultAddress?.district || "",
  postalCode:   customer?.defaultAddress?.postalCode || "",
  country:      customer?.defaultAddress?.country || "Sri Lanka",
  isActive:     customer?.isActive ?? true,
});

const buildCustomerPayload = (draft) => {
  const hasAddress = draft.addressLine1 || draft.city || draft.district;
  const payload = {
    firstName: draft.firstName,
    lastName:  draft.lastName,
    email:     draft.email,
    phone:     draft.phone,
    isActive:  draft.isActive,
    addresses: hasAddress
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
  };
  if (draft.password) payload.password = draft.password;
  return payload;
};

const CustomersPage = () => {
  const { customers, customersLoading, customersError, refreshCustomers, addCustomer, editCustomer, deleteCustomer } = useAdmin();
  const [searchTerm, setSearchTerm]           = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [draft, setDraft]                     = useState(createCustomerDraft(null));
  const [saving, setSaving]                   = useState(false);
  const [formError, setFormError]             = useState("");
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [deleting, setDeleting]               = useState(false);

  const filteredCustomers = customers.filter((c) => {
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
  });

  const handleDraftChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDraft((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const openCreateCustomer = () => {
    setSelectedCustomer(null);
    setCreatingCustomer(true);
    setDraft(createCustomerDraft(null));
    setFormError("");
  };

  const openEditCustomer = (customer) => {
    setCreatingCustomer(false);
    setSelectedCustomer(customer);
    setDraft(createCustomerDraft(customer));
    setFormError("");
  };

  const closeDrawer = () => {
    setSelectedCustomer(null);
    setCreatingCustomer(false);
    setFormError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedCustomer && !creatingCustomer) return;
    try {
      setSaving(true);
      setFormError("");
      const saved = creatingCustomer
        ? await addCustomer(buildCustomerPayload(draft))
        : await editCustomer(selectedCustomer.id, buildCustomerPayload(draft));
      setSelectedCustomer(saved);
      setCreatingCustomer(false);
      setDraft(createCustomerDraft(saved));
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteCustomer(deleteTarget.id);
      if (selectedCustomer?.id === deleteTarget.id) closeDrawer();
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const drawerOpen = selectedCustomer || creatingCustomer;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-[#3b302a]">Customers</h2>
          <p className="text-base text-[#a3948b] mt-2">Create, edit, or remove customer accounts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3948b]" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base w-full md:w-80 focus:ring-1 focus:ring-[#c2b2a6] outline-none transition-all shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={openCreateCustomer}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3b302a] text-white text-base font-semibold hover:bg-[#2e2622] shadow-sm"
          >
            <Plus size={20} />
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e5ddd5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfaf7] border-b border-[#e5ddd5]">
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Default Address</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Joined</th>
                <th className="px-6 py-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8]">
              {customersLoading && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-base text-[#6b5e55]">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={20} className="animate-spin" /> Loading customers...
                    </span>
                  </td>
                </tr>
              )}
              {customersError && !customersLoading && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <p className="text-base text-rose-600">{customersError}</p>
                    <button type="button" onClick={refreshCustomers} className="mt-3 px-5 py-2.5 rounded-xl border border-[#d8ccc2] text-base text-[#5f5149] hover:bg-[#f8f5f2]">
                      Try Again
                    </button>
                  </td>
                </tr>
              )}
              {!customersLoading && !customersError && filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-base text-[#8c7d73]">No customers found.</td>
                </tr>
              )}
              {!customersLoading && !customersError && filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#fcfaf7] transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f3ede8] flex items-center justify-center text-[#3b302a] text-lg font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[#3b302a]">{customer.name}</p>
                        <p className="text-sm text-[#a3948b] mt-0.5">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-2 text-base text-[#6b5e55]">
                        <Mail size={16} className="text-[#a3948b]" /> {customer.email}
                      </span>
                      <span className="flex items-center gap-2 text-base text-[#6b5e55]">
                        <Phone size={16} className="text-[#a3948b]" /> {customer.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-xs">
                    <p className="text-base text-[#6b5e55] truncate">
                      {customer.defaultAddress
                        ? `${customer.defaultAddress.addressLine1}, ${customer.defaultAddress.city}`
                        : "No saved address"}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-base text-[#6b5e55]">{customer.joinedDate}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openEditCustomer(customer)}
                        className="p-2.5 text-[#8c7d73] hover:text-[#3b302a] hover:bg-[#f3ede8] rounded-xl transition-all">
                        <Edit2 size={19} />
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(customer)}
                        className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={19} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#3b302a]/25 backdrop-blur-sm z-[60]" onClick={closeDrawer} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white z-[70] shadow-2xl overflow-y-auto">
              <form onSubmit={handleSave} className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#3b302a]">
                      {creatingCustomer ? "Create Customer" : "Edit Customer"}
                    </h3>
                    <p className="text-base text-[#a3948b] mt-1">
                      {creatingCustomer ? "Add a customer profile" : selectedCustomer.id}
                    </p>
                  </div>
                  <button type="button" onClick={closeDrawer} className="p-2 hover:bg-[#f8f5f2] rounded-full text-[#6b5e55]">
                    <X size={26} />
                  </button>
                </div>

                <div className="flex items-center gap-5 p-6 bg-[#fcfaf7] rounded-3xl border border-[#e5ddd5]">
                  <div className="w-16 h-16 rounded-full bg-[#3b302a] flex items-center justify-center text-white text-2xl font-bold">
                    {(selectedCustomer?.name || draft.email || "C").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#3b302a]">{selectedCustomer?.name || "New Customer"}</h4>
                    <p className="text-base text-[#a3948b]">{selectedCustomer?.email || "Created by admin"}</p>
                    <p className="text-sm text-[#8c7d73] mt-1">
                      {creatingCustomer ? "Password is required for new customers" : `Joined ${selectedCustomer.joinedDate}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name"  name="firstName" value={draft.firstName} onChange={handleDraftChange} />
                  <Field label="Last Name"   name="lastName"  value={draft.lastName}  onChange={handleDraftChange} />
                  <Field label="Email"       name="email"     type="email"  value={draft.email}    onChange={handleDraftChange} required />
                  <Field label="Phone"       name="phone"     value={draft.phone}     onChange={handleDraftChange} />
                  <Field
                    label={creatingCustomer ? "Password *" : "New Password"}
                    name="password" type="password" value={draft.password} onChange={handleDraftChange}
                    required={creatingCustomer}
                    placeholder={creatingCustomer ? "Minimum 6 characters" : "Leave blank to keep current"}
                  />
                </div>

                <label className="inline-flex items-center gap-3 text-base text-[#3b302a]">
                  <input type="checkbox" name="isActive" checked={draft.isActive} onChange={handleDraftChange} className="h-5 w-5 accent-[#3b302a]" />
                  Active customer account
                </label>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#a3948b] uppercase tracking-widest border-b border-[#e5ddd5] pb-2">
                    Default Address
                  </h4>
                  <Field label="Address Line 1" name="addressLine1" value={draft.addressLine1} onChange={handleDraftChange} />
                  <Field label="Address Line 2" name="addressLine2" value={draft.addressLine2} onChange={handleDraftChange} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="City"        name="city"       value={draft.city}       onChange={handleDraftChange} />
                    <Field label="District"    name="district"   value={draft.district}   onChange={handleDraftChange} />
                    <Field label="Postal Code" name="postalCode" value={draft.postalCode} onChange={handleDraftChange} />
                    <Field label="Country"     name="country"    value={draft.country}    onChange={handleDraftChange} />
                  </div>
                </div>

                {!creatingCustomer && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-[#a3948b] uppercase tracking-widest">Saved Addresses</h4>
                    {selectedCustomer.addresses.length === 0 ? (
                      <p className="text-base text-[#8c7d73] bg-[#fcfaf7] border border-[#e5ddd5] rounded-2xl px-4 py-3">
                        No saved addresses.
                      </p>
                    ) : (
                      selectedCustomer.addresses.map((address, index) => (
                        <div key={`${address.addressLine1}-${index}`} className="rounded-2xl border border-[#e5ddd5] bg-white px-4 py-3">
                          <p className="flex items-center gap-2 text-base font-semibold text-[#3b302a]">
                            <MapPin size={16} /> {address.fullName || selectedCustomer.name}
                          </p>
                          <p className="mt-1 text-base text-[#6b5e55]">
                            {[address.addressLine1, address.addressLine2, address.city, address.district, address.postalCode, address.country].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {formError && (
                  <p className="text-base text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeDrawer}
                    className="flex-1 py-3.5 rounded-xl bg-white border border-[#d8ccc2] text-base font-semibold text-[#5f5149] hover:bg-[#f8f5f2]">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#3b302a] text-white text-base font-semibold hover:bg-[#2e2622] disabled:opacity-60">
                    {saving && <Loader2 size={18} className="animate-spin" />}
                    {creatingCustomer ? "Create Customer" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete customer?"
        message={`This will remove ${deleteTarget?.name || "this customer"} from the active customer list.`}
        confirmLabel="Delete Customer"
        type="delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

const Field = ({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) => (
  <label className="block">
    <span className="block text-sm font-semibold text-[#a3948b] uppercase tracking-wider mb-2">{label}</span>
    <input
      name={name} type={type} value={value} onChange={onChange}
      required={required} placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base text-[#3b302a] focus:ring-1 focus:ring-[#c2b2a6] outline-none"
    />
  </label>
);

export default CustomersPage;
