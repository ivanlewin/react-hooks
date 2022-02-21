// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

export function useLocalStorage(key, initialValue) {
  const getInitialState = () => {
    try {
      const value = JSON.parse(window.localStorage.getItem(key));
      return value ?? initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };
  const [value, setValue] = React.useState(getInitialState);

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName='Hola' />
}

export default App
