/**
 * ============================================================================
 * VIP PROGRESS MONITORING DASHBOARD
 * AI in Pharmaceutical Sciences: Bench to Bedside
 *
 * TEMPLATE VERSION - Configure for your institution
 * ============================================================================
 *
 * This script provides real-time visibility into student progress:
 * - Tracks talktorial completion by week
 * - Monitors last activity date per student
 * - Flags inactive students (configurable threshold)
 * - Generates at-a-glance dashboard
 * - Sends weekly progress reports to instructor
 * - Optional: AI-powered notebook analysis using Claude API
 *
 * Dashboard shows:
 * - Student name and overall progress percentage
 * - Week-by-week talktorial status (✓ modified, ○ untouched, - not released)
 * - Days since last activity
 * - Alert flags for students needing attention
 *
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION - UPDATE THESE VALUES FOR YOUR INSTITUTION
// ============================================================================

const PROGRESS_CONFIG = {

  // ---------------------------------------------------------------------------
  // INSTRUCTOR INFO
  // ---------------------------------------------------------------------------

  instructorEmail: 'YOUR_EMAIL@university.edu',     // UPDATE: Your email
  instructorName: 'Dr. Your Name',                   // UPDATE: Your name

  // ---------------------------------------------------------------------------
  // FOLDER AND SPREADSHEET IDS
  // ---------------------------------------------------------------------------

  // Parent folder containing all student folders
  parentFolderId: 'PASTE_PARENT_FOLDER_ID_HERE',

  // Roster spreadsheet ID
  rosterSpreadsheetId: 'PASTE_ROSTER_SPREADSHEET_ID_HERE',
  rosterSheetName: 'Roster',

  // Dashboard sheet name (will be created if doesn't exist)
  dashboardSheetName: 'Progress Dashboard',

  // ---------------------------------------------------------------------------
  // ALERT THRESHOLDS
  // ---------------------------------------------------------------------------

  // Days of inactivity before flagging a student
  inactivityThresholdDays: 5,

  // Minimum expected progress percentage (based on current week)
  minExpectedProgressPercent: 70,

  // ---------------------------------------------------------------------------
  // AI ANALYSIS SETTINGS (Optional)
  // ---------------------------------------------------------------------------

  // Claude model to use for AI analysis
  // Options: 'claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022'
  claudeModel: 'claude-sonnet-4-20250514',

  // AI Insights sheet name
  aiInsightsSheetName: 'AI Insights',

  // Expected notebook structure (for structure analysis)
  // Customize based on your lab notebook template
  notebookStructure: {
    sections: [
      {
        name: 'AI-Assisted Learning Documentation',
        aliases: ['AI-Assisted Learning', 'AI Learning', 'Section 1'],
        subsections: ['Weekly Inquiry Logs', 'AI Verification Log', 'Prompt Engineering Progress']
      },
      {
        name: 'Technical Documentation',
        aliases: ['Technical', 'Section 2'],
        subsections: ['Daily Progress Notes', 'Code Documentation', 'Experimental Design']
      },
      {
        name: 'Reflection Section',
        aliases: ['Reflection', 'Reflections', 'Section 3'],
        subsections: ['Weekly Reflections', 'Challenge Analysis', 'AI Learning Reflection']
      },
      {
        name: 'Integration Section',
        aliases: ['Integration', 'Section 4'],
        subsections: ['Monthly Synthesis', 'Cross-Disciplinary Insights', 'Healthcare Impact']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // GOOGLE CHAT WEBHOOK (Optional)
  // ---------------------------------------------------------------------------

  chatWebhookUrl: 'PASTE_WEBHOOK_URL_HERE',

  // ---------------------------------------------------------------------------
  // SEMESTER DATES
  // ---------------------------------------------------------------------------

  semesterStart: new Date('2026-01-12'),
  semesterEnd: new Date('2026-05-12'),
  springBreakStart: new Date('2026-03-08'),
  springBreakEnd: new Date('2026-03-15'),

  // ---------------------------------------------------------------------------
  // TALKTORIAL SCHEDULE
  // Week number -> array of talktorial numbers released that week
  // ---------------------------------------------------------------------------

  talktorialSchedule: {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
    5: [9, 10],
    6: [11, 12],
    7: [13],
    8: [14],
    // Spring break - no release
    9: [15],
    10: [16],
    11: [17],
    12: [18],
    13: [19],
    14: [20],
    15: [],
    16: []
  }
};

// ============================================================================
// MAIN DASHBOARD FUNCTIONS
// ============================================================================

/**
 * Refresh the progress dashboard
 * This is the main function that updates the dashboard sheet
 */
function refreshProgressDashboard() {
  Logger.log('Refreshing progress dashboard...');

  const ss = SpreadsheetApp.openById(PROGRESS_CONFIG.rosterSpreadsheetId);

  // Get or create dashboard sheet
  let dashboard = ss.getSheetByName(PROGRESS_CONFIG.dashboardSheetName);
  if (!dashboard) {
    dashboard = ss.insertSheet(PROGRESS_CONFIG.dashboardSheetName);
    Logger.log('Created new dashboard sheet');
  }

  // Get roster data
  const roster = ss.getSheetByName(PROGRESS_CONFIG.rosterSheetName);
  if (!roster) {
    Logger.log('ERROR: Roster sheet not found!');
    return;
  }

  const rosterData = roster.getDataRange().getValues();
  const headers = rosterData[0].map(h => String(h).trim());

  // Find required columns
  const nameCol = headers.indexOf('Name');
  const emailCol = headers.indexOf('Email');
  const folderIdCol = headers.indexOf('Folder ID');
  const talktorialFolderIdCol = headers.indexOf('Talktorial Folder ID');
  const folderCreatedCol = headers.indexOf('Folder Created');

  if (nameCol === -1 || folderIdCol === -1) {
    Logger.log('ERROR: Required columns not found in roster!');
    return;
  }

  // Calculate current week
  const currentWeek = getCurrentWeekForProgress();
  const totalExpectedTalktorials = getTalktorialsUpToWeekForProgress(currentWeek).length;

  Logger.log('Current week: ' + currentWeek);
  Logger.log('Expected talktorials: ' + totalExpectedTalktorials);

  // Build dashboard data
  const dashboardData = [];
  const alertStudents = [];

  // Process each student
  for (let i = 1; i < rosterData.length; i++) {
    const row = rosterData[i];
    const name = row[nameCol];
    const email = row[emailCol];
    const folderId = row[folderIdCol];
    const talktorialFolderId = row[talktorialFolderIdCol];
    const folderCreated = row[folderCreatedCol];

    // Skip empty rows or students without folders
    if (!name || !folderId) continue;
    if (folderCreated !== '✓' && folderCreated !== true && folderCreated !== 'Yes') continue;

    Logger.log('Processing student: ' + name);

    try {
      // Get student progress
      const progress = getStudentProgress(name, folderId, talktorialFolderId, currentWeek);
      dashboardData.push(progress);

      // Check for alerts
      if (progress.needsAttention) {
        alertStudents.push({
          name: name,
          email: email,
          reason: progress.alertReason
        });
      }

    } catch (error) {
      Logger.log('Error processing ' + name + ': ' + error.message);
      dashboardData.push({
        name: name,
        completedCount: 0,
        totalExpected: totalExpectedTalktorials,
        progressPercent: 0,
        lastActivity: 'Error',
        daysSinceActivity: 999,
        weekStatus: {},
        needsAttention: true,
        alertReason: 'Error accessing folder'
      });
    }
  }

  // Write dashboard
  writeDashboardSheet(dashboard, dashboardData, currentWeek);

  // Log summary
  Logger.log('Dashboard refreshed. ' + dashboardData.length + ' students processed.');
  Logger.log('Students needing attention: ' + alertStudents.length);

  return {
    studentsProcessed: dashboardData.length,
    alertCount: alertStudents.length,
    alertStudents: alertStudents
  };
}

/**
 * Get progress data for a single student
 */
function getStudentProgress(name, folderId, talktorialFolderId, currentWeek) {
  const progress = {
    name: name,
    completedCount: 0,
    totalExpected: 0,
    progressPercent: 0,
    lastActivity: null,
    daysSinceActivity: 0,
    weekStatus: {},
    needsAttention: false,
    alertReason: ''
  };

  // Get the talktorial folder
  let talktorialFolder;
  if (talktorialFolderId) {
    try {
      talktorialFolder = DriveApp.getFolderById(talktorialFolderId);
    } catch (e) {
      // Fall back to finding Talktorials subfolder
      const studentFolder = DriveApp.getFolderById(folderId);
      const subfolders = studentFolder.getFoldersByName('Talktorials');
      if (subfolders.hasNext()) {
        talktorialFolder = subfolders.next();
      }
    }
  } else {
    // Find Talktorials subfolder
    const studentFolder = DriveApp.getFolderById(folderId);
    const subfolders = studentFolder.getFoldersByName('Talktorials');
    if (subfolders.hasNext()) {
      talktorialFolder = subfolders.next();
    }
  }

  if (!talktorialFolder) {
    progress.alertReason = 'No Talktorials folder found';
    progress.needsAttention = true;
    return progress;
  }

  // Get all files in talktorial folder
  const files = talktorialFolder.getFiles();
  const talktorialFiles = {};
  let lastModified = null;

  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();
    const modDate = file.getLastUpdated();

    // Extract talktorial number from filename
    const match = fileName.match(/AI-PSCI-0*(\d+)/i);
    if (match) {
      const num = parseInt(match[1]);
      talktorialFiles[num] = {
        name: fileName,
        lastModified: modDate,
        // Consider "modified" if changed more than 1 hour after creation
        wasWorkedOn: (modDate.getTime() - file.getDateCreated().getTime()) > 3600000
      };

      // Track last activity
      if (!lastModified || modDate > lastModified) {
        lastModified = modDate;
      }
    }
  }

  // Calculate progress by week
  const expectedTalktorials = getTalktorialsUpToWeekForProgress(currentWeek);
  progress.totalExpected = expectedTalktorials.length;

  for (let week = 1; week <= currentWeek; week++) {
    const weekTalktorials = PROGRESS_CONFIG.talktorialSchedule[week] || [];
    const weekStatus = [];

    weekTalktorials.forEach(num => {
      if (talktorialFiles[num]) {
        if (talktorialFiles[num].wasWorkedOn) {
          weekStatus.push('✓'); // Modified
          progress.completedCount++;
        } else {
          weekStatus.push('○'); // Exists but not modified
        }
      } else {
        weekStatus.push('✗'); // Missing
      }
    });

    progress.weekStatus[week] = weekStatus.join('');
  }

  // Calculate percentage
  if (progress.totalExpected > 0) {
    progress.progressPercent = Math.round((progress.completedCount / progress.totalExpected) * 100);
  }

  // Calculate days since activity
  if (lastModified) {
    progress.lastActivity = lastModified;
    const now = new Date();
    progress.daysSinceActivity = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24));
  } else {
    progress.daysSinceActivity = 999; // No activity found
  }

  // Check if student needs attention
  if (progress.daysSinceActivity > PROGRESS_CONFIG.inactivityThresholdDays) {
    progress.needsAttention = true;
    progress.alertReason = 'Inactive for ' + progress.daysSinceActivity + ' days';
  } else if (progress.progressPercent < PROGRESS_CONFIG.minExpectedProgressPercent) {
    progress.needsAttention = true;
    progress.alertReason = 'Progress below ' + PROGRESS_CONFIG.minExpectedProgressPercent + '%';
  }

  return progress;
}

/**
 * Write the dashboard data to the sheet
 */
function writeDashboardSheet(sheet, data, currentWeek) {
  // Clear existing content
  sheet.clear();

  // Build headers
  const headers = ['Student', 'Progress', '%', 'Last Activity', 'Days Idle'];

  // Add week columns
  for (let w = 1; w <= currentWeek; w++) {
    const weekTalktorials = PROGRESS_CONFIG.talktorialSchedule[w] || [];
    if (weekTalktorials.length > 0) {
      headers.push('W' + w);
    }
  }

  headers.push('Status');

  // Write header row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white')
    .setHorizontalAlignment('center');

  // Build data rows
  const rows = data.map(student => {
    const row = [
      student.name,
      student.completedCount + '/' + student.totalExpected,
      student.progressPercent + '%',
      student.lastActivity ? Utilities.formatDate(student.lastActivity, 'America/New_York', 'MM/dd') : 'Never',
      student.daysSinceActivity === 999 ? 'N/A' : student.daysSinceActivity
    ];

    // Add week status columns
    for (let w = 1; w <= currentWeek; w++) {
      const weekTalktorials = PROGRESS_CONFIG.talktorialSchedule[w] || [];
      if (weekTalktorials.length > 0) {
        row.push(student.weekStatus[w] || '-');
      }
    }

    // Status column
    if (student.needsAttention) {
      row.push('⚠️ ' + student.alertReason);
    } else {
      row.push('✅ On Track');
    }

    return row;
  });

  // Write data rows
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

    // Apply conditional formatting
    applyDashboardFormatting(sheet, rows.length, headers.length, currentWeek);
  }

  // Add summary row
  const summaryRow = rows.length + 3;
  const onTrackCount = data.filter(s => !s.needsAttention).length;
  const alertCount = data.filter(s => s.needsAttention).length;
  const avgProgress = data.length > 0
    ? Math.round(data.reduce((sum, s) => sum + s.progressPercent, 0) / data.length)
    : 0;

  sheet.getRange(summaryRow, 1, 1, 4).setValues([[
    'SUMMARY',
    'Week ' + currentWeek,
    'Avg: ' + avgProgress + '%',
    onTrackCount + ' on track, ' + alertCount + ' need attention'
  ]]);
  sheet.getRange(summaryRow, 1, 1, 4)
    .setFontWeight('bold')
    .setBackground('#f3f3f3');

  // Add legend
  const legendRow = summaryRow + 2;
  sheet.getRange(legendRow, 1, 1, 5).setValues([[
    'Legend:', '✓ = Modified', '○ = Untouched', '✗ = Missing', ''
  ]]);
  sheet.getRange(legendRow, 1).setFontWeight('bold');

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  // Freeze header row
  sheet.setFrozenRows(1);

  // Add last updated timestamp
  const timestampRow = legendRow + 1;
  sheet.getRange(timestampRow, 1).setValue(
    'Last Updated: ' + Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm:ss')
  );
  sheet.getRange(timestampRow, 1).setFontStyle('italic').setFontColor('#666666');
}

/**
 * Apply conditional formatting to the dashboard
 */
function applyDashboardFormatting(sheet, numRows, numCols, currentWeek) {
  // Color the progress percentage column based on value
  const progressColIndex = 3;

  for (let row = 2; row <= numRows + 1; row++) {
    const cell = sheet.getRange(row, progressColIndex);
    const value = cell.getValue();
    const percent = parseInt(value);

    if (percent >= 80) {
      cell.setBackground('#c6efce').setFontColor('#006100'); // Green
    } else if (percent >= 50) {
      cell.setBackground('#ffeb9c').setFontColor('#9c5700'); // Yellow
    } else {
      cell.setBackground('#ffc7ce').setFontColor('#9c0006'); // Red
    }
  }

  // Color the days idle column
  const daysIdleColIndex = 5;

  for (let row = 2; row <= numRows + 1; row++) {
    const cell = sheet.getRange(row, daysIdleColIndex);
    const value = cell.getValue();
    const days = parseInt(value);

    if (!isNaN(days)) {
      if (days <= 2) {
        cell.setBackground('#c6efce'); // Green
      } else if (days <= PROGRESS_CONFIG.inactivityThresholdDays) {
        cell.setBackground('#ffeb9c'); // Yellow
      } else {
        cell.setBackground('#ffc7ce'); // Red
      }
    }
  }

  // Color the status column (last column)
  for (let row = 2; row <= numRows + 1; row++) {
    const cell = sheet.getRange(row, numCols);
    const value = cell.getValue();

    if (value.includes('✅')) {
      cell.setBackground('#c6efce');
    } else if (value.includes('⚠️')) {
      cell.setBackground('#ffc7ce');
    }
  }
}

// ============================================================================
// ALERT AND REPORTING FUNCTIONS
// ============================================================================

/**
 * Send weekly progress report to instructor
 */
function sendWeeklyProgressReport() {
  const result = refreshProgressDashboard();

  if (!result) {
    Logger.log('Could not generate progress report');
    return;
  }

  const currentWeek = getCurrentWeekForProgress();
  const ss = SpreadsheetApp.openById(PROGRESS_CONFIG.rosterSpreadsheetId);
  const dashboardUrl = ss.getUrl() + '#gid=' + ss.getSheetByName(PROGRESS_CONFIG.dashboardSheetName).getSheetId();

  // Build email body
  let emailBody = `Weekly Progress Report - Week ${currentWeek}\n\n`;
  emailBody += `Students Tracked: ${result.studentsProcessed}\n`;
  emailBody += `Students On Track: ${result.studentsProcessed - result.alertCount}\n`;
  emailBody += `Students Needing Attention: ${result.alertCount}\n\n`;

  if (result.alertCount > 0) {
    emailBody += `STUDENTS NEEDING ATTENTION:\n`;
    emailBody += `${'─'.repeat(40)}\n`;
    result.alertStudents.forEach(student => {
      emailBody += `• ${student.name}: ${student.reason}\n`;
    });
    emailBody += `\n`;
  }

  emailBody += `View Full Dashboard: ${dashboardUrl}\n\n`;
  emailBody += `This report was generated automatically by VIP Progress Monitor.`;

  // Send email
  MailApp.sendEmail({
    to: PROGRESS_CONFIG.instructorEmail,
    subject: `📊 VIP Progress Report - Week ${currentWeek}`,
    body: emailBody
  });

  Logger.log('Weekly progress report sent to ' + PROGRESS_CONFIG.instructorEmail);

  // Also send to Chat if there are alerts
  if (result.alertCount > 0) {
    let chatMessage = `📊 *Weekly Progress Report - Week ${currentWeek}*\n\n`;
    chatMessage += `Students needing attention: *${result.alertCount}*\n\n`;
    result.alertStudents.forEach(student => {
      chatMessage += `• ${student.name}: ${student.reason}\n`;
    });
    chatMessage += `\nView dashboard for details.`;

    sendProgressChatMessage(chatMessage);
  }
}

/**
 * Check for and alert about inactive students
 */
function checkInactiveStudents() {
  Logger.log('Checking for inactive students...');

  const result = refreshProgressDashboard();

  if (!result || result.alertCount === 0) {
    Logger.log('No inactive students found');
    return;
  }

  // Only send alert if there are concerning patterns
  const severeAlerts = result.alertStudents.filter(s =>
    s.reason.includes('Inactive') && parseInt(s.reason.match(/\d+/)) > 7
  );

  if (severeAlerts.length > 0) {
    let message = `⚠️ *Student Inactivity Alert*\n\n`;
    message += `${severeAlerts.length} student(s) inactive for 7+ days:\n\n`;
    severeAlerts.forEach(s => {
      message += `• ${s.name}: ${s.reason}\n`;
    });

    sendProgressChatMessage(message);
    Logger.log('Inactivity alert sent for ' + severeAlerts.length + ' students');
  }
}

/**
 * Send message to Google Chat
 */
function sendProgressChatMessage(message) {
  if (!PROGRESS_CONFIG.chatWebhookUrl || PROGRESS_CONFIG.chatWebhookUrl === 'PASTE_WEBHOOK_URL_HERE') {
    Logger.log('Chat webhook not configured');
    return;
  }

  const payload = { text: message };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(PROGRESS_CONFIG.chatWebhookUrl, options);
    if (response.getResponseCode() === 200) {
      Logger.log('Chat message sent successfully');
    } else {
      Logger.log('Chat message failed: ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('Chat webhook error: ' + error.message);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate current week of semester
 */
function getCurrentWeekForProgress() {
  const now = new Date();
  const start = PROGRESS_CONFIG.semesterStart;

  if (now < start) return 1;
  if (now > PROGRESS_CONFIG.semesterEnd) return 16;

  let weeks = Math.ceil((now - start) / (7 * 24 * 60 * 60 * 1000));

  if (now >= PROGRESS_CONFIG.springBreakStart && now <= PROGRESS_CONFIG.springBreakEnd) {
    return 8;
  }
  if (now > PROGRESS_CONFIG.springBreakEnd) {
    weeks -= 1;
  }

  return Math.min(weeks, 16);
}

/**
 * Get array of talktorial numbers released up to a given week
 */
function getTalktorialsUpToWeekForProgress(week) {
  const talktorials = [];
  for (let w = 1; w <= week; w++) {
    const weekTalktorials = PROGRESS_CONFIG.talktorialSchedule[w] || [];
    talktorials.push(...weekTalktorials);
  }
  return talktorials;
}

// ============================================================================
// INDIVIDUAL STUDENT FUNCTIONS
// ============================================================================

/**
 * View detailed progress for a specific student
 */
function viewStudentDetail() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.prompt(
    'View Student Detail',
    'Enter student name:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const studentName = response.getResponseText().trim();
  if (!studentName) return;

  // Find student in roster
  const ss = SpreadsheetApp.openById(PROGRESS_CONFIG.rosterSpreadsheetId);
  const roster = ss.getSheetByName(PROGRESS_CONFIG.rosterSheetName);
  const data = roster.getDataRange().getValues();
  const headers = data[0].map(h => String(h).trim());

  const nameCol = headers.indexOf('Name');
  const folderIdCol = headers.indexOf('Folder ID');
  const talktorialFolderIdCol = headers.indexOf('Talktorial Folder ID');

  let studentRow = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][nameCol] && data[i][nameCol].toLowerCase().includes(studentName.toLowerCase())) {
      studentRow = data[i];
      break;
    }
  }

  if (!studentRow) {
    ui.alert('Student Not Found', 'Could not find student: ' + studentName, ui.ButtonSet.OK);
    return;
  }

  const currentWeek = getCurrentWeekForProgress();
  const progress = getStudentProgress(
    studentRow[nameCol],
    studentRow[folderIdCol],
    studentRow[talktorialFolderIdCol],
    currentWeek
  );

  // Build detail message
  let detail = `Student: ${progress.name}\n\n`;
  detail += `Overall Progress: ${progress.completedCount}/${progress.totalExpected} (${progress.progressPercent}%)\n`;
  detail += `Last Activity: ${progress.lastActivity ? Utilities.formatDate(progress.lastActivity, 'America/New_York', 'MM/dd/yyyy') : 'Never'}\n`;
  detail += `Days Since Activity: ${progress.daysSinceActivity === 999 ? 'N/A' : progress.daysSinceActivity}\n\n`;

  detail += `Week-by-Week Status:\n`;
  for (let w = 1; w <= currentWeek; w++) {
    const weekTalktorials = PROGRESS_CONFIG.talktorialSchedule[w] || [];
    if (weekTalktorials.length > 0) {
      detail += `Week ${w}: ${progress.weekStatus[w] || '-'} (AI-PSCI-${weekTalktorials.map(n => String(n).padStart(3, '0')).join(', ')})\n`;
    }
  }

  detail += `\nStatus: ${progress.needsAttention ? '⚠️ ' + progress.alertReason : '✅ On Track'}`;

  ui.alert('Student Progress Detail', detail, ui.ButtonSet.OK);
}

// ============================================================================
// TRIGGER MANAGEMENT
// ============================================================================

/**
 * Set up weekly progress report trigger (Mondays at 8 AM)
 */
function setWeeklyReportTrigger() {
  // Remove existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sendWeeklyProgressReport') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new weekly trigger
  ScriptApp.newTrigger('sendWeeklyProgressReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();

  SpreadsheetApp.getUi().alert(
    'Weekly Report Trigger Set',
    'Progress report will be sent every Monday at 8 AM.\n\n' +
    'The report includes:\n' +
    '• Overall class progress summary\n' +
    '• List of students needing attention\n' +
    '• Link to the full dashboard',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Set up daily inactivity check trigger
 */
function setDailyInactivityTrigger() {
  // Remove existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'checkInactiveStudents') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new daily trigger
  ScriptApp.newTrigger('checkInactiveStudents')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();

  SpreadsheetApp.getUi().alert(
    'Daily Inactivity Check Set',
    'System will check for inactive students daily at 9 AM.\n\n' +
    'Alerts will be sent to Google Chat when students are inactive for 7+ days.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Remove all progress monitoring triggers
 */
function removeProgressTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;

  triggers.forEach(trigger => {
    const func = trigger.getHandlerFunction();
    if (func === 'sendWeeklyProgressReport' || func === 'checkInactiveStudents' || func === 'refreshProgressDashboard') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });

  SpreadsheetApp.getUi().alert(
    'Triggers Removed',
    removed + ' progress monitoring trigger(s) removed.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Show progress trigger status
 */
function showProgressTriggerStatus() {
  const triggers = ScriptApp.getProjectTriggers();
  let status = 'Progress Monitoring Triggers:\n\n';
  let found = false;

  triggers.forEach(trigger => {
    const func = trigger.getHandlerFunction();
    if (func === 'sendWeeklyProgressReport') {
      status += '✅ Weekly Report: Mondays at 8 AM\n';
      found = true;
    } else if (func === 'checkInactiveStudents') {
      status += '✅ Daily Inactivity Check: 9 AM\n';
      found = true;
    }
  });

  if (!found) {
    status += '⚠️ No progress monitoring triggers are set.\n\n';
    status += 'Use the menu to enable automatic monitoring.';
  }

  SpreadsheetApp.getUi().alert('Trigger Status', status, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ============================================================================
// AI ANALYSIS - API KEY MANAGEMENT (Optional Feature)
// ============================================================================

/**
 * Get the stored Claude API key (from Script Properties)
 */
function getClaudeApiKey() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty('CLAUDE_API_KEY');
}

/**
 * Store the Claude API key securely
 */
function setClaudeApiKey(apiKey) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('CLAUDE_API_KEY', apiKey);
}

/**
 * Clear the stored API key
 */
function clearClaudeApiKey() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('CLAUDE_API_KEY');
  SpreadsheetApp.getUi().alert('API Key Cleared', 'The Claude API key has been removed.', SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Prompt user for API key if not set
 */
function ensureApiKey() {
  let apiKey = getClaudeApiKey();

  if (!apiKey) {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt(
      'Claude API Key Required',
      'Enter your Anthropic API key (from console.anthropic.com):\n\n' +
      'The key will be stored securely and you won\'t need to enter it again.',
      ui.ButtonSet.OK_CANCEL
    );

    if (response.getSelectedButton() !== ui.Button.OK) {
      return null;
    }

    apiKey = response.getResponseText().trim();
    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      ui.alert('Invalid API Key', 'API key should start with "sk-ant-". Please try again.', ui.ButtonSet.OK);
      return null;
    }

    setClaudeApiKey(apiKey);
    ui.alert('API Key Saved', 'Your API key has been stored securely.', ui.ButtonSet.OK);
  }

  return apiKey;
}

/**
 * Update the stored API key
 */
function updateApiKey() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Update Claude API Key',
    'Enter your new Anthropic API key:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const apiKey = response.getResponseText().trim();
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    ui.alert('Invalid API Key', 'API key should start with "sk-ant-".', ui.ButtonSet.OK);
    return;
  }

  setClaudeApiKey(apiKey);
  ui.alert('API Key Updated', 'Your API key has been updated.', ui.ButtonSet.OK);
}

// ============================================================================
// AI ANALYSIS - CLAUDE API INTEGRATION (Optional Feature)
// ============================================================================

/**
 * Call the Claude API
 */
function callClaudeAPI(prompt, maxTokens = 1024) {
  const apiKey = getClaudeApiKey();
  if (!apiKey) {
    throw new Error('Claude API key not configured');
  }

  const url = 'https://api.anthropic.com/v1/messages';

  const payload = {
    model: PROGRESS_CONFIG.claudeModel,
    max_tokens: maxTokens,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      const errorText = response.getContentText();
      Logger.log('Claude API error: ' + errorText);
      throw new Error('API error: ' + responseCode);
    }

    const json = JSON.parse(response.getContentText());
    return json.content[0].text;

  } catch (error) {
    Logger.log('Claude API call failed: ' + error.message);
    throw error;
  }
}

/**
 * Test the Claude API connection
 */
function testClaudeAPI() {
  const apiKey = ensureApiKey();
  if (!apiKey) return;

  const ui = SpreadsheetApp.getUi();

  try {
    const response = callClaudeAPI('Respond with exactly: "API connection successful"');
    if (response && response.includes('successful')) {
      ui.alert('API Test Passed', '✅ Claude API is working correctly!', ui.ButtonSet.OK);
    } else {
      ui.alert('API Test', 'Received response: ' + response, ui.ButtonSet.OK);
    }
  } catch (error) {
    ui.alert('API Test Failed', '❌ Error: ' + error.message, ui.ButtonSet.OK);
  }
}

// ============================================================================
// MENU
// ============================================================================

/**
 * Create the Progress Monitor menu
 */
function createProgressMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 VIP Progress')
    .addItem('🔄 Refresh Dashboard', 'refreshProgressDashboard')
    .addItem('👤 View Student Detail', 'viewStudentDetail')
    .addSeparator()
    .addSubMenu(ui.createMenu('🤖 AI Analysis (Optional)')
      .addItem('Test Claude API', 'testClaudeAPI')
      .addItem('Update API Key', 'updateApiKey')
      .addItem('Clear API Key', 'clearClaudeApiKey'))
    .addSeparator()
    .addItem('📧 Send Weekly Report Now', 'sendWeeklyProgressReport')
    .addItem('🔔 Check Inactive Students Now', 'checkInactiveStudents')
    .addSeparator()
    .addSubMenu(ui.createMenu('⏰ Automatic Monitoring')
      .addItem('Set Weekly Report (Mondays 8 AM)', 'setWeeklyReportTrigger')
      .addItem('Set Daily Inactivity Check (9 AM)', 'setDailyInactivityTrigger')
      .addSeparator()
      .addItem('Remove All Progress Triggers', 'removeProgressTriggers')
      .addItem('Show Trigger Status', 'showProgressTriggerStatus'))
    .addSeparator()
    .addItem('💬 Test Chat Webhook', 'testProgressWebhook')
    .addToUi();
}

/**
 * Test the progress monitor webhook
 */
function testProgressWebhook() {
  sendProgressChatMessage('🧪 *Progress Monitor Test*\n\nIf you see this, the progress monitor webhook is working!');
  SpreadsheetApp.getUi().alert('Test message sent! Check your Chat space.');
}
