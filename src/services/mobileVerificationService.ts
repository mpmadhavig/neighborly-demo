/**
 * Mobile Verification Service
 * 
 * Handles mobile number verification using Asgardeo's identity user API.
 * This is used after updating a user's mobile number to verify ownership.
 */

const ORG_NAME = 'vihanga3';
const BASE_URL = `https://api.asgardeo.io/t/${ORG_NAME}/api/identity/user/v1.0`;

/**
 * Validates a verification code sent to the user's mobile number
 * @param code - The verification code received by the user
 * @param accessToken - Access token for authorization
 */
export const validateMobileVerificationCode = async (
  code: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/me/validate-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        properties: []
      }),
    });

    // Success is indicated by 202 Accepted status
    if (response.status === 202) {
      return { success: true };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Mobile verification API error:', errorData);
      
      if (response.status === 400) {
        return { success: false, error: 'Invalid verification code' };
      }
      
      throw new Error(
        `Failed to validate code: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json().catch(() => ({}));
    console.log('✅ Mobile verification code validated successfully:', data);

    return { success: true };
  } catch (error) {
    console.error('Error validating mobile verification code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Resends the verification code to the user's mobile number
 * @param accessToken - Access token for authorization
 */
export const resendMobileVerificationCode = async (
  accessToken: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/me/resend-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: [
          {
            key: 'RecoveryScenario',
            value: 'MOBILE_VERIFICATION_ON_UPDATE'
          }
        ]
      }),
    });

    // Success is indicated by 201 Created status
    if (response.status === 201) {
      console.log('✅ Verification code resent successfully (201)');
      return { success: true };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Resend code API error:', errorData);
      throw new Error(
        `Failed to resend code: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json().catch(() => ({}));
    console.log('✅ Verification code resent successfully:', data);

    return { success: true };
  } catch (error) {
    console.error('Error resending mobile verification code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
