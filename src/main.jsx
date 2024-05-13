import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createStore } from "redux";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "./index.css";

const initialState = {
    pokemons: [],
    pokemon: {},
    pokemonTypes: [],
    pokemonFilters: {
        input: "",
    },
    myPokemons: [],
    auth: {
        isLogin: false,
        token: localStorage.getItem("token") || "",
        loginData: {},
    },
    config: {
        pagination: {
            cursor: 0,
            totalData: 0,
            totalPage: 0,
            offset: 20,
            limit: 20,
            limitButton: 5,
            listNumberPage: [],
        },
    },
    methods: {
        fetchData: async (url) => {
            const response = await fetch(url);
            const json = await response.json();
            return json;
        },
    },
    errors: {
        handleImageError: (e) => {
            e.target.src = "../img/no-image.jpg";
        },
    },
};

initialState.config.pagination.listNumberPage = Array(initialState.config.pagination.limitButton)
    .fill(null)
    .map((_, i) => i + 1);

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_ALL_POKEMON":
            return { ...state, pokemons: action.payload };
        case "SET_AUTH":
            return { ...state, auth: action.payload };
        case "SET_POKEMON":
            return { ...state, pokemon: action.payload };
        case "SET_POKEMON_TYPES":
            return { ...state, pokemonTypes: action.payload };
        case "FILTER_POKEMON":
            return { ...state, pokemonFilters: action.payload };
        case "SET_PAGINATION_CONFIG":
            return { ...state, config: { pagination: action.payload } };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "SET_POKEMON_DETAIL_ID":
            return { ...state, pokemonDetail: action.payload };
        case "SET_MYPOKEMON":
            return { ...state, myPokemons: action.payload };
        default:
            return state;
    }
};

const store = createStore(rootReducer);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
);
