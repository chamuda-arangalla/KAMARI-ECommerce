# Koko Payment Integration Guide

This guide explains how to set up and use the Koko payment integration in the KAMARI e-commerce platform.

## Overview

Koko is a Buy Now Pay Later (BNPL) payment service. This integration allows customers to pay for orders using Koko's payment gateway.

## Prerequisites

1. **Koko Merchant Account**: You must have a registered Koko merchant account
2. **Koko Credentials**: You'll need:
   - Merchant ID (_mId)
   - API Key
   - Private Key (for signing requests)
   - Koko's Public Key (for verifying responses)

## Getting Koko Credentials

Contact the Koko Merchant Success team for your country to receive:
- Live and test credentials
- Merchant ID
- API Key
- RSA Private Key (PEM format)
- Koko's RSA Public Key (PEM format)

Different credentials are available for:
- **Dev**: devapi.paykoko.com
- **QA**: qaapi.paykoko.com  
- **Production**: prodapi.paykoko.com

## Backend Setup

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Koko Payment Integration
KOKO_API_URL=https://prodapi.paykoko.com  # or dev/qa URL
KOKO_MERCHANT_ID=your_merchant_id_here
KOKO_API_KEY=your_api_key_here
KOKO_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nYour_private_key_content_here\n-----END RSA PRIVATE KEY-----
KOKO_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nKoko_public_key_content_here\n-----END PUBLIC KEY-----

# Other required URLs
SERVER_URL=http://localhost:5000  # or your production URL
CLIENT_URL=http://localhost:5173  # or your frontend URL
```

**Important**: 
- For multiline keys (PEM format), use `\n` for newlines in the .env file
- Or use environment variable files that support multiline strings
- For production, ensure these are set via secure environment variable management

### 2. Key Files Created

```
server/src/
├── services/
│   └── koko.service.js          # Koko API service
├── controllers/
│   └── koko.controller.js       # Koko payment controllers
├── routes/
│   └── koko.routes.js           # Koko payment routes
└── models/
    └── Order.js                 # Updated with kokoTransactionId
```

### 3. API Endpoints

#### Initiate Koko Payment
```
POST /api/payments/koko/initiate
Authentication: Required (JWT token)
Body: { orderId: "string" }

Response:
{
  "success": true,
  "message": "Koko payment initiated successfully",
  "data": {
    "orderId": "ORD123",
    "amount": 5000,
    "redirectUrl": "https://prodapi.paykoko.com/checkout?orderId=ORD123"
  }
}
```

#### Payment Callback (Webhook)
```
POST /api/payments/koko/callback
Authentication: Not required (Koko backend calls this)
Body: 
{
  "orderId": "ORD123",
  "trnId": "transaction_id",
  "status": "SUCCESS|FAILURE|CANCELED",
  "desc": "description",
  "signature": "encrypted_signature"
}

Response:
{
  "success": true,
  "message": "Callback processed successfully",
  "paymentStatus": "COMPLETED|FAILED|PENDING"
}
```

#### Check Payment Status
```
GET /api/payments/koko/status/:orderId
Authentication: Required (JWT token)

Response:
{
  "success": true,
  "data": {
    "orderId": "ORD123",
    "localStatus": "COMPLETED",
    "kokoStatus": { ... }
  }
}
```

## Payment Flow

### 1. Customer Initiates Payment
- Customer completes checkout and creates an order
- Order is created with `paymentStatus: "PENDING"`
- Customer clicks "Pay with Koko" button

### 2. Redirect to Koko
- Frontend calls `POST /api/payments/koko/initiate` with `orderId`
- Backend creates a signed request with Koko
- Backend returns a redirect URL
- Customer is redirected to Koko's checkout page

### 3. Customer Completes Payment
- Customer enters payment details on Koko
- Koko processes the payment
- Koko redirects customer back to your site using `_returnUrl`

### 4. Backend Verification
- Koko sends callback to `_responseUrl` (webhook)
- Backend verifies Koko's signature
- Order `paymentStatus` is updated to `COMPLETED` or `FAILED`
- Confirmation email is sent to customer

### 5. Frontend Confirmation
- Frontend checks payment status at return URL
- Displays success/failure message to customer

## Data Flow Diagram

```
Customer                Your App              Koko
   |                       |                   |
   |---Create Order------->|                   |
   |                       |<---Save Order-----|
   |<---Order Created------|                   |
   |                       |                   |
   |---Pay with Koko------>|                   |
   |                       |---Request Signature|
   |                       |   (signed with key)|
   |                       |                   |
   |                       |<--Checkout URL----|
   |<--Redirect to Koko----|                   |
   |                       |                   |
   |-----Enter Details---->|                   |
   |                       |---Process Payment-|
   |                       |                   |
   |                       |<--Callback--------|
   |                       |  (signature + status)
   |                       |---Verify Sig----->
   |                       |   (signed with key)
   |                       |<--Valid-----------|
   |                       |                   |
   |<--Redirect to App-----|                   |
   |    (success page)      |                   |
```

## Frontend Integration

### Button to Initiate Payment

```jsx
const handlePayWithKoko = async (orderId) => {
  try {
    const response = await fetch('/api/payments/koko/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    });

    const data = await response.json();
    
    if (data.success) {
      // Redirect to Koko checkout
      window.location.href = data.data.redirectUrl;
    } else {
      console.error('Payment initiation failed:', data.message);
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

### Payment Status Page

```jsx
const PaymentStatus = () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const status = params.get('status'); // From Koko's redirect

  useEffect(() => {
    checkPaymentStatus(orderId);
  }, [orderId]);

  const checkPaymentStatus = async (orderId) => {
    const response = await fetch(
      `/api/payments/koko/status/${orderId}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await response.json();
    // Display status based on data.data.localStatus
  };

  return (
    <div>
      {/* Display payment status */}
    </div>
  );
};
```

## Security Considerations

### 1. Signature Verification
- All requests to Koko must be signed with your private key
- All responses from Koko must be verified using Koko's public key
- The service handles this automatically

### 2. Private Key Management
- Never expose your private key
- Store it securely in environment variables
- Use secure environment variable management in production

### 3. Webhook Security
- The callback endpoint verifies Koko's signature
- Only processes callbacks with valid signatures
- Implements idempotency (same request processed only once)

### 4. Order Validation
- Always fetch order details from database
- Verify order exists before processing
- Check order status before updating

## Testing

### Test Mode Setup

1. Use QA endpoint in .env:
   ```env
   KOKO_API_URL=https://qaapi.paykoko.com
   ```

2. Use test credentials from Koko

3. Test Payment Flow:
   - Create an order
   - Initiate payment
   - Complete payment on Koko test portal
   - Verify callback is received
   - Check order status is updated

### Test Credentials

Koko provides test credentials. Contact merchant success for:
- Test merchant ID
- Test API key
- Test private/public keys

## Troubleshooting

### Signature Verification Fails
- Check PEM keys are correctly formatted
- Ensure newlines are properly escaped in .env
- Verify key order in data string matches Koko's specification

### Callback Not Received
- Ensure `_responseUrl` is publicly accessible
- Check firewall/security rules allow Koko's IP
- Verify webhook endpoint is correctly implemented

### Order Not Updated
- Check callback endpoint is receiving requests
- Verify signature verification is passing
- Check MongoDB connection and write permissions

### Environment Variable Issues
- For multiline keys, use proper escaping: `\n` for newlines
- Test with: `node -e "console.log(process.env.KOKO_PRIVATE_KEY)"`
- Ensure no accidental line breaks in .env

## Order Model Changes

The Order model has been updated with:

```javascript
{
  kokoTransactionId: String,    // Koko's transaction ID
  paymentMethod: String,         // "manual", "koko", "other"
  // ... existing fields
}
```

## Email Templates

Two email templates are used:

1. **Payment Confirmation** - Sent when payment succeeds
2. **Payment Failed** - Sent when payment fails

Ensure your email service is configured (nodemailer/SendGrid).

## Production Deployment

Before going live:

1. ✅ Update environment variables with production credentials
2. ✅ Switch to production Koko API URL
3. ✅ Update return/cancel/response URLs to production domain
4. ✅ Test complete payment flow
5. ✅ Verify webhook endpoint is accessible
6. ✅ Set up monitoring/logging for payment transactions
7. ✅ Ensure SSL/TLS is enabled for all URLs
8. ✅ Back up private keys securely
9. ✅ Test error scenarios

## Support

For Koko API issues:
- Contact Koko Merchant Success team
- API Documentation: Refer to attached Koko API docs

For integration issues:
- Check logs in server console
- Verify all environment variables
- Test signature creation manually
- Use Postman to test endpoints

## Additional Resources

- [Koko API Documentation](./docs/koko-api-v1.06.pdf)
- [Koko Merchant Order View API](./docs/koko-orderView-v1.0.pdf)
- Sample implementation files in `/attachments/`
