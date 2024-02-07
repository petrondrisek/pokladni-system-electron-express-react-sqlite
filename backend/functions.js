class Functions {
    getCurrentDateTime() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const dateTimeString = `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;

        return dateTimeString;
    }

    uniqueId() {
        return Math.random().toString(36).substr(2) + Date.now().toString(36);
    }
}

module.exports = Functions;