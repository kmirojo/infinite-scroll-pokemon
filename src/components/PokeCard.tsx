import "../styles/poke-card.scss";

const PokeCard = ({ pokemon }: any) => {
    const { name, types } = pokemon;
    const imageDefault = pokemon.sprites.front_default;

    const getTypes = () => {
        const pokemonTypes = types.map((type: any) => (
            <span className="poke-card__type">{type.type.name}</span>
        ));

        return <span className="poke-card__types">{pokemonTypes}</span>;
    };

    return (
        <div className={`card poke-card poke-card__${types[0].type.name}`}>
            <div className="card-body">
                <h5 className="card-title poke-card__title">{name}</h5>
            </div>
            <img
                src={imageDefault}
                className="card-img-top poke-card__image"
                alt="..."
            />
            <div className="card-body">{getTypes()}</div>
        </div>
    );
};

export default PokeCard;
