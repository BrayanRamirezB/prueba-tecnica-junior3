import { type User, SortBy } from '../types.d'

interface Props {
  users: User[]
  showColors: boolean
  deleteUser: (uuid: string) => void
  changeSorting: (sort: SortBy) => void
}

const UsersList = ({ users, showColors, deleteUser, changeSorting }: Props) => {
  return (
        <table width={'100%'}>
            <thead>
                <tr>
                    <th>Picture</th>
                    <th className='pointer' onClick={() => { changeSorting(SortBy.NAME) }}>First Name</th>
                    <th className='pointer' onClick={() => { changeSorting(SortBy.LAST) }}>Last Name</th>
                    <th className='pointer' onClick={() => { changeSorting(SortBy.COUNTRY) }}>Country</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                  users.map((user, index) => {
                    const backgroundColor = index % 2 === 0 ? 'blueviolet' : '#101010'
                    const color = showColors ? backgroundColor : 'transparent'

                    return (
                      <tr key={user.login.uuid} style={{ backgroundColor: color }}>
                        <td>
                          <img src={user.picture.thumbnail} alt="User image" />
                        </td>
                        <td>
                          {user.name.first}
                        </td>
                        <td>
                          {user.name.last}
                        </td>
                        <td>
                          {user.location.country}
                        </td>
                        <td>
                          <button onClick={() => { deleteUser(user.login.uuid) }}>Delete</button>
                        </td>
                      </tr>
                    )
                  })
                }
            </tbody>
        </table>
  )
}

export default UsersList
