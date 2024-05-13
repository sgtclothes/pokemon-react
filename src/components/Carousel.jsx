export default function Carousel() {
    const banners = [
        {
            id: 1,
            active: true,
        },
        {
            id: 2,
            active: false,
        },
        {
            id: 3,
            active: false,
        },
    ];
    return (
        <>
            <div className="pk-lines"></div>
            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {banners.map((banner) => (
                        <div key={banner.id} className={`carousel-item ${banner.active ? "active" : ""}`}>
                            <img className="d-block w-100 h-100" src={`./img/pokemon-banner-${banner.id}.png`} alt="First slide" />
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className="pk-lines"></div>
        </>
    );
}
