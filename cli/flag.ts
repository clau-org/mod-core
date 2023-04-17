export interface Flag {
  key: string;
  description: string;
  //   options?: string[];
  required?: boolean;
}
export interface defineFlagOptions {
  key: string;
  description?: string;
  required?: boolean;
  //   options?: string[];
}
export const defineFlag = (options: defineFlagOptions): Flag => {
  const { key, description, required } = options;
  return {
    key,
    description: description ?? key,
    // options,
    required,
  };
};
