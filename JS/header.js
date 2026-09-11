/* =========================================================
   1. IDENTIFICAR LA RAÍZ DEL PROYECTO
   ---------------------------------------------------------
   const rutaBase = window.location.origin + "/";


/* =========================================================
   3. DEFINIR LA RUTA DEL HEADER
   ---------------------------------------------------------
   ¿Qué hace?

   Indica dónde está nuestro archivo global.

   Ya no importa si estamos en:

   index.html
   Informacion.html
   BLOGS/6.html
   BLOGS/7.html

   Todos buscarán el mismo header.
========================================================= */

const rutaHeader =
  rutaBase + "componentes/header-global.html";


/* =========================================================
   4. BUSCAR EL CONTENEDOR DEL HEADER
   ---------------------------------------------------------
   ¿Qué hace?

   Busca en la página:

   <div id="header-global"></div>

   Ese será el lugar donde aparecerá
   nuestro encabezado.
========================================================= */

const contenedorHeader =
  document.getElementById("header-global");


/* =========================================================
   5. COMPROBAR QUE EXISTE EL CONTENEDOR
   ---------------------------------------------------------
   ¿Qué hace?

   Evita errores si alguna página no tiene
   <div id="header-global"></div>
========================================================= */

if (!contenedorHeader) {

  console.warn(
    "No se encontró el contenedor #header-global"
  );

} else {


  /* =======================================================
     6. CARGAR EL HEADER GLOBAL
     -------------------------------------------------------
     ¿Qué hace?

     Descarga header-global.html.
  ======================================================= */

  fetch(rutaHeader)

    .then(response => {

      /* ===============================================
         7. COMPROBAR SI EL ARCHIVO EXISTE
         -----------------------------------------------
         ¿Qué hace?

         Si GitHub no encuentra el archivo,
         mostramos un error.
      =============================================== */

      if (!response.ok) {

        throw new Error(
          "No se pudo encontrar header-global.html"
        );

      }

      return response.text();

    })


    /* ===================================================
       8. INSERTAR EL HEADER
       ---------------------------------------------------
       ¿Qué hace?

       Coloca el contenido de header-global.html
       dentro de:

       <div id="header-global"></div>
    =================================================== */

    .then(data => {

      contenedorHeader.innerHTML = data;
      

       /* =================================================
     8.1 CARGAR CSS DEL HEADER
     -------------------------------------------------
     ¿Qué hace?

     Carga automáticamente:

     css/header-global.css

     desde la raíz del proyecto.

     Así las páginas NO necesitan poner:

     <link rel="stylesheet"
           href="../css/header-global.css">
  ================================================= */


      const cssHeader =
      document.createElement("link");

      cssHeader.rel = "stylesheet";

      cssHeader.href =
      rutaBase + "css/header-global.css";

      document.head.appendChild(cssHeader);
      
      const svgBase =
      rutaBase + "IMAGENES/svg/";
      contenedorHeader
      .querySelectorAll("[data-svg]")
      .forEach(img => {
        img.src =
        svgBase + img.dataset.svg;
      });
/* =====================================================
   CARGAR TODOS LOS SVG AUTOMÁTICAMENTE
   =====================================================

   Busca cualquier imagen que tenga:

   data-svg="nombre.svg"

   y le asigna la ruta completa.
*/

document
.querySelectorAll("[data-svg]")
.forEach(img => {

  img.src =
  svgBase + img.dataset.svg;

});


      /* =================================================
         9. CORREGIR AUTOMÁTICAMENTE LAS IMÁGENES
         -------------------------------------------------
         ¿Qué hace?

         Busca imágenes del header que tengan:

         data-root="IMAGENES/..."

         y les coloca automáticamente
         la dirección completa del proyecto.
      ================================================= */

      contenedorHeader
        .querySelectorAll("[data-root]")
        .forEach(elemento => {

          const ruta =
            elemento.getAttribute("data-root");

          elemento.src =
            rutaBase + ruta;

        });


      /* =================================================
         10. CORREGIR AUTOMÁTICAMENTE LOS ENLACES
         -------------------------------------------------
         ¿Qué hace?

         Busca enlaces que tengan:

         data-root="index.html"

         y crea automáticamente:

         /NEXATA-INSIGHT-MEDIA-STUDIO/index.html
      ================================================= */

      contenedorHeader
        .querySelectorAll("[data-link]")
        .forEach(enlace => {

          const ruta =
            enlace.getAttribute("data-link");

          enlace.href =
            rutaBase + ruta;

        });

    })


    /* =====================================================
       11. MOSTRAR ERRORES
       -----------------------------------------------------
       ¿Qué hace?

       Si algo falla, aparecerá el error
       en la consola del navegador.
    ===================================================== */

    .catch(error => {

      console.error(
        "Error al cargar el Header Global:",
        error
      );

    });

}
