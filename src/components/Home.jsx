import NavigationBar from "./NavigationBar";
import Carousel from "./Carousel";
import PokemonList from "./PokemonList";

(async () => {
    let response = await fetch("/api/category/cactus?page=1");
    let json = await response.json();
    console.log(json);
})();

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
