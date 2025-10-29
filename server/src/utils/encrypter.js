const crypto = require('crypto');
/**
 * Provides AES-256-CBC encryption and decryption compatible with the C# implementation.
 * It uses HKDF-SHA256 for key derivation and a [salt][iv][ciphertext] structure.
 */
class Encrypter {
    static SALT_SIZE = 16;  // 128-bit
    static IV_SIZE = 16;  // 128-bit
    static KEY_SIZE = 32; // 256-bit key
    static ITER = 100000; // For PBKDF2 (DeriveKey_slow)
    /**
     * Encrypts plaintext using a password.
     * @param {string} password - The password to derive the encryption key.
     * @param {string} plaintext - The text to encrypt.
     * @returns {string} A Base64-URL-encoded encrypted string.
     */
    static encrypt(password, plaintext) {
        const salt = Encrypter.randomBytes(Encrypter.SALT_SIZE);
        const key = Encrypter.deriveKey(password, salt);
        const iv = Encrypter.randomBytes(Encrypter.IV_SIZE);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        
        const plainBytes = Buffer.from(plaintext, 'utf8');
        const encrypted = Buffer.concat([cipher.update(plainBytes), cipher.final()]);
        // Concatenate [salt || iv || ciphertext]
        const all = Buffer.concat([salt, iv, encrypted]);
        return Encrypter.base64UrlEncode(all);
    }
    /**
     * Decrypts a Base64-URL-encoded string using a password.
     * @param {string} password - The password to derive the decryption key.
     * @param {string} b64 - The Base64-URL-encoded string to decrypt.
     * @returns {string} The original decrypted plaintext.
     */
    static decrypt(password, b64) {
        const all = Encrypter.base64UrlDecode(b64);
        if (all.length < Encrypter.SALT_SIZE + Encrypter.IV_SIZE) {
            throw new Error("Ciphertext too short.");
        }
        // Extract components: [salt || iv || ciphertext]
        const salt = all.subarray(0, Encrypter.SALT_SIZE);
        const iv = all.subarray(Encrypter.SALT_SIZE, Encrypter.SALT_SIZE + Encrypter.IV_SIZE);
        const encrypted = all.subarray(Encrypter.SALT_SIZE + Encrypter.IV_SIZE);
        const key = Encrypter.deriveKey(password, salt);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    }
    /**
     * Encodes a Buffer into a Base64 URL-safe string.
     * (Replaces +, / and removes = padding)
     * @param {Buffer} data - The buffer to encode.
     * @returns {string} The Base64 URL-safe string.
     */
    static base64UrlEncode(data) {
        return data.toString('base64')
            .replace(/\+/g, '-')  // Replace + with -
            .replace(/\//g, '_')  // Replace / with _
            .replace(/=/g, '');   // Remove padding
    }
    /**
     * Decodes a Base64 URL-safe string into a Buffer.
     * (Replaces -, _ and adds back padding)
     * @param {string} text - The Base64 URL-safe string.
     * @returns {Buffer} The decoded buffer.
     */
    static base64UrlDecode(text) {
        let padded = text.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding back
        while (padded.length % 4) {
            padded += '=';
        }
        return Buffer.from(padded, 'base64');
    }
    /**
     * (Unused by Encrypt/Decrypt)
     * Derives a key using PBKDF2-HMAC-SHA1.
     * This matches the C# Rfc2898DeriveBytes(password, salt, iter) implementation.
     * @param {string} password - The password.
     * @param {Buffer} salt - The salt.
     * @returns {Buffer} The derived key.
     */
    static deriveKey_slow(password, salt) {
        return crypto.pbkdf2Sync(
            password, 
            salt, 
            Encrypter.ITER, 
            Encrypter.KEY_SIZE, 
            'sha1'
        );
    }
    /**
     * Derives a key using HKDF-SHA256 (Extract and Expand).
     * This matches the C# HMACSHA256-based DeriveKey implementation.
     * @param {string} password - The password (as input keying material).
     * @param {Buffer} salt - The salt.
     * @returns {Buffer} The derived key.
     */
    static deriveKey(password, salt) {
        // crypto.hkdfSync implements HKDF (Extract-and-Expand)
        // 'sha256': The hash function
        // password: The input keying material (IKM)
        // salt: The salt
        // '': The 'info' or context (empty in the C# version)
        // KEY_SIZE: The length of the output keying material (OKM)
        return crypto.hkdfSync(
            'sha256', 
            password, 
            salt, 
            '', 
            Encrypter.KEY_SIZE
        );
    }
    /**
     * Generates a buffer of cryptographically secure random bytes.
     * @param {number} n - The number of bytes to generate.
     * @returns {Buffer} The random bytes.
     */
    static randomBytes(n) {
        return crypto.randomBytes(n);
    }
}
/**
 * Formats a Date object to an ISO string with 7 decimal places for milliseconds,
 * matching the C# 'o' format specifier (e.g., 2023-10-27T10:00:00.1234567Z).
 * @param {Date} dt - The Date object.
 * @returns {string} The formatted date string.
 */
function toCSharpISOString(dt) {
    // getISOString() returns 3 decimal places (e.g., .123Z)
    const iso = dt.toISOString();
    // We slice off the 'Z' and add the remaining '0000Z' to get 7 decimal places
    return iso.slice(0, -1) + '0000Z';
}
/**
 * Creates a self-generated temporary token.
 * @param {string} parent_token - The parent token.
 * @param {Date} expire - The expiration date object.
 * @param {string | null} [permissions=null] - Optional permissions string.
 * @param {string | null} [rid=null] - Optional rid.
 * @param {string | null} [fid=null] - Optional fid.
 * @param {string | null} [sourceipv4=null] - Optional source IP.
 * @param {string | null} [host=null] - Optional host.
 * @returns {string} The generated temporary token.
 */
function createSelfGeneratedTempTokenV3getTempAPIKeyV2(
    parent_token, 
    expire, 
    permissions = null, 
    rid = null, 
    fid = null, 
    sourceipv4 = null, 
    host = null
) {
    if (!parent_token) {
        throw new Error("empty parent_token not allowed");
    }
    const keyfreg = parent_token.split('i', 2);
    const accid = keyfreg[0];
    // Use slice to get last 4 chars, handling strings shorter than 4
    const last4_parent_token = parent_token.slice(Math.max(0, parent_token.length - 4));
    const sbPayload = [];
    // Use a custom function to match C#'s "o" format (7 decimal places)
    sbPayload.push(toCSharpISOString(expire));
    if (permissions != null) {
        sbPayload.push("!p");
        sbPayload.push(permissions);
    }
    if (rid != null) {
        sbPayload.push("!r");
        sbPayload.push(rid);
    }
    if (fid != null) {
        sbPayload.push("!f");
        sbPayload.push(fid);
    }
    if (sourceipv4 != null) {
        sbPayload.push("!i");
        sbPayload.push(sourceipv4);
    }
    if (host != null) {
        sbPayload.push("!h");
        sbPayload.push(host);
    }
    const payloadString = sbPayload.join('');
    const emsg = Encrypter.encrypt(parent_token, payloadString);
    return `${accid}i3${last4_parent_token}${emsg}`;
}
// Export the class and the function
module.exports = {
    Encrypter,
    createSelfGeneratedTempTokenV3getTempAPIKeyV2,
    toCSharpISOString // Exporting this helper in case it's needed externally
};