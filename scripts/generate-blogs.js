const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "_posts");
const BLOGS_DIR = path.join(ROOT, "BLOGS");

const SITE_URL = "https://nexata.site";
const AUTHOR_IMAGE =
  "https://nuvary.github.io/NEXATA-INSIGHT-MEDIA-STUDIO/IMAGENES/Foto%20de%20autor/0.jpg";

function obtenerSiguienteNumero() {
  const archivos = fs.readdirSync(BLOGS_DIR);

  const numeros = archivos
    .map((archivo) => {
      const coincidencia = archivo.match(/^(\d+)\.html$/);
      return coincidencia ? Number(coincidencia[1]) : null;
    })
    .filter((numero) => numero !== null);

  return numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
}

function convertirImagen(ruta) {
  if (!ruta) return "";

  let imagen = String(ruta);

  imagen = decodeURIComponent(imagen);

  imagen = imagen.replace(
    /^\/NEXATA-INSIGHT-MEDIA-STUDIO\//,
    ""
  );

  imagen = imagen.replace(/^\/+/, "");

  return "../" + imagen;
}

function escaparHTML(texto) {
  return String(texto || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatearFecha(fecha) {
  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("es-MX", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

function generarArticulo(postPath, numero) {
  const contenidoArchivo = fs.readFileSync(postPath, "utf8");
  const { data, content } = matter(contenidoArchivo);

  const titulo = data.title || "Sin título";
  const descripcion = data.description || "";
  const categoria = data.category || "";
  const imagen = convertirImagen(data.image);
  const fecha = formatearFecha(data.date);

  const htmlContenido = marked.parse(content);

  const urlArticulo = `${SITE_URL}/BLOGS/${numero}.html`;

  const tituloCompleto =
    `${titulo} – NEXATA INSIGHT MEDIA STUDIO`;

  const html = `<!DOCTYPE html>
<html lang="es">

<head>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${escaparHTML(tituloCompleto)}</title>

  <link rel="stylesheet" href="../css/ui.css">
  <link rel="stylesheet" href="../css/blogs.css">

  <meta property="og:type" content="article">

  <meta
    property="og:title"
    content="${escaparHTML(tituloCompleto)}"
  >

  <meta
    property="og:description"
    content="${escaparHTML(descripcion)}"
  >

  <meta
    property="og:url"
    content="${urlArticulo}"
  >

  <meta
    property="og:image"
    content="${SITE_URL}/${imagen.replace(/^\.\.\//, "")}"
  >

  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <meta property="og:image:type" content="image/jpeg">

  <meta
    name="twitter:card"
    content="summary_large_image"
  >

  <meta
    name="twitter:title"
    content="${escaparHTML(titulo)}"
  >

  <meta
    name="twitter:description"
    content="${escaparHTML(descripcion)}"
  >

  <meta
    name="twitter:image"
    content="${SITE_URL}/${imagen.replace(/^\.\.\//, "")}"
  >

</head>

<body>

  <div id="header-global"></div>

  <main class="container">

    <img
      src="${imagen}"
      alt="${escaparHTML(titulo)}"
      class="destacada"
    >

    <div class="autor-box">

      <div class="autor-contenido">

        <div class="autor-foto-box">

          <img
            src="${AUTHOR_IMAGE}"
            alt="Dennis Palma"
            class="autor-foto"
          >

          <span class="estado-online"></span>

        </div>

        <div class="autor-info">

          <h2>Dennis Palma</h2>

          <p>
            Diseñador Gráfico, Técnico en Ofimática y Programación
          </p>

          <small class="autor-fecha">
            Editado: ${escaparHTML(fecha)}
          </small>

        </div>

      </div>

      <div class="live-feed">

        <div class="live-head">

          <span class="dot"></span>

          LIVE FEED • NEXATA NEWS

          <b>LIVE</b>

        </div>

        <div class="live-body">

          <div class="ticker">

            <span>⚡ GTA 6 - 19 Nov 2026</span>
            <span class="s">•</span>

            <span>🚨 Alerta Sísmica Simulacro 2026</span>
            <span class="s">•</span>

            <span>💿 Zorin OS 18 Beta</span>
            <span class="s">•</span>

            <span>🎙 Nuevos Podcast</span>

          </div>

        </div>

      </div>

    </div>

    <div class="social">

      <a
        class="facebook"
        href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlArticulo)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Compartir en Facebook
      </a>

      <a
        class="twitter"
        href="https://twitter.com/intent/tweet?url=${encodeURIComponent(urlArticulo)}&text=${encodeURIComponent(titulo)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Compartir en X
      </a>

      <a
        class="whatsapp"
        href="https://api.whatsapp.com/send?text=${encodeURIComponent(
          `Mira este artículo de NEXATA INSIGHT MEDIA STUDIO: ${titulo} ${urlArticulo}`
        )}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Compartir en WhatsApp
      </a>

    </div>

    <article class="blog-content">

      <h1>
        ${escaparHTML(titulo)}
      </h1>

      ${htmlContenido}

    </article>

  </main>

  <section class="comentarios-box">

    <button id="loginGoogle">
      🔑 Iniciar sesión con Google
    </button>

    <button id="logoutGoogle">
      🚪 Cerrar sesión
    </button>

    <div id="usuarioActual"></div>

    <h2 id="contadorComentarios">
      💬 Comentarios (0)
    </h2>

    <span
      id="ayudaComentarios"
      class="ayuda-comentarios"
    >
      ❓
    </span>

    <input
      type="text"
      id="nombre"
      placeholder="Nombre (opcional)"
    >

    <textarea
      id="comentario"
      placeholder="Escribe tu comentario..."
    ></textarea>

    <button onclick="enviarComentario()">
      Publicar comentario
    </button>

    <div id="listaComentarios"></div>

  </section>

  <script src="../JS/header.js"></script>

  <script type="module">

    import { initializeApp }
    from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

    import {
      getFirestore,
      collection,
      addDoc,
      getDocs,
      query,
      orderBy,
      where,
      doc,
      updateDoc,
      increment,
      deleteDoc
    }
    from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

    import {
      getAuth,
      GoogleAuthProvider,
      signInWithPopup,
      onAuthStateChanged,
      signOut
    }
    from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

    const firebaseConfig = {

      apiKey: "AIzaSyCsucEr-t1QVVIdG6YnWLm-5p5Kzp6nwUk",

      authDomain: "comentarios-nims.firebaseapp.com",

      projectId: "comentarios-nims",

      storageBucket: "comentarios-nims.firebasestorage.app",

      messagingSenderId: "529237253093",

      appId: "1:529237253093:web:1cb81ffe914c89be172d0c"

    };

    const app = initializeApp(firebaseConfig);

    const db = getFirestore(app);

    const auth = getAuth(app);

    const provider = new GoogleAuthProvider();

    let usuario = null;

    const articulo = "${numero}";

    onAuthStateChanged(auth, (user) => {

      usuario = user;

      const info =
        document.getElementById("usuarioActual");

      if (user) {

        info.innerHTML =
          \`✅ \${user.displayName}\`;

      } else {

        info.innerHTML =
          "Invitado";

      }

    });

    document
      .getElementById("loginGoogle")
      .onclick = async () => {

        try {

          await signInWithPopup(
            auth,
            provider
          );

        } catch (error) {

          alert(error.message);

        }

      };

    document
      .getElementById("logoutGoogle")
      .onclick = async () => {

        await signOut(auth);

      };

    window.enviarComentario = async () => {

      const nombre =
        document
          .getElementById("nombre")
          .value
          .trim() || "Anónimo";

      const comentario =
        document
          .getElementById("comentario")
          .value
          .trim();

      if (!comentario) {

        alert("Escribe un comentario");

        return;

      }

      const ultimaPublicacion =
        localStorage.getItem(
          "ultimoComentario"
        );

      const ahora = Date.now();

      if (
        ultimaPublicacion &&
        ahora - Number(ultimaPublicacion) < 30000
      ) {

        alert(
          "Espera 30 segundos antes de comentar nuevamente."
        );

        return;

      }

      await addDoc(
        collection(db, "comentarios"),
        {

          articulo,

          nombre,

          comentario,

          likes: 0,

          uid: usuario
            ? usuario.uid
            : null,

          fecha:
            new Date().toISOString()

        }
      );

      localStorage.setItem(
        "ultimoComentario",
        Date.now()
      );

      document
        .getElementById("comentario")
        .value = "";

      cargarComentarios();

    };

    async function cargarComentarios() {

      let total = 0;

      const lista =
        document.getElementById(
          "listaComentarios"
        );

      lista.innerHTML =
        "Cargando comentarios...";

      const q = query(

        collection(
          db,
          "comentarios"
        ),

        where(
          "articulo",
          "==",
          articulo
        ),

        orderBy(
          "fecha",
          "desc"
        )

      );

      const datos =
        await getDocs(q);

      lista.innerHTML = "";

      datos.forEach((doc) => {

        total++;

        const c =
          doc.data();

        const id =
          doc.id;

        let botonEliminar = "";

        const ADMIN_EMAIL =
          "diamantesdmpj@gmail.com";

        if (

          (usuario &&
            usuario.email === ADMIN_EMAIL)

          ||

          (usuario &&
            usuario.uid === c.uid)

        ) {

          botonEliminar =

            \`<button onclick="eliminarComentario('\${id}')">
              🗑 Eliminar
            </button>\`;

        }

        const fecha =
          new Date(
            c.fecha
          ).toLocaleString();

        lista.innerHTML += \`

          <div class="comentario">

            <strong>
              \${c.nombre}
            </strong>

            <p>
              \${c.comentario}
            </p>

            <div class="fecha">
              \${fecha}
            </div>

            <button
              onclick="darLike('\${id}')"
            >
              👍 \${c.likes || 0}
            </button>

            \${botonEliminar}

          </div>

        \`;

      });

      document
        .getElementById(
          "ayudaComentarios"
        )
        .onclick = () => {

          alert(

            "Los usuarios que inician sesión con Google pueden eliminar sus propios comentarios.\\n\\n" +

            "Los invitados pueden comentar libremente, pero no pueden eliminar comentarios después de publicarlos.\\n\\n" +

            "El administrador puede eliminar cualquier comentario. Comunicate a soporte"

          );

        };

      document
        .getElementById(
          "contadorComentarios"
        )
        .textContent =
          \`💬 Comentarios (\${total})\`;

    }

    window.darLike = async (id) => {

      const clave =
        "like_" + id;

      if (
        localStorage.getItem(clave)
      ) {

        alert(
          "Ya diste like a este comentario."
        );

        return;

      }

      await updateDoc(

        doc(
          db,
          "comentarios",
          id
        ),

        {
          likes:
            increment(1)
        }

      );

      localStorage.setItem(
        clave,
        "1"
      );

      cargarComentarios();

    };

    window.eliminarComentario =
      async (id) => {

        if (
          !confirm(
            "¿Eliminar comentario?"
          )
        ) {

          return;

        }

        await deleteDoc(

          doc(
            db,
            "comentarios",
            id
          )

        );

        cargarComentarios();

      };

    cargarComentarios();

  </script>

</body>
</html>
`;

  const destino = path.join(
    BLOGS_DIR,
    `${numero}.html`
  );

  fs.writeFileSync(
    destino,
    html,
    "utf8"
  );

  console.log(
    `Generado: BLOGS/${numero}.html`
  );
}

function ejecutar() {

  if (!fs.existsSync(POSTS_DIR)) {

    console.log(
      "No existe la carpeta _posts."
    );

    return;

  }

  if (!fs.existsSync(BLOGS_DIR)) {

    fs.mkdirSync(
      BLOGS_DIR,
      { recursive: true }
    );

  }

  const archivos = fs
    .readdirSync(POSTS_DIR)
    .filter((archivo) =>
      archivo.endsWith(".md")
    )
    .sort();

  if (archivos.length === 0) {

    console.log(
      "No hay artículos en _posts."
    );

    return;

  }

  let siguienteNumero =
    obtenerSiguienteNumero();

  for (const archivo of archivos) {

    const postPath =
      path.join(
        POSTS_DIR,
        archivo
      );

    generarArticulo(
      postPath,
      siguienteNumero
    );

    siguienteNumero++;

  }

}

ejecutar();
