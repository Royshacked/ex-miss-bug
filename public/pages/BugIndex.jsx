import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { utilService } from '../services/util.service.js'
import { userService } from '../services/user.service.js'

const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(bugService.getFilterFromSearchParams(searchParams))
  const [pageCount, setPageCount] = useState(0)
  const [labels, setLabels] = useState([])
  const [user, setUser] = useState(userService.getLoggedInUser)

  const debounceSetFilterBy = useRef(utilService.debounce(onSetNewFilter, 250))

  useEffect(() => {
    loadPageCount()
    loadLabels()
  }, [])


  useEffect(() => {
    setSearchParams({ ...filterBy, selectedLabels: filterBy.selectedLabels.join(',') })
    loadBugs()
  }, [filterBy])

  function loadBugs() {
    bugService.query(filterBy).then(setBugs)
  }

  function loadPageCount() {
    bugService.getPageCount().then(setPageCount)
  }

  function loadLabels() {
    bugService.getLabels().then(labels => {
      setLabels(labels)
    })
  }

  function onRemoveBug(bugId) {
    bugService.remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
        loadPageCount()
        loadLabels()
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onAddBug() {
    const title = prompt('Bug title?')
    const description = prompt('Bug description?')
    const severity = +prompt('Bug severity?')
    const labelsInput = prompt('Bug labels (comma-separated)?')
    const labels = labelsInput ? labelsInput.split(',') : []

    const bug = {
      title,
      description,
      severity,
      labels
    }

    if (!bug.title && !bug.severity && !bug.description) return

    bugService.save(bug)
      .then((savedBug) => {
        loadBugs()
        loadPageCount()
        loadLabels()
        showSuccessMsg('Bug added')
      }
      )
      .catch((err) => {
        console.log('Error from onAddBug ->', err)
        showErrorMsg('Cannot add bug')
      })
  }

  function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }

    bugService.save(bugToSave)
      .then((savedBug) => {
        console.log('Updated Bug:', savedBug)
        setBugs(prevBugs => prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        ))
        loadPageCount()
        loadLabels()
        showSuccessMsg('Bug updated')
      })
      .catch((err) => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }

  function onSetNewFilter(newFilter) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...newFilter }))
  }

  return (
    <main className='bug-index'>
      <section className="bug-index-header">
        <h3>Bugs App</h3>
        <BugFilter filterBy={filterBy} onSetNewFilter={debounceSetFilterBy.current} lastPage={pageCount} labels={labels} />
      </section>
      <main>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} user={user} />
      </main>
    </main>
  )
}
