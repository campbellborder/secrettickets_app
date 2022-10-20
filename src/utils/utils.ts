import { mnemonicToSeed } from 'bip39';
import { pki, random } from "node-forge";

export function isValidAmount(amount_str: string, label: string) {
    // Check if value is number
    var amount = Number(amount_str);
    if (!amount || amount <= 0) {
        alert(`${label} is not a positive integer`);
        return false;
    }

    amount = amount * 1000000;
    if (!Number.isInteger(amount)) {
        alert(`${label} can only have 6 decimal places`);
        return false;
    }

    return true
}

class RsaPrivateKey {
    constructor() {
    }
    async decrypt(input: any) {
        await sleep(3000);
        return "63F3A89C45DE97FA"
    }
}

export function isValidNumTickets(num_str: string) {
    // Check if value is number
    var num_tickets = Number(num_str);
    if (!num_tickets || !Number.isInteger(num_tickets) || num_tickets <= 0) {
        alert("Number of tickets is not an integer greater than 0.")
        return false;
    }

    return true;

}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export function generateEntropyString() {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    const bytesHex = bytes.reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');
  
    // convert hexademical value to a decimal string
    return BigInt('0x' + bytesHex).toString(16)
}

export async function generateRSAKeypair(mnemonic: string) {

    const seed = (await mnemonicToSeed(mnemonic)).toString('hex');
    const prng = random.createInstance();
    prng.seedFileSync = () => seed;

    const { publicKey } = pki.rsa.generateKeyPair({bits: 1024, prng, workers: 2})
    return { privateKey: new RsaPrivateKey(), publicKey: publicKey};
}