const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require ('cheerio')

const app = express()


const imoveis = []

app.get('/conceito', (req, res) => {

    axios.get('https://www.conceitoimoveispg.com.br/busca/locacao/')
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)


        })

})



app.get('/', (req, res) => {
    res.json('Welcome to my real estate API')
})

app.listen(PORT, () =>  console.log(`server running on PORT ${PORT}`))
