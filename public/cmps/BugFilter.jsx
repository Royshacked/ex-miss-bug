const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetNewFilter, lastPage, labels }) {
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

    function handleLabels({ target }) {
        const { name, checked } = target

        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            selectedLabels: checked ? [...prevFilter.selectedLabels, name] : prevFilter.selectedLabels.filter(label => label !== name),
            pageIdx: 0
        }
        ))
    }

    return <section className="bug-filter">
        <div className="filter-inputs">
            <label htmlFor="txt">
                <input type="text" name="txt" id="txt" placeholder="Filter by Title..." onChange={handleChange} value={filterByToEdit.txt} />
            </label>

            <label htmlFor="number">
                <input type="number" name="minSeverity" id="number" min="0" max="7" placeholder="Min Severity..." onChange={handleChange} value={filterByToEdit.minSeverity} />
            </label>
        </div>

        <div className="labels-inputs">
            <h3>Labels</h3>
            {labels.map((label, idx) =>
                <label htmlFor={label} key={idx}>
                    {label}:
                    <input type="checkbox" name={label} id={label} checked={filterByToEdit.selectedLabels.includes(label)} onChange={handleLabels} />
                </label>
            )}
        </div>

        <div className="paging">
            <button onClick={() => handlePages(+1)}>+</button>
            <span>{filterByToEdit.pageIdx + 1}</span>
            <button onClick={() => handlePages(-1)}>-</button>
        </div>
    </section>
}