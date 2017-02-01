var TableroHomologadoJS = {

  numeros: [],
  mapNumeros: [],

  init: function () {

  },

  crearPdf: function () {
    var reporteJS = new ReporteJS("tabla_reporte_homologado");
    reporteJS.crearPdf();
  },

  muestraBotonTablero: function () {
    var dato = $('#select_mes_tableros_homologados').val();
    if (dato && dato !== '') {
      $('#div_boton_tableros_homologados').removeClass('hidden');
      $('#div_numero_columnas_tableros_homologados').removeClass('hidden');
    }
  },

  muestraNivel: function () {
    var dato = $('#select_tipo_tablero_tableros_homologados').val();

    $('#numero_columnas_tableros_homologados').select2({
      language: {
        noResults: function () {
          return 'No se encontraron resultados.';
        }
      },
    });
    $('#select_nivel_tableros_homologados').select2({
      language: {
        noResults: function () {
          return 'No se encontraron resultados.';
        }
      },
    });
    switch (dato) {
      case 'dor':
        $('#div_contenedor_select_nivel_tableros_homologados').removeClass('hidden');
        break;
      default:
        $('#div_contenedor_select_nivel_tableros_homologados').addClass('hidden');
        $('#div_select_input_tableros_homologados').addClass('hidden');
        $('#div_select_mes_tableros_homologados').addClass('hidden');
        $('#div_boton_tableros_homologados').addClass('hidden');
        $('#div_numero_columnas_tableros_homologados').addClass('hidden');
    }
  },

  muestraMesAnio: function () {
    muestraDialogoEspera();
    var dato = $('#select_input_tableros_homologados').val();
    if (dato && dato !== '') {
      $('#div_select_mes_tableros_homologados').removeClass('hidden');
      TableroHomologadoJS.obtenerMesesAnio();
    } else {
      ocultaDialogoEspera();
    }
  },

  //TODO: Mejorar para realizar el filtro con los demás datos.
  obtenerMesesAnio: function () {
    google.script.run.withSuccessHandler(TableroHomologadoJS.procesarObtenerMesesAnio)
      .withFailureHandler(TableroHomologadoJS.setFailure)
      .tableroHomologadoServerObtenerMesesAnio();
  },

  procesarObtenerMesesAnio: function (response) {
    var datos = TableroHomologadoJS.convertirArrayObjetos(response);
    var select = $('#select_mes_tableros_homologados');
    select.empty().append("<option value=''>----</option>");
    $.each(datos, function (k, v) {
      select.append("<option value='" + v.NB_MES_ANIO + "'>" + v.NB_MES_ANIO + "</option>");
    });
    select.select2({
      language: {
        noResults: function () {
          return 'No se encontraron resultados.';
        }
      },
    });
    ocultaDialogoEspera();
  },

  cambiarNivel: function () {
    var nivel = $('#select_nivel_tableros_homologados').val();
    switch (nivel) {
      case 'division':
        TableroHomologadoJS.obtenerTodasDivisiones();
        break;
      case 'zona':
        TableroHomologadoJS.obtenerTodasZonas();
        break;
      case 'sucursal':
        TableroHomologadoJS.obtenerTodasSucursales();
        break;
      case 'cr':
        TableroHomologadoJS.procesarCambiarNivel();
        break;
    }
  },

  obtenerTodasDivisiones: function () {
    muestraDialogoEspera();
    google.script.run.withSuccessHandler(TableroHomologadoJS.procesarCambiarNivel)
      .withFailureHandler(TableroHomologadoJS.setFailure)
      .tableroHomologadoServerObtenerTodasDivisiones();
  },

  obtenerTodasZonas: function () {
    muestraDialogoEspera();
    google.script.run.withSuccessHandler(TableroHomologadoJS.procesarCambiarNivel)
      .withFailureHandler(TableroHomologadoJS.setFailure)
      .tableroHomologadoServerObtenerTodasZonas();
  },

  obtenerTodasSucursales: function () {
    muestraDialogoEspera();
    google.script.run.withSuccessHandler(TableroHomologadoJS.procesarCambiarNivel)
      .withFailureHandler(TableroHomologadoJS.setFailure)
      .tableroHomologadoServerObtenerTodasSucursales();
  },

  procesarCambiarNivel: function (response) {
    var selector = $('#div_select_input_tableros_homologados');
    selector.removeClass("hidden");
    selector.addClass("hidden");
    selector.removeClass("hidden");
    selector.empty();
    if (response) {
      var select = $('<select id="select_input_tableros_homologados" name="select_input_tableros_homologados" style="color: #094FA4;" class="form-control" onchange="TableroHomologadoJS.muestraMesAnio();"></select>');
      select.attr("class", "form-control");
      select.empty();
      select.append("<option value='0'>----</option>");
      var datos = TableroHomologadoJS.convertirArrayObjetos(response);
      $.each(datos, function (k, v) {
        select.append("<option value='" + v.CR + "'>" + v.DESCRIPCION + "</option>");
      });
      select.appendTo(selector);
      select.select2({
        language: {
          noResults: function () {
            return 'No se encontraron resultados.';
          }
        },
      });
    } else {
      var input = $('<input id="select_input_tableros_homologados" name="select_input_tableros_homologados" type="text" value="" class="form-control input-lg" style="text-align: center;" onblur="this.value=this.value.toUpperCase();TableroHomologadoJS.muestraMesAnio();"/>');
      input.appendTo(selector);
    }
    $('#div_select_input_tableros_homologados').removeClass("hidden");
    ocultaDialogoEspera();
  },

  mostrar: function () {
    $('#tabla_reporte_homologado').empty();
    var nivel = $('#select_nivel_tableros_homologados').val();
    switch (nivel) {
      case 'division':
        TableroHomologadoJS.obtenerZonas();
        break;
      case 'zona':
        TableroHomologadoJS.obtenerSucursales();
        break;
      case 'sucursal':
        var sucursal = {};
        sucursal.CR = $('#select_input_tableros_homologados').val();
        TableroHomologadoJS.obtenerRegistros(null, sucursal);
        break;
      case 'cr':
        var sucursal = {};
        sucursal.CR = $('#select_input_tableros_homologados').val();
        if (isNaN(sucursal.CR)) {
          console.info("Aun no implementado");
        } else {
          TableroHomologadoJS.obtenerRegistros(null, sucursal);
        }
        break;
    }
  },

  obtenerSucursales: function () {
    muestraDialogoEspera();
    var division = {};
    division.CR = $('#select_input_tableros_homologados').val();

    google.script.run.withSuccessHandler(TableroHomologadoJS.obtenerRegistros).withUserObject(division)
      .withFailureHandler(TableroHomologadoJS.setFailure)
      .tableroHomologadoServerObtenerSucursales(division.CR);
  },

  obtenerZonas: function () {
    muestraDialogoEspera();
    var division = {};
    division.CR = $('#select_input_tableros_homologados').val();

    if (division.CR === '9800') {
      google.script.run.withSuccessHandler(TableroHomologadoJS.obtenerRegistros).withUserObject(division)
        .withFailureHandler(TableroHomologadoJS.setFailure)
        .tableroHomologadoServerObtenerTodasDivisiones();
    } else {
      google.script.run.withSuccessHandler(TableroHomologadoJS.obtenerRegistros).withUserObject(division)
        .withFailureHandler(TableroHomologadoJS.setFailure)
        .tableroHomologadoServerObtenerZonas(division.CR);
    }
  },

  obtenerRegistros: function (response, CR) {
    var datos = [];
    if (response) {
      datos = TableroHomologadoJS.convertirArrayObjetos(response);
    }
    datos.push(CR);
    google.script.run.withSuccessHandler(TableroHomologadoJS.procesarObtenerRegistros)
      .withFailureHandler(TableroHomologadoJS.setFailure)
      .tableroHomologadoServerObtenerRegistros(datos, $('#select_mes_tableros_homologados').val());
  },

  procesarObtenerRegistros: function (response) {
    var datos = TableroHomologadoJS.convertirArrayObjetos(response);

    var arreglo = [];
    var objCaption = {};
    var objEncabezado = {};
    var objDatos = {};
    var objeto = {};

    var tituloStyle = new ObjFuente("white", 12);
    var captionStyle = new ObjFuente("red", 10);
    var encabezadoStyle = new ObjFuente("yellow", 10);
    var datosStyle = new ObjFuente("blue", 8);
    var registro1 = [];
    var registro2 = [];
    var registro3 = [];
    var registro4 = [];
    var registro5 = [];
    var registro6 = [];
    $.each(datos, function (indice, valor) {
      //valor.CD_TABLERO_DOR;
      var arreglo = [];
      arreglo.push(valor.NB_CR);
      arreglo.push(valor.NB_SUCURSAL);
      arreglo.push(valor.NB_DOR);
      arreglo.push(valor.NB_TOTAL_SUC);
      arreglo.push(valor.NB_PROM_BP_EC_SUC);
      registro1.push(arreglo);

      arreglo = [];
      arreglo.push(valor.NB_OBJETIVOS_PROM);
      arreglo.push(valor.NB_OBJETIVOS_OBJETIVO);
      arreglo.push(valor.NB_OBJETIVOS_PTS_REQ);
      arreglo.push(valor.NB_OBJETIVOS_PTS_AL_OBJ);
      registro2.push(arreglo);

      arreglo = [];
      arreglo.push(valor.NB_ACC);
      arreglo.push(valor.NB_BP_PROM);
      registro3.push(arreglo);

      arreglo = [];
      arreglo.push(valor.NB_CAPTACION_VISTA);
      arreglo.push(valor.NB_CAPTACION_FONDOS);
      arreglo.push(valor.NB_CAPTACION_PLAZO);
      arreglo.push(valor.NB_CAPTACION_P_F);
      registro4.push(arreglo);

      arreglo = [];
      arreglo.push(valor.NB_ACTIVIDAD_CONS);
      arreglo.push(valor.NB_ACTIVIDAD_TDC);
      arreglo.push(valor.NB_ACTIVIDAD_SEG);
      arreglo.push(valor.NB_ACTIVIDAD_HIP);
      arreglo.push(valor.NB_ACTIVIDAD_TRAD_COLOC);
      arreglo.push(valor.NB_ACTIVIDAD_TN);
      arreglo.push(valor.NB_ACTIVIDAD_STOCK);
      arreglo.push(valor.NB_ACTIVIDAD_TPV);
      arreglo.push(valor.NB_ACTIVIDAD_CTS_DIG);
      arreglo.push(valor.NB_ACTIVIDAD_REC_FIS);
      arreglo.push(valor.NB_ACTIVIDAD_REC_PYME);
      registro5.push(arreglo);

      arreglo = [];
      arreglo.push(valor.NB_CALIDAD_CONT_INT);
      arreglo.push(valor.NB_CALIDAD_EU);
      registro6.push(arreglo);

      arreglo = [];
    });

    captionStyle = new ObjFuente("white", 11);
    encabezadoStyle = new ObjFuente("white", 10);
    datosStyle = new ObjFuente("blue", 10);

    objCaption = new ObjCaption("", "blanco", captionStyle);
    objEncabezado = new ObjEncabezado(['CR', 'Sucursal', 'DOR', 'Total Suc', 'Prom BP EC SUC'], "reporteEncabezadoTabla", encabezadoStyle);
    objDatos = new ObjDatos(registro1, "", datosStyle);
    objeto = new ObjTablaRep(objCaption, "reporteTablaBorde", objEncabezado, objDatos);
    arreglo.push(objeto);

    objCaption = new ObjCaption("Objetivos", "azul_5bc0de reporteTablaBorde", captionStyle);
    objEncabezado = new ObjEncabezado(['Prom', 'Objetivo', 'Pts Req', 'Pts para llegar al Obj'], "reporteEncabezadoTabla", encabezadoStyle);
    objDatos = new ObjDatos(registro2, "", datosStyle);
    objeto = new ObjTablaRep(objCaption, "reporteTablaBorde", objEncabezado, objDatos);
    arreglo.push(objeto);

    objCaption = new ObjCaption("", "blanco", captionStyle);
    objEncabezado = new ObjEncabezado(['ACC', 'BP Prom'], "reporteEncabezadoTabla", encabezadoStyle);
    objDatos = new ObjDatos(registro3, "", datosStyle);
    objeto = new ObjTablaRep(objCaption, "reporteTablaBorde", objEncabezado, objDatos);
    arreglo.push(objeto);

    objCaption = new ObjCaption("Captación", "verde_008000 reporteTablaBorde", captionStyle);
    objEncabezado = new ObjEncabezado(['Vista', 'Fondos', 'Plazo', 'Fondo + Plazo'], "reporteEncabezadoTabla", encabezadoStyle);
    objDatos = new ObjDatos(registro4, "", datosStyle);
    objeto = new ObjTablaRep(objCaption, "reporteTablaBorde", objEncabezado, objDatos);
    arreglo.push(objeto);

    objCaption = new ObjCaption("Actividad", "naranja_e69138 reporteTablaBorde", captionStyle);
    objEncabezado = new ObjEncabezado(['Cons', 'TDC', 'Seg', 'Hip', 'Trad Coloc', 'TN y MN', 'Stock', 'TPV', 'Cts Dig', 'Rec Fis', 'Rec Pyme'], "reporteEncabezadoTabla", encabezadoStyle);
    objDatos = new ObjDatos(registro5, "", datosStyle);
    objeto = new ObjTablaRep(objCaption, "reporteTablaBorde", objEncabezado, objDatos);
    arreglo.push(objeto);

    objCaption = new ObjCaption("Calidad", "azul_46b8da reporteTablaBorde", captionStyle);
    objEncabezado = new ObjEncabezado(['Cont Int', 'EU'], "reporteEncabezadoTabla", encabezadoStyle);
    objDatos = new ObjDatos(registro6, "", datosStyle);
    objeto = new ObjTablaRep(objCaption, "reporteTablaBorde", objEncabezado, objDatos);
    arreglo.push(objeto);

    var objTitulo = new ObjTitulo('DOR Homologado', "encabezadoReporte", tituloStyle);
    var tablaReporte = new ReporteJS("tabla_reporte_homologado", arreglo, objTitulo, $('#numero_columnas_tableros_homologados').val());
    tablaReporte.construir();

    $('#boton_tableros_homologados_pdf').removeClass('hidden');
    $('#boton_tableros_homologados_excel').removeClass('hidden');
    ocultaDialogoEspera();
  },

  abrirBuzon: function () {
    $('#modal_buzon_tableros_homologados').modal('show');
  },

  mandarBuzon: function () {
    //var titulo = $('#input_buzon_titulo_tableros_homologados').val();
    //var sugerencia = $('#input_buzon_sugerencia_tableros_homologados').val();

    var mensaje = {};
    mensaje.to = "moises.tapia.contractor@bbva.com";
    mensaje.cc = "moises.tapia.contractor@bbva.com";
    mensaje.replyTo = sessionStorage.getItem('NB_CORREO');
    mensaje.subject = $('#input_buzon_titulo_tableros_homologados').val();

    var body = "Estimado <br><br><br>" +
      "Se recibio la siguiente sugerencia: <br><br><br>" +
      $('#input_buzon_sugerencia_tableros_homologados').val();

    mensaje.htmlBody = body;
    google.script.run.withSuccessHandler(TableroHomologadoJS.cancelarBuzon)
      .withFailureHandler(TableroHomologadoJS.setFailure)
      .mandarCorreo(mensaje);
  },

  cancelarBuzon: function () {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#modal_buzon_tableros_homologados').removeClass('fade');
    $('#modal_buzon_tableros_homologados').modal('hide');
    $('#input_buzon_titulo_tableros_homologados').val('');
    $('#input_buzon_sugerencia_tableros_homologados').val('');
  },

  convertirArrayObjetos: function (response) {
    var registros = [];
    if (TableroHomologadoJS.validarRespuesta(response)) {
      for (var x in response) {
        var json = JSON.parse(response[x], TableroHomologadoJS.json_deserialize_helper);
        registros.push(json);
      }
    }
    return registros;
  },

  validarRespuesta: function (response) {
    var respuesta = true;
    if ($.type(response) === "string" && response.startsWith("ERROR")) {
      TableroHomologadoJS.setFailure(response);
      respuesta = false;
    }
    return respuesta;
  },

  json_deserialize_helper: function (key, value) {
    if (typeof value === 'string') {
      var regexp;
      regexp = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.exec(value);
      if (regexp) {
        return new Date(value);
      }
    }
    return value;
  },

  setFailure: function (data) {
    console.info("setFailure");
    console.info(data);
  },
}
