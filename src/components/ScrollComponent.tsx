import { Component } from "react";
import PokeCard from "./PokeCard";

export default class ScrollComponent extends Component<any, any> {
    observer: IntersectionObserver = {} as any;
    loadingRef: any;

    constructor(props: any) {
        super(props);

        this.state = {
            photos: [],
            loading: false,
            page: 10,
            prevY: 0,
        };
    }

    render() {
        const loadingCSS = {
            height: "100px",
            margin: "30px",
        };

        // To change the loading icon behavior
        const loadingTextCSS = {
            display: this.state.loading ? "block" : "none",
        };

        return (
            <div className="container">
                <div
                    className="row"
                    style={{
                        minHeight: "800px",
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    {this.getPokeCard()}
                </div>
                <div
                    ref={(loadingRef) => (this.loadingRef = loadingRef)}
                    style={loadingCSS}
                >
                    <span style={loadingTextCSS}>Loading...</span>
                </div>
            </div>
        );
    }

    getPokeCard() {
        const pokeCards = this.state.photos.map((pokemon: any) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={pokemon.id}>
                <PokeCard pokemon={pokemon} />
            </div>
        ));

        return pokeCards;
    }

    async componentDidMount() {
        await this.getPhotos(this.state.page);

        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        };

        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this),
            options
        );

        this.observer.observe(this.loadingRef);
    }

    async getPhotos(page: number) {
        this.setState({ loading: true });

        const limit = page > 0 ? 10 : 0;
        const offset = page <= 10 ? 0 : page - 10;

        try {
            console.log(
                `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
            );
            const resp = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
            );
            const data = await resp.json();

            const pokemons = await this.getEachPokemon(data.results);

            console.log(pokemons);

            this.setState({
                photos: [...this.state.photos, ...pokemons],
            });
            this.setState({ loading: false });
        } catch (error) {
            console.error(error);
        }
    }

    handleObserver(entities: any, observer: any) {
        const { photos } = this.state;
        const y = entities[0].boundingClientRect.y;

        if (this.state.prevY > y) {
            console.log(this.state.prevY);
            console.log(y);
            console.log(photos[photos.length - 1]);
            //     const lastPhoto = photos[photos.length - 1];
            //     const curPage = lastPhoto.id;
            this.getPhotos(photos.length + 10);
            //     this.setState({ page: curPage });
        }

        this.setState({ prevY: y });
    }

    async getEachPokemon(pokemons: any) {
        const pokemonsArr: any[] = [];

        for (const pokemonData of pokemons) {
            const pokemonImage: string = await new Promise(async (resolve) => {
                const resp = await fetch(pokemonData.url);
                const jsonData = await resp.json();

                const pokemonImage = jsonData;

                resolve(pokemonImage);
            });

            pokemonsArr.push(pokemonImage);
        }

        console.log(pokemonsArr);

        return pokemonsArr;
    }
}
