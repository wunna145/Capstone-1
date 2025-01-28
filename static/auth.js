function generateAuth() {
    const ts = "1";
    const privateKey = "5bd6ed7b4e62d54c91e367615c63faabec8d260c";
    const publicKey = "7d66a4084550c5f9d6d12cccaf85c476";

    const toHash = ts + privateKey + publicKey;
    const hashValue = CryptoJS.MD5(toHash).toString();

    return `ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;
}

export { generateAuth };
