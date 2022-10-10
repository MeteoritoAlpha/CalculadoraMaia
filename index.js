const express = require('express');
const app  = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/calculo', async (request, response) => {
    const calculo = '5 baktuns'
    const dataCompleta = request.url.substring(request.url.indexOf('?')+1)
    
    const data = dataCompleta.split('/')
    const dia = data[0]
    const mes = data[1]
    const ano = data[2]


    console.log(dia, mes, ano)


    response.json(calculo)
});