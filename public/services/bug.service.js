
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyFilter,
    getFilterFromSearchParams,
}

const BASE_URL = '/api/bug'

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
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

function getEmptyFilter(txt = '', minSeverity = 0) {
    return {
        txt,
        minSeverity
    }
}

function getFilterFromSearchParams(searchParams) {
    return {
        txt: searchParams.get('txt') || '',
        minSeverity: +searchParams.get('minSeverity') || '',
    }
}