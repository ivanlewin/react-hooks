// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react';

const useLocalStorageState = (key, defaultValue, {
  serialize = JSON.serialize,
  deserealize = JSON.parse
} = {}) => {
  const getter = () => {
    const localStorageValue = window.localStorage.getItem(key);
    const fallback = typeof defaultValue === 'function' ? defaultValue() : defaultValue ? defaultValue : '';
    if (localStorageValue) {
      try {
        return deserealize(localStorageValue);
      } catch (e) {
        console.error(e);
        return fallback;
      }
    } else {
      return fallback;
    }
  };

  const [state, setState] = React.useState(getter);
  const previousKeyRef = React.useRef(key);

  React.useEffect(() => {
    if (previousKeyRef.current !== key) {
      window.localStorage.removeItem(key);
    }
    previousKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
};

function Greeting({ initialName = '' }) {
  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
}

function App() {
  return <Greeting />;
}

export default App;
