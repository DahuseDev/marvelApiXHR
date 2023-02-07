let url="https://gateway.marvel.com:443/v1/public/";
let privateKey="2bfb960a6dcdfc26cc5d114dc8b61a0eb4fa2189";
let publicKey="88cf2b13d56278fb815edae1c64a3d79";
let ts="1";
let hash=md5(ts+privateKey+publicKey);
let name;
let xhr = new XMLHttpRequest();

  

window.onload=function(){
    document.getElementById('btn').addEventListener('click',function(){
        name=document.getElementById('nom').value;
        doRequest();
    })   
}


function doRequest(){
    try{
        let loader = document.getElementById('loader');
        loader.style.display="block";
        xhr.open("GET", getURL()); 
        xhr.send(); 
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200){
                generarContingut(JSON.parse(this.responseText).data.results)
            }
        }
        
    } catch(err){
        throw new err("No s'ha pogut fer la petició"); 
    }
}
function getURL(){
    let api=`${url}`;
    api+='characters?&';
    if(name!=""){
        api+=`nameStartsWith=${name}&`;
    }
    api+=`limit=1&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    console.log(api)
    return api;
}
function getComics(uri){
    xhr.open("GET",uri); 
    xhr.send(); 
    xhr.addEventListener('progress', (event) => {
        console.log(event)
        if(event.lengthComputable){
            console.log(event.loaded+" / "+event.total)
        }
    })
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){          
            let resposta = JSON.parse(this.responseText).data.results; 
            resposta.forEach(comic=>{
                marvel.innerHTML += "<div class='box'>"+
                "<div class='box-front'><img src='"+comic.thumbnail.path+"."+comic.thumbnail.extension+"'><p>" +comic.title+ "</p></div>"+
                "<div class='box-back'><h1>Datos</h1><p>Precio: "+comic.prices[0].price+"$</p><p> Fecha: "+comic.dates[0].date.split("T")[0]+"</p></div></div>";
            })
        }
    }
}
async function generarContingut(elements) {
    console.log(elements)
    let personatge = elements[0];
    let comics = personatge.comics.items;
    let marvel = document.getElementById("marvel");
    marvel.innerHTML="";
    let uri= url+`comics?characters=${personatge.id}&limit=100&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    await getComics(uri)
    
    setTimeout((()=>{
        let marvel = document.getElementById("marvel");
        marvel.style.display="grid";
        console.log("ready")
        document.getElementById('loader').style.display="none";
        let frontBox = document.getElementsByClassName('box-front');
        let backBox = document.getElementsByClassName('box-back');
        for(let i=0;i<frontBox.length;i++){ 
            frontBox[i].addEventListener("click", (()=>{
                frontBox[i].style.display="none";
                backBox[i].style.display="flex";
                console.log("Hola"); 
            }));
        }

        for(let i=0;i<backBox.length;i++){ 
            backBox[i].addEventListener("click", (()=>{
                backBox[i].style.display="none";
                frontBox[i].style.display="block";
                console.log("Hola"); 
            }));
        }
    }),2000)
}
    


function comicRequest(URI){
    fetch(URI+`?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
        .then(res =>{return res.json()})
        .then((json)=>{
            resposta=json;
        })
        .catch(err => console.error(err)) 
}