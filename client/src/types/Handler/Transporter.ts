import { Handler } from 'types/index';

export interface Transporter extends Handler {
  order: number;
  manifest?: number;
}
