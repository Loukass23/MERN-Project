export type DuckType = {
  id?: number;
  _id: string;
  name: string;
  image: string;
  breed: string;
  mood: string;
  gender: string;
  likes: number;
  isRubberDuck: boolean;
  uploadedAt: string;
};

export type DuckListType = DuckType[];

export type DuckOptions = {
  breeds: string[];
  moods: string[];
  genders: string[];
};

export type NewDuckType = {
  name: string;
  image: string;
  breed?: string;
  mood?: string;
  gender?: string;
  isRubberDuck?: boolean;
};

export type User = {
  id: string | number;
  username: string;
  email: string;
  avatar?: string;
};
