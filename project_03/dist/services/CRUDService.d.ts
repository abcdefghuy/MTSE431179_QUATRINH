interface UserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    gender: string;
    roleId: string;
    id?: string;
}
declare const _default: {
    createNewUser: (data: UserData) => Promise<string>;
    getAllUsers: () => Promise<any[]>;
    getUserById: (userId: string) => Promise<any>;
    updateUserData: (data: UserData) => Promise<any[] | string>;
    deleteUserById: (userId: string) => Promise<string>;
};
export default _default;
