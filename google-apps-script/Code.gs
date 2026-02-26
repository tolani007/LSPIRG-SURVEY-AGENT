/**
 * QR Survey Agent - Google Apps Script (v2.1.0-privacy)
 *
 * Deploy this as a Web App (Execute as: Me, Access: Anyone)
 * to enable the n8n workflow to:
 *   1. Close a Google Form programmatically
 *   2. Export a Google Sheet as PDF
 *   3. Export anonymized data (privacy-safe)
 *   4. Remove raw response data after export
 *   5. Apply conditional formatting for sentiment columns
 *
 * Deployment:
 *   1. Open https://script.google.com
 *   2. Create a new project, paste this code
 *   3. Deploy > New Deployment > Web App
 *   4. Copy the deployment URL into your n8n workflow
 */

var VERSION = '2.1.0-privacy';

// ─────────────────────────────────────────────
// Web App Entry Point
// ─────────────────────────────────────────────

function doGet(e) {
  var action = e.parameter.action;

  if (!action) {
    // Health check / status endpoint
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'QR Survey Agent API is running',
        version: VERSION,
        available_actions: [
          { action: 'close_form', params: 'form_id (required)' },
          { action: 'export_pdf', params: 'sheet_id (required)' },
          { action: 'export_anonymized', params: 'sheet_id (required), feedback_col (optional)' },
          { action: 'remove_raw_data', params: 'sheet_id (required)' },
          { action: 'setup_formatting', params: 'sheet_id (required)' }
        ]
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'close_form') {
    return closeForm(e.parameter.form_id);
  } else if (action === 'export_pdf') {
    return exportSheetAsPdf(e.parameter.sheet_id);
  } else if (action === 'export_anonymized') {
    return exportAnonymized(e.parameter.sheet_id, e.parameter.feedback_col);
  } else if (action === 'remove_raw_data') {
    return removeRawData(e.parameter.sheet_id);
  } else if (action === 'setup_formatting') {
    return setupConditionalFormatting(e.parameter.sheet_id);
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: 'Unknown action. Use: close_form, export_pdf, export_anonymized, remove_raw_data, setup_formatting'
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────
// Close Google Form (Kill Switch)
// ─────────────────────────────────────────────

function closeForm(formId) {
  try {
    if (!formId) {
      return jsonResponse({ status: 'error', message: 'Missing required parameter: form_id' });
    }
    var form = FormApp.openById(formId);
    form.setAcceptingResponses(false);
    form.setCustomClosedFormMessage(
      'Thank you for your interest! This survey has closed. We appreciate your feedback.'
    );

    return jsonResponse({
      status: 'success',
      message: 'Form closed successfully',
      form_id: formId,
      closed_at: new Date().toISOString()
    });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ─────────────────────────────────────────────
// Export Sheet as PDF
// ─────────────────────────────────────────────

function exportSheetAsPdf(sheetId) {
  try {
    if (!sheetId) {
      return jsonResponse({ status: 'error', message: 'Missing required parameter: sheet_id' });
    }
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName('Form Responses 1');

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'Sheet "Form Responses 1" not found' });
    }

    // Build PDF export URL
    var url = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/export?';
    var params = {
      format: 'pdf',
      size: 'letter',
      portrait: false,
      fitw: true,
      gridlines: false,
      printtitle: true,
      sheetnames: true,
      fzr: true,
      gid: sheet.getSheetId()
    };

    var queryString = Object.keys(params).map(function(key) {
      return key + '=' + params[key];
    }).join('&');

    var pdfUrl = url + queryString;

    // Fetch PDF blob
    var token = ScriptApp.getOAuthToken();
    var response = UrlFetchApp.fetch(pdfUrl, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    var pdfBlob = response.getBlob().setName(
      'Survey_Results_' + new Date().toISOString().split('T')[0] + '.pdf'
    );

    // Save to Google Drive and return the URL
    var file = DriveApp.createFile(pdfBlob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return jsonResponse({
      status: 'success',
      pdf_url: file.getUrl(),
      download_url: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
      file_name: pdfBlob.getName()
    });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ─────────────────────────────────────────────
// Export Anonymized Data (Privacy-Safe)
// ─────────────────────────────────────────────

function exportAnonymized(sheetId, feedbackCol) {
  try {
    if (!sheetId) {
      return jsonResponse({ status: 'error', message: 'Missing required parameter: sheet_id' });
    }
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName('Form Responses 1');

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'Sheet "Form Responses 1" not found' });
    }

    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return jsonResponse({ status: 'error', message: 'No response data found' });
    }

    var headers = data[0];

    // Find the sentiment column
    var sentimentIdx = -1;
    for (var h = 0; h < headers.length; h++) {
      if (headers[h].toString().trim().toLowerCase() === 'sentiment') {
        sentimentIdx = h;
        break;
      }
    }

    // Build anonymized summary: only sentiment counts, no PII
    var counts = { empath: 0, 'needs growth': 0, unclassified: 0 };
    var totalResponses = data.length - 1; // exclude header

    for (var i = 1; i < data.length; i++) {
      if (sentimentIdx >= 0) {
        var val = data[i][sentimentIdx].toString().trim().toLowerCase();
        if (val === 'empath') {
          counts.empath++;
        } else if (val === 'needs growth') {
          counts['needs growth']++;
        } else {
          counts.unclassified++;
        }
      }
    }

    return jsonResponse({
      status: 'success',
      total_responses: totalResponses,
      sentiment_summary: counts,
      exported_at: new Date().toISOString()
    });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ─────────────────────────────────────────────
// Remove Raw Data (Post-Export Cleanup)
// ─────────────────────────────────────────────

function removeRawData(sheetId) {
  try {
    if (!sheetId) {
      return jsonResponse({ status: 'error', message: 'Missing required parameter: sheet_id' });
    }
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName('Form Responses 1');

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'Sheet "Form Responses 1" not found' });
    }

    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return jsonResponse({ status: 'success', message: 'No data rows to remove', rows_removed: 0 });
    }

    var rowsToRemove = lastRow - 1;
    sheet.deleteRows(2, rowsToRemove);

    return jsonResponse({
      status: 'success',
      message: 'Raw response data removed',
      rows_removed: rowsToRemove,
      removed_at: new Date().toISOString()
    });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ─────────────────────────────────────────────
// Setup Conditional Formatting (Run Once)
// ─────────────────────────────────────────────

function setupConditionalFormatting(sheetId) {
  try {
    if (!sheetId) {
      return jsonResponse({ status: 'error', message: 'Missing required parameter: sheet_id' });
    }
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName('Form Responses 1');

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'Sheet "Form Responses 1" not found' });
    }

    // Find the Sentiment column dynamically
    var sentimentCol = findColumnByHeader(sheet, 'Sentiment');
    if (sentimentCol === -1) {
      return jsonResponse({ status: 'error', message: 'Sentiment column not found' });
    }

    var range = sheet.getRange(2, sentimentCol, sheet.getMaxRows() - 1, 1);

    // Get existing rules and add new ones
    var rules = sheet.getConditionalFormatRules();

    // Rule 1: "empath" → Purple background (#A020F0), White text
    var empathRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('empath')
      .setBackground('#A020F0')
      .setFontColor('#FFFFFF')
      .setBold(true)
      .setRanges([range])
      .build();

    // Rule 2: "needs growth" → Lime-Green background (#32CD32), Black text
    var needsGrowthRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('needs growth')
      .setBackground('#32CD32')
      .setFontColor('#000000')
      .setBold(true)
      .setRanges([range])
      .build();

    rules.push(empathRule);
    rules.push(needsGrowthRule);
    sheet.setConditionalFormatRules(rules);

    return jsonResponse({
      status: 'success',
      message: 'Conditional formatting applied',
      sentiment_column: sentimentCol,
      rules_applied: ['empath → Purple/White', 'needs growth → Lime-Green/Black']
    });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ─────────────────────────────────────────────
// Utility: Find column index by header name
// ─────────────────────────────────────────────

function findColumnByHeader(sheet, headerName) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toString().trim().toLowerCase() === headerName.toLowerCase()) {
      return i + 1; // 1-indexed
    }
  }
  return -1;
}

// ─────────────────────────────────────────────
// Utility: JSON response helper
// ─────────────────────────────────────────────

function jsonResponse(data) {
  return ContentService.createTextOutput(
    JSON.stringify(data)
  ).setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────
// Manual test functions (run from Script Editor)
// ─────────────────────────────────────────────

function testSetupFormatting() {
  // Replace with your actual Sheet ID
  var sheetId = 'YOUR_GOOGLE_SHEET_ID';
  var result = setupConditionalFormatting(sheetId);
  Logger.log(result.getContent());
}

function testCloseForm() {
  // Replace with your actual Form ID
  var formId = 'YOUR_GOOGLE_FORM_ID';
  var result = closeForm(formId);
  Logger.log(result.getContent());
}

function testExportAnonymized() {
  // Replace with your actual Sheet ID
  var sheetId = 'YOUR_GOOGLE_SHEET_ID';
  var result = exportAnonymized(sheetId);
  Logger.log(result.getContent());
}
