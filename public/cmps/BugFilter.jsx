import { bugService } from "../services/bug.service.js"

const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetNewFilter, lastPage }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetNewFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value } = target
        const { name, type } = target

        type === 'number' ? value = +value || '' : value

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [name]: value, pageIdx: 0 }))
    }

    function handlePages(diff = 0) {
        let currentPage = checkPageIdx(diff)

        setFilterByToEdit(prevFilter => ({ ...prevFilter, pageIdx: currentPage }))
    }

    function checkPageIdx(diff = 0) {
        let currentPage = +filterByToEdit.pageIdx + diff
        if (currentPage < 0) return currentPage = lastPage - 1
        if (currentPage > lastPage - 1) return currentPage = 0

        return currentPage
    }

    return <section className="bug-filter">
        <input type="text" name="txt" placeholder="Filter by Title..." onChange={handleChange} value={filterByToEdit.txt} />
        <input type="number" name="minSeverity" min="0" max="7" placeholder="Min Severity..." onChange={handleChange} value={filterByToEdit.minSeverity} />

        <div>
            <button onClick={() => handlePages(+1)}>+</button>
            <span>{filterByToEdit.pageIdx + 1}</span>
            <button onClick={() => handlePages(-1)}>-</button>
        </div>
    </section>
}