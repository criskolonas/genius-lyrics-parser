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

const get_search_results = async (query)=>{
  let rj = null
  const uri = encodeURI(query.trim())
  await fetch("https://api.genius.com/search?q="+ uri +"&access_token="+token)
  .then((res)=>res.json().then((rjson)=>{
    rj = rjson
  }));
  return rj.response.hits
}

const get_hit_ids = (hits)=>{
  return hits.map((el)=>{
    return el.result.id
  })
}


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
    for (let t in tracks_json){
      let hits = await get_search_results(tracks_json[t].song+" "+tracks_json[t].artist);
      let ids = get_hit_ids(hits);
      ids.array.forEach(id => {
        const song_document = "http://api.genius.com/songs/"+id+"&access_token="+token
      });
      //lyrics = do_that(url)
    }
}



main_func()

//do_that()
