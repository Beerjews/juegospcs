/**
 * GOOGLE APPS SCRIPT — EPP Entrenamiento Newrest
 *
 * PASOS PARA INSTALAR:
 * 1. Abre Google Sheets y crea una hoja nueva (o usa una existente).
 * 2. Ve a Extensiones → Apps Script.
 * 3. Borra el contenido que aparece y pega TODO este código.
 * 4. Guarda (Ctrl+S). Ponle nombre al proyecto, ej: "EPP Entrenamiento".
 * 5. Haz clic en "Implementar" → "Nueva implementación".
 * 6. En "Tipo": selecciona "Aplicación web".
 * 7. En "Ejecutar como": selecciona "Yo (tu email)".
 * 8. En "Quién tiene acceso": selecciona "Cualquier usuario".
 * 9. Haz clic en "Implementar" y copia la URL que aparece.
 * 10. Pega esa URL en index.html donde dice: const APPS_SCRIPT_URL = 'PEGA_AQUI_TU_URL';
 *
 * IMPORTANTE: Cada vez que modifiques este script debes crear una
 * NUEVA implementación (no "Editar existente") para que los cambios apliquen.
 */

const SHEET_NAME = 'Resultados'; // Nombre de la pestaña donde se guardarán los datos

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    // Crear encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Nombre',
        'Cargo',
        'Área',
        'Puntaje',
        'Puntaje Máximo',
        'Porcentaje (%)',
        'Nivel'
      ]);

      // Formato de encabezados
      const headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a1e28');
      headerRange.setFontColor('#e8941a');
    }

    // Formatear timestamp legible
    const ts = data.timestamp ? new Date(data.timestamp) : new Date();
    const tsFormatted = Utilities.formatDate(ts, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

    // Agregar fila con los datos
    sheet.appendRow([
      tsFormatted,
      data.nombre   || '',
      data.cargo    || '',
      data.area     || '',
      data.score    || 0,
      data.maxScore || 18,
      data.pct      || 0,
      data.tag      || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Respuesta simple para verificar que el script está activo
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'EPP Script activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}
