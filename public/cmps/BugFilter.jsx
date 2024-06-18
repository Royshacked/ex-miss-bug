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
        <input type="text" name="title" placeholder="Filter by Title..." onChange={handleChange} value={filterByToEdit.title} />
        <input type="number" name="severity" min="1" max="7" placeholder="1" onChange={handleChange} value={filterByToEdit.severity} />
    </section>
}