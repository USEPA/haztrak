import { Handler } from 'types';

export interface Transporter extends Handler {
  order: number;
  manifest: number;
}
