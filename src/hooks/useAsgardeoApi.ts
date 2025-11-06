import { useAuthContext } from '@asgardeo/auth-react';

export const useAsgardeoApi = () => {
  const { httpRequest } = useAuthContext();

  const initiateRegistrationFlow = async () => {
    try {
      const response = await httpRequest({
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

  return {
    initiateRegistrationFlow,
  };
};
