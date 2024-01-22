export interface Login {
  login: string,
  password: string,
}

export interface User {
  name: string;
  position: number;
  post: string;
  phone: string;
  hotel?: string;
  edit: String
}

export interface Group {

}
export interface Floor {
  numberFloor: number,
  rooms: number []
}
