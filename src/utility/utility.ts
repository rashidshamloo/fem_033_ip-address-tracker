// fetch with timeout
const fetchTimeout = async (
  res: RequestInfo | URL,
  options: RequestInit | undefined = {}
) => {
  // 4 seconds limit
  const limit = 4000;

  const controller = new AbortController();
  const timououtId = setTimeout(() => controller.abort(), limit);
  const fetchRes = await fetch(res, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(timououtId);
  return fetchRes;
};

export default fetchTimeout;
