var express = require('express');
var app = express();
var path = require('path');
const PORT = 8000;

app.use(express.static(path.join(__dirname, 'public')));

// Escucha en el puerto 8080 y corre el server
app.listen(PORT, function() {
    console.log('App listening on port ' + PORT);
});

/* --------------------- APP ------------------------- */

  /*--- CONSTANTES ---*/
  var API_KEY = "AIzaSyAnKxRYj7wc2ZqiRx3yPEbl_ICNB0Rrp7I";
  const URL_PRINCIPAL = "https://mechanic.firebaseio.com/";
  const URL_CLIENTES = URL_PRINCIPAL + "Clientes/";
  const URL_SERVICIOS = URL_PRINCIPAL + "Servicios/";
  const URL_PARTNER = URL_PRINCIPAL + "Partner/";
  const URL_SERVICIOS_ACTIVOS = URL_PARTNER + "servicios_activos/";


  /*--- REQUERIMIENTOS ---*/

  var Firebase = require("firebase");
  var distance = require('google-distance');
  var dateFormat = require('dateformat');

  /*--- INICIALIZANDO ---*/
  var principal = new Firebase(URL_PRINCIPAL);
  var token = "ZbxlaQ9QYcTNyCEm2mUyzU2ywAfULwGVSXs40IjK";
  principal.authWithCustomToken(token, function(error, authData) { /* Your Code */ }, {
    remember: "default"
  });
  var clientes = new Firebase(URL_CLIENTES);
  var partner = new Firebase(URL_PARTNER);
  var servicios = new Firebase(URL_SERVICIOS);
  var serviciosActivos = new Firebase(URL_SERVICIOS_ACTIVOS);
  distance.apiKey = API_KEY;
  var timestamp = -1 * new Date().valueOf();
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
  var latPartner;
  var lngPartner;
  var idCliente;
  var placa;
  var vehiculo;

  /*--- LISTENERS ---*/

    /*--- Nuevos Servicios ---*/
    servicios.on("child_added", function(snap) {
          idServicio = snap.key();
          descripcion = snap.val().descripcion;
          tipoServicio = snap.val().tipoServicio;
          initLat = snap.val().initLat;
          initLng = snap.val().initLng;
          endLat = snap.val().endLat;
          endLng = snap.val().endLng;
          tomado = snap.val().tomado;
          vehiculo = snap.val().vehiculo;
          direccionServicio = snap.val().direccionServicio;
          if(tomado != 1){
            switch (tipoServicio) {
              case "Grua":
                  agregarGrua(idServicio, descripcion, direccionServicio, tipoServicio, initLat, initLng, endLat, endLng, vehiculo);
                break;
              case "Taller":
                  agregarTaller(idServicio, descripcion, tipoServicio, initLat, initLng, vehiculo);
                break;

            }
          }

      });

      /*--- Cambios Estado Servicio ---*/
      servicios.on("child_changed", function(snap){
        var tomado = snap.val().tomado;
        var idServicio = snap.key();
        var aceptado = snap.val().aceptado;

        //---- Para nuevas notificaciones cuando el servicio es cancelado o no tomado
        descripcion = snap.val().descripcion;
        tipoServicio = snap.val().tipoServicio;
        initLat = snap.val().initLat;
        initLng = snap.val().initLng;
        idCliente = snap.val().idCliente;
        endLat = snap.val().endLat;
        endLng = snap.val().endLng;
        latPartner = snap.val().latPartner;
        lngPartner = snap.val().lngPartner;
        tomado = snap.val().tomado;
        terminado = snap.val().terminado;
        direccion = snap.val().direccion;
        placa = snap.val().placa;
        vehiculo = snap.val().vehiculo;
        calificacion = snap.val().calificacion;
        direccionServicio = snap.val().direccionServicio;
        urlServicio = new Firebase(URL_SERVICIOS + idServicio);
        urlDetallesServicio = new Firebase(URL_SERVICIOS + idServicio + "/serviciosDetalles");
        urlListaServicios = new Firebase(URL_SERVICIOS + idServicio + "/servicios");

        /*--- Elimina Notificaciones Servicios cuando es tomado ---*/
        if(tomado == 1){
          serviciosActivos.orderByChild("idServicio").equalTo(idServicio).on("child_added", function(snap) {
            var removeNotificiaciones = new Firebase(URL_SERVICIOS_ACTIVOS + snap.key());
            removeNotificiaciones.remove();
          });
        }
        /*--- Al terminar el servicio ---*/
        if(terminado == 5){
          var urlCliente = new Firebase(URL_CLIENTES + idCliente + "/Historial");
          var datosPartner = new Firebase(URL_SERVICIOS + idServicio + "/serviciosDetalles");
          var urlEliminada = new Firebase(URL_SERVICIOS + idServicio);
          datosPartner.on("value", function(snapshot){
            var date = new Date();
            //var fecha = date.toLocaleDateString();
            var fecha = dateFormat(date, "yyyy-mm-dd");
            var hora = date.toLocaleTimeString();
            var idPart = snapshot.val().idPartner;
            var urlPartner = new Firebase(URL_PARTNER + idPart + "/Historial");
            var timestamp = -1 * new Date().valueOf();
            if(tipoServicio == "Grua"){
              urlPartner.push({
                idServicio: idServicio,
                timestamp: timestamp,
                fecha: fecha,
                hora: hora,
                descripcion: descripcion,
                valor: snapshot.val().valor,
                descripcionOfrecido: snapshot.val().descripcion,
                calificacion: calificacion,
                tipoServicio: tipoServicio,
                direccionServicio: direccionServicio,
                direccion: direccion,
                initLat: initLat,
                initLng: initLng,
                endLat: endLat,
                endLng: endLng,
                placa: placa,
                vehiculo: vehiculo,
                idPartner: snapshot.val().idPartner
              });
              urlCliente.push({
                idServicio: idServicio,
                timestamp: timestamp,
                fecha: fecha,
                hora: hora,
                descripcion: descripcion,
                idPartner: snapshot.val().idPartner,
                valor: snapshot.val().valor,
                descripcionOfrecido: snapshot.val().descripcion,
                calificacion: calificacion,
                tipoServicio: tipoServicio,
                direccionServicio: direccionServicio,
                direccion: direccion,
                initLat: initLat,
                initLng: initLng,
                endLat: endLat,
                placa: placa,
                vehiculo: vehiculo,
                endLng: endLng,
                idPartner: snapshot.val().idPartner
              });
            }else{
              urlPartner.push({
                idServicio: idServicio,
                timestamp: timestamp,
                fecha: fecha,
                hora: hora,
                valor: snapshot.val().valor,
                descripcion: descripcion,
                descripcionOfrecido: snapshot.val().descripcion,
                calificacion: calificacion,
                tipoServicio: tipoServicio,
                direccion: direccion,
                initLat: initLat,
                initLng: initLng,
                placa: placa,
                vehiculo: vehiculo,
                idPartner: snapshot.val().idPartner
              });
              urlCliente.push({
                idServicio: idServicio,
                timestamp: timestamp,
                fecha: fecha,
                hora: hora,
                descripcion: descripcion,
                idPartner: snapshot.val().idPartner,
                valor: snapshot.val().valor,
                descripcionOfrecido: snapshot.val().descripcion,
                calificacion: calificacion,
                tipoServicio: tipoServicio,
                direccion: direccion,
                initLat: initLat,
                initLng: initLng,
                placa: placa,
                vehiculo: vehiculo,
                idPartner: snapshot.val().idPartner
              });
            }
          });
          datosPartner.off();
          urlEliminada.remove();
        }
        /*--- Para volver a notificar a los partner ---*/
        if(aceptado == 2){
          urlServicio.update({
            aceptado: 4,
            tomado: 4
          })
          urlDetallesServicio.update({
            aceptado: 2
          });
          urlDetallesServicio.on("value", function(sna){
            if(sna.val().aceptado == 2){
              motivo = sna.val().motivo;
              var valor = sna.val().valor;
              var desSer = sna.val().valor;
              idPartnerCancelado = sna.val().idPartner;
              switch (motivo) {
                case 1:
                    urlListaServicios.push().set({
                      idPartner: idPartnerCancelado,
                      motivo: "Cancelado por el partner",
                      valor: valor,
                      desSer: desSer
                    });
                  break;
                case 2:
                    urlListaServicios.push().set({
                      idPartner: idPartnerCancelado,
                      motivo: "Cancelado por el usuario"
                    });
                  break;
              }
              urlDetallesServicio.update({aceptado: 4});
            }
          });
          urlDetallesServicio.off();
          switch (tipoServicio) {
            case "Grua":
                agregarGrua2(idServicio, descripcion, direccionServicio, tipoServicio, initLat, initLng, endLat, endLng, idPartnerCancelado, vehiculo);
              break;
            case "Taller":
                agregarTaller2(idServicio, descripcion, tipoServicio, initLat, initLng, idPartnerCancelado, vehiculo);
              break;
          }
        }

      });

  /*--- FUNCIONES ---*/

    /*--- CUANDO PIDEN SERVICIO TALLER ---*/
    function agregarTaller(idServicio, descripcion, tipoServicio, initLat, initLng, vehiculo){
      var ubCliente = initLat + "," + initLng;
      partner.orderByChild("activo").equalTo(1).on("child_added", function(snapshot) {
        var online = snapshot.val().online;
        var ocupado = snapshot.val().ocupado;
        var idPartnerS = snapshot.val().idPartner;
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
                  serviciosActivos.push().set({
                    idPartner: idPartnerS,
                    timestamp: timestamp,
                    idServicio: idServicio,
                    descripcion: descripcion,
                    distancia: distancia,
                    tiempo: tiempo,
                    tipoServicio: tipoServicio,
                    vehiculo: vehiculo
                  });
                }
              });
            }
          }
      });
    }

    /*--- CUANDO EL USUARIO O EL PARTNER CANCELAR EL SERVICIO ---*/
    function agregarTaller2(idServicio, descripcion, tipoServicio, initLat, initLng, idPartnerCancelado, vehiculo){
      var ubCliente = initLat + "," + initLng;
      partner.orderByChild("activo").equalTo(1).on("child_added", function(snapshot) {
        var can = new Firebase(URL_SERVICIOS + idServicio + "/servicios");
        var idPartnerS = snapshot.val().idPartner;
        var online = snapshot.val().online;
        var ocupado = snapshot.val().ocupado;
        if(idPartnerCancelado != idPartnerS){
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

                    serviciosActivos.off();
                    serviciosActivos.push({
                      idPartner: idPartnerS,
                      idServicio: idServicio,
                      timestamp: timestamp,
                      descripcion: descripcion,
                      distancia: distancia,
                      tiempo: tiempo,
                      tipoServicio: tipoServicio,
                      vehiculo: vehiculo
                    });
                }
              });
            }
          }
        }
      });
    }

    /*--- CUANDO PIDEN SERVICIO GRUA---*/
    function agregarGrua(idServicio, descripcion, direccionServicio, tipoServicio, initLat, initLng, endLat, endLng, vehiculo){
      var ubCliente = initLat + "," + initLng;
      var deCliente = endLat + "," + endLng;
      partner.orderByChild("activo").equalTo(1).on("child_added", function(snapshot) {
        var online = snapshot.val().online;
        var ocupado = snapshot.val().ocupado;
        var idPartnerS = snapshot.val().idPartner;
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
                        vehiculo: vehiculo
                      });
                    }
                  )
                }
            });
          }
        }
      });
    }

    /*--- CUANDO PIDEN SERVICIO GRUA POR CANCELACION---*/
    function agregarGrua2(idServicio, descripcion, direccionServicio, tipoServicio, initLat, initLng, endLat, endLng, idPartnerCancelado, vehiculo){
      var ubCliente = initLat + "," + initLng;
      var deCliente = endLat + "," + endLng;
      partner.orderByChild("activo").equalTo(1).on("child_added", function(snapshot) {
        var online = snapshot.val().online;
        var ocupado = snapshot.val().ocupado;
        var idPartnerS = snapshot.val().idPartner;
        if(idPartnerS != idPartnerCancelado){
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
                  if(dist < 5000){
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
                        serviciosActivos.off();
                        serviciosActivos.push({
                          idPartner: idPartnerS,
                          idServicio: idServicio,
                          descripcion: descripcion,
                          timestamp: timestamp,
                          distancia: distancia,
                          tiempo: tiempo,
                          distanciaServicio: distanciaServicio,
                          tiempoServicio: tiempoServicio,
                          direccionServicio: direccionServicio,
                          tipoServicio: tipoServicio,
                          vehiculo:vehiculo
                        });
                      }
                    )
                  }
              });
            }
          }
        }
      });
    }
