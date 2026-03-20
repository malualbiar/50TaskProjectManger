import { useParams } from 'react-router-dom'

export default function TeamDetail() {
  const { id } = useParams()

  return (
    <div style={{ padding: '40px' }}>
      <h1>Team Detail</h1>
      <p>Teams Section - Detailed view of team {id}</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Team Information</h3>
        <p><strong>Team ID:</strong> {id}</p>
        <p><strong>Team Name:</strong> Team Alpha</p>
        <p><strong>Members:</strong> 5</p>
        <h4 style={{ marginTop: '20px' }}>Team Members List</h4>
        <ul>
          <li>Member 1</li>
          <li>Member 2</li>
          <li>Member 3</li>
        </ul>
      </div>
    </div>
  )
}
