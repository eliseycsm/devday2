const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default
const md5 = require('md5')

const pubKey = '1737b9f4c507031ec34abb0631ad6b2d'
const priKey = '6e4afde7d76951c3749d11f61eddf601de24e0d0'
const timestamp = new Date().toString()// or new Date().getTime()

const PORT = 3000;

//create instance of express
const app = express()


app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

if(pubKey && priKey) {
    app.listen(PORT, () => {
        console.info(`Application started on port ${PORT} at ${new Date()}`)
        console.info(`with valid keys ${priKey} & ${pubKey}`)
    })
} else {
    console.error('either of the key is missing')
}




const endpoint = "https://gateway.marvel.com/v1/public"
const searchTerm = '/characters'
//console.log(baseURL + searchTerm)

const marvelCharacter = process.argv[2]

const fullURL = endpoint + searchTerm

async function findCharacters(name) {
    let query = withQuery(fullURL, {
        apikey: pubKey,
        ts: timestamp,
        hash: md5(timestamp+priKey+pubKey),
        nameStartsWith: name
        })

    const result = await fetch(query)
    const p = await result.json()

    if (p.data.count <= 0) 
        return -1
    return parseInt(p.data.results[0].id)
}

const getCharDetails = async (charId) => {
    let ts = new Date().toString()
    const hash = md5(ts + priKey + pubKey)

    let query = withQuery(fullURL + `/${charId}` , {
        apikey: pubKey,
        ts,
        hash
        })

    let result = await fetch(query)
    const p = await result.json()

    console.info('fetch done, ', p)

    if (p.data.count <= 0) null
    return p.data.results
}

const run = async() => {

    const charId = await findCharacters(marvelCharacter)
    const data = await getCharDetails(charId)

    if (data)
        return JSON.stringify(data)
    return "{}"
}

run()
    .then(result => {
        console.info(result)
})