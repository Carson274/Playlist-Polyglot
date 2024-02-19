const CardComponent = ({ title, imageSrc, imageAlt }) => (
<div className="card w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-neutral shadow-xl transform transition duration-500 ease-in-out hover:scale-110 min-h-52">
    <div className="p-4 md:p-8">
        <img src={imageSrc} alt={imageAlt} />
    </div>
    <div className="card-body relative flex flex-col justify-between p-4 md:pb-2 lg:pb-6">
        <h2 className="card-title mt-auto text-sm md:text-base lg:text-lg">{title}</h2>
    </div>
</div>
);
  
export default CardComponent;