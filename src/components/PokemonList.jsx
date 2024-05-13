/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL, IMAGE_URL } from "./DataSource";
import PokemonFilter from "./PokemonFilter";
import Pagination from "./Pagination";
import NoPokemonFound from "./NoPokemonFound";
import PokemonLoading from "./PokemonLoading";

export default function PokemonList() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitSearch, setIsSubmitSearch] = useState(false);
    const state = useSelector((state) => state);
    const { pokemons } = state;
    const pokemonFilters = state.pokemonFilters;
    const { pagination } = state.config;
    const { handleImageError } = state.errors;
    const { fetchData } = state.methods;
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            try {
                let pokemonsData = null;
                setIsLoading(true);
                pokemonFilters.input === "" ? setIsSubmitSearch(false) : setIsSubmitSearch(true);
                if (isSubmitSearch) {
                    const response = await fetch(`${BASE_URL}/pokemon/${pokemonFilters.input.toLowerCase()}`);
                    response.ok ? (response.ok === true ? (pokemonsData = await response.json()) : (pokemonsData = {})) : (pokemonsData = {});
                    pokemonsData.forms ? pokemonsData.forms.map((pokemon, index) => (pokemonsData.forms[index]["id"] = pokemonsData.id)) : (pokemonsData = { forms: [] });
                    pokemonsData = {
                        results: pokemonsData.forms,
                        count: pokemonsData.forms.length,
                    };
                } else {
                    pokemonsData = await fetchData(`${BASE_URL}/pokemon?offset=${pagination.cursor * pagination.offset}&limit=${pagination.limit}`);
                    pokemonsData.results.map((pokemon, index) => {
                        const splitUrl = pokemon.url.split("/");
                        const id = splitUrl[splitUrl.length - 2];
                        pokemonsData.results[index]["id"] = id;
                    });
                }
                dispatch({ type: "GET_ALL_POKEMON", payload: pokemonsData });
                dispatch({
                    type: "SET_PAGINATION_CONFIG",
                    payload: {
                        ...pagination,
                        totalData: pokemonsData.count,
                        totalPage: Math.ceil(pokemonsData.count / pagination.limit),
                    },
                });
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        })();
    }, [pagination.cursor, isSubmitSearch]);

    return (
        <>
            <PokemonFilter pokemonFilters={pokemonFilters} dispatch={dispatch} setIsSubmitSearch={setIsSubmitSearch} isSubmitSearch={isSubmitSearch} />
            <div className="pk-list">
                {isLoading ? (
                    <PokemonLoading />
                ) : (
                    <div className="row row-cols-1 row-cols-md-4 g-4">
                        {pokemons.results ? (
                            pokemons.results.length > 0 ? (
                                pokemons.results.map((pokemon, id) => (
                                    <div key={id} className="col">
                                        <div className="card">
                                            <div className="pk-frame">
                                                <img onError={handleImageError} src={`${IMAGE_URL}/${pokemon.id}.png`} className="card-img-top" alt="..." />
                                            </div>
                                            <div className="card-body">
                                                <Link to={`/detail/${pokemon.id}`} className="card-title">
                                                    <b>{pokemon.name.toUpperCase()}</b>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <NoPokemonFound />
                            )
                        ) : (
                            ""
                        )}
                    </div>
                )}
            </div>
            <Pagination pagination={pagination} isSubmitSearch={isSubmitSearch} dispatch={dispatch} />
        </>
    );
}


