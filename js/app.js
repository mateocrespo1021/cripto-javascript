//Campos
const form = document.querySelector("#form");
const selectMoneda = document.querySelector("#moneda");
const selectCriptomoneda = document.querySelector("#criptomoneda");
const cajaForm = document.querySelector("#cajaForm");
const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};
//Eventos
//Cuando el dom cargue
document.addEventListener("DOMContentLoaded", () => {
  obtenerCripto();
  form.addEventListener("submit", validarCampos);
  selectMoneda.addEventListener("change", leerValor);
  selectCriptomoneda.addEventListener("change", leerValor);
});

//Funciones

//Peticion con fetch
function obtenerCripto() {
  const URL =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
  fetch(URL)
    .then((respuesta) => respuesta.json())
    .then((resultado) => selectCripto(resultado.Data))
    .catch((error) => console.log(error));
}

//Llenar el select con las cripto
function selectCripto(data) {
  data.forEach((element) => {
    //Destructuring del element.CoinInfo
    const { FullName, Name } = element.CoinInfo;

    //Crear las option
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    selectCriptomoneda.appendChild(option);
  });
}

//Llenar el objeto
function leerValor(e) {
  objBusqueda[e.target.id] = e.target.value;
  console.log(objBusqueda);
}

//Valida campos

function validarCampos(e) {
  e.preventDefault();
  const { moneda, criptomoneda } = objBusqueda;
  if (moneda === "" || criptomoneda === "") {
    mensajeError("Todos los campos deben estar llenos");
    return;
  }

  //Validacion correcta
  validacionCorrecta(moneda, criptomoneda);
}

//Validacion y consulta a API

function validacionCorrecta(moneda, criptomoneda) {
  const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  fetch(URL)
    .then((respuesta) => respuesta.json())
    .then((resultado) => consultaAPI(resultado.DISPLAY[criptomoneda][moneda]))
    .catch((error) => console.log(error));
}

//Consulta la API

function consultaAPI(resultado) {
  //Desaparecer la caja main para msotrar lo consultado
  cajaForm.style.display = "none";
  //Remueve el div existente de la info
  removerDiv();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = resultado;

  //Contenedor div
  const div = document.createElement("div");
  div.classList.add("divInfo");
  //Precio
  const precio = document.createElement("p");
  precio.textContent = `Precio: ${PRICE}`;
  precio.classList.add("texto");
  div.appendChild(precio);

  //Precio más alto
  const precioAlto = document.createElement("p");
  precioAlto.textContent = `Precio más alto del día: ${HIGHDAY}`;
  precioAlto.classList.add("texto");
  div.appendChild(precioAlto);

  //Precio más bajo
  const precioBajo = document.createElement("p");
  precioBajo.textContent = `Precio más bajo del día: ${LOWDAY}`;
  precioBajo.classList.add("texto");
  div.appendChild(precioBajo);

  //Variación
  const variacion = document.createElement("p");
  variacion.textContent = `Variación de las 24 horas: ${CHANGEPCT24HOUR}`;
  variacion.classList.add("texto");
  div.appendChild(variacion);

  //Última actualización
  const actualizacion = document.createElement("p");
  actualizacion.textContent = `Ultima actualización: ${LASTUPDATE}`;
  actualizacion.classList.add("texto");
  div.appendChild(actualizacion);

  //Btn para volver
  const btnVolver = document.createElement("button");
  btnVolver.textContent = "Volver";
  btnVolver.classList.add("btnVolver");
  btnVolver.onclick=()=>{
    removerDiv();
    cajaForm.style.display = "flex";
    form.reset();
  }
  div.appendChild(btnVolver);

  main.appendChild(div);
}

//Limpiar html
function removerDiv() {
  if (document.querySelector(".divInfo")) {
    document.querySelector(".divInfo").remove();
  }
}

//Mensaje de error
function mensajeError(mensaje) {
  if (document.querySelector(".parrafo")) {
    return;
  }
  const parrafo = document.createElement("p");
  parrafo.textContent = mensaje;
  parrafo.classList.add("parrafo");
  form.append(parrafo);

  setTimeout(() => {
    parrafo.remove();
  }, 3000);
}
