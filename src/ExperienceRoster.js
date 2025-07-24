const createExperienceEntry = (
        entryDate,
        description,
        amount
     ) => {
        const id = crypto.randomUUID();
        return {
            id : id,
            entryDate: entryDate || new Date(),
            description: description || 'no description',
            amount: amount || 0
        }

}

export class ExperienceRoster {
    #recalcNeeded = false
    constructor() {
        this.totalExperience = 0;
        this.history = []
    }
    get Experience () { 
        if (this.#recalcNeeded) {
            this.recalc()
        }
        return this.totalExperience
    }

    get History () {
        if (this.#recalcNeeded) {
            this.recalc()
        }
        return this.history.map( (item) => ({...item}))
    }
    recalc() {
        if (this.history.length < 1) {
            this.#recalcNeeded = false
            this.totalExperience = 0
            return this.totalExperience
        }
        this.history.sort((a,b) => (a.entryDate - b.entryDate))
        this.totalExperience = this.history.reduce( (previous, current) => {
            if (current.hasOwnProperty('amount')) {
                if (typeof current.amount === 'number') {
                    return previous + current.amount
                }
            }
            return previous
        }, 0)
        this.#recalcNeeded = false
    }
    addExperience (
        entryDate,
        description,
        amount
     ) {
        const entry = createExperienceEntry(
                entryDate,
                description,
                amount
        )
        this.#addEntry(entry)
        return entry
     }
     #addEntry (entry) {
         this.history.push(entry)
         this.#recalcNeeded = true
     }
}