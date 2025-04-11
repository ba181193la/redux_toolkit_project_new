import CryptoJS from 'crypto-js';

export const isSessionExpired = (sessionExpiryTime) => {
  if (!sessionExpiryTime) return true;
  return Date.now() > sessionExpiryTime;
};

export const checkAccess = (isSuperAdmin, isView, flag) => {
  if (isSuperAdmin) return true;
  if (flag) return true;
  if (isView) return false;
  
  return false;
};

export const decryptAES = (encryptedData, secretkey) => {
  try {
    // Generate the key using SHA-256
    const key = CryptoJS.SHA256(secretkey);

    // Decode the base64 string
    const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedData);

    // Extract the IV (first 16 bytes) and the encrypted data
    const iv = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(0, 4)); // 4 words * 4 bytes = 16 bytes
    const encrypted = CryptoJS.lib.WordArray.create(
      encryptedBytes.words.slice(4)
    );

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    const decryptedValue = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedValue;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

export const encryptAES = (plainText, secretKey) => {
  // Generate the key using SHA-256
  const key = CryptoJS.SHA256(process.env.REACT_APP_SECRET_KEY);
  // Generate a random IV
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt the data
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // Combine IV and encrypted data
  const encryptedValue = CryptoJS.enc.Base64.stringify(
    iv.concat(encrypted.ciphertext)
  );

  return encryptedValue;
};
