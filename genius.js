import fetch from 'node-fetch';
import http from 'http'
import cheerio from 'cheerio';
import fs from 'fs';

const PORT = 3000;
const storedtext = fs.readFileSync('songs.txt').toString();

const server = http.createServer((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('Hello World');

});

server.listen(PORT,()=>{
    console.log('Server running at PORT:'+PORT);
})

const get_data = async(url)=>{
  const response =await fetch(url);
  const data = response.text()
  return data;
}

const get_search_results = async (query)=>{
  const uri = encodeURI(query.trim())
  await fetch("https://api.genius.com/search?q="+ uri +"&access_token=oevAmuh71xZFg1T9WhQfdPPXl4WcbIg1zW52b-NSMF68dO1rliZx8zRdXZUK1yxQ")
  .then((res)=>res.json().then((rjson)=>{
    console.log(rjson)
}));
  //return response.json()
}
get_search_results("way 2 sexy drake")

const scraper = (data)=>{
  const $ =  cheerio.load(data);
  const lyrics = $("p").text()
  return lyrics;
}
const do_that = async (url)=>{
  const data = await get_data(url);
  return scraper(data);
}



const main_func = async ()=>{
    let tracks = storedtext.split("\n");

    let tracks_json = tracks.map((track)=>{
        let [song,artist] = track.split(",")
        return new Object({
            'song': song,
            'artist' :artist
        })
    })
    for (t in tracks_json){
      result = await get_search_results(tracks_json[t].song+" "+tracks_json[t].artist)

      //lyrics = do_that(url)
    }
    let search_results = await get_search_results()

}



//main_func()

//do_that()
