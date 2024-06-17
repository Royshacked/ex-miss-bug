import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    save,

}

var bugs = utilService.readJsonFile('./data/bug.json')

function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === id)
    return Promise.resolve(bug)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }

    return _saveCarsToFile()
        .then(() => bugToSave)
}



function _saveCarsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}