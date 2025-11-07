# SCIM API Limitation - Browser CORS Issue

## Current Situation

The Molly Maid application collects user profile data (first name, last name, mobile number) before proceeding to payment. This data is intended to be saved to Asgardeo user profiles via the SCIM 2.0 API.

**However, SCIM API calls from the browser are blocked due to CORS restrictions.**

## Why This Happens

The Asgardeo SCIM API endpoint (`https://api.asgardeo.io/t/{org}/scim2/Users`) does not include the necessary CORS headers (`Access-Control-Allow-Origin`) to permit requests from browser applications. This is a security measure - SCIM APIs are designed to be called from backend services, not directly from browsers.

## Current Behavior

✅ **User experience is NOT affected:**
- Profile form displays and collects data normally
- Data is stored in React application state
- User proceeds to payment without interruption
- No error messages are shown to users

⚠️ **What happens behind the scenes:**
- SCIM update attempts fail with CORS error (expected)
- Detailed logs are written to browser console
- Profile data remains available in the application context
- User profile in Asgardeo is NOT updated

## Console Output You'll See

When a user submits their profile, you'll see logs like:

```
⚠️ Note: SCIM API calls from browser will fail due to CORS restrictions
Attempting to search for user: user@example.com
⚠️ SCIM API call failed (expected due to CORS when called from browser)
⚠️ To enable profile updates, implement a backend proxy for SCIM API calls
💡 Profile data has been collected and will be available in the application context
💡 To persist this data to Asgardeo, implement a backend API to proxy SCIM requests
Proceeding to payment page with profile data: {firstName: "John", lastName: "Doe", ...}
```

## Production Solution

To actually save profile data to Asgardeo, you need to implement a **backend proxy**:

### Option 1: Node.js/Express Backend

```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

app.post('/api/update-profile', async (req, res) => {
  const { username, firstName, lastName, mobileNumber, accessToken } = req.body;
  
  try {
    // Search for user
    const searchResponse = await fetch(
      `https://api.asgardeo.io/t/vihanga3/scim2/Users?filter=userName eq "${username}"`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const searchData = await searchResponse.json();
    const userId = searchData.Resources[0].id;
    
    // Update user
    const updateResponse = await fetch(
      `https://api.asgardeo.io/t/vihanga3/scim2/Users/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
          Operations: [{
            op: 'replace',
            value: {
              name: {
                givenName: firstName,
                familyName: lastName
              },
              phoneNumbers: [{
                type: 'mobile',
                value: mobileNumber
              }]
            }
          }]
        })
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => console.log('Backend running on port 3001'));
```

Then update your React app to call this backend:

```typescript
// In scimService.ts
const result = await fetch('http://localhost:3001/api/update-profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    mobileNumber: profileData.mobileNumber,
    accessToken
  })
});
```

### Option 2: Serverless Functions

Use Vercel Functions, AWS Lambda, or similar to create a serverless endpoint that proxies SCIM requests.

### Option 3: Use Asgardeo Organizations API

Consider using Asgardeo's newer APIs that may have better CORS support, or handle profile updates during the authentication flow itself.

## For Demo Purposes

For a demonstration or proof-of-concept, the current implementation is **acceptable**:
- ✅ Shows the complete user flow
- ✅ Collects all necessary data
- ✅ Demonstrates integration points
- ⚠️ Just doesn't persist to Asgardeo (logged clearly in console)

## Next Steps

If you need to persist profile data to Asgardeo:

1. **Choose a backend solution** (Express, serverless, etc.)
2. **Create a proxy endpoint** that accepts profile data
3. **Make SCIM calls from your backend** (no CORS issues)
4. **Update `scimService.ts`** to call your backend instead of Asgardeo directly
5. **Test end-to-end** to confirm profile updates work

## Questions?

This is a common limitation when working with APIs that don't support CORS. The solution is always to proxy requests through your own backend.
