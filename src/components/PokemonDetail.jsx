/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { BASE_URL, IMAGE_URL, COLOR_THEME, SOUND_THEME, API_BASE_URL } from "./DataSource";
import NoPokemonFound from "./NoPokemonFound";
import NavigationBar from "./NavigationBar";
import PokemonLoading from "./PokemonLoading";
import PokemonHeader from "./PokemonHeader";

function PokemonDetailUnit({ isCatching, setIsCatching, isCatched, setIsCatched }) {
    const { id } = useParams();
    const { pokemon, auth } = useSelector((state) => state);
    const { handleImageError } = useSelector((state) => state.errors);
    const { fetchData } = useSelector((state) => state.methods);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pokemonNickName, setPokemonNickName] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const pokemonData = await fetchData(`${BASE_URL}/pokemon/${id}`);
                const pokemonTypes = await fetchData(`${BASE_URL}/type`);
                dispatch({ type: "SET_POKEMON", payload: pokemonData });
                dispatch({ type: "SET_POKEMON_TYPES", payload: pokemonTypes });
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsError(true);
                setIsLoading(false);
            }
        })();
    }, []);

    async function handleSubmitCatched(e) {
        e.preventDefault();
        const response = await fetch(API_BASE_URL + "/api/storePokemon", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: auth.token, up_pk_api_id: pokemon.id, up_pk_name: pokemon.name, up_pk_nickname: pokemonNickName }),
        });
        const json = await response.json();
        if (json.status === "success") {
            setIsCatched(false);
            alert("Pokemon Stored to My Pokemon List");
        } else {
            setIsCatched(true);
        }
    }

    return (
        <>
            {!isLoading ? (
                isError ? (
                    <NoPokemonFound />
                ) : (
                    <div className="pk-detail">
                        {isCatching ? (
                            <div className="pk-catch-pokemon text-center my-5">
                                <img src="../img/catching-pokemon.gif" alt="" />
                            </div>
                        ) : (
                            ""
                        )}
                        {isCatched ? (
                            <div className="pk-catch-pokemon text-center my-5">
                                <form onSubmit={handleSubmitCatched}>
                                    <div className="pk-label-catch-pokemon">Give Pokemon NickName :</div>
                                    <input type="text" value={pokemonNickName} onChange={(e) => setPokemonNickName(e.target.value)} />
                                    <button className="pk-button">Submit</button>
                                </form>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="pk-detail-container row">
                            <div className="pk-img-container col-sm-4">
                                <PokemonDetailImage handleImageError={handleImageError} id={id} />
                            </div>
                            <div className="pk-table-container col-sm-8">
                                <PokemonDetailTable isCatched={isCatched} id={id} pokemon={pokemon} isCatching={isCatching} setIsCatching={setIsCatching} setIsCatched={setIsCatched} />
                            </div>
                        </div>
                        <div className="pk-detail-other">
                            <PokemonDetailOthers pokemon={pokemon} />
                        </div>
                    </div>
                )
            ) : (
                <PokemonLoading />
            )}
        </>
    );
}

function PokemonDetailImage({ handleImageError, id }) {
    return <img onError={handleImageError} src={`${IMAGE_URL}/${id}.png`} className="card-img-top" alt="..." />;
}

function PokemonDetailTable({ id, pokemon, isCatching, setIsCatching, setIsCatched, isCatched }) {
    const { auth } = useSelector((state) => state);
    function handleCatchPokemon() {
        try {
            setIsCatching(true);
            setTimeout(async () => {
                const response = await fetch(API_BASE_URL + "/api/catchPokemon", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: auth.token }),
                });
                const json = await response.json();
                if (json.status === "success") {
                    setIsCatched(true);
                    alert(json.message);
                } else {
                    setIsCatched(false);
                    alert(json.message);
                }
                setIsCatching(false);
            }, 10000);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            {pokemon ? (
                <table className="table">
                    <tbody>
                        <tr>
                            <th className="pk-title-row" scope="row">
                                ID
                            </th>
                            <th scope="row">{id}</th>
                        </tr>
                        <tr>
                            <th className="pk-title-row" scope="row">
                                Name
                            </th>
                            <td>
                                <b>{pokemon.name ? pokemon.name.toUpperCase() : "Unknown Pokemon"}</b>
                            </td>
                        </tr>
                        <tr>
                            <th className="pk-title-row" scope="row">
                                Types
                            </th>
                            <td>
                                {pokemon.types
                                    ? pokemon.types.map((type) => (
                                          <span key={type.slot} className={`badge bg-type-${type.type.name} m-1`}>
                                              {type.type.name}
                                          </span>
                                      ))
                                    : ""}
                            </td>
                        </tr>
                        <tr>
                            <th className="pk-title-row" scope="row">
                                Held Items
                            </th>
                            <td>
                                {pokemon.held_items ? (
                                    pokemon.held_items.length > 0 ? (
                                        pokemon.held_items.map((item, i) => (
                                            <span key={i} className={`badge bg-${COLOR_THEME[Math.floor(Math.random() * COLOR_THEME.length)]} m-1`}>
                                                {item.item.name}
                                            </span>
                                        ))
                                    ) : (
                                        <b>No Held Items</b>
                                    )
                                ) : (
                                    "No Held Item"
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th className="pk-title-row" scope="row">
                                Height
                            </th>
                            <td>
                                <b>{pokemon.height ? pokemon.height : ""}</b>
                            </td>
                        </tr>
                        <tr>
                            <th className="pk-title-row" scope="row">
                                Weight
                            </th>
                            <td>
                                <b>{pokemon.weight ? pokemon.weight : ""}</b>
                            </td>
                        </tr>
                        <tr>
                            <th className="pk-title-row" scope="row">
                                Abilities
                            </th>
                            <td>
                                {pokemon.abilities ? (
                                    pokemon.abilities.length > 0 ? (
                                        pokemon.abilities.map((ability, i) => (
                                            <span key={i} className={`badge bg-${COLOR_THEME[Math.floor(Math.random() * COLOR_THEME.length)]} m-1`}>
                                                {ability.ability.name}
                                            </span>
                                        ))
                                    ) : (
                                        <b>No Abilities</b>
                                    )
                                ) : (
                                    "No Abilities"
                                )}
                            </td>
                        </tr>
                        {auth.isLogin && !isCatched ? (
                            <tr>
                                <th className="pk-title-row" scope="row">
                                    Catch Pokemon
                                </th>
                                <td>
                                    <button onClick={handleCatchPokemon} disabled={isCatching ? true : false} className={`pk-button ${isCatching ? "pk-disabled-button" : ""}`}>
                                        Catch Now!
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            ""
                        )}
                    </tbody>
                </table>
            ) : (
                ""
            )}
        </>
    );
}

function PokemonDetailOthers({ pokemon }) {
    return (
        <>
            <PokemonHeader title={"POKEMON SOUND"} />
            <div className="pk-detail-sound row">
                {pokemon.cries ? (
                    SOUND_THEME.map((theme) => (
                        <div key={theme} className="pk-sound col-sm-6 text-center my-4">
                            <h2>
                                <b>{theme.toUpperCase()}</b>
                            </h2>
                            <audio controls>
                                <source src={`${pokemon.cries[theme]}`} type="audio/ogg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))
                ) : (
                    <div className="pk-no-found">
                        <b>No Sound Found</b>
                    </div>
                )}
            </div>
            <PokemonHeader title={"POKEMON MOVES"} />
            {pokemon.moves ? <PokemonDetailMoves data={pokemon.moves} itemsPerPage={5} /> : "No Moves Found"}
            <PokemonHeader title={"POKEMON STATS"} />
            <PokemonDetailStats pokemon={pokemon} />
        </>
    );
}

function PokemonDetailMoves({ data, itemsPerPage }) {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            {currentItems.length > 0 ? (
                <div className="pk-table-moves pt-4">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="pk-no-table-moves pk-title-row">No</th>
                                <th className="pk-title-row">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, i) => (
                                <tr key={i}>
                                    <td className="pk-title-row">
                                        <b>{i + 1}</b>
                                    </td>
                                    <td>
                                        <b>{item.move.name}</b>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pk-pagination">
                        <button className={currentPage === 1 ? "pk-disabled-button" : ""} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                            Previous
                        </button>
                        <span className="pk-detail-move-page">
                            <b>{currentPage}</b>
                        </span>
                        <button className={indexOfLastItem >= data.length ? "pk-disabled-button" : ""} disabled={indexOfLastItem >= data.length} onClick={() => handlePageChange(currentPage + 1)}>
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="pk-no-found">
                    <b>No Moves Found</b>
                </div>
            )}
        </>
    );
}

function PokemonDetailStats({ pokemon }) {
    return (
        <>
            <div className="pk-detail-stats m-4">
                {pokemon ? (
                    <table className="table mx-auto my-auto">
                        <thead>
                            <tr>
                                <th className="pk-title-row">Name</th>
                                <th className="pk-title-row">Stat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemon.stats
                                ? pokemon.stats.map((stat, i) => (
                                      <tr key={i}>
                                          <td className="pk-title-row" scope="row">
                                              <b>{stat.stat.name}</b>
                                          </td>
                                          <td scope="row">
                                              <b>{stat.base_stat}</b>
                                          </td>
                                      </tr>
                                  ))
                                : "No Stats Found"}
                        </tbody>
                    </table>
                ) : (
                    <div className="pk-no-found">
                        <b>No Stats Found</b>
                    </div>
                )}
            </div>
        </>
    );
}

export default function PokemonDetail() {
    const [isCatching, setIsCatching] = useState(false);
    const [isCatched, setIsCatched] = useState(false);
    return (
        <>
            <NavigationBar />
            <div className="pk-lines"></div>
            <PokemonHeader title={"POKEMON INFO"} />
            <PokemonDetailUnit isCatching={isCatching} setIsCatching={setIsCatching} isCatched={isCatched} setIsCatched={setIsCatched} />
        </>
    );
}
