export async function dispatchSovereignCommand(prompt: string, history: any[], coordinates: any, token: string | null) {
  const activeToken = token || 'guest-bypass-token';

  let response: Response;
  try {
    response = await fetch('/api/sovereign/cognition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}` 
      },
      body: JSON.stringify({
        prompt,
        chatHistory: history,
        userLocationContext: coordinates
      })
    });
  } catch (error) {
    return {
      message: "Interface decoupled from backend loops. System stabilizing.",
      data: {},
      status: "STANDBY"
    };
  }

  if (!response.ok) {
    const status = response.status;
    let errorMessage = `Unexpected server response (Status: ${status}).`;
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch (_) {
      // Ignore JSON parse errors for non-JSON responses
    }

    if (status === 429) {
      throw new Error("I'm currently receiving too many requests. My cognitive architecture is slightly over capacity—please give me a moment to recalibrate and try your request again.");
    } else if (status === 401 || status === 403) {
      throw new Error("My security protocols have denied access. Please ensure your session is fully authenticated.");
    } else if (status >= 500) {
      return {
        message: "Interface decoupled from backend loops. System stabilizing.",
        data: {},
        status: "STANDBY"
      };
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}
