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

export function isValidNumTickets(num_str: string) {
    // Check if value is number
    var num_tickets = Number(num_str);
    if (!num_tickets || !Number.isInteger(num_tickets) || num_tickets <= 0) {
        alert("Number of tickets is not an integer greater than 0.")
        return false;
    }

    return true;

}

export function generateEntropyString() {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    const bytesHex = bytes.reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');
  
    // convert hexademical value to a decimal string
    return BigInt('0x' + bytesHex).toString(16)
}