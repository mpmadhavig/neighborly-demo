# Payment Flow with Profile Update

## Overview
This document describes the complete booking and payment flow with user profile update via SCIM API.

## Flow Steps

### 1. **Registration & OTP Verification**
- User fills booking form (email, zip code, address)
- System initiates registration flow via Asgardeo
- User receives OTP and verifies email
- Registration email with PDF quotation is sent

### 2. **Quotation Acceptance**
- Success banner displays with quotation breakdown:
  - Standard Cleaning: $80.00
  - Bathroom Cleaning: $50.00
  - Special Discount: -$20.00
  - **Total: $150.00**
- User clicks "Accept & Proceed to Payment"

### 3. **Profile Form (NEW)**
- User is prompted to complete profile with:
  - First Name
  - Last Name
  - Mobile Number
- On submit, SCIM API is called to update user profile

### 4. **SCIM Profile Update**
The system performs the following:
1. Gets access token from Asgardeo auth context
2. Searches for user by username (email) via SCIM API
3. Updates user profile using SCIM PATCH operation
4. Updates: `name.givenName`, `name.familyName`, and `phoneNumbers`

**SCIM Endpoint:**
```
PATCH https://api.asgardeo.io/t/vihanga3/scim2/Users/{userId}
```

**Payload Example:**
```json
{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  "Operations": [{
    "op": "replace",
    "value": {
      "name": {
        "givenName": "John",
        "familyName": "Doe"
      },
      "phoneNumbers": [{
        "type": "mobile",
        "value": "+1 555-123-4567"
      }]
    }
  }]
}
```

### 5. **Payment Details**
- After successful profile update, payment form is displayed
- User enters:
  - Card Number (auto-formatted with spaces)
  - Cardholder Name
  - Expiry Date (auto-formatted MM/YY)
  - CVV

### 6. **Payment Submission & Sign-In**
- On payment submit, the system:
  1. Processes payment (currently simulated)
  2. Triggers Asgardeo sign-in with `login_hint=payment`
  3. User is authenticated and redirected to dashboard

**Sign-In with Login Hint:**
```typescript
authContext.signIn({
  login_hint: 'payment'
});
```

This parameter can be used by Asgardeo to:
- Track that user came from payment flow
- Apply custom authentication policies
- Trigger specific post-authentication actions

## Required Asgardeo Scopes

The application requires the following OAuth scopes:
- `openid` - Basic authentication
- `profile` - User profile information
- `email` - User email address
- `internal_user_mgt_view` - View user management data (SCIM read)
- `internal_user_mgt_update` - Update user management data (SCIM write)

**Configuration:**
```typescript
// src/config/asgardeo.config.ts
scope: ["openid", "profile", "email", "internal_user_mgt_view", "internal_user_mgt_update"]
```

## Important Notes

### Asgardeo Application Configuration
Make sure your Asgardeo application has:
1. **Authorized Redirect URLs:** `http://localhost:8080`
2. **Allowed Origins:** `http://localhost:8080`
3. **Access Token:** Grant type includes Authorization Code
4. **API Permissions:** User Management API scopes enabled

### SCIM API Authorization
- The SCIM API uses the OAuth access token from Asgardeo
- User must be authenticated to update their own profile
- Admin privileges may be required for updating other users

### Error Handling
The flow includes error handling for:
- Missing access token
- User not found in SCIM
- SCIM API failures
- Profile update failures

### Security Considerations
1. **Access Token:** Never expose tokens in client-side logs in production
2. **Profile Data:** Validate all user input before sending to SCIM
3. **Payment Data:** In production, use proper payment gateway (Stripe, PayPal, etc.)
4. **HTTPS:** Always use HTTPS in production for secure communication

## Testing the Flow

### Prerequisites
1. Asgardeo account with organization `vihanga3`
2. Application configured with correct client ID and scopes
3. User registered through the booking flow

### Test Steps
1. Start the application: `npm run dev`
2. Navigate to Booking tab
3. Fill registration form and verify OTP
4. Click "Accept & Proceed to Payment"
5. Fill profile form (first name, last name, mobile)
6. Submit profile (check console for SCIM API logs)
7. Fill payment form
8. Submit payment (triggers sign-in with login_hint)
9. Verify user is redirected to dashboard

### Verification
- Check browser console for SCIM API logs
- Verify profile update in Asgardeo console
- Confirm authentication with `login_hint=payment`

## Files Modified/Created

### New Files
- `src/components/molly-maid/ProfileFormPage.tsx` - Profile form component
- `src/services/scimService.ts` - SCIM API service
- `docs/PAYMENT_FLOW.md` - This documentation

### Modified Files
- `src/pages/molly-maid-app.tsx` - Added profile form state and handlers
- `src/config/asgardeo.config.ts` - Added SCIM scopes
- `src/components/molly-maid/BookingPage.tsx` - Added quotation summary

## Troubleshooting

### "No access token available"
- Ensure user completed OTP verification
- Check that Asgardeo session is active
- Verify token is stored in sessionStorage

### "User not found"
- Verify email used in booking form matches Asgardeo username
- Check SCIM search filter syntax
- Ensure user was created through registration flow

### "Failed to update profile"
- Check Asgardeo application has required API scopes
- Verify access token has correct permissions
- Check SCIM endpoint URL and organization name

### CORS Errors
- Ensure Asgardeo application has correct allowed origins
- Check browser console for detailed CORS error messages
