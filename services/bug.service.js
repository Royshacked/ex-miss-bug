import { utilService } from "./util.service.js"

export const bugService = {
    query,
}

function query() {
    return Promise.resolve(utilService.readJsonFile('./data/bug.json'))
}