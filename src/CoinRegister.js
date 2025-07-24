
const createLedgerEntry = (
    entryDate,
    description,
    isDebit,
    platinum,
    gold,
    silver,
    copper
) => {
        return {
            entryDate: entryDate || new Date(),
            description,
            isDebit,
            platinum,
            gold,
            silver,
            copper
        }
}

const createCoinBalance = (
    platinum,
    gold,
    silver,
    copper
) => {
    return {
        platinum: platinum,
        gold: gold,
        silver: silver,
        copper: copper
    }
}



class CoinRoster {
    constructor () {
        this.balance = createCoinBalance(0,0,0,0)
        this.transactions = []
    }
    get History () {
        return this.transactions.map( (item) => ({...item}))
    }
    recalc () {
        if (this.transactions.length < 1) {
            this.balance = createCoinBalance(0,0,0,0)
            return {...this.balance}
        }

        this.transactions.sort( (a,b) => a.entryDate - b.entryDate)

        let totalCopper = this.transactions.reduce( (previous, current) => {
            return current.isDebit
                ? previous - current.copper
                : previous + current.copper
        }, 0)

        let totalSilver = this.transactions.reduce( (previous, current) => {
             return current.isDebit
                ? previous - current.silver
                : previous + current.silver
        }, 0)

        let totalGold = this.transactions.reduce( (previous, current) => {
             return current.isDebit
                ? previous - current.gold
                : previous + current.gold
        }, 0)

        let totalPlatinum = this.transactions.reduce( (previous, current) => {
             return current.isDebit
                ? previous - current.platinum
                : previous + current.platinum
        }, 0)

        let combined = (totalCopper) + (totalSilver * 10) +
            (totalGold * 100) + (totalPlatinum * 1000)
        
        const pt = Math.floor(combined / 1000)
        combined = combined - (pt * 1000)

        const au = Math.floor(combined / 100)
        combined = combined - (au * 100)

        const ag = Math.floor(combined / 10)
        combined = combined - (ag * 10)

        const cu = combined
        this.balance = createCoinBalance(pt, au, ag, cu)

        return {...this.balance}
    }

    addEntry (
        entryDate,
        description,
        isDebit,
        platinum,
        gold,
        silver,
        copper
    ) {
        this.transactions.push(
            createLedgerEntry(
                entryDate,
                description,
                isDebit,
                platinum,
                gold,
                silver,
                copper
            )
        )
        return this.recalc()
    }
}

