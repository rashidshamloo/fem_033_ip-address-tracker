export interface RequestInitTimeout extends RequestInit {
  timeout?: number;
}

const fetchTimeout = async (
  res: RequestInfo | URL,
  options: RequestInitTimeout | undefined = {}
) => {
  // get timeout
  const { timeout, ...fetchOptions } = options;
  // if timeout is set
  if (timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () =>
        controller.abort(
          new DOMException(
            `signal timed out (${options.timeout}ms)`,
            'TimeoutError'
          )
        ),
      timeout
    );
    const fetchSignal = options.signal;
    // if fetch request already has a signal
    if (fetchSignal) {
      // if signal is already aborted, abort timeout signal
      if (fetchSignal.aborted) {
        controller.abort(fetchSignal.reason);
      }
      // else add on signal abort: abort timeout signal
      fetchSignal.addEventListener('abort', () => {
        controller.abort(fetchSignal.reason);
        clearTimeout(timeoutId);
      });
    }
    // options with timeout signal
    const fetchTimeoutOptions: RequestInit = {
      ...fetchOptions,
      signal: controller.signal,
    };
    // do fetch
    let fetchRes;
    try {
      fetchRes = await fetch(res, fetchTimeoutOptions);
    } catch (error: any) {
      // clear the timeout on error
      clearTimeout(timeoutId);
      throw error;
    }
    return fetchRes;
  }
  // if timeout is not set, do regular fetch
  else {
    const fetchRes = await fetch(res, fetchOptions);
    return fetchRes;
  }
};

export default fetchTimeout;
