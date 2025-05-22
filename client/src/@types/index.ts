export type DuckType = {
  _id: string;
  name: string;
  image: string;
  gender?: string;
  breed?: string;
  isRubberDuck: boolean;
  description?: string;
  likes: number;
  likedBy: string[];
  uploadedAt: string;
  uploadedBy: string;
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
  id: string;
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
};

export type CommentType = {
  _id: string;
  content: string;
  duck: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  likes: number;
  likedBy: string[];
  parentComment: string | null;
  replies: CommentType[];
  createdAt: string;
  updatedAt: string;
};

export type NewCommentType = {
  content: string;
  duckId: string;
  parentCommentId?: string;
};

export interface PaginatedDuckResponse {
  ducks: DuckType[];
  pagination: {
    totalDucks: number;
    totalPages: number;
    currentPage: number;
    ducksPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
