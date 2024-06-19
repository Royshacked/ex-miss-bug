const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetNewFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetNewFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value } = target
        const { name, type } = target

        type === 'number' ? value = +value : value

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [name]: value }))
    }

    return <section className="bug-filter">
        <input type="text" name="txt" placeholder="Filter by Title..." onChange={handleChange} value={filterByToEdit.txt} />
        <input type="number" name="minSeverity" min="0" max="7" placeholder="1" onChange={handleChange} value={filterByToEdit.minSeverity} />
    </section>
}