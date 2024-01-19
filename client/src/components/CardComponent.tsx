const CardComponent = ({ title, imageSrc, imageAlt }) => (
    <div className="card w-1/4 bg-neutral shadow-xl transform transition duration-500 ease-in-out hover:scale-110">
        <figure><img className="p-12" src={imageSrc} alt={imageAlt} /></figure>
        <div className="card-body">
            <h2 className="card-title">{title}</h2>
        </div>
    </div>
);

export default CardComponent;