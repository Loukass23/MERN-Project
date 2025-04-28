export type DuckType = {
  id: number;
  name: string;
  image: string;
};
export type DuckListType = DuckType[];

export type User = {
  id: string | number;
  username: string;
  email: string;
  avatar?: string;
};
