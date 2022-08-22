import { resolve } from 'path';

export const getEnvPath = (dest: string): string => {
  const env: string | undefined = process.env.NODE_ENV;
  const fileName: string = env ? `.${env}.env` : '.env';
  const filePath: string = resolve(`${dest}/${fileName}`);
  return filePath;
};
