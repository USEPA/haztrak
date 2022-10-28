// utility function to show HtCard.Spinner for a second

/**
 * sleepDemo
 * @param {number} ms - number of milliseconds before the fake async call is resolved
 */
function sleepDemo(ms: number): Promise<{}> {
  const env = process.env.REACT_APP_HT_ENV;
  if (typeof env === 'string' && env.toUpperCase() === 'DEVELOPMENT') {
    return new Promise<{}>((resolve) => setTimeout(resolve, ms));
  } else {
    return new Promise<{}>((resolve) => setTimeout(resolve, 0));
  }
}

export { sleepDemo };
