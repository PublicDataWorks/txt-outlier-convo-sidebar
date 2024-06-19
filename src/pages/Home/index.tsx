function readUsersTable() {
  const request = indexedDB.open('MissiveProduction', 18)

  request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode)
  }

  request.onsuccess = (event) => {
    const db = event.target.result
    console.log(db)
    const transaction = db.transaction(['users'], 'readonly')
    const objectStore = transaction.objectStore('users')
    const getRequest = objectStore.getAll() // Retrieve all records from the "users" table

    getRequest.onerror = (event) => {
      console.error('Get request error:', event.target.errorCode)
    }

    getRequest.onsuccess = (event) => {
      console.log('Data:', event.target.result)
    }
  }
}

function Home() {
  // readUsersTable()
  Missive.requestAccessToken().then(a => console.log(JSON.stringify(a)))
  return (
    <div>hello</div>
  )
}

export default Home
