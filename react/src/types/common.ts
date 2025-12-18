export interface Timestamps {
  createdAt: string,
  updatedAt: string,
}

type TNF = 0x0 | 0x01 | 0x02 | 0x03 | 0x04 | 0x05 | 0x06 | 0x07;

export interface NdefRecord {
  id?: number[];
  tnf: TNF;
  type: number[] | string;
  payload: any[];
}

export interface TagEvent {
  ndefMessage: NdefRecord[];
  maxSize?: number;
  type?: string;
  techTypes?: string[];
  id?: string;
}