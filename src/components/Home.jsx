import NavigationBar from "./NavigationBar";
import Carousel from "./Carousel";
import PokemonList from "./PokemonList";

(async()=> {
    let response = await fetch("http://103.186.1.188:3007/product/category/cactus?page=1");
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
