import axios from 'axios';

export const generarId = () => {
    const random = Math.random().toString(36).substr(2)
    const fecha = Date.now().toString(36)
    return random + fecha
}

export const formatearFecha = fecha => {
    const fechaNueva = new Date(fecha)
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }
    return fechaNueva.toLocaleDateString('es-Es', opciones)
}

export const obtenerDatos = async () => {
    const gistId = 'fc5cef71dea268451a1c1d5488c90f7f'; // Reemplaza esto con el ID de tu Gist
    const gistFilename = 'gastos.json'; // Reemplaza esto con el nombre de archivo que desees utilizar
    const token = import.meta.env.GITHUB_TOKEN;
  
    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const gist = await response.json();
      const archivo = gist.files[gistFilename];
      if (archivo) {
        const contenido = await fetch(archivo.raw_url);
        const datos = await contenido.json();
        return datos;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los datos del Gist:', error);
      return [];
    }
  };
  

// Función para guardar los datos en el Gist  
  export const guardarDatos = async (datos) => {
    const gistId = 'fc5cef71dea268451a1c1d5488c90f7f'; // Reemplaza esto con el ID de tu Gist
    const gistFilename = 'gastos.json'; // Reemplaza esto con el nombre de archivo que desees utilizar
    const token = import.meta.env.VITE_GITHUB_TOKEN; // Reemplaza esto con tu token de autenticación de GitHub
    
    try {
      const gistUrl = `https://api.github.com/gists/${gistId}`;
      const response = await axios.get(gistUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
          }
      });
        
      const gist = response.data;
      const archivo = gist.files[gistFilename];
      const contenido = JSON.stringify(datos);
      
      if (archivo) {
        // Actualizar el contenido del archivo existente
        const actualizarUrl = `https://api.github.com/gists/${gistId}`;
        const actualizarResponse = await axios.patch(actualizarUrl, {
          files: {
            [gistFilename]: {
              content: contenido,
            },
          },
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (actualizarResponse.status === 200) {
          console.log('Datos guardados correctamente en el Gist.');
        } else {
          console.error('Error al actualizar el archivo del Gist:', actualizarResponse.statusText);
        }
      } 
    } catch (error) {
      console.error('Error al guardar los datos en el Gist:', error);
    }
  };

  export const responseGit = async () => {
    return await fetch('/.netlify/functions/fetchGistData')
      .then(response => response.json()
    )
  }

  export const saveCloud = async (datos) => {
    console.log('from saveCloud');
    console.log(datos);

    try {
      const response = await fetch('/.netlify/functions/fetchGistSaveData', {
        method: 'POST',
        headers: {
          
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
      } else {
        const error = await response.json();
        console.error(error.error);
      }
    } catch (error) {
      console.error('Error al llamar a la función serverless:', error);
    }
  };