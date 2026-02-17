/**
 * QR Survey Agent - Google Apps Script
 *
 * Deploy this as a Web App (Execute as: Me, Access: Anyone)
 * to enable the n8n workflow to:
 *   1. Close a Google Form programmatically
 *   2. Export a Google Sheet as PDF
 *   3. Apply conditional formatting for sentiment columns
 *
 * Deployment:
 *   1. Open https://script.google.com
 *   2. Create a new project, paste this code
 *   3. Deploy > New Deployment > Web App
 *   4. Copy the deployment URL into your n8n workflow
 */

// ─────────────────────────────────────────────
// Web App Entry Point
// ─────────────────────────────────────────────

function doGet(e) {
  var action = e.parameter.action;

  if (action === 'close_form') {
    return closeForm(e.parameter.form_id);
  } else if (action === 'export_pdf') {
    return exportSheetAsPdf(e.parameter.sheet_id);
  } else if (action === 'setup_formatting') {
    return setupConditionalFormatting(e.parameter.sheet_id);
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: 'Unknown action. Use: close_form, export_pdf, setup_formatting' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────
// Close Google Form (Kill Switch)
// ─────────────────────────────────────────────

function closeForm(formId) {
  try {
    var form = FormApp.openById(formId);
    form.setAcceptingResponses(false);
    form.setCustomClosedFormMessage(
      'Thank you for your interest! This survey has closed. We appreciate your feedback.'
    );

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Form closed successfully',
        form_id: formId,
        closed_at: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────
// Export Sheet as PDF
// ─────────────────────────────────────────────

function exportSheetAsPdf(sheetId) {
  try {
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName('Form Responses 1');

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

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        pdf_url: file.getUrl(),
        download_url: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
        file_name: pdfBlob.getName()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────
// Setup Conditional Formatting (Run Once)
// ─────────────────────────────────────────────

function setupConditionalFormatting(sheetId) {
  try {
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName('Form Responses 1');

    // Find the Sentiment column (assume column C = index 3, adjust if needed)
    var sentimentCol = findColumnByHeader(sheet, 'Sentiment');
    if (sentimentCol === -1) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: 'Sentiment column not found' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var range = sheet.getRange(2, sentimentCol, sheet.getMaxRows() - 1, 1);

    // Clear existing conditional formatting rules
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

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Conditional formatting applied',
        sentiment_column: sentimentCol,
        rules_applied: ['empath → Purple/White', 'needs growth → Lime-Green/Black']
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
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
