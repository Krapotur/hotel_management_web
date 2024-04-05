export interface Login {
  login: string,
  password: string,
}

export interface User {
  _id?: string,
  status?: boolean,
  position?: number;
  lastName?: string;
  firstName?: string;
  post?: string;
  phone?: string;
  hotels?: string[];
  hotel?: string;
  edit?: string,
  login?: string,
  password?: string
}

export interface House {
  _id?: string,
  status?: boolean,
  position?: number,
  statusReady?: string,
  title?: string,
  floors?: number,
  imgSrc?: string,
  personal?: string[],
  tasks?: string,
  comments?: string
}

export interface Floor {
  numberFloor: number,
  rooms: Room[]
}

export interface Hotel {
  _id?: string,
  status?: boolean,
  title: string,
  floors?: number,
  rooms?: Room[]
  roomsStr?: string[],
  imgSrc?: string,
  quantityRooms?: number,
  position?: number,
  personal?: string[],
  percentReadyRooms?: number,
  notReadyRooms?: number,
  inProcessRooms?: number
}

export interface Post {
  _id?: string,
  position?: number,
  title: string
}

export interface Room {
  _id?: string,
  status?: string,
  numberRoom?: number,
  floor?: number,
  tasks?:string[],
  comments?: string,
  roomsStr?: string[],
  hotelTitle?: string,
  hotel?: string
}

export interface AuthToken {
  token: string,
  post: string,
  user: string
}
