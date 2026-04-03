const NETWORK_ERROR_CODES = new Set([
  'ERR_NETWORK',
  'ECONNABORTED',
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
]);

const warnedApiNames = new Set();

function extractApiData(response) {
  return response?.data?.data ?? response?.data;
}

function hasNetworkFailureMessage(error) {
  const message = String(error?.message ?? '').toLowerCase();

  return (
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    message.includes('timeout') ||
    message.includes('load failed')
  );
}

function isEndpointNotImplemented(error) {
  const status = error?.response?.status;
  return status === 404 || status === 405;
}

function isBackendUnavailable(error) {
  if (!error) return false;
  if (isEndpointNotImplemented(error)) return true;
  if (error.response) return false;

  if (NETWORK_ERROR_CODES.has(error.code)) return true;
  return hasNetworkFailureMessage(error);
}

function warnFallbackOnce(apiName, error) {
  if (!import.meta.env.DEV) return;
  if (!apiName || warnedApiNames.has(apiName)) return;

  warnedApiNames.add(apiName);
  console.warn(
    `[api-fallback] Backend unavailable. Using mock data for "${apiName}".`,
    error
  );
}

export async function requestWithMockFallback({ apiName, request, fallback }) {
  try {
    const response = await request();
    return extractApiData(response);
  } catch (error) {
    if (!isBackendUnavailable(error)) {
      throw error;
    }

    warnFallbackOnce(apiName, error);
    return fallback();
  }
}
