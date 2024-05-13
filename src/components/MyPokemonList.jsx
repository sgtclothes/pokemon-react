import NoPokemonFound from "./NoPokemonFound";
import NavigationBar from "./NavigationBar";
import PokemonHeader from "./PokemonHeader";
import { useEffect } from "react";
import { API_BASE_URL, IMAGE_URL } from "./DataSource";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";

export default function MyPokemonList() {
    return (
        <>
            <NavigationBar />
            <div className="pk-lines"></div>
            <PokemonHeader title={"MY POKEMON LIST"} />
            <MyPokemonTable />
        </>
    );
}

function MyPokemonTable() {
    const { auth, myPokemons } = useSelector((state) => state);
    const [isReleasing, setIsReleasing] = useState(false);
    const [isReleased, setIsReleased] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [rename, setRename] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(API_BASE_URL + "/api/myPokemon", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: auth.token }),
                });
                const json = await response.json();
                setRename(Array(json.length).fill(""));
                dispatch({ type: "SET_MYPOKEMON", payload: json });
            } catch (error) {
                console.log(error);
            }
        })();
    }, [isReleased, isRenaming]);

    async function handleReleasePokemon(id) {
        try {
            setIsReleasing(true);
            setTimeout(async () => {
                const response = await fetch(API_BASE_URL + "/api/releasePokemon", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: auth.token, up_id: id }),
                });
                const json = await response.json();
                if (json.status === "success") {
                    setIsReleasing(false);
                    setIsReleased(!isReleased);
                    alert(json.message);
                } else {
                    setIsReleasing(false);
                    alert(json.message);
                }
            }, 10000);
        } catch (error) {
            console.log(error);
        }
    }

    function handleRenamePokemon() {
        setIsRenaming(!isRenaming);
    }

    async function handleSubmitRename(e, id, i) {
        e.preventDefault();
        const response = await fetch(API_BASE_URL + "/api/renamePokemon", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: auth.token, up_id: id, up_pk_nickname: rename[i] }),
        });
        const json = await response.json();
        if (json.status === "success") {
            setIsRenaming(false);
            setRename(Array(json.length).fill(""));
            alert(json.message);
        } else {
            setIsRenaming(false);
            alert(json.message);
        }
    }

    function handleRename(i, value) {
        const updatedName = [...rename];
        updatedName[i] = value;
        setRename(updatedName);
    }
    return (
        <>
            <div className="pk-mypokemon-list">
                {auth.isLogin ? (
                    <div>
                        {" "}
                        {isReleasing ? (
                            <div className="pk-release-pokemon">
                                <img src="../img/release-pokemon.jpg" alt="" />
                                <div style={{ color: "red" }}>
                                    <b>Releasing Pokemon...</b>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                        {myPokemons.length > 0 ? (
                            myPokemons.map((myPokemon, i) => (
                                <div key={i} className="row">
                                    <div className="col-sm-6 mb-4">
                                        <div className="title text-center">
                                            <b>{myPokemon.up_pk_nickname.toUpperCase()}</b>
                                        </div>
                                        <div className="text-center pk-mypokemon-image-container">
                                            <img src={`${IMAGE_URL}/${myPokemon.up_pk_api_id}.png`} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6 my-auto text-center">
                                        <div>
                                            <button disabled={isReleasing ? true : false} className={isReleasing ? "pk-disabled-button" : ""} onClick={() => handleReleasePokemon(myPokemon.up_id)}>
                                                Release
                                            </button>
                                            <button disabled={isReleasing ? true : false} className={isReleasing ? "pk-disabled-button" : ""} onClick={handleRenamePokemon}>
                                                Rename
                                            </button>
                                        </div>
                                        <div className="pk-rename">
                                            {isRenaming ? (
                                                <form onSubmit={(e) => handleSubmitRename(e, myPokemon.up_id, i)}>
                                                    <input onChange={(e) => handleRename(i, e.target.value)} value={rename[i]} style={{ height: "40px" }} type="text" />
                                                    <button className="pk-button">Rename Pokemon</button>
                                                </form>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <NoPokemonFound />
                        )}
                    </div>
                ) : (
                    <NoPokemonFound />
                )}
            </div>
        </>
    );
}
