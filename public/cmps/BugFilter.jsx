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

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [name]: value }))
    }

    function handlePages(diff) {
        let currentPage = +filterByToEdit.pageIdx + diff
        if (currentPage < 0) currentPage = lastPage
        if (currentPage > lastPage) currentPage = 0

        setFilterByToEdit(prevFilter => ({ ...prevFilter, pageIdx: currentPage }))
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