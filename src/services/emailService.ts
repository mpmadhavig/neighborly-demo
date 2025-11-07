const EMAIL_API_BASE_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001';

export const sendRegistrationEmail = async (email: string, address: string, zipCode: string) => {
  try {
    const response = await fetch(`${EMAIL_API_BASE_URL}/api/send-registration-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        address,
        zipCode,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending registration email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
