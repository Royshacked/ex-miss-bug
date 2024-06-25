
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getFilterFromSearchParams,
    getPageCount,
    getLabels
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
    return axios.delete(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + '/' + bug._Id, bug)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }
}


function getFilterFromSearchParams(searchParams) {
    const labels = !searchParams.get('selectedLabels') ? [] : searchParams.get('selectedLabels').split(',')
    return {
        txt: searchParams.get('txt') || '',
        minSeverity: +searchParams.get('minSeverity') || 0,
        pageIdx: +searchParams.get('pageIdx') || 0,
        selectedLabels: labels,
    }
}

function getPageCount() {
    return axios.get(BASE_URL + '/page')
        .then(res => +res.data)
}

function getLabels() {
    return axios.get(BASE_URL + '/label')
        .then(res => res.data)
}