
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getFilterFromSearchParams,
    getPageCount
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


function getFilterFromSearchParams(searchParams) {
    return {
        txt: searchParams.get('txt') || '',
        minSeverity: +searchParams.get('minSeverity') || '',
        pageIdx: +searchParams.get('pageIdx') || '',
    }
}

function getPageCount() {
    return axios.get(BASE_URL + '/page')
        .then(res => +res.data)
}