const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require ('cheerio')

const app = express()

app.get('/conceito', (req, res) => {

    let pages = []
    let imoveis = []
    let promises = []

    axios.get('https://www.conceitoimoveispg.com.br/busca/locacao/')
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('.pagination> li', html).each(function() {
                page = $(this).find('a').text()
                pages.push(page);
            })
            last_page = pages[pages.length-2]
        })

        .then(response => {
            for(i=1;i<=last_page;i++){
                promises.push(
                    axios.get('https://www.conceitoimoveispg.com.br/busca/locacao/pag_'+i)
                    .then(response => {
                        const html = response.data
                        const $ = cheerio.load(html)
                        $('.searchItem').each(function() {
                            const title = $(this).find('.imobTitle > div > h2 > strong').text().trim()
                            const address = $(this).find('.hide').text().trim()
                            const type = $(this).find('.innerInfo').first().text().trim()
                            const neighbourhood = $(this).find('.innerInfo').last().text().trim()
                            const price = $(this).find('.imobPrice').text().trim()
                            const link = $(this).find('a').attr('href').trim()
                            
                            imoveis.push({
                                title
                                , address
                                , type
                                , neighbourhood
                                , price
                                , link
                            })

                        })
                    })               
                )
            }

            Promise.all(promises)
                .then((ok) => {
                    console.log('ok')
                    console.log(imoveis.length)
                    res.json(imoveis)
                })
        })
})




app.get('/', (req, res) => {
    res.json('Welcome to my real estate API')
})

app.listen(PORT, () =>  console.log(`server running on PORT ${PORT}`))
