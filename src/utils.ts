export type Indexable = { [index: string]: any };

export interface Contract {
  username: string;
  password: string;
  nodeName: string;
  requestTimeout?: number;
  connectionTTL?: number;
  callbackURL?: string;
}
