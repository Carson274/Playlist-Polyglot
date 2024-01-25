const CardComponent = ({ title, imageSrc, imageAlt }) => (
    <div className="card w-1/4 bg-neutral shadow-xl transform transition duration-500 ease-in-out hover:scale-110">
        <figure><img className="p-8" src={imageSrc} alt={imageAlt} /></figure>
        <div className="card-body md:pb-2 lg:pb-6">
            <h2 className="card-title md:text-sm lg:text-lg">{title}</h2>
        </div>
    </div>
);

export default CardComponent;