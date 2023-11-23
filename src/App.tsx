import { useEffect, useMemo, useRef, useState } from 'react'
import { SortBy, type User } from './types.d'
import UsersList from './components/UsersList'
import './App.css'

const App = () => {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async response => await response.json())
      .then(response => {
        setUsers(response.results)
        originalUsers.current = response.results
      }).catch(error => {
        console.error(error)
      })
  }, [])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter((user => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
      }))
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]

      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== uuid)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  return (
    <div className='App'>
      <h1>Prueba Técnica</h1>
      <header>
        <button onClick={toggleColors}>Color Rows</button>
        <button onClick={toggleSortByCountry}>{sorting === SortBy.COUNTRY ? 'disorder' : 'Sort by Country'}</button>
        <button onClick={handleReset}>Reset Users</button>
        <input type="text" placeholder='Filter by Country' onChange={(e) => {
          setFilterCountry(e.target.value)
        }} />
      </header>
      <UsersList users={sortedUsers} showColors={showColors} deleteUser={handleDelete} changeSorting={handleChangeSort} />
    </div>
  )
}

export default App
