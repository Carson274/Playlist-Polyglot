import { useEffect, useState } from 'react';
import axios from 'axios';

const SONGS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";


const Top_Songs_Page = ({ token, logout }) => {

    const [data, setData] = useState({})

    const handleGetSongs = () => {
        axios
            .get(SONGS_ENDPOINT, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        handleGetSongs();
    }, []);

    return (
        <>
            <button onClick={logout}>Logout</button>
            {data?.items ? data.items.map((item) => (
                <div key={item.id}>
                    <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        {item.name}
                    </a>
                </div>
            )) : null}
        </>
    )

};

export default Top_Songs_Page;