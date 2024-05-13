/* eslint-disable react/prop-types */
export default function PokemonHeader({ title }) {
    return (
        <>
            <div className="pk-detail-header">
                <div className="pk-info">
                    <b>{title}</b>
                </div>
            </div>
        </>
    );
}
