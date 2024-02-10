export interface Login {
  login: string,
  password: string,
}

export interface User {
  position?: number;
  _id?: string
  lastName?: string;
  firstName?: number;
  post?: string;
  phone?: string;
  hotels?: string[];
  hotel?: string;
  edit?: string,
  login?: string,
  password?: string
}

export interface Group {

}

export interface Floor {
  numberFloor: number,
  rooms: Room[]
}

export interface Hotel {
  _id?: string,
  title: string,
  floors: number,
  rooms?: Room[]
  roomsStr?: string[],
  imgSrc?: string,
  quantityRooms?: number,
  position?: number
  personal?: string[]
}

export interface Post {
  _id?: string,
  position?: number,
  title: string
}

export interface Room {
  _id?: string,
  numberRoom?: number,
  floor?: number,
  status?: string,
  comments?: string[],
  roomsStr?: string[],
  hotelTitle?: string,
  hotel?: string
}
