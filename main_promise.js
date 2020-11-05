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

const endpoint = "https://gateway.marvel.com/v1/public"
const searchTerm = '/characters'
//console.log(baseURL + searchTerm)

const marvelCharacter = process.argv[2]

const fullURL = endpoint + searchTerm
const query = withQuery(fullURL, {
    apikey: pubKey,
    ts: timestamp,
    hash: md5(timestamp+priKey+pubKey),
    nameStartsWith: marvelCharacter
    })


fetch(query)
    .then(result => result.json())
    .then(result => {
        if (result.data.count <= 0) {
            return Promise.reject('Not Found')
        }

        const charId = result.data.results[0].id
        
        let ts = new Date().getTime().toString()
        const hash = md5(ts + priKey + pubKey)

        let url = withQuery(fullURL + `/characters/${charId}`, {
            ts, hash, apikey: pubKey,
        })
        return fetch(url)
    })
    .then(result => result.json())
    .then(result => {
        if (result.data.count <= 0){
            return null
            }
        console.info('final result: ', result.data.results[0])
        })
    .catch(e => console.error('Error: ', e))
    
