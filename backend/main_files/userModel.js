import {
    emailFetchDatabase,
    getAllUsersDatabase,
    loginDatabase,
    passwordChangeDatabase,
    registerDatabase,
    productsFetchDatabase,
    userDataChangeDatabase,
    backupCodesDatabase,
    getUserIdDatabase,
    markBackupCodeUsedDatabase, getAllBackupCodesDatabase, getUserBackupCodeDatabase
} from "./databaseQueries.js";


export class UserModel {
    async modelLogin(hashedPassword, username) {
        return await loginDatabase(hashedPassword, username);
    };

    async modelRegister(hashedPassword, username, email) {
        return await registerDatabase(hashedPassword, username, email);
    };

    async modelEmailFetch(username) {
        return await emailFetchDatabase(username);
    }

    async modelPasswordChange(hashedPassword, username) {
        return await passwordChangeDatabase(hashedPassword, username);
    }

    async modelGetAllUsers() {
        return await getAllUsersDatabase();
    }

    async modelProductsFetch() {
        return await productsFetchDatabase();
    }

    async modelUserDataChange(values, updates) {
        return await userDataChangeDatabase(values, updates);
    }

    async modelBackupCodes(newUserId, codeHash) {
        return await backupCodesDatabase(newUserId, codeHash);
    }

    async modelGetUserId(username) {
        return await getUserIdDatabase(username);
    }

    async modelGetUserBackupCode(user_id){
        return await getUserBackupCodeDatabase(user_id);
    }

    async modelMarkBackupCodeUsed(codeId) {
        return await markBackupCodeUsedDatabase(codeId);
    }

    async modelGetAllBackupCodes(){
        return await getAllBackupCodesDatabase()
    }
}