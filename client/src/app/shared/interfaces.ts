export interface Login {
  login: string,
  password: string,
}

export interface User {
  position?: number;
  _id?: string
  lastName: string;
  firstName: number;
  post: string;
  phone: string;
  hotels?: string;
  edit?: string,
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
  _id?:string,
  title: string,
  floors: number,
  rooms: string[],
  quantityRooms?: number,
  position?:number
  personal?: string[]
}

export interface Post {
  _id?: string,
  position?: number,
  title: string
}

export interface Room{
  numberRoom: number,
  floor: number,
  status?: string,
  comments?: string[],
  hotel: string
}
