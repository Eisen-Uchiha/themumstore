import React from 'react'

function Park() {
  return (
    <div>
      <div>Under Construction</div>
      <div><button onClick={handleClick("hello")}>Test</button></div>
    </div>
  )
}

const handleClick = api => e => {
  e.preventDefault()

  // this.setState({ loading: true })
  fetch("/.netlify/functions/" + api)
    .then(response => { console.log(response); response.json(); })
    .then(json => console.log(json))
}

export default Park
