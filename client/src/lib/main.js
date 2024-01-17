import getLyrics from "./getLyrics.js";
import getSong from "./getSong.js";
import axios from 'axios';
import FormData from 'form-data';
import {franc, francAll} from 'franc';

const options={
    apiKey:'wzTVvJ9dWy8iYMzWlpzGgd7VUjI4rpeGOaY5sjsIsvih7TPes-k_oMjLENA14V5Y',
    title:'baby',
    artist:'justin bieber',
    optimizeQuery:true
}

async function find_most_common_words(lyrics_string) {
    const words_array = lyrics_string.toLowerCase().split(/\W+/).filter(word => word.length > 0)
    const words_count = new Map();

    console.log(franc(lyrics_string.substring(0, 20)));

    for (let word of words_array) {
        if (words_count.has(word)) {
            words_count.set(word, words_count.get(word) + 1);
        } else {
            words_count.set(word, 1);
        }
    }

    let top_10_words = Array.from(words_count.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);


    // console.log(franc(top_10_words[4][0]));
    // for (let word of top_10_words) {
    //     console.log(`${word[0]} is ${franc(word[0])}`);
    // }

    // for (let word of top_10_words) {
    //     const formdata = new FormData();
    //     formdata.append("key", "5d2cf7af3acafdb9897c04b3e2bf24c6");
    //     formdata.append("txt", word[0]);
    
    //     const requestOptions = {
    //         method: 'post',
    //         url: "https://api.meaningcloud.com/lang-4.0/identification",
    //         headers: formdata.getHeaders(),
    //         data : formdata
    //     };
    
    //     const response = await axios(requestOptions)
    //         .then(response => response.data)
    //         .catch(error => console.log('error', error));
    
    //     if (response.language_list && response.language_list.length > 0) {
    //         console.log(`Word: ${word[0]}, Language: ${response.language_list[0].name}`);
    //     } else {
    //         console.log(`Word: ${word[0]}, Language: Unable to determine`);
    //     }
    // }
}

getSong(options).then((song)=> {
        find_most_common_words(`${song.lyrics}`)
    }
)