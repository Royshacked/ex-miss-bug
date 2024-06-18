
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyFilter,
}

const BASE_URL = '/api/bug'

function query(filterBy = {}) {
    console.log(filterBy)
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            if (filterBy.title) {
                bugs = bugs.filter(bug => bug.title.toLowerCase().includes(filterBy.title.toLowerCase()))
            }

            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }
            return bugs
        })
}

function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + '/' + bugId + '/remove')
        .then(res => res.data)
}

function save(bug) {
    const queryStr = `/save?title=${bug.title}&description=${bug.description}&severity=${bug.severity}&_id=${bug._id || ''}`
    return axios.get(BASE_URL + queryStr)
        .then(res => res.data)
}

function getEmptyFilter(title = '', severity = 1) {
    return {
        title,
        severity
    }
}