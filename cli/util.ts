export function validateOption(option: string, options: string[]) {
  const isValidOption = options.includes(option);
  if (isValidOption) return;

  const message = `
    
      Invalid option: ${option}
      Options: ${options}
      `;

  throw new Error(message);
}
