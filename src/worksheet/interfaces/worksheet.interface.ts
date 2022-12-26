import { Document } from 'mongoose';

export class Worksheet {
  readonly caption: string;
  readonly legends: [];
  readonly isOpen: boolean;
  readonly user: string;
}
