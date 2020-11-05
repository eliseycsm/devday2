// const express = require('express')
// const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default
const md5 = require('md5')

const pubKey = '1737b9f4c507031ec34abb0631ad6b2d'
const priKey = '6e4afde7d76951c3749d11f61eddf601de24e0d0'
const timestamp = new Date().toString()// or new Date().getTime()

// //create instance of express
// const app = express()

const endpoint = "https://gateway.marvel.com"
const searchTerm = '/v1/public/characters'
//console.log(baseURL + searchTerm)
const fullURL = endpoint + searchTerm

async function result() {
    const query = withQuery(fullURL, {
        apikey: pubKey,
        ts: timestamp,
        hash: md5(timestamp+priKey+pubKey)
        })

    const result = await fetch(query)
    console.info('fetch done')
    const p = await result.json()
    
   /*  code, status, copyright, etag, data, attributionTExt, attributionHTML
   where
   data: {
        offset: 0,
        limit: 20,
        total: 1493,
        count: 20,
        results: [char objs]} 
    object: 
        id, name, description, modified, 
        thumbnail(path, extension), resourceURI,
        comics(available, collectionURI, items[], returned),
        series(available, collectionURI, items[], returned),
        stories(format as above line),
        events(format as above line),
        urls(objects of (type,url))
        
        
        */
    console.info(p.data)
    //console.info(p.data.results[0]['urls'])
}

result().catch(e) {
    console.info(`Error is: ${e}`)
}