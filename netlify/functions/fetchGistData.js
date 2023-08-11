
import fetch from 'node-fetch'

export const handler = async () => {
  const gistId = 'fc5cef71dea268451a1c1d5488c90f7f'; // Reemplaza esto con el ID de tu Gist
  const gistFilename = 'gastos.json'; // Reemplaza esto con el nombre de archivo que desees utilizar
  const tkn = '1998ghp_ZvCaMHiKj8DW1998aAgh1y8MMVMBsMQ3kt3lNYmF1998';
  const GIT_API = `https://api.github.com/gists/${gistId}`

  const response = await fetch(GIT_API, {
    headers: {
      Authorization: `Bearer ${tkn.replace(/1998/g, '')}`,
    },
  })
  
  const gist = await response.json();
  
  let datos = [];
  const archivo = gist.files[gistFilename];
  if (archivo) {
    const contenido = await fetch(archivo.raw_url);
    datos = await contenido.json();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      datos
    })
  }
}