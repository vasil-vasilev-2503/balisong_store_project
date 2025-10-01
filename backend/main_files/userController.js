import {UserModel} from "./UserModel.js";

const userModel = new UserModel();


export class UserController {
    async controllerLogin(hashedPassword, username){
        return await userModel.modelLogin(hashedPassword, username);
    };

    async controllerRegister(hashedPassword, username, email){
        return await userModel.modelRegister(hashedPassword, username, email);
    };

    async controllerEmailFetch(username) {
        return await userModel.modelEmailFetch(username);
    }

    async controllerPasswordChange(hashedPassword, username){
        return await userModel.modelPasswordChange(hashedPassword, username);
    };

    async controllerGetAllUsers() {
        return await userModel.modelGetAllUsers();
    }

    async controllerProductsFetch() {
        return await userModel.modelProductsFetch();
    }

    async controllerUserDataChange(values, updates){
        return await userModel.modelUserDataChange(values, updates);
    }

    async controllerBackupCodes(newUserId, codeHash) {
        return await userModel.modelBackupCodes(newUserId, codeHash);
    }

    async controllerGetUserId(username) {
        return await userModel.modelGetUserId(username);
    }

    async controllerGetUserBackupCode(user_id) {
        return await userModel.modelGetUserBackupCode(user_id);
    }

    async controllerMarkBackupCodeUsed(codeId) {
        return await userModel.modelMarkBackupCodeUsed(codeId);
    }

    async controllerGetAllBackupCodes() {
        return await userModel.modelGetAllBackupCodes();
    }
}