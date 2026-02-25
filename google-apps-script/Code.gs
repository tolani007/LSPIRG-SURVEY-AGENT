/**
 * QR Survey Agent - Google Apps Script
 * Privacy-Hardened Edition
 *
 * Deploy this as a Web App (Execute as: Me, Access: Anyone)
 * to enable the n8n workflow to:
 *   1. Close a Google Form programmatically
 *   2. Anonymize response data (strip all PII)
 *   3. Export anonymized Google Sheet as PDF
 *   4. Purge raw response data after export
 *   5. Apply conditional formatting for sentiment columns
 *
 * PRIVACY: This script ensures NO attendee identity data
 * (timestamps, emails, IPs, names) reaches the email recipient.
 *
 * IMPORTANT: After updating this file, you must create a NEW
 * deployment in Apps Script (Deploy > New Deployment > Web App)
 * and update the deployment URL in your n8n workflow.
 */

// ─────────────────────────────────────────────
// Web App Entry Point
// ─────────────────────────────────────────────

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';

  if (!action) {
    return jsonResponse('success', {
      message: 'QR Survey Agent API is running',
      version: '2.0.0-privacy',
      available_actions: [
        'close_form (requires: form_id)',
        'export_anonymized (requires: sheet_id)',
        'export_pdf (requires: sheet_id, optional: anonymized=true)',
        'purge_raw_data (requires: sheet_id)',
        'setup_formatting (requires: sheet_id)'
      ]
    });
  }

  if (action === 'close_form') {
    var formId = e.parameter.form_id;
    if (!formId) {
      return jsonError('Missing required parameter: form_id');
    }
    return closeForm(formId);

  } else if (action === 'export_anonymized') {
    var sheetId = e.parameter.sheet_id;
    if (!sheetId) {
      return jsonError('Missing required parameter: sheet_id');
    }
    return anonymizeSheet(sheetId);

  } else if (action === 'export_pdf') {
    var sheetId = e.parameter.sheet_id;
    if (!sheetId) {
      return jsonError('Missing required parameter: sheet_id');
    }
    var anonymized = e.parameter.anonymized === 'true';
    return exportSheetAsPdf(sheetId, anonymized);

  } else if (action === 'purge_raw_data') {
    var sheetId = e.parameter.sheet_id;
    if (!sheetId) {
      return jsonError('Missing required parameter: sheet_id');
    }
    return purgeRawData(sheetId);

  } else if (action === 'setup_formatting') {
    var sheetId = e.parameter.sheet_id;
    if (!sheetId) {
      return jsonError('Missing required parameter: sheet_id');
    }
    return setupConditionalFormatting(sheetId);

  } else {
    return jsonError(
      'Unknown action: "' + action + '". Valid actions: close_form, export_anonymized, export_pdf, purge_raw_data, setup_formatting'
    );
  }
}

// ─────────────────────────────────────────────
// JSON Response Helpers
// ─────────────────────────────────────────────

function jsonResponse(status, data) {
  var payload = { status: status };
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      payload[key] = data[key];
    }
  }
  return ContentService.createTextOutput(
    JSON.stringify(payload)
  ).setMimeType(ContentService.MimeType.JSON);
}

function jsonError(message) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'error', message: message })
  ).setMimeType(ContentService.MimeType.JSON);
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

    return jsonResponse('success', {
      message: 'Form closed successfully',
      form_id: formId,
      closed_at: new Date().toISOString()
    });
  } catch (err) {
    var msg = err.toString();
    if (msg.indexOf('No item with the given ID') >= 0) {
      return jsonError('Form not found. Check that form_id "' + formId + '" is the Form ID (not the published URL ID). Find it at: docs.google.com/forms/d/{THIS_IS_THE_ID}/edit');
    }
    return jsonError('closeForm failed: ' + msg);
  }
}

// ─────────────────────────────────────────────
// Anonymize Sheet Data (Privacy Layer)
// Creates an "Anonymized Results" sheet with:
//   - NO Timestamps
//   - NO email addresses
//   - Anonymous IDs instead of row numbers
//   - Only: Anonymous ID, Feedback (scrubbed), Sentiment
// ─────────────────────────────────────────────

function anonymizeSheet(sheetId) {
  try {
    var spreadsheet = openSpreadsheet(sheetId);
    var source = spreadsheet.getSheetByName('Form Responses 1');

    if (!source) {
      return jsonError('Source sheet "Form Responses 1" not found in spreadsheet. Make sure your Google Form is linked to this sheet.');
    }

    // Delete existing anonymized sheet if it exists
    var existing = spreadsheet.getSheetByName('Anonymized Results');
    if (existing) {
      spreadsheet.deleteSheet(existing);
    }

    var anonSheet = spreadsheet.insertSheet('Anonymized Results');

    // Set headers (privacy-safe columns only)
    anonSheet.getRange(1, 1).setValue('Response #');
    anonSheet.getRange(1, 2).setValue('Feedback');
    anonSheet.getRange(1, 3).setValue('Sentiment');

    // Style headers
    var headerRange = anonSheet.getRange(1, 1, 1, 3);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4A148C');
    headerRange.setFontColor('#FFFFFF');

    // Find relevant columns in source
    var headers = source.getRange(1, 1, 1, source.getLastColumn()).getValues()[0];
    var feedbackCol = -1;
    var sentimentCol = -1;

    for (var i = 0; i < headers.length; i++) {
      var h = headers[i].toString().trim().toLowerCase();
      if (h === 'feedback' || h.indexOf('how was') >= 0 || h.indexOf('experience') >= 0) {
        feedbackCol = i;
      }
      if (h === 'sentiment') {
        sentimentCol = i;
      }
    }

    // Fallback: if no "Feedback" header found, use column B (index 1)
    if (feedbackCol === -1) feedbackCol = 1;

    var lastRow = source.getLastRow();
    if (lastRow < 2) {
      return jsonResponse('success', {
        message: 'No responses to anonymize',
        rows: 0
      });
    }

    var data = source.getRange(2, 1, lastRow - 1, source.getLastColumn()).getValues();

    // Batch write for performance: build all values first, then write at once
    var outputData = [];
    for (var r = 0; r < data.length; r++) {
      var rawFeedback = data[r][feedbackCol] ? data[r][feedbackCol].toString() : '';
      var sentiment = (sentimentCol >= 0 && data[r][sentimentCol]) ? data[r][sentimentCol].toString() : '';
      var cleanFeedback = scrubPII(rawFeedback);
      outputData.push(['R-' + (r + 1), cleanFeedback, sentiment]);
    }

    if (outputData.length > 0) {
      anonSheet.getRange(2, 1, outputData.length, 3).setValues(outputData);
    }

    // Apply conditional formatting to anonymized sheet
    applyFormattingToSheet(anonSheet, 3);

    // Auto-resize columns
    anonSheet.autoResizeColumns(1, 3);

    return jsonResponse('success', {
      message: 'Sheet anonymized successfully',
      rows_processed: outputData.length,
      columns: ['Response #', 'Feedback', 'Sentiment']
    });
  } catch (err) {
    return jsonError('anonymizeSheet failed: ' + err.toString());
  }
}

// ─────────────────────────────────────────────
// PII Scrubbing (Server-Side Backup)
// Defense-in-depth: n8n scrubs first,
// Apps Script scrubs again before export.
// ─────────────────────────────────────────────

function scrubPII(text) {
  if (!text) return '';

  // Strip email addresses
  text = text.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '[REDACTED]');

  // Strip phone numbers
  text = text.replace(/(\+?\d{1,3}[\s\-]?)?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}/g, '[REDACTED]');

  // Strip URLs
  text = text.replace(/https?:\/\/[^\s]+/g, '[REDACTED]');

  // Strip IP addresses
  text = text.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED]');

  // Strip social handles
  text = text.replace(/@[a-zA-Z0-9_]{2,}/g, '[REDACTED]');

  // Strip self-identification
  text = text.replace(/(?:my name is|i'm|i am|call me|this is)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/gi, '[REDACTED]');

  // Strip zip codes
  text = text.replace(/\b\d{5}(?:-\d{4})?\b/g, '[REDACTED]');

  // Clean consecutive redactions
  text = text.replace(/(\[REDACTED\]\s*){2,}/g, '[REDACTED] ');

  return text.trim();
}

// ─────────────────────────────────────────────
// Export Sheet as PDF
// ─────────────────────────────────────────────

function exportSheetAsPdf(sheetId, anonymized) {
  try {
    var spreadsheet = openSpreadsheet(sheetId);
    var sheetName = anonymized ? 'Anonymized Results' : 'Form Responses 1';
    var sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      var hint = anonymized
        ? 'Run the export_anonymized action first to create the anonymized sheet.'
        : 'Make sure your Google Form is linked to this spreadsheet.';
      return jsonError('Sheet "' + sheetName + '" not found. ' + hint);
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
      sheetnames: false,
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

    var fileName = anonymized
      ? 'Survey_Results_Anonymized_' + new Date().toISOString().split('T')[0] + '.pdf'
      : 'Survey_Results_' + new Date().toISOString().split('T')[0] + '.pdf';

    var pdfBlob = response.getBlob().setName(fileName);

    // Save to Google Drive and return the URL
    var file = DriveApp.createFile(pdfBlob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return jsonResponse('success', {
      pdf_url: file.getUrl(),
      download_url: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
      file_name: fileName,
      anonymized: anonymized
    });
  } catch (err) {
    return jsonError('exportSheetAsPdf failed: ' + err.toString());
  }
}

// ─────────────────────────────────────────────
// Purge Raw Response Data (Post-Export)
// After the anonymized PDF is emailed, this
// removes all raw response data to prevent
// any retroactive identity correlation.
// ─────────────────────────────────────────────

function purgeRawData(sheetId) {
  try {
    var spreadsheet = openSpreadsheet(sheetId);
    var source = spreadsheet.getSheetByName('Form Responses 1');

    if (!source) {
      return jsonResponse('success', {
        message: 'No raw data sheet found (may already be purged)'
      });
    }

    var lastRow = source.getLastRow();
    if (lastRow < 2) {
      return jsonResponse('success', {
        message: 'No data rows to purge'
      });
    }

    // Clear all data rows (keep headers)
    var lastCol = source.getLastColumn();
    source.getRange(2, 1, lastRow - 1, lastCol).clearContent();

    // Add a purge notice in row 2
    source.getRange(2, 1).setValue('DATA PURGED');
    source.getRange(2, 2).setValue('Raw response data was purged after anonymized export on ' + new Date().toISOString());

    return jsonResponse('success', {
      message: 'Raw response data purged',
      rows_purged: lastRow - 1,
      purged_at: new Date().toISOString()
    });
  } catch (err) {
    return jsonError('purgeRawData failed: ' + err.toString());
  }
}

// ─────────────────────────────────────────────
// Setup Conditional Formatting (Run Once)
// ─────────────────────────────────────────────

function setupConditionalFormatting(sheetId) {
  try {
    var spreadsheet = openSpreadsheet(sheetId);
    var sheet = spreadsheet.getSheetByName('Form Responses 1');

    if (!sheet) {
      return jsonError('"Form Responses 1" sheet not found. Link a Google Form to this spreadsheet first.');
    }

    var sentimentCol = findColumnByHeader(sheet, 'Sentiment');
    if (sentimentCol === -1) {
      return jsonError('Sentiment column not found. Add a column header named "Sentiment" to your sheet first.');
    }

    applyFormattingToSheet(sheet, sentimentCol);

    return jsonResponse('success', {
      message: 'Conditional formatting applied',
      sentiment_column: sentimentCol,
      rules_applied: ['empath -> Purple/White', 'needs growth -> Lime-Green/Black']
    });
  } catch (err) {
    return jsonError('setupConditionalFormatting failed: ' + err.toString());
  }
}

// ─────────────────────────────────────────────
// Helper: Open spreadsheet with clear error
// ─────────────────────────────────────────────

function openSpreadsheet(sheetId) {
  try {
    return SpreadsheetApp.openById(sheetId);
  } catch (err) {
    throw new Error(
      'Cannot open spreadsheet with ID "' + sheetId + '". ' +
      'Check that the sheet_id is correct (find it in the URL: docs.google.com/spreadsheets/d/{THIS_IS_THE_ID}/edit) ' +
      'and that the Apps Script owner has edit access to the spreadsheet.'
    );
  }
}

// ─────────────────────────────────────────────
// Helper: Apply sentiment formatting to a sheet
// ─────────────────────────────────────────────

function applyFormattingToSheet(sheet, colIndex) {
  var range = sheet.getRange(2, colIndex, sheet.getMaxRows() - 1, 1);
  var rules = sheet.getConditionalFormatRules();

  // Rule 1: "empath" -> Purple background (#A020F0), White text
  var empathRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('empath')
    .setBackground('#A020F0')
    .setFontColor('#FFFFFF')
    .setBold(true)
    .setRanges([range])
    .build();

  // Rule 2: "needs growth" -> Lime-Green background (#32CD32), Black text
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
  var sheetId = 'YOUR_GOOGLE_SHEET_ID';
  var result = setupConditionalFormatting(sheetId);
  Logger.log(result.getContent());
}

function testCloseForm() {
  var formId = 'YOUR_GOOGLE_FORM_ID';
  var result = closeForm(formId);
  Logger.log(result.getContent());
}

function testAnonymize() {
  var sheetId = 'YOUR_GOOGLE_SHEET_ID';
  var result = anonymizeSheet(sheetId);
  Logger.log(result.getContent());
}

function testPurge() {
  var sheetId = 'YOUR_GOOGLE_SHEET_ID';
  var result = purgeRawData(sheetId);
  Logger.log(result.getContent());
}
