// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon';
import { ErrorBoundary } from 'react-error-boundary';

function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    error: null,
    data: null
  });

  React.useEffect(() => {
    if (!pokemonName) return;
    setState(state => ({
      ...state,
      status: 'pending'
    }));
    fetchPokemon(pokemonName)
      .then(
        pokemonData => {
          setState({
            error: null,
            status: 'resolved',
            data: pokemonData
          });
        },
        fetchPokemonError => {
          setState(state => ({
            data: state.data,
            error: fetchPokemonError.message,
            status: 'rejected',
          }));
        }
      );
  }, [pokemonName]);

  if (state.status === 'idle') {
    return 'Submit a pokemon';
  } else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (state.status === 'rejected') {
    throw new Error(state.error);
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.data} />;
  } else {
    throw new Error("Shouldn't have gotten to this point");
  }
}

function ErrorDisplay({ error, resetErrorBoundary }) {
  return (
    <>
      <div role="alert">There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre></div>
      <button onClick={resetErrorBoundary}>Try again</button></>
  );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorDisplay}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
