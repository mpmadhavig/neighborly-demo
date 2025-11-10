import { BasicUserInfo } from '@asgardeo/auth-react';

/**
 * SCIM 2.0 User Profile Service
 * 
 * Using /scim2/Me endpoint to update the currently authenticated user's profile.
 * This endpoint works from the browser as it uses the user's own access token.
 * 
 * REQUIREMENTS:
 * - User must be authenticated
 * - Access token must include 'internal_login' scope
 * - Access token is automatically scoped to the authenticated user
 * 
 * CURRENT BEHAVIOR:
 * - Profile data is collected and stored in application state
 * - SCIM update uses /Me endpoint (updates current user)
 * - User flow continues to payment regardless of outcome
 * - Detailed logging provided in browser console
 */

export interface ScimUserProfile {
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

export interface ScimUpdatePayload {
  schemas: string[];
  Operations: Array<{
    op: string;
    value: {
      name?: {
        givenName: string;
        familyName: string;
      };
      phoneNumbers?: Array<{
        type: string;
        value: string;
      }>;
    };
  }>;
}

/**
 * Updates the currently authenticated user's profile using SCIM 2.0 /Me endpoint
 * This endpoint works from the browser as it uses the user's own access token
 * @param profileData - Profile data to update
 * @param accessToken - Access token for authorization (must include 'internal_login' scope)
 */
export const updateMyProfile = async (
  profileData: ScimUserProfile,
  accessToken: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const orgName = 'vihanga3';
    
    // Use /Me endpoint to update current user's profile
    const scimMeEndpoint = `https://api.asgardeo.io/t/${orgName}/scim2/Me`;

    const payload = {
      schemas: [
        'urn:ietf:params:scim:api:messages:2.0:PatchOp'
      ],
      Operations: [
        {
          op: 'replace',
          value: {
            name: {
              givenName: profileData.firstName,
              familyName: profileData.lastName,
            },
            phoneNumbers: [
              {
                type: 'mobile',
                value: profileData.mobileNumber,
              },
            ],
          },
        },
      ],
    };

    console.log('Updating current user profile via SCIM /Me API:', {
      endpoint: scimMeEndpoint,
      payload,
      mobileNumber: profileData.mobileNumber, // Log the exact mobile number being sent
    });

    const response = await fetch(scimMeEndpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/scim+json',
        'Accept': 'application/scim+json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('SCIM /Me API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('SCIM /Me API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        mobileNumber: profileData.mobileNumber,
      });
      throw new Error(
        `Failed to update profile: ${response.status} ${response.statusText}. Mobile: ${profileData.mobileNumber}`
      );
    }

    const data = await response.json();
    console.log('✅ User profile updated successfully via /Me endpoint:', data);

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile via /Me:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Updates user profile using SCIM 2.0 API
 * @deprecated Use updateMyProfile instead for authenticated users
 * @param userId - The user ID from Asgardeo
 * @param profileData - Profile data to update
 * @param accessToken - Access token for authorization
 */
export const updateUserProfile = async (
  userId: string,
  profileData: ScimUserProfile,
  accessToken: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the organization name from Asgardeo config
    const orgName = 'vihanga3';
    
    const scimEndpoint = `https://api.asgardeo.io/t/${orgName}/scim2/Users/${userId}`;

    const payload: ScimUpdatePayload = {
      schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
      Operations: [
        {
          op: 'replace',
          value: {
            name: {
              givenName: profileData.firstName,
              familyName: profileData.lastName,
            },
            phoneNumbers: [
              {
                type: 'mobile',
                value: profileData.mobileNumber,
              },
            ],
          },
        },
      ],
    };

    console.log('Updating user profile via SCIM API:', {
      userId,
      endpoint: scimEndpoint,
      payload,
    });

    const response = await fetch(scimEndpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('SCIM API error:', errorData);
      throw new Error(
        `Failed to update profile: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('✅ User profile updated successfully:', data);

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Alternative: Update user profile using username instead of userId
 * @deprecated Use updateMyProfile instead for authenticated users (uses /Me endpoint)
 * 
 * NOTE: This function searches for users which may not work from browser due to CORS.
 * For authenticated users, use updateMyProfile() which uses the /Me endpoint.
 */
export const updateUserProfileByUsername = async (
  username: string,
  profileData: ScimUserProfile,
  accessToken: string
): Promise<{ success: boolean; error?: string; userId?: string }> => {
  try {
    const orgName = 'vihanga3';
    
    // First, get the user ID by filtering with username
    const searchEndpoint = `https://api.asgardeo.io/t/${orgName}/scim2/Users?filter=userName eq "${username}"`;

    console.log('⚠️ Note: Consider using updateMyProfile() for authenticated users');
    console.log('Attempting to search for user:', username);

    const searchResponse = await fetch(searchEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!searchResponse.ok) {
      throw new Error(`Failed to search user: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.Resources || searchData.Resources.length === 0) {
      throw new Error('User not found');
    }

    const userId = searchData.Resources[0].id;
    console.log('Found user ID:', userId);

    // Now update the user profile
    return await updateUserProfile(userId, profileData, accessToken);
  } catch (error) {
    console.warn('⚠️ User search/update failed');
    console.error('Error details:', error);
    
    // Check if it's a CORS error
    const isCorsError = error instanceof TypeError && error.message.includes('Failed to fetch');
    
    return {
      success: false,
      error: isCorsError 
        ? 'SCIM API is not accessible from browser due to CORS restrictions. Use updateMyProfile() instead.'
        : (error instanceof Error ? error.message : 'Unknown error'),
    };
  }
};
