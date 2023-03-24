// Server Packages
const express = require('express');
const app = express();

// Server Channel
const PORT = process.env.PORT || 3000;

// Tool To Get Data Packages
const axios = require('axios');

// Web Scraping Packages
const {parse} = require('himalaya');


//Helper Functions
function formatBookInput(book) {
    book.toLowerCase();
    switch (book) {
      case "ezekiel":
        book = "ezk";
        break;
      case "judges":
        book = "jdg";
        break;
      case "philippians":
        book = "php";
        break;
      case "nahum":
        book = "nam";
        break;
      case "mark":
        book = "mrk";
        break;
      case "john":
        book = "jhn";
        break;
      case "philemon":
        book = "phm";
        break;
      case "james":
        book = "jas";
        break;
      case "1john":
        book = "1jn";
        break;
      case "2john":
        book = "2jn";
        break;
      case "3john":
        book = "3jn";
        break;
      default:
        book = book.substring(0, 3);
        break;
    }
    return book.toUpperCase();
  }
function getWhatYouSearchedFor(array){
    return array[array.length - 1];
}

// Global Variables
const bible_Verse_Html_Verse_Text = []
let bibleVerseSearchedFor;


app.get('/', (req,res) => {
    res.json({
        bibleVerseSearchedFor
    });
});

app.get('/verse/:book/:chapter/:verse', (req,res) => {

    // url input
    const book = formatBookInput(req.params.book);
    const chapter = req.params.chapter;
    const verse = req.params.verse;

    // sites to get data from
    const urls = [`https://www.bible.com/bible/100/${book}.${chapter}.${verse}.NASB1995.html`];

    // mapping all sites to get data from
    const request = urls.map((url) => axios.get(url));

    axios.all(request)
    .then((response) => {
        // Getting response from axios
            let bible_Verse_Html = response[0].data;
            // himalaya converting data to json
            let bible_Verse_Html_To_Json =   parse(bible_Verse_Html );
            // Going through json and grabbing bible verse
            let bible_Verse_Html_To_Json_Response = bible_Verse_Html_To_Json[1].children[0].children[42].children[0].content;
            // Splitting string where we can take away unnecessary words
            let bible_Verse_Html_Verse_Array = bible_Verse_Html_To_Json_Response.split('|');
            // Grabbing bible verse from first index
            let veresText = bible_Verse_Html_Verse_Array[0];
            bible_Verse_Html_Verse_Text.push({
               veresText
            });
            bibleVerseSearchedFor = bible_Verse_Html_Verse_Text[bible_Verse_Html_Verse_Text.length - 1];
            // End of Bible Verse =============================================================================
    }).catch((err) => console.log(err));
    res.json({
        bibleVerseSearchedFor
    });
});

app.listen(PORT, () => {console.log(`Listening On Port:${PORT}`)});