import axios from 'axios';

export class Admin {
    //<roles>
    static getRoles(roleNameFilter: string) {
        var body = {
            roleName: roleNameFilter
        };
        return axios.post("Auth/GetRoles", body);
    }
    static insertRole(roleName: string) {
        var body = {
            roleName: roleName
        };
        return axios.post("Auth/InsertRole", body);
    }
    static updateRole(roleId: string, roleName: string) {
        var body = {
            roleID: roleId,
            roleName: roleName
        };
        return axios.post("Auth/UpdateRole", body);
    }
    static deleteRole(roleId: string) {
        var body = {
            roleID: roleId
        };
        return axios.post("Auth/DeleteRole", body);
    }
    static addClaimToRole(roleId: string, claimType: string, claimValue: string) {
        let body = {
            roleID: roleId,
            claimType: claimType,
            claimValue: claimValue
        };
        return axios.post("Auth/AddClaimToRole", body);
    }
    static removeClaimFromRole(roleId: string, claimType: string, claimValue: string) {
        let body = {
            roleID: roleId,
            claimType: claimType,
            claimValue: claimValue
        };
        return axios.post("Auth/RemoveClaimFromRole", body);
    }
    static getAvailableClaimsForRole(roleId: string) {
        let body = {
            roleID: roleId
        };
        return axios.post("Auth/GetAvailableClaimsForRole", body);
    }
    //</roles>
    //<users>
    static getUsers(usernameFilter: string, emailFilter: string) {
        let body = {
            username: usernameFilter,
            email: emailFilter
        };
        return axios.post("Auth/GetUsers", body);
    }
    static insertUser(userName: string, email: string, password: string, confirmPassword: string) {
        let body = {
            userName: userName,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        };
        return axios.post("Auth/InsertUser", body);
    }
    static updateUser(userID: string, userName: string, email: string, password: string) {
        let body = {
            userID: userID,
            userName: userName,
            email: email,
            password: password
        };
        return axios.post('Auth/UpdateUser', body);
    }
    static deleteUser(userId: string) {
        let body = {
            userID: userId
        };
        return axios.post("Auth/DeleteUser", body);
    }
    static addClaimToUser(userId: string, claimType: string, claimValue: string) {
        let body = {
            userId: userId,
            claimType: claimType,
            claimValue: claimValue
        };
        return axios.post("Auth/AddClaimToUser", body);
    }
    static removeClaimFromUser(userId: string, claimType: string, claimValue: string) {
        let body = {
            userId: userId,
            claimType: claimType,
            claimValue: claimValue
        };
        return axios.post("Auth/RemoveClaimFromUser", body);
    }
    static getAvailableClaimsForUser(userId: string) {
        let body = {
            userID: userId
        };
        return axios.post("Auth/GetAvailableClaimsForUser", body);
    }
    static getAvailableRolesForUser(userId: string) {
        let body = {
            userID: userId
        };
        return axios.post("Auth/GetAvailableRolesForUser", body);
    }
    static addRoleToUser(userId: string, roleName: string) {
        let body = {
            userID: userId,
            roleName: roleName
        };
        return axios.post("Auth/AddRoleToUser", body);
    }
    static removeRoleFromUser(userId: string, roleName: string) {
        let body = {
            userID: userId,
            roleName: roleName
        };
        return axios.post("Auth/RemoveRoleFromUser", body);
    }
    //</users>
}