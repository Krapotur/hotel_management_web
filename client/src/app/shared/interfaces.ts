export interface Login {
  login: string,
  password: string,
}

export interface User {
  _id?: string
  lastName: string;
  firstName: number;
  position?: number;
  post: string;
  phone: string;
  hotels?: string;
  edit?: string,
  login: string,
  password: string
}

export interface UserUser {
  lastName: string;
  firstName: number;
  post: string;
  phone: string;
  hotels?: string[];
  login: string,
  password: string
}

export interface Group {

}

export interface Floor {
  numberFloor: number,
  rooms: number []
}

export interface Hotel {
  title: string,
  quantityFloors: number,
  quantityRooms: number,
  floors: Floor[],
  image: File
}

export interface Post {
  _id?: string,
  position?: number,
  title: string
}
