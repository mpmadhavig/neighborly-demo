import { useAuthContext } from '@asgardeo/auth-react';

export interface FormData {
  email: string;
  zipCode: string;
  address: string;
}

interface FlowComponent {
  id: string;
  type: string;
  variant?: string;
  actionId?: string;
  components?: FlowComponent[];
  config?: {
    identifier?: string;
    text?: string;
    type?: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
  };
}

export interface FlowResponse {
  flowId: string;
  flowType: string;
  flowStatus: string;
  type: string;
  data: {
    components: FlowComponent[];
  };
}

export const useAsgardeoApi = () => {
  const authContext = useAuthContext();

  const extractFieldIds = (response: FlowResponse) => {
    const formComponent = response.data.components.find(
      (comp) => comp.type === 'FORM'
    );

    if (!formComponent || !formComponent.components) {
      throw new Error('Form component not found in response');
    }

    const submitButton = formComponent.components.find(
      (comp) => comp.type === 'BUTTON' && comp.variant === 'PRIMARY'
    );

    if (!submitButton) {
      throw new Error('Required form fields not found');
    }

    return {
      buttonActionId: submitButton.actionId || submitButton.id,
    };
  };

  const initiateRegistrationFlow = async () => {
    
    // Use authenticated request if context is available
    try {
      const response = await authContext.httpRequest({
        url: 'https://api.asgardeo.io/t/vihanga3/api/server/v1/flow/execute',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          flowType: 'REGISTRATION',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error initiating registration flow:', error);
      throw error;
    }
  };

  const submitRegistrationForm = async (flowResponse: FlowResponse, formData: FormData) => {
    
    try {
      const flowId = flowResponse.flowId;
      const { buttonActionId } = extractFieldIds(flowResponse);

      const inputs = {
        "http://wso2.org/claims/emailaddress": formData.email,
        "http://wso2.org/claims/postalcode": formData.zipCode,
        "http://wso2.org/claims/streetaddress": formData.address,
      };

      // Use authenticated request if context is available
      const response = await authContext.httpRequest({
        url: 'https://api.asgardeo.io/t/vihanga3/api/server/v1/flow/execute',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          flowId,
          actionId: buttonActionId,
          inputs,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error submitting registration form:', error);
      throw error;
    }
  };

  const verifyOtp = async (flowId: string, actionId: string, otpValue: string) => {
    try {
      const response = await authContext.httpRequest({
        url: 'https://api.asgardeo.io/t/vihanga3/api/server/v1/flow/execute',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          flowId,
          actionId,
          inputs: {
            otp: otpValue,
          },
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const completeAuthentication = async (flowId: string, userAssertion: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('userAssertion', userAssertion);
      formData.append('sessionDataKey', flowId);

      const response = await fetch('https://api.asgardeo.io/t/vihanga3/commonauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      return response;
    } catch (error) {
      console.error('Error completing authentication:', error);
      throw error;
    }
  };

  const initiateOAuthFlow = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('client_id', 'PboRLJXwnrfYcrmw92mnWjH9RnUa');
      formData.append('response_type', 'code');
      formData.append('redirect_uri', 'http://localhost:8080');
      formData.append('scope', 'openid');
      formData.append('response_mode', 'direct');

      const response = await fetch('https://api.asgardeo.io/t/vihanga3/oauth2/authorize', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic UGJvUkxKWHducmZZY3JtdzkybW5Xakg5Um5VYTpDRG94dFRUWUNJTjJjWnpudERLVzg2b2JQRVpPUGhBZWhtSnRqNWhkNUxBYQ==',
        },
        body: formData.toString(),
      });

      const result = await response.json();
      console.log('OAuth flow initiated:', result);
      
      // Extract flowId from the response
      return result.flowId;
    } catch (error) {
      console.error('Error initiating OAuth flow:', error);
      throw error;
    }
  };

  return {
    initiateRegistrationFlow,
    submitRegistrationForm,
    verifyOtp,
    completeAuthentication,
    initiateOAuthFlow,
  };
};
