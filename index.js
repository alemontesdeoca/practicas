import { Terminal } from "@es-js/terminal";
import { tiza } from "@es-js/tiza";
import * as CryptoJS from "crypto-js";

import.meta.env = {
  VITE_TOKEN: "e8f677817d15718c645a17ed3864ee53",
}

async function obtenerPreciosApi() {
  Terminal.limpiar();

  const respuesta = await fetch(
    "https://dolar-api-argentina.vercel.app/v1/dolares/blue"
  );

  return respuesta;
}

function obtenerPromedio(compra, venta) {
  return Math.ceil((compra + venta) / 2);
}

function mostrarValorCompra(cotizacion) {
  Terminal.escribir("Compra: $" + cotizacion.compra);
}

function mostrarValorVenta(cotizacion) {
  Terminal.escribir("Venta: $" + cotizacion.venta);
}

function mostrarPromedio(promedio) {
  Terminal.escribir("Promedio: $" + promedio);
}

function mostrarFechaDeCotizacion(cotizacion) {
  Terminal.escribir(
    "Fecha de cotización: " + formatearFecha(cotizacion.fechaActualizacion)
  );
}

function formatearFecha(fecha) {
  const fechaAux = new Date(fecha);

  const dia = fechaAux.getDate();
  const mes = fechaAux.getMonth() + 1;
  const año = fechaAux.getFullYear();

  const fechaFormateada = dia.toString().padStart(2, '0') + "/" + mes.toString().padStart(2, '0') + "/" + año;

  return fechaFormateada;
}

function mostrarCotizacion(cotizacion, promedio) {
  mostrarValorCompra(cotizacion);
  mostrarValorVenta(cotizacion);
  mostrarPromedio(promedio);
  mostrarFechaDeCotizacion(cotizacion);
}

async function obtenerCotizacion() {
  const respuesta = await obtenerPreciosApi();

  const cotizacion = await respuesta.json();

  const promedio = obtenerPromedio(cotizacion.compra, cotizacion.venta);

  Terminal.escribir("Cotización del Dolar en Argentina");
  mostrarCotizacion(cotizacion, promedio);
  Terminal.escribir("Presiona ENTER para volver a consultar");

  await Terminal.leerEnter();
  obtenerCotizacion();
}

async function login() {
  if (
    !import.meta.env ||
    !import.meta.env.VITE_TOKEN ||
    import.meta.env.VITE_TOKEN.trim() === ""
  ) {
    return Terminal.escribir(
      tiza.fondoRojo('Debes definir la Variable de Entorno "VITE_TOKEN"')
    );
  }

  Terminal.escribir("Hola! Ingresa la contraseña");

  const contraseña = await Terminal.leer();

  if (calcularMd5(contraseña) === import.meta.env.VITE_TOKEN) {
    obtenerCotizacion();
  } else {
    Terminal.escribir(tiza.fondoRojo("Contraseña incorrecta"));
    Terminal.escribir("Presiona ENTER para volver a intentar");
    await Terminal.leerEnter();
    Terminal.limpiar();
    inicio();
  }
}

function calcularMd5(cadena) {
  return CryptoJS.MD5(String(cadena)).toString();
}

login();
