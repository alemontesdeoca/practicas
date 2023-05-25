importar { Terminal } desde "@es-js/terminal"
importar { tiza } desde "https://cdn.jsdelivr.net/npm/@es-js/tiza@0.0.5/+esm"
importar cryptojs desde "https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/+esm"

importar.meta.env = {
  VITE_TOKEN: "e8f677817d15718c645a17ed3864ee53",
}

asincrono funcion obtenerPreciosApi() {
  Terminal.limpiar()

  const respuesta = esperar fetch(
    "https://dolar-api-argentina.vercel.app/v1/dolares/blue"
  )

  retornar respuesta
}

funcion obtenerPromedio(compra, venta) {
  retornar Mate.redondearHaciaArriba((compra + venta) / 2)
}

funcion mostrarValorCompra(cotizacion) {
  Terminal.escribir("Compra: $" + cotizacion.compra)
}

funcion mostrarValorVenta(cotizacion) {
  Terminal.escribir("Venta: $" + cotizacion.venta)
}

funcion mostrarPromedio(promedio) {
  Terminal.escribir("Promedio: $" + promedio)
}

funcion mostrarFechaDeCotizacion(cotizacion) {
  Terminal.escribir(
    "Fecha de cotización: " + formatearFecha(cotizacion.fechaActualizacion)
  )
}

funcion formatearFecha(fecha) {
  const fechaAux = crear Fecha(fecha)

  const dia = fechaAux.obtenerDia()
  const mes = fechaAux.obtenerMes() + 1
  const año = fechaAux.obtenerAño()

  const fechaFormateada = dia.aCadena() + "/" + mes.aCadena() + "/" + año

  retornar fechaFormateada
}

funcion mostrarCotizacion(cotizacion, promedio) {
  mostrarValorCompra(cotizacion)
  mostrarValorVenta(cotizacion)
  mostrarPromedio(promedio)
  mostrarFechaDeCotizacion(cotizacion)
}
asincrono funcion obtenerCotizacion() {
  const respuesta = esperar obtenerPreciosApi()

  const cotizacion = esperar respuesta.json()

  const promedio = obtenerPromedio(cotizacion.compra, cotizacion.venta)

  Terminal.escribir("Cotización del Dolar en Argentina")
  mostrarCotizacion(cotizacion, promedio)
  Terminal.escribir("Presiona ENTER para volver a consultar")

  esperar Terminal.leerEnter()
  obtenerCotizacion()
}

asincrono funcion login() {
  si (
    !importar.meta.env ||
    !importar.meta.env.VITE_TOKEN ||
    importar.meta.env.VITE_TOKEN.recortarEspacios() == ""
  ) {
    retornar Terminal.escribir(
      tiza.fondoRojo('Debes definir la Variable de Entorno "VITE_TOKEN"')
    )
  }

  Terminal.escribir("Hola! Ingresa la contraseña")

  const contraseña = esperar Terminal.leer()

  si (calcularMd5(contraseña) == importar.meta.env.VITE_TOKEN) {
    obtenerCotizacion()
  } sino {
    Terminal.escribir(tiza.fondoRojo("Contraseña incorrecta"))
    Terminal.escribir("Presiona ENTER para volver a intentar")
    esperar Terminal.leerEnter()
    Terminal.limpiar()
    inicio()
  }
}

funcion calcularMd5(cadena) {
  retornar cryptojs.MD5(Cadena(cadena)).aCadena()
}

login()
