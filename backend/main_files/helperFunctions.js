import crypto from "crypto";
import {getAllBackupCodesDatabase} from "./databaseQueries.js";
import {UserController} from "./userController.js";

const userController = new UserController();

export function passwordValidation(password) {
    return password.length >= 7;
}


export function generateBackupCode() {
    const code = crypto.randomBytes(8).toString("hex");
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const backupCodes = userController.controllerGetAllBackupCodes();
    let codeFlag = 0;
    if(backupCodes === null || backupCodes === undefined) {
        return {
            result:0,
            message: "No backup codes in the database!"
        };
    }
    for (let i = 0; i < backupCodes.length; i++) {
        if(backupCodes[i].code_hash === codeHash) {
            codeFlag = 1;
        }
    }
    if(codeFlag === 1) {
        return {
            result:0,
            message: "The same backup code already exist in the database!"
        };
    }
    return code;
}