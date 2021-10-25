import fetch from 'node-fetch';
import http from 'http'
import cheerio from 'cheerio';
import fs from 'fs';

const PORT = 3000;
const storedtext = fs.readFileSync('songs.txt').toString();
const token = "oevAmuh71xZFg1T9WhQfdPPXl4WcbIg1zW52b-NSMF68dO1rliZx8zRdXZUK1yxQ";

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

const get_results = async (query)=>{
  let rj = null
  const uri = encodeURI(query.trim())
  await fetch("https://api.genius.com/search?q="+ uri +"&access_token="+token)
  .then((res)=>res.json().then((rjson)=>{
    rj = rjson
  }));
  return rj
}

const get_hit_paths = (rj)=>{
  return rj.response.hits.map((el)=>{
    return el.result.path
  })
}



const scrapper = async (url)=>{
  const data = await get_data(url);
  const $ =  cheerio.load(data);
  const lyrics = $("p").text()
  return lyrics;
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
    for (let t in tracks_json){
      let hits = await get_results(tracks_json[t].song+" "+tracks_json[t].artist);
      let paths = get_hit_paths(hits);
      for(let p in paths){
        let song_url = "http://genius.com"+paths[p];
        console.log(song_url)
        const lyrics = await scrapper(song_url)
        console.log(lyrics)
      }
    }
}



main_func()
