/**
 * Arquivo: src/face-detection.js 
 * Data: 06/04/2020
 * Descrição: Arquivo responsável por realizar o reconhecimento facial usando Face API & Node.js
 * Author: Marcio Cordeiro Gomes
 */

 'use strict';
 const request = require('request');

 require('dotenv').config();

 const subscriptionKey = process.env.SUBSCRIPTION_FACE_API_KEY;
 const uriBase = process.env.URI_BASE;
 
 // Foto de senhor com idade
 //const imageUrl = 'https://cdn-ofuxico.akamaized.net/img/upload/noticias/2019/05/13/silvio_santos_reproducao_instagram_349201_36.jpg';
 
 // exemplo de moça com óculos e sem expressão
 //const imageUrl = 'https://media.eotica.com.br/magpleasure/mpblog/upload/4/a/4a6a41f32d45226512ecbb4bbf6bb09b.jpg';
 
 // exemplo de moça com óculos e outros acessórios - não funcionou
 //const imageUrl = 'https://clinicasim.com/wp-content/uploads/2017/07/oculos-de-sol-768x384.jpg';

 // exemplo de moça com óculos, com colar e relógio.
 //const imageUrl = 'https://media.eotica.com.br/magpleasure/mpblog/upload/8/2/82b5cd6a36cdef5783718fd04852a337.jpg';

 // exemplo de engenheiro com óculos e chapeu
 //const imageUrl = 'https://azurecomcdn.azureedge.net/cvt-f5ab578f41fc8f93ac9c7f1cd40941f1dcde8887a48baba731a3bebf350cfb50/images/shared/cognitive-services-demos/face-detection/detection-3.jpg';

 // exemplo com 3 pessoas
 const imageUrl = 'https://progressive.in/wp-content/uploads/2018/02/download-1.jpg';

 const params = {
     'returnFaceId': 'true',
     'returnFaceLandmarks': 'false',
     'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
                             'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
 };

 const options = {
     uri: uriBase,
     qs: params,
     body: '{"url": ' + '"' + imageUrl + '"}',
     headers: {
         'Content-Type': 'application/json',
         'Ocp-Apim-Subscription-Key': subscriptionKey,
     }
 };

 request.post(options, (error, response, body) => {
    if (error) {
        console.log('Erro ao identificar a imagem: ', error);
        return;
    }

    console.log('Atributos:\n');
    let jsonResponse = JSON.stringify( JSON.parse(body), null, '  ');

    let jsonBody = JSON.parse(body);
    //console.log( jsonResponse );

    for (var p = 0; p < JSON.parse(body).length; p++)
    {
        console.log('\nAtributos gerais da pessoa ==> ' + (p+1));
        console.log( '\tSmile / Sorrindo: ' + (jsonBody[p].faceAttributes.smile >= 0.90 ? "Sim":"Não") );
        console.log( '\tGender / Sexo: ' + jsonBody[p].faceAttributes.gender );
        console.log( '\tAge / Idade: ' + jsonBody[p].faceAttributes.age );
        console.log( '\tGlasses / Lentes: ' + jsonBody[p].faceAttributes.glasses );

        // Cabelo no rosto identificado
        let grupoPropriedades = jsonBody[p].faceAttributes.facialHair;
        for (const property in grupoPropriedades) {
            const propertyValue = `${grupoPropriedades[property]}`
            if ( propertyValue >= 0.5) {
                console.log( `\tCabelo identicado na face: ${property}`);
            }
        }

        // Emoção identificada
        grupoPropriedades = jsonBody[p].faceAttributes.emotion;
        for (const property in grupoPropriedades) {
            const propertyValue = `${grupoPropriedades[property]}`
            if ( propertyValue >= 0.1) {
                console.log( `\tEmoção identicada na face: ${property}`);
            }
        }

        // Maquiagem
        grupoPropriedades = jsonBody[p].faceAttributes.makeup;
        for (const property in grupoPropriedades) {
            const propertyValue = `${grupoPropriedades[property]}`
            if ( propertyValue == 'true') {
                console.log( `\tMaquiagem identificada na face: ${property}`);
            }
        }
        
        // Acessórios
        grupoPropriedades = jsonBody[p].faceAttributes.accessories;
        for (var i=0; i < grupoPropriedades.length; i++) {
            // se o nível de confiança for maior que 70%
            if ( grupoPropriedades[i].confidence >= 0.7) {
                console.log('\tAcessório identificado: ' + grupoPropriedades[i].type );
            }    
        }

        // Acessórios
        grupoPropriedades = jsonBody[p].faceAttributes.hair.hairColor;
        for (var i=0; i < grupoPropriedades.length; i++) {
            // se o nível de confiança for maior que 100%
            if ( grupoPropriedades[i].confidence == 1) {
                console.log('\tCor do cabelo identificado: ' + grupoPropriedades[i].color );
            }    
        }
    }    
    
 });