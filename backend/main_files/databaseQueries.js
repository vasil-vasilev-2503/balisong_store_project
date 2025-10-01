import {db} from '../server.js'



export async function loginDatabase(hashedPassword, username) {
    const [rows] = await db.query('SELECT password FROM accounts WHERE username = ?', [username]);
    if (!rows || rows.length === 0) {
        console.log(`Login failed: username "${username}" not found`);
        return false;
    }

    if (rows[0].password !== hashedPassword) {
        return false;
    }

    return true;
}

export async function registerDatabase(hashedPassword, username, email) {
    const result = await db.execute('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
    if(result[0].affectedRows >= 1) {
        const userIdFetch = await db.execute('SELECT id from accounts where username = ?', [username]);
        if(!userIdFetch) {
            return 0;
        }
        else {
            return userIdFetch[0][0].id;
        }
    }
    else {
        return 0;
    }
}

export async function emailFetchDatabase(username) {
    const [rows] = await db.query('SELECT email from accounts WHERE username = ?', [username]);
    if (rows.length === 0) {
        return "";
    }
    return rows[0].email;
}

export async function passwordChangeDatabase(hashedPassword, username) {
    const result = await db.execute("UPDATE accounts SET password = ? WHERE username = ?", [hashedPassword, username])
    return result[0].affectedRows >= 1;
}

export async function getAllUsersDatabase() {
    const [rows] = await db.query("SELECT * FROM accounts")
    if (rows.length === 0) {
        return []
    }
    return rows;
}

export async function productsFetchDatabase() {
    const [rows] = await db.query("SELECT * FROM products");
    if (rows.length === 0) {
        return []
    }
    return rows;
}

export async function userDataChangeDatabase(values, updates) {
    const sql = `UPDATE accounts SET ${updates.join(", ")} WHERE id = ?`;
    const result = await db.execute(sql, values);
    return result[0].affectedRows >= 1;
}

export async function backupCodesDatabase(newUserId, codeHash){
    const result = await db.query(
        "INSERT INTO backup_codes (user_id, code_hash) VALUES (?, ?)",
        [newUserId, codeHash]
    );
    if(result[0].affectedRows >= 1){
        return 1
    }
    else {
        return 0
    }
}

export async function getUserIdDatabase(username) {
    const userIdFetch = await db.execute('SELECT id from accounts where username = ?', [username]);
    if(!userIdFetch) {
        return 0;
    }
    else {
        return userIdFetch[0][0].id;
    }
}

export async function getUserBackupCodeDatabase(user_id) {
    const [rows] = await db.query(
        "SELECT id, code_hash FROM backup_codes WHERE user_id = ? AND used = 0",
        [user_id]);
    if(rows.length === 0) {
        return 0;
    }
    else {
        return rows;
    }
}

export async function markBackupCodeUsedDatabase(codeId) {
    try {
        const [result] = await db.query(
            "UPDATE backup_codes SET used = 1 WHERE id = ?",
            [codeId]
        );

        return result.affectedRows === 1;
    } catch (err) {
        console.error("Error marking backup code as used:", err);
        return false;
    }
}

export async function getAllBackupCodesDatabase() {
    const [rows] = await db.query(
        "SELECT code_hash FROM backup_codes");
    if(rows.length === 0) {
        return 0;
    }
    else {
        return rows;
    }
}