import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PokemonDetail from "./components/PokemonDetail";
import MyPokemonList from "./components/MyPokemonList";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/detail/:id" element={<PokemonDetail />} />
                    <Route path="/mypokemon" element={<MyPokemonList />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
