import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,
    getPages,
    getLabels
}

const PAGE_SIZE = 3
var bugs = utilService.readJsonFile('./data/bug.json')


function query(filterBy) {
    if (!filterBy) return Promise.resolve(bugs)

    const { txt, minSeverity, selectedLabels, pageIdx, userId, isAdmin } = filterBy
    const regExp = new RegExp(txt, 'i')
    var filteredBugs = bugs

    if (isAdmin === true) return Promise.resolve(filteredBugs)
    if (userId) filteredBugs = filteredBugs.filter(bug => bug.creator._id === userId)

    if (txt) filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    if (minSeverity) filteredBugs = filteredBugs.filter(bug => bug.severity >= minSeverity)
    if (selectedLabels.length > 0) filteredBugs = filteredBugs.filter(bug => filterBy.selectedLabels.every(label => bug.labels.includes(label)))

    if (pageIdx) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.push(bugToSave)
    }

    return _saveBugsToFile()
        .then(() => bugToSave)
}

function getPages() {
    return query()
        .then(bugs => Promise.resolve(Math.ceil(bugs.length / PAGE_SIZE)))
}

function getLabels() {
    return query()
        .then(bugs => {
            const labels = bugs.reduce((acc, bug) => {
                return [...acc, ...bug.labels]
            }, [])

            return Promise.resolve([...new Set(labels)])
        })
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}