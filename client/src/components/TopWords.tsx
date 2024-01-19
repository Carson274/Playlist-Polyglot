const TopWords = ({ words }) => (
    <>
        {words.map((word, index) => (
            <div key={index} className="flex my-2 flex-col items-center">
                <div className="flex-grow mb-2">
                    <button className="cursor-none btn btn-lg btn-outline btn-secondary flex-grow">{word[0]}</button>
                </div>
                <button className="cursor-none btn btn-md btn-outline btn-secondary flex-grow">{word[1]}</button>
                <br />
            </div>
        ))}
    </>
);

export default TopWords;