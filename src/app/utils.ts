export const getMessageFromBackendError = (message: string | { [key: string]: string[] } = '') => {
  if (typeof message === 'string') {
    return message;
  }

  return Object.keys(message).reduce((acc, next) => {
    return `${acc}
      ${message[next].join('\n')}
    `;
  }, '');
};
