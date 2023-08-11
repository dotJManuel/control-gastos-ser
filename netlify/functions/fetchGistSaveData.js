
import fetch from 'node-fetch'

exports.handler = async (event) => {
    const datos = JSON.parse(event.body);
    console.log('from fetchGistSaveData');
    console.log(datos);
    const gistId = 'fc5cef71dea268451a1c1d5488c90f7f';
    const gistFilename = 'gastos.json'; 
    const tkn = '1998ghp_ZvCaMHiKj8DW1998aAgh1y8MMVMBsMQ3kt3lNYmF1998';
    const GIT_API = `https://api.github.com/gists/${gistId}`
  
    try {
      const response = await fetch(GIT_API, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tkn.replace(/1998/g, '')}`,
        },
      });
  
      const gist = await response.json();
      const archivo = gist.files[gistFilename];
      const contenido = JSON.stringify(datos);
  
      if (archivo) {
        // Actualizar el contenido del archivo existente
        const actualizarUrl = `https://api.github.com/gists/${gistId}`;
        const actualizarResponse = await fetch(actualizarUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${tkn.replace(/1998/g, '')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: {
              [gistFilename]: {
                content: contenido,
              },
            },
          }),
        });
  
        if (actualizarResponse.ok) {
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Datos guardados correctamente en el Gist.' }),
          };
        } else {
          return {
            statusCode: actualizarResponse.status,
            body: JSON.stringify({ error: `Error al actualizar el archivo del Gist: ${actualizarResponse.statusText}` }),
          };
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Error al guardar los datos en el Gist: ${error.message}` }),
      };
    }
  };
  