import NavigationBar from "./NavigationBar";
import Carousel from "./Carousel";
import PokemonList from "./PokemonList";

function Header() {
    return (
        <>
            <NavigationBar />
            <Carousel />
        </>
    );
}

export default function Home() {
    return (
        <>
            <Header />
            <PokemonList />
        </>
    );
}
