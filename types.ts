//file that contains the used types in this project

//Redux Interfaces

//this is how the user state looks like
export interface UserState {
  auth: object;
  data: { firstname: string; name: string; groups: string[] };
  groups: object[];
}
export interface UserAuthState {
  auth: string;
  data: { firstname: string; name: string; groups: string[] };
}

export interface Group {
  id: string;
  name: string;
  description: string;
  roles: object;
  myRole: string;
}
