const fs = require('node:fs/promises');

export async function loadData(fileName) {
    const data = await fs.readFile(fileName, 'utf8');
    return JSON.parse(data); 
}

export function exportData(fileName, content) {
    fs.writeFile(fileName, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
          console.error('Error al escribir en el archivo:', err);
          return;
        }
        console.log('Datos escritos en el archivo correctamente.');
    });
}