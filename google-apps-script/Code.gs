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
 */

// ─────────────────────────────────────────────
// Web App Entry Point
// ─────────────────────────────────────────────

function doGet(e) {
  var action = e.parameter.action;

  if (action === 'close_form') {
    return closeForm(e.parameter.form_id);
  } else if (action === 'export_anonymized') {
    return anonymizeSheet(e.parameter.sheet_id);
  } else if (action === 'export_pdf') {
    var anonymized = e.parameter.anonymized === 'true';
    return exportSheetAsPdf(e.parameter.sheet_id, anonymized);
  } else if (action === 'purge_raw_data') {
    return purgeRawData(e.parameter.sheet_id);
  } else if (action === 'setup_formatting') {
    return setupConditionalFormatting(e.parameter.sheet_id);
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: 'Unknown action. Use: close_form, export_anonymized, export_pdf, purge_raw_data, setup_formatting'
      })
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
// Anonymize Sheet Data (Privacy Layer)
// Creates an "Anonymized Results" sheet with:
//   - NO Timestamps
//   - NO email addresses
//   - Anonymous IDs instead of row numbers
//   - Only: Anonymous ID, Feedback (scrubbed), Sentiment
// ─────────────────────────────────────────────

function anonymizeSheet(sheetId) {
  try {
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var source = spreadsheet.getSheetByName('Form Responses 1');

    if (!source) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: 'Source sheet "Form Responses 1" not found' })
      ).setMimeType(ContentService.MimeType.JSON);
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
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'success', message: 'No responses to anonymize', rows: 0 })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var data = source.getRange(2, 1, lastRow - 1, source.getLastColumn()).getValues();

    for (var r = 0; r < data.length; r++) {
      var responseNum = r + 1;
      var rawFeedback = data[r][feedbackCol] ? data[r][feedbackCol].toString() : '';
      var sentiment = (sentimentCol >= 0 && data[r][sentimentCol]) ? data[r][sentimentCol].toString() : '';

      // Scrub any remaining PII from feedback
      var cleanFeedback = scrubPII(rawFeedback);

      anonSheet.getRange(r + 2, 1).setValue('R-' + responseNum);
      anonSheet.getRange(r + 2, 2).setValue(cleanFeedback);
      anonSheet.getRange(r + 2, 3).setValue(sentiment);
    }

    // Apply conditional formatting to anonymized sheet
    applyFormattingToSheet(anonSheet, 3);

    // Auto-resize columns
    anonSheet.autoResizeColumns(1, 3);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Sheet anonymized successfully',
        rows_processed: data.length,
        columns: ['Response #', 'Feedback', 'Sentiment']
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
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
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheetName = anonymized ? 'Anonymized Results' : 'Form Responses 1';
    var sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: 'Sheet "' + sheetName + '" not found. Run export_anonymized first.' })
      ).setMimeType(ContentService.MimeType.JSON);
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

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        pdf_url: file.getUrl(),
        download_url: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
        file_name: fileName,
        anonymized: anonymized
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
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
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var source = spreadsheet.getSheetByName('Form Responses 1');

    if (!source) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'success', message: 'No raw data sheet found' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var lastRow = source.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'success', message: 'No data rows to purge' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Clear all data rows (keep headers)
    var lastCol = source.getLastColumn();
    source.getRange(2, 1, lastRow - 1, lastCol).clearContent();

    // Add a purge notice in row 2
    source.getRange(2, 1).setValue('DATA PURGED');
    source.getRange(2, 2).setValue('Raw response data was purged after anonymized export on ' + new Date().toISOString());

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Raw response data purged',
        rows_purged: lastRow - 1,
        purged_at: new Date().toISOString()
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

    var sentimentCol = findColumnByHeader(sheet, 'Sentiment');
    if (sentimentCol === -1) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: 'Sentiment column not found' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    applyFormattingToSheet(sheet, sentimentCol);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Conditional formatting applied',
        sentiment_column: sentimentCol,
        rules_applied: ['empath -> Purple/White', 'needs growth -> Lime-Green/Black']
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
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
