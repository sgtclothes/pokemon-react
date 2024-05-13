/* eslint-disable react/prop-types */
export default function PokemonFilter({ pokemonFilters, dispatch, setIsSubmitSearch, isSubmitSearch }) {

    function handleInput(value) {
        dispatch({ type: "FILTER_POKEMON", payload: { ...pokemonFilters, input: value, sortBy: pokemonFilters.sortBy } });
    }

    function handleSubmitSearch(e) {
        e.preventDefault();
        setIsSubmitSearch(!isSubmitSearch);
    }

    return (
        <>
            <div className="pk-filter">
                <form className="d-flex" onSubmit={handleSubmitSearch}>
                    <div className="mb-3 d-flex">
                        <input placeholder="Input Pokemon Name" className="form-control" type="text" onChange={(e) => handleInput(e.target.value)} value={pokemonFilters.input} />
                        <button className="mx-2 pk-button-search">Search</button>
                    </div>
                </form>
            </div>
        </>
    );
}
