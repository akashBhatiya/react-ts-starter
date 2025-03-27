export interface RouteType {
    path: string;
    element: React.ComponentType<any>;
    isPrivate?: boolean;
    children?: RouteType[];
}


export interface IUser {
    id: string;
    email: string;
    // Add other user properties as needed
}