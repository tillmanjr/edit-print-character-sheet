
import { ExperienceRoster } from './ExperienceRoster.js';

const emitPass = (msg) => console.log(msg)
const emitFail = (msg) => console.error(msg)

const expectToEqual = (lhs, rhs) => {
    if (lhs === rhs) {
        emitPass('Pass')
        return
    }
    emitFail(`Failed: expected ${lhs} to equal ${rhs}`)

}

const roster = new ExperienceRoster()
expectToEqual(roster.Experience, 0)
roster.addExperience(
    new Date(),
    'Description01',
    100
)
expectToEqual(roster.Experience, 100)
roster.addExperience(
    new Date(),
    'Description01',
    300
)
expectToEqual(roster.Experience, 400)

roster.addExperience(
    new Date(),
    'Description01',
    500
)
expectToEqual(roster.Experience, 900)
const history = roster.History
expectToEqual(history.length, 3)