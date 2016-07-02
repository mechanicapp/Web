var express = require('express');
var app = express();
var path = require('path');
const PORT = 8000;

app.use(express.static(path.join(__dirname, 'public')));

// Escucha en el puerto 8080 y corre el server
app.listen(PORT, function() {
    console.log('App listening on port ' + PORT);
});



/*--- CONSTANTES ---*/

var API_KEY = "AIzaSyBQq1f_dETVPO8PghhM2WKAf8KYJE7PjWY";

/*--- REQUERIMIENTOS ---*/

var firebase = require("firebase");
var distance = require('google-distance');
var dateFormat = require('dateformat');

/*--- INICIALIZANDO ---*/

firebase.initializeApp({
  serviceAccount: "MechanicApp-dbe6c5fb803e.json",
  databaseURL: "https://mechanic.firebaseio.com"
});

distance.apiKey = API_KEY;
var timestamp = -1 * new Date().valueOf();
var db = firebase.database();
var clientes = db.ref("Clientes");
var servicios = db.ref("Servicios");
var partners = db.ref("Partner");
var serviciosActivos = db.ref("Partner/serviciosActivos");


/*--- VARIABLES ---*/

var count = 0;
var idServicio;
var descripcion;
var initLat;
var initLng;
var endLat;
var endLng;
var tipoServicio;
var distancia;
var tiempo;
var idPartnerCancelado;
var tomado;
var distanciaServicio;
var tiempoServicio;
var direccionServicio;
var motivo;
var detallesCancelacion;
var latPartner
var lngPartner
var idCliente
var placa;
var vehiculo;

/*--- ESCUCHADORES ---*/

/*--- NUEVOS SERVICIOS ---*/
servicios.on("child_added", function(snap){
  idServicio = snap.key
  descripcion = snap.val().descripcion;
  tipoServicio = snap.val().tipoServicio;
  initLat = snap.val().initLat;
  initLng = snap.val().initLng;
  endLat = snap.val().endLat;
  endLng = snap.val().endLng;
  tomado = snap.val().tomado;
  tipoVehiculo = snap.val().tipoVehiculo;
  direccionServicio = snap.val().direccionDestino;
  if(tomado != 1){
    switch (tipoServicio){
      case 1:
        agregarMecanico(idServicio, descripcion, tipoServicio, initLat, initLng, tipoVehiculo);
        break;
      case 2:
        agregarTaller(idServicio, descripcion, tipoServicio, initLat, initLng, tipoVehiculo);
        break;
      case 3:
        agregarGrua(idServicio, descripcion, direccionServicio, tipoServicio, initLat, initLng, endLat, endLng, tipoVehiculo);
        break;
    }
  }
});

/*--- CAMBIOS ESTADO SERVICIO ---*/

servicios.on("child_changed", function(snap){
  var tomado = snap.val().tomado;
  var idServicio = snap.key;
  var aceptado = snap.val().aceptado;

  descripcion = snap.val().descripcion;
  tipoServicio = snap.val().tipoServicio;
  initLat = snap.val().initLat;
  initLng = snap.val().initLng;
  endLat = snap.val().endLat;
  endLng = snap.val().endLng;
  idCliente = snap.val().uidCliente;

});


/*--- FUNCIONES ---*/

/*--- CUANDO PIDEN SERVICIO MECANICO --- */
function agregarMecanico(idServicio, descripcion, tipoServicio, initLat, initLng, tipoVehiculo){
  var ubCliente = initLat + "," + initLng;
  partners.orderByChild("activo").equalTo(1).on("child_added", function(snapshot){
    var valores = snapshot.val();
    var online = valores.online;
    var ocupado = valores.ocupado;
    var idPartnerS = snapshot.key;
    if(online == 1){
      if(ocupado == 2){
        latPartner = valores.lat;
        lngPartner = valores.lng;
        var ubPartner = latPartner + "," + lngPartner;
        distance.get(
          {
            origin: ubCliente,
            destination: ubPartner,
            index: 1,
            language: 'es',
            mode: 'driving'
          },
          function(err, data){
            if(err) return console.log(err);
            var json = JSON.stringify(data);
            var obj = JSON.parse(json);
            var dist = obj['distanceValue'];
            distancia = obj['distance'];
            tiempo = obj['duration'];
            if(dist < 10000){
              serviciosActivos.push().set({
                idPartner: idPartnerS,
                timestamp: timestamp,
                idServicio: idServicio,
                descripcion: descripcion,
                distancia: distancia,
                tiempo: tiempo,
                tipoServicio: tipoServicio,
                tipoVehiculo: tipoVehiculo
              });
            }
          });
      }
    }
  });
}

/*--- CUANDO PIDEN SERVICIO DE CARRO TALLER ---*/
function agregarTaller(idServicio, descripcion, tipoServicio, initLat, initLng, tipoVehiculo){
  var ubCliente = initLat + "," + initLng;
  partners.orderByChild("activo").equalTo(1).on("child_added", function(snapshot){
    var valores = snapshot.val();
    var online = valores.online;
    var ocupado = valores.ocupado;
    var idPartnerS = snapshot.key;
    if(online == 1){
      if(ocupado == 2){
        latPartner = valores.lat;
        lngPartner = valores.lng;
        var ubPartner = latPartner + "," + lngPartner;
        distance.get(
          {
            origin: ubCliente,
            destination: ubPartner,
            index: 1,
            language: 'es',
            mode: 'driving'
          },
          function(err, data){
            if(err) return console.log(err);
            var json = JSON.stringify(data);
            var obj = JSON.parse(json);
            var dist = obj['distanceValue'];
            distancia = obj['distance'];
            tiempo = obj['duration'];
            if(dist < 10000){
              serviciosActivos.push().set({
                idPartner: idPartnerS,
                timestamp: timestamp,
                idServicio: idServicio,
                descripcion: descripcion,
                distancia: distancia,
                tiempo: tiempo,
                tipoServicio: tipoServicio,
                tipoVehiculo: tipoVehiculo
              });
            }
          });
      }
    }
  });
}

/*--- CUANDO PIDEN UN SERVICIO DE GRUA ---*/
function agregarGrua(idServicio, descripcion, direccionServicio, tipoServicio, initLat, initLng, endLat, endLng, tipoVehiculo){
  var ubCliente = initLat + "," + initLng;
  var deCliente = endLat + "," + endLng;
  partners.orderByChild("activo").equalTo(1).on("child_added", function(snapshot) {
    var online = snapshot.val().online;
    var ocupado = snapshot.val().ocupado;
    var idPartnerS = snapshot.key;
    if(online == 1){
      if(ocupado == 2){
        latPartner = snapshot.val().lat;
        lngPartner = snapshot.val().lng;
        var ubPartner = latPartner + "," + lngPartner;
        distance.get(
          {
            origin: ubCliente,
            destination: ubPartner,
            index: 1,
            language: 'es',
            mode: 'driving'
          },
          function(err, data) {
            if (err) return console.log(err);
            var json=JSON.stringify(data);
            var obj = JSON.parse(json);
            var dist = obj['distanceValue'];
            distancia = obj['distance'];
            tiempo = obj['duration'];
            if(dist < 10000){
              distance.get(
                {
                  origin: ubCliente,
                  destination: deCliente,
                  index: 1,
                  language: 'es',
                  mode: 'driving'
                },
                function(err,data){
                  if (err) return console.log (err);
                  var json = JSON.stringify(data);
                  var obj = JSON.parse(json);
                  distanciaServicio = obj['distance'];
                  tiempoServicio = obj['duration'];
                  serviciosActivos.push().set({
                    idPartner: idPartnerS,
                    idServicio: idServicio,
                    timestamp: timestamp,
                    descripcion: descripcion,
                    distancia: distancia,
                    tiempo: tiempo,
                    distanciaServicio: distanciaServicio,
                    tiempoServicio: tiempoServicio,
                    direccionServicio: direccionServicio,
                    tipoServicio: tipoServicio,
                    endLat: endLat,
                    endLng: endLng,
                    tipoVehiculo: tipoVehiculo
                  });
                }
              )
            }
        });
      }
    }
  });
}
