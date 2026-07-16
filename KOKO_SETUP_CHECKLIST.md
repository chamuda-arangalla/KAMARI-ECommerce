# Koko Integration - Next Steps Checklist

## ✅ What Has Been Completed

### Backend Implementation
- ✅ **Koko Service** (`server/src/services/koko.service.js`)
  - Signature generation and verification
  - Payment initiation
  - Status checking
  - Response processing

- ✅ **Koko Controller** (`server/src/controllers/koko.controller.js`)
  - `/initiate` - Initiate Koko payment
  - `/callback` - Handle Koko response
  - `/status/:orderId` - Check payment status

- ✅ **Koko Routes** (`server/src/routes/koko.routes.js`)
  - Integrated into app.js
  - Authentication configured

- ✅ **Database Updates**
  - Order model updated with `kokoTransactionId` field
  - Added `paymentMethod` field

- ✅ **Environment Configuration**
  - .env updated with Koko variables
  - Ready for your credentials

---

## 🔧 What You Need to Do

### 1. **Obtain Koko Credentials** (⏱️ ~1 day)
   - [ ] Contact Koko Merchant Success team for your country
   - [ ] Request credentials for:
     - Dev/QA environment (for testing)
     - Production environment (when ready to go live)
   - [ ] You'll receive:
     - Merchant ID
     - API Key
     - Private Key (PEM format)
     - Koko's Public Key (PEM format)

### 2. **Update Environment Variables** (⏱️ ~5 minutes)
   Edit `server/.env`:
   ```env
   KOKO_API_URL=https://qaapi.paykoko.com  # or devapi for dev, prodapi for production
   KOKO_MERCHANT_ID=YOUR_MERCHANT_ID_HERE
   KOKO_API_KEY=YOUR_API_KEY_HERE
   KOKO_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
   KOKO_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
   ```

   **⚠️ Important**: 
   - Replace `\n` with actual newlines if using a .env parser that supports it
   - Or use a configuration management service for production

### 3. **Test Backend Endpoints** (⏱️ ~30 minutes)
   
   **Using Postman or cURL:**

   a) Create an order first via existing endpoint:
   ```
   POST /api/orders
   ```

   b) Initiate Koko payment:
   ```
   POST /api/payments/koko/initiate
   Headers: { Authorization: Bearer YOUR_JWT_TOKEN }
   Body: { "orderId": "ORD-XXXXX" }
   ```

   c) Expected response:
   ```json
   {
     "success": true,
     "data": {
       "orderId": "ORD-XXXXX",
       "amount": 5000,
       "redirectUrl": "https://qaapi.paykoko.com/checkout?orderId=ORD-XXXXX"
     }
   }
   ```

### 4. **Create Frontend Components** (⏱️ ~2 hours)
   
   Create in `client/src/components/checkout/`:
   
   - `KokoPaymentButton.jsx`
     - Button to trigger Koko payment
     - Calls `/api/payments/koko/initiate`
     - Redirects to Koko checkout
   
   - `PaymentStatusPage.jsx`
     - Shows payment success/failure
     - Calls `/api/payments/koko/status/:orderId`
     - Displays order confirmation
   
   - Add to checkout flow alongside existing payment methods

### 5. **Update Checkout Component** (⏱️ ~1 hour)
   
   Modify `client/src/pages/CheckoutPage.jsx`:
   - [ ] Add Koko payment option
   - [ ] Integrate KokoPaymentButton
   - [ ] Handle return URL with status
   - [ ] Update payment method selection

### 6. **Test Full Payment Flow** (⏱️ ~1-2 hours)
   
   1. Create test order
   2. Click "Pay with Koko"
   3. Redirect to Koko test checkout
   4. Complete payment on Koko
   5. Verify:
      - ✅ Callback received at `/api/payments/koko/callback`
      - ✅ Order status updated in database
      - ✅ Email sent to customer
      - ✅ Frontend shows success page

### 7. **Production Deployment** (⏱️ ~30 minutes)
   
   When ready to go live:
   - [ ] Switch to production Koko credentials
   - [ ] Update `KOKO_API_URL=https://prodapi.paykoko.com`
   - [ ] Update return/response URLs to production domain
   - [ ] Test complete flow on production
   - [ ] Set up monitoring/logging
   - [ ] Verify SSL/TLS is enabled

---

## 📋 File Reference

### New Files Created
```
server/
├── src/
│   ├── services/
│   │   └── koko.service.js          (NEW - Koko API service)
│   ├── controllers/
│   │   └── koko.controller.js       (NEW - Payment controllers)
│   ├── routes/
│   │   └── koko.routes.js           (NEW - Payment routes)
│   └── app.js                       (MODIFIED - Added Koko routes)
├── .env                             (MODIFIED - Added Koko variables)
└── package.json                     (NO CHANGES - All dependencies present)

Models/
├── Order.js                         (MODIFIED - Added kokoTransactionId, paymentMethod)

Documentation/
└── KOKO_INTEGRATION_GUIDE.md       (NEW - Comprehensive integration guide)
```

### Key Functions in Koko Service

```javascript
// Signature generation and verification
generateSignature(dataString)
verifyKokoSignature(dataString, signature)

// Payment operations
initiateKokoPayment(paymentParams)
checkKokoPaymentStatus(orderId)
processKokoResponse(responseData)

// Validation
validateKokoConfig()
```

---

## 🔑 Environment Variables Needed

| Variable | Format | Example | Required |
|----------|--------|---------|----------|
| KOKO_API_URL | URL | https://qaapi.paykoko.com | Yes |
| KOKO_MERCHANT_ID | String | c8cca514bdfa0582... | Yes |
| KOKO_API_KEY | String | 83fA5n1xUaj8OKn... | Yes |
| KOKO_PRIVATE_KEY | PEM String | -----BEGIN RSA... | Yes |
| KOKO_PUBLIC_KEY | PEM String | -----BEGIN PUBLIC... | Yes |

---

## 🚀 Quick Start Command

After setting up environment variables:

```bash
# 1. Make sure dependencies are installed
cd server
npm install

# 2. Start server
npm start

# 3. Test endpoint (replace with your JWT token)
curl -X POST http://localhost:5000/api/payments/koko/initiate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"TEST-ORDER-123"}'
```

---

## 📚 Resources

1. **Integration Guide**: `./KOKO_INTEGRATION_GUIDE.md`
2. **Koko API Docs**: Attached PDF files
3. **Sample PHP Code**: In attachments folder
4. **API Reference**: Check Koko documentation for latest endpoints

---

## ⚠️ Important Notes

1. **Keys Security**
   - Never commit `.env` to git
   - Use `.env.example` for template
   - Store production keys in secure environment variable management

2. **Testing**
   - Always test on QA/Dev first
   - Use test credentials from Koko
   - Verify callback endpoint is accessible

3. **Signature Format**
   - Data string order is CRITICAL - must match Koko spec exactly
   - Current implementation follows v1.06 API specification
   - Double-check with Koko if signature verification fails

4. **Email Configuration**
   - Ensure email service is configured in the app
   - Payment confirmation emails will be sent on success
   - Check email logs if emails not received

---

## ❓ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Signature verification fails | Check PEM keys format and newlines |
| Callback not received | Verify response URL is publicly accessible |
| Order not updating | Check database write permissions |
| Can't find order | Verify orderId format matches |
| Email not sent | Check email service configuration |

---

## Next: Frontend Implementation Guide

Once backend testing is complete, refer to frontend implementation guide for:
- Payment button component
- Payment status page
- Error handling
- Order confirmation

---

**Last Updated**: $(date)
**Backend Status**: ✅ Complete & Ready for Testing
**Frontend Status**: ⏳ Awaiting Implementation
