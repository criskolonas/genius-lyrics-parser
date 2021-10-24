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

const get_data = async()=>{
  const response =await fetch("https://genius.com/Thouxanbanfauni-american-muscle-lyrics");
  const data = response.text()
  return data;
}

const scraper = (data)=>{
  const $ =  cheerio.load(data);
  const lyrics = $("p").text()
  return lyrics;
}
const do_that = async ()=>{
  const data = await get_data();
  console.log(scraper(data))
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
    console.log(tracks_json)
}



main_func()

//do_that()
