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
        subsections: ['Weekly Inquiry Logs', 'AI Verification Log', 'Prompt Engineering Progress'],
        weeklyRequired: true  // Expect weekly entries in this section
      },
      {
        name: 'Technical Documentation',
        aliases: ['Technical', 'Section 2'],
        subsections: ['Daily Progress Notes', 'Code Documentation', 'Experimental Design'],
        weeklyRequired: true
      },
      {
        name: 'Reflection Section',
        aliases: ['Reflection', 'Reflections', 'Section 3'],
        subsections: ['Weekly Reflections', 'Challenge Analysis', 'AI Learning Reflection'],
        weeklyRequired: true
      },
      {
        name: 'Integration Section',
        aliases: ['Integration', 'Section 4'],
        subsections: ['Monthly Synthesis', 'Cross-Disciplinary Insights', 'Healthcare Impact'],
        weeklyRequired: false  // Monthly synthesis, not weekly
      }
    ],
    // Patterns to detect weekly entries (e.g., "Week 1", "Week 2", dates)
    weekPatterns: [
      /week\s*(\d+)/i,
      /w(\d+)/i,
      /\b(jan|feb|mar|apr|may)\w*\s+\d{1,2}/i,
      /\d{1,2}\/\d{1,2}\/\d{2,4}/
    ]
  },

  // Lab notebook tracking settings
  labNotebookTracking: {
    // Minimum word count per weekly entry to consider it "substantive"
    minWordsPerEntry: 50,
    // Alert if lab notebook not updated in this many days
    notebookInactivityDays: 7,
    // Weight for overall progress calculation (0-1)
    notebookProgressWeight: 0.3  // 30% of overall score
  },

  // ---------------------------------------------------------------------------
  // STUDENT NUDGE EMAIL SETTINGS
  // ---------------------------------------------------------------------------

  nudgeEmails: {
    // Email sender name (appears in "From" field)
    senderName: 'VIP AI-PSCI Course',

    // CC instructor on all nudge emails
    ccInstructor: true,

    // Email templates - customize these messages
    templates: {
      // For students behind on current week's talktorials
      behindOnWork: {
        subject: 'VIP AI-PSCI: Friendly Reminder - Week {week} Talktorials',
        body: `Hi {firstName},

I noticed you haven't yet completed the talktorial(s) for Week {week}:
{missingTalktorials}

These are due by the end of the week. If you're having any difficulties or need help getting started, please don't hesitate to reach out - I'm happy to help!

Remember, you can use AI tools like Claude or ChatGPT to help you work through the code. The goal is learning, not perfection.

Best,
{instructorName}

---
VIP AI in Pharmaceutical Sciences: Bench to Bedside
This is an automated reminder from the VIP Progress Monitor.`
      },

      // For students who haven't been active recently
      inactive: {
        subject: 'VIP AI-PSCI: Checking In - {daysInactive} Days Since Last Activity',
        body: `Hi {firstName},

I noticed it's been {daysInactive} days since your last activity in the VIP course materials. I wanted to check in and make sure everything is okay.

Your current progress:
• Talktorial completion: {talktorialPercent}%
• Lab notebook: {notebookPercent}%
• Overall: {overallPercent}%

If you're facing any challenges - whether technical, conceptual, or personal - please let me know. We can work together to get you back on track.

The upcoming work for this week includes:
{upcomingWork}

Best,
{instructorName}

---
VIP AI in Pharmaceutical Sciences: Bench to Bedside
This is an automated reminder from the VIP Progress Monitor.`
      },

      // For students with low overall progress
      lowProgress: {
        subject: 'VIP AI-PSCI: Let\'s Chat About Your Progress',
        body: `Hi {firstName},

I'm reaching out because your overall progress in the VIP course ({overallPercent}%) is below where I'd expect at this point in the semester.

Here's where you stand:
• Completed talktorials: {completedCount} of {expectedCount}
• Lab notebook entries: {notebookPercent}%

I'd like to schedule a brief check-in to discuss how I can better support you. This isn't about grades - it's about making sure you're getting the learning experience you deserve.

Please reply to this email or stop by my office hours to chat.

Best,
{instructorName}

---
VIP AI in Pharmaceutical Sciences: Bench to Bedside`
      }
    }
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
  const labNotebookIdCol = headers.indexOf('Lab Notebook ID');
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
    const labNotebookId = labNotebookIdCol !== -1 ? row[labNotebookIdCol] : null;
    const folderCreated = row[folderCreatedCol];

    // Skip empty rows or students without folders
    if (!name || !folderId) continue;
    if (folderCreated !== '✓' && folderCreated !== true && folderCreated !== 'Yes') continue;

    Logger.log('Processing student: ' + name);

    try {
      // Get student progress (includes talktorials AND lab notebook)
      const progress = getStudentProgress(name, folderId, talktorialFolderId, currentWeek, labNotebookId);
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

  // Calculate averages for reporting
  const avgOverall = dashboardData.length > 0
    ? Math.round(dashboardData.reduce((sum, s) => sum + s.progressPercent, 0) / dashboardData.length)
    : 0;
  const avgTalktorial = dashboardData.length > 0
    ? Math.round(dashboardData.reduce((sum, s) => sum + s.talktorialPercent, 0) / dashboardData.length)
    : 0;
  const avgNotebook = dashboardData.length > 0
    ? Math.round(dashboardData.reduce((sum, s) => sum + s.notebookPercent, 0) / dashboardData.length)
    : 0;

  // Log summary
  Logger.log('Dashboard refreshed. ' + dashboardData.length + ' students processed.');
  Logger.log('Students needing attention: ' + alertStudents.length);
  Logger.log('Averages - Overall: ' + avgOverall + '%, Talktorial: ' + avgTalktorial + '%, Notebook: ' + avgNotebook + '%');

  return {
    studentsProcessed: dashboardData.length,
    alertCount: alertStudents.length,
    alertStudents: alertStudents,
    avgOverall: avgOverall,
    avgTalktorial: avgTalktorial,
    avgNotebook: avgNotebook
  };
}

/**
 * Get progress data for a single student
 */
function getStudentProgress(name, folderId, talktorialFolderId, currentWeek, labNotebookId) {
  const progress = {
    name: name,
    // Talktorial progress
    completedCount: 0,
    totalExpected: 0,
    talktorialPercent: 0,
    lastActivity: null,
    daysSinceActivity: 0,
    weekStatus: {},
    // Lab notebook progress
    notebook: null,
    notebookPercent: 0,
    // Combined progress
    progressPercent: 0,
    needsAttention: false,
    alertReason: '',
    alertReasons: []  // Multiple reasons possible
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

  // Calculate talktorial percentage
  if (progress.totalExpected > 0) {
    progress.talktorialPercent = Math.round((progress.completedCount / progress.totalExpected) * 100);
  }

  // Calculate days since talktorial activity
  if (lastModified) {
    progress.lastActivity = lastModified;
    const now = new Date();
    progress.daysSinceActivity = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24));
  } else {
    progress.daysSinceActivity = 999; // No activity found
  }

  // Get lab notebook progress
  if (labNotebookId) {
    progress.notebook = getLabNotebookProgress(labNotebookId, currentWeek);
    progress.notebookPercent = progress.notebook.weeklyCompleteness;

    // Update last activity to include notebook activity
    if (progress.notebook.lastModified) {
      if (!progress.lastActivity || progress.notebook.lastModified > progress.lastActivity) {
        progress.lastActivity = progress.notebook.lastModified;
        progress.daysSinceActivity = progress.notebook.daysSinceUpdate;
      }
    }
  }

  // Calculate combined progress (weighted average)
  progress.progressPercent = getCombinedProgressScore(
    progress.talktorialPercent,
    progress.notebookPercent
  );

  // Check if student needs attention - collect all alerts
  if (progress.daysSinceActivity > PROGRESS_CONFIG.inactivityThresholdDays) {
    progress.alertReasons.push('Inactive ' + progress.daysSinceActivity + 'd');
  }
  if (progress.talktorialPercent < PROGRESS_CONFIG.minExpectedProgressPercent) {
    progress.alertReasons.push('Talktorials ' + progress.talktorialPercent + '%');
  }
  if (progress.notebook && progress.notebook.alerts.length > 0) {
    // Add first notebook alert (most important)
    progress.alertReasons.push('Notebook: ' + progress.notebook.alerts[0]);
  }

  if (progress.alertReasons.length > 0) {
    progress.needsAttention = true;
    progress.alertReason = progress.alertReasons.join('; ');
  }

  return progress;
}

/**
 * Write the dashboard data to the sheet
 */
function writeDashboardSheet(sheet, data, currentWeek) {
  // Clear existing content
  sheet.clear();

  // Build headers - now includes both talktorial and notebook tracking
  const headers = [
    'Student',
    'Overall',    // Combined progress
    'Talktorials', // Talktorial count
    'T%',          // Talktorial percentage
    'Notebook',    // Notebook weekly entries
    'N%',          // Notebook percentage
    'Last Active',
    'Days'
  ];

  // Add week columns for talktorials
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
    // Build notebook weekly entry string (e.g., "3/5" for 3 of 5 weeks)
    const notebookWeeks = student.notebook
      ? student.notebook.weeksWithEntries + '/' + student.notebook.expectedWeeks
      : 'N/A';

    const row = [
      student.name,
      student.progressPercent + '%',                                         // Overall (combined)
      student.completedCount + '/' + student.totalExpected,                  // Talktorials count
      student.talktorialPercent + '%',                                       // Talktorial %
      notebookWeeks,                                                         // Notebook weeks
      student.notebookPercent + '%',                                         // Notebook %
      student.lastActivity ? Utilities.formatDate(student.lastActivity, 'America/New_York', 'MM/dd') : 'Never',
      student.daysSinceActivity === 999 ? 'N/A' : student.daysSinceActivity
    ];

    // Add week status columns (talktorials)
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
  const avgOverall = data.length > 0
    ? Math.round(data.reduce((sum, s) => sum + s.progressPercent, 0) / data.length)
    : 0;
  const avgTalktorial = data.length > 0
    ? Math.round(data.reduce((sum, s) => sum + s.talktorialPercent, 0) / data.length)
    : 0;
  const avgNotebook = data.length > 0
    ? Math.round(data.reduce((sum, s) => sum + s.notebookPercent, 0) / data.length)
    : 0;

  sheet.getRange(summaryRow, 1, 1, 6).setValues([[
    'SUMMARY',
    'Week ' + currentWeek,
    'Avg Overall: ' + avgOverall + '%',
    'Avg Talktorial: ' + avgTalktorial + '%',
    'Avg Notebook: ' + avgNotebook + '%',
    onTrackCount + ' on track, ' + alertCount + ' alerts'
  ]]);
  sheet.getRange(summaryRow, 1, 1, 6)
    .setFontWeight('bold')
    .setBackground('#f3f3f3');

  // Add legend
  const legendRow = summaryRow + 2;
  sheet.getRange(legendRow, 1, 1, 6).setValues([[
    'Legend:',
    'Talktorials: ✓=Modified ○=Untouched ✗=Missing',
    'Notebook: Weeks with entries/Total weeks',
    'Overall = 70% Talktorial + 30% Notebook',
    '',
    ''
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
 * Column layout: Student | Overall | Talktorials | T% | Notebook | N% | Last Active | Days | W1... | Status
 */
function applyDashboardFormatting(sheet, numRows, numCols, currentWeek) {
  // Column indices (1-based)
  const overallColIndex = 2;      // Overall %
  const talktorialPctColIndex = 4; // Talktorial %
  const notebookPctColIndex = 6;   // Notebook %
  const daysIdleColIndex = 8;      // Days

  // Helper function to apply color based on percentage
  function applyPercentColor(cell, percent) {
    if (percent >= 80) {
      cell.setBackground('#c6efce').setFontColor('#006100'); // Green
    } else if (percent >= 50) {
      cell.setBackground('#ffeb9c').setFontColor('#9c5700'); // Yellow
    } else {
      cell.setBackground('#ffc7ce').setFontColor('#9c0006'); // Red
    }
  }

  for (let row = 2; row <= numRows + 1; row++) {
    // Color the overall progress column
    const overallCell = sheet.getRange(row, overallColIndex);
    const overallValue = overallCell.getValue();
    const overallPercent = parseInt(overallValue);
    if (!isNaN(overallPercent)) {
      applyPercentColor(overallCell, overallPercent);
    }

    // Color the talktorial percentage column
    const talktorialCell = sheet.getRange(row, talktorialPctColIndex);
    const talktorialValue = talktorialCell.getValue();
    const talktorialPercent = parseInt(talktorialValue);
    if (!isNaN(talktorialPercent)) {
      applyPercentColor(talktorialCell, talktorialPercent);
    }

    // Color the notebook percentage column
    const notebookCell = sheet.getRange(row, notebookPctColIndex);
    const notebookValue = notebookCell.getValue();
    const notebookPercent = parseInt(notebookValue);
    if (!isNaN(notebookPercent)) {
      applyPercentColor(notebookCell, notebookPercent);
    }

    // Color the days idle column
    const daysCell = sheet.getRange(row, daysIdleColIndex);
    const daysValue = daysCell.getValue();
    const days = parseInt(daysValue);

    if (!isNaN(days)) {
      if (days <= 2) {
        daysCell.setBackground('#c6efce'); // Green
      } else if (days <= PROGRESS_CONFIG.inactivityThresholdDays) {
        daysCell.setBackground('#ffeb9c'); // Yellow
      } else {
        daysCell.setBackground('#ffc7ce'); // Red
      }
    }

    // Color the status column (last column)
    const statusCell = sheet.getRange(row, numCols);
    const statusValue = statusCell.getValue();

    if (statusValue.includes('✅')) {
      statusCell.setBackground('#c6efce');
    } else if (statusValue.includes('⚠️')) {
      statusCell.setBackground('#ffc7ce');
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

  // Calculate averages from dashboard data
  const dashboard = ss.getSheetByName(PROGRESS_CONFIG.dashboardSheetName);
  const avgOverall = result.avgOverall || 0;
  const avgTalktorial = result.avgTalktorial || 0;
  const avgNotebook = result.avgNotebook || 0;

  // Build email body
  let emailBody = `Weekly Progress Report - Week ${currentWeek}\n\n`;
  emailBody += `${'═'.repeat(50)}\n`;
  emailBody += `SUMMARY\n`;
  emailBody += `${'─'.repeat(50)}\n`;
  emailBody += `Students Tracked: ${result.studentsProcessed}\n`;
  emailBody += `Students On Track: ${result.studentsProcessed - result.alertCount}\n`;
  emailBody += `Students Needing Attention: ${result.alertCount}\n\n`;

  emailBody += `PROGRESS AVERAGES\n`;
  emailBody += `${'─'.repeat(50)}\n`;
  emailBody += `Overall Progress: ${avgOverall}%\n`;
  emailBody += `  • Talktorial Completion: ${avgTalktorial}%\n`;
  emailBody += `  • Lab Notebook Entries: ${avgNotebook}%\n\n`;

  if (result.alertCount > 0) {
    emailBody += `STUDENTS NEEDING ATTENTION\n`;
    emailBody += `${'─'.repeat(50)}\n`;
    result.alertStudents.forEach(student => {
      emailBody += `• ${student.name}: ${student.reason}\n`;
    });
    emailBody += `\n`;
  }

  emailBody += `${'═'.repeat(50)}\n`;
  emailBody += `View Full Dashboard: ${dashboardUrl}\n\n`;
  emailBody += `This report was generated automatically by VIP Progress Monitor.\n`;
  emailBody += `Progress = 70% Talktorials + 30% Lab Notebook`;

  // Send email
  MailApp.sendEmail({
    to: PROGRESS_CONFIG.instructorEmail,
    subject: `📊 VIP Progress Report - Week ${currentWeek}`,
    body: emailBody
  });

  Logger.log('Weekly progress report sent to ' + PROGRESS_CONFIG.instructorEmail);

  // Also send to Chat
  let chatMessage = `📊 *Weekly Progress Report - Week ${currentWeek}*\n\n`;
  chatMessage += `*Class Averages:*\n`;
  chatMessage += `• Overall: ${avgOverall}%\n`;
  chatMessage += `• Talktorials: ${avgTalktorial}%\n`;
  chatMessage += `• Lab Notebook: ${avgNotebook}%\n\n`;

  if (result.alertCount > 0) {
    chatMessage += `⚠️ *${result.alertCount} student(s) need attention:*\n`;
    result.alertStudents.slice(0, 5).forEach(student => {
      chatMessage += `• ${student.name}: ${student.reason}\n`;
    });
    if (result.alertStudents.length > 5) {
      chatMessage += `... and ${result.alertStudents.length - 5} more\n`;
    }
  } else {
    chatMessage += `✅ All students on track!`;
  }

  sendProgressChatMessage(chatMessage);
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

// ============================================================================
// STUDENT NUDGE EMAIL FUNCTIONS
// ============================================================================

/**
 * Get list of students who need nudging (preview before sending)
 * Returns object with categorized student lists
 */
function getStudentsToNudge() {
  const result = refreshProgressDashboard();
  if (!result) {
    return { behind: [], inactive: [], lowProgress: [] };
  }

  const currentWeek = getCurrentWeekForProgress();
  const expectedTalktorials = getTalktorialsUpToWeekForProgress(currentWeek);

  // Get full student data from roster
  const ss = SpreadsheetApp.openById(PROGRESS_CONFIG.rosterSpreadsheetId);
  const roster = ss.getSheetByName(PROGRESS_CONFIG.rosterSheetName);
  const dashboard = ss.getSheetByName(PROGRESS_CONFIG.dashboardSheetName);

  const rosterData = roster.getDataRange().getValues();
  const headers = rosterData[0];
  const emailCol = headers.indexOf('Email');
  const nameCol = headers.indexOf('Name');

  // Build email lookup from roster
  const studentEmails = {};
  for (let i = 1; i < rosterData.length; i++) {
    const name = rosterData[i][nameCol];
    const email = rosterData[i][emailCol];
    if (name && email) {
      studentEmails[name] = email;
    }
  }

  // Get dashboard data
  const dashboardData = dashboard.getDataRange().getValues();
  const dashHeaders = dashboardData[0];
  const dNameCol = dashHeaders.indexOf('Student');
  const dProgressCol = dashHeaders.indexOf('Overall %');
  const dTalktorialCol = dashHeaders.indexOf('Talktorial %');
  const dNotebookCol = dashHeaders.indexOf('Notebook %');
  const dDaysCol = dashHeaders.indexOf('Days Inactive');
  const dStatusCol = dashHeaders.indexOf('Status');

  const behind = [];
  const inactive = [];
  const lowProgress = [];

  for (let i = 1; i < dashboardData.length; i++) {
    const row = dashboardData[i];
    const name = row[dNameCol];
    const email = studentEmails[name];
    const overallPercent = parseInt(row[dProgressCol]) || 0;
    const talktorialPercent = parseInt(row[dTalktorialCol]) || 0;
    const notebookPercent = parseInt(row[dNotebookCol]) || 0;
    const daysInactive = parseInt(row[dDaysCol]) || 0;
    const status = row[dStatusCol] || '';

    if (!name || !email) continue;

    const firstName = name.split(' ')[0];

    // Find missing talktorials for current week
    const currentWeekTalktorials = PROGRESS_CONFIG.talktorialSchedule[currentWeek] || [];
    const missingCurrentWeek = [];

    // Check week columns for current week status
    const weekColIndex = dashHeaders.indexOf('W' + currentWeek);
    if (weekColIndex !== -1) {
      const weekStatus = row[weekColIndex];
      if (weekStatus === '○' || weekStatus === '○○') {
        currentWeekTalktorials.forEach(num => {
          missingCurrentWeek.push('AI-PSCI-' + String(num).padStart(3, '0'));
        });
      }
    }

    const studentData = {
      name: name,
      firstName: firstName,
      email: email,
      overallPercent: overallPercent,
      talktorialPercent: talktorialPercent,
      notebookPercent: notebookPercent,
      daysInactive: daysInactive,
      missingTalktorials: missingCurrentWeek,
      completedCount: Math.round(talktorialPercent * expectedTalktorials.length / 100),
      expectedCount: expectedTalktorials.length
    };

    // Categorize students
    if (missingCurrentWeek.length > 0) {
      behind.push(studentData);
    }

    if (daysInactive >= PROGRESS_CONFIG.inactivityThresholdDays) {
      inactive.push(studentData);
    }

    if (overallPercent < PROGRESS_CONFIG.minExpectedProgressPercent) {
      lowProgress.push(studentData);
    }
  }

  return {
    behind: behind,
    inactive: inactive,
    lowProgress: lowProgress,
    currentWeek: currentWeek
  };
}

/**
 * Preview which students would receive nudge emails
 */
function previewNudgeEmails() {
  const ui = SpreadsheetApp.getUi();
  const nudgeData = getStudentsToNudge();

  let message = '📋 NUDGE EMAIL PREVIEW\n\n';

  message += '📝 BEHIND ON CURRENT WEEK (' + nudgeData.behind.length + ' students):\n';
  if (nudgeData.behind.length === 0) {
    message += '   None - all caught up!\n';
  } else {
    nudgeData.behind.forEach(s => {
      message += '   • ' + s.name + ' (' + s.email + ')\n';
      message += '     Missing: ' + s.missingTalktorials.join(', ') + '\n';
    });
  }

  message += '\n⏰ INACTIVE (' + nudgeData.inactive.length + ' students):\n';
  if (nudgeData.inactive.length === 0) {
    message += '   None - everyone active!\n';
  } else {
    nudgeData.inactive.forEach(s => {
      message += '   • ' + s.name + ' - ' + s.daysInactive + ' days inactive\n';
    });
  }

  message += '\n⚠️ LOW PROGRESS (' + nudgeData.lowProgress.length + ' students):\n';
  if (nudgeData.lowProgress.length === 0) {
    message += '   None - everyone on track!\n';
  } else {
    nudgeData.lowProgress.forEach(s => {
      message += '   • ' + s.name + ' - ' + s.overallPercent + '% overall\n';
    });
  }

  ui.alert('Nudge Email Preview', message, ui.ButtonSet.OK);
}

/**
 * Send nudge emails to students behind on current week's work
 */
function nudgeBehindStudents() {
  const ui = SpreadsheetApp.getUi();
  const nudgeData = getStudentsToNudge();

  if (nudgeData.behind.length === 0) {
    ui.alert('No Nudges Needed', 'All students are caught up on Week ' + nudgeData.currentWeek + ' work!', ui.ButtonSet.OK);
    return;
  }

  // Confirm before sending
  const response = ui.alert(
    'Confirm Send',
    'Send reminder emails to ' + nudgeData.behind.length + ' student(s) who are behind on Week ' + nudgeData.currentWeek + '?\n\n' +
    nudgeData.behind.map(s => '• ' + s.name).join('\n'),
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const template = PROGRESS_CONFIG.nudgeEmails.templates.behindOnWork;
  let sentCount = 0;
  let errors = [];

  nudgeData.behind.forEach(student => {
    try {
      const subject = fillTemplate(template.subject, student, nudgeData.currentWeek);
      const body = fillTemplate(template.body, student, nudgeData.currentWeek);

      const emailOptions = {
        to: student.email,
        subject: subject,
        body: body,
        name: PROGRESS_CONFIG.nudgeEmails.senderName
      };

      if (PROGRESS_CONFIG.nudgeEmails.ccInstructor) {
        emailOptions.cc = PROGRESS_CONFIG.instructorEmail;
      }

      MailApp.sendEmail(emailOptions);
      sentCount++;
      Logger.log('Nudge sent to: ' + student.email);

    } catch (error) {
      errors.push(student.name + ': ' + error.message);
      Logger.log('Error sending to ' + student.email + ': ' + error.message);
    }
  });

  // Report results
  let resultMessage = '✅ Sent ' + sentCount + ' of ' + nudgeData.behind.length + ' emails.';
  if (errors.length > 0) {
    resultMessage += '\n\n❌ Errors:\n' + errors.join('\n');
  }

  ui.alert('Nudge Emails Sent', resultMessage, ui.ButtonSet.OK);

  // Log to chat
  sendProgressChatMessage('📬 Sent ' + sentCount + ' nudge emails to students behind on Week ' + nudgeData.currentWeek);
}

/**
 * Send nudge emails to inactive students
 */
function nudgeInactiveStudents() {
  const ui = SpreadsheetApp.getUi();
  const nudgeData = getStudentsToNudge();

  if (nudgeData.inactive.length === 0) {
    ui.alert('No Nudges Needed', 'No students have been inactive for ' + PROGRESS_CONFIG.inactivityThresholdDays + '+ days!', ui.ButtonSet.OK);
    return;
  }

  // Confirm before sending
  const response = ui.alert(
    'Confirm Send',
    'Send check-in emails to ' + nudgeData.inactive.length + ' inactive student(s)?\n\n' +
    nudgeData.inactive.map(s => '• ' + s.name + ' (' + s.daysInactive + ' days)').join('\n'),
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const template = PROGRESS_CONFIG.nudgeEmails.templates.inactive;
  const currentWeek = nudgeData.currentWeek;
  const upcomingTalktorials = PROGRESS_CONFIG.talktorialSchedule[currentWeek] || [];
  const upcomingWork = upcomingTalktorials.length > 0
    ? upcomingTalktorials.map(n => '• AI-PSCI-' + String(n).padStart(3, '0')).join('\n')
    : '• No new talktorials this week';

  let sentCount = 0;
  let errors = [];

  nudgeData.inactive.forEach(student => {
    try {
      student.upcomingWork = upcomingWork;
      const subject = fillTemplate(template.subject, student, currentWeek);
      const body = fillTemplate(template.body, student, currentWeek);

      const emailOptions = {
        to: student.email,
        subject: subject,
        body: body,
        name: PROGRESS_CONFIG.nudgeEmails.senderName
      };

      if (PROGRESS_CONFIG.nudgeEmails.ccInstructor) {
        emailOptions.cc = PROGRESS_CONFIG.instructorEmail;
      }

      MailApp.sendEmail(emailOptions);
      sentCount++;
      Logger.log('Inactivity nudge sent to: ' + student.email);

    } catch (error) {
      errors.push(student.name + ': ' + error.message);
      Logger.log('Error sending to ' + student.email + ': ' + error.message);
    }
  });

  // Report results
  let resultMessage = '✅ Sent ' + sentCount + ' of ' + nudgeData.inactive.length + ' emails.';
  if (errors.length > 0) {
    resultMessage += '\n\n❌ Errors:\n' + errors.join('\n');
  }

  ui.alert('Nudge Emails Sent', resultMessage, ui.ButtonSet.OK);

  // Log to chat
  sendProgressChatMessage('📬 Sent ' + sentCount + ' check-in emails to inactive students');
}

/**
 * Send nudge emails to students with low overall progress
 */
function nudgeLowProgressStudents() {
  const ui = SpreadsheetApp.getUi();
  const nudgeData = getStudentsToNudge();

  if (nudgeData.lowProgress.length === 0) {
    ui.alert('No Nudges Needed', 'All students are above ' + PROGRESS_CONFIG.minExpectedProgressPercent + '% progress!', ui.ButtonSet.OK);
    return;
  }

  // Confirm before sending
  const response = ui.alert(
    'Confirm Send',
    'Send check-in emails to ' + nudgeData.lowProgress.length + ' student(s) with low progress?\n\n' +
    nudgeData.lowProgress.map(s => '• ' + s.name + ' (' + s.overallPercent + '%)').join('\n'),
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const template = PROGRESS_CONFIG.nudgeEmails.templates.lowProgress;
  let sentCount = 0;
  let errors = [];

  nudgeData.lowProgress.forEach(student => {
    try {
      const subject = fillTemplate(template.subject, student, nudgeData.currentWeek);
      const body = fillTemplate(template.body, student, nudgeData.currentWeek);

      const emailOptions = {
        to: student.email,
        subject: subject,
        body: body,
        name: PROGRESS_CONFIG.nudgeEmails.senderName
      };

      if (PROGRESS_CONFIG.nudgeEmails.ccInstructor) {
        emailOptions.cc = PROGRESS_CONFIG.instructorEmail;
      }

      MailApp.sendEmail(emailOptions);
      sentCount++;
      Logger.log('Low progress nudge sent to: ' + student.email);

    } catch (error) {
      errors.push(student.name + ': ' + error.message);
      Logger.log('Error sending to ' + student.email + ': ' + error.message);
    }
  });

  // Report results
  let resultMessage = '✅ Sent ' + sentCount + ' of ' + nudgeData.lowProgress.length + ' emails.';
  if (errors.length > 0) {
    resultMessage += '\n\n❌ Errors:\n' + errors.join('\n');
  }

  ui.alert('Nudge Emails Sent', resultMessage, ui.ButtonSet.OK);

  // Log to chat
  sendProgressChatMessage('📬 Sent ' + sentCount + ' check-in emails to students with low progress');
}

/**
 * Fill email template with student data
 */
function fillTemplate(template, student, currentWeek) {
  return template
    .replace(/{firstName}/g, student.firstName || '')
    .replace(/{name}/g, student.name || '')
    .replace(/{email}/g, student.email || '')
    .replace(/{week}/g, currentWeek || '')
    .replace(/{overallPercent}/g, student.overallPercent || '0')
    .replace(/{talktorialPercent}/g, student.talktorialPercent || '0')
    .replace(/{notebookPercent}/g, student.notebookPercent || '0')
    .replace(/{daysInactive}/g, student.daysInactive || '0')
    .replace(/{completedCount}/g, student.completedCount || '0')
    .replace(/{expectedCount}/g, student.expectedCount || '0')
    .replace(/{missingTalktorials}/g, student.missingTalktorials ? student.missingTalktorials.map(t => '• ' + t).join('\n') : '')
    .replace(/{upcomingWork}/g, student.upcomingWork || '')
    .replace(/{instructorName}/g, PROGRESS_CONFIG.instructorName || 'Instructor');
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
// LAB NOTEBOOK TRACKING FUNCTIONS
// ============================================================================

/**
 * Get lab notebook progress for a student
 * @param {string} labNotebookId - Google Doc ID of the lab notebook
 * @param {number} currentWeek - Current week of semester
 * @returns {Object} Lab notebook progress data
 */
function getLabNotebookProgress(labNotebookId, currentWeek) {
  const progress = {
    exists: false,
    lastModified: null,
    daysSinceUpdate: 999,
    sectionsFound: [],
    sectionsMissing: [],
    sectionCompleteness: 0,
    weeklyEntries: {},
    weeksWithEntries: 0,
    expectedWeeks: currentWeek,
    weeklyCompleteness: 0,
    totalWordCount: 0,
    hasSubstantiveContent: false,
    alerts: []
  };

  if (!labNotebookId) {
    progress.alerts.push('No lab notebook ID found');
    return progress;
  }

  try {
    // Get the file to check last modified date
    const file = DriveApp.getFileById(labNotebookId);
    progress.exists = true;
    progress.lastModified = file.getLastUpdated();

    const now = new Date();
    progress.daysSinceUpdate = Math.floor((now - progress.lastModified) / (1000 * 60 * 60 * 24));

    // Open the document to analyze content
    const doc = DocumentApp.openById(labNotebookId);
    const body = doc.getBody();
    const fullText = body.getText();

    // Count total words
    progress.totalWordCount = fullText.split(/\s+/).filter(w => w.length > 0).length;
    progress.hasSubstantiveContent = progress.totalWordCount >= PROGRESS_CONFIG.labNotebookTracking.minWordsPerEntry * 3;

    // Check for required sections
    const expectedSections = PROGRESS_CONFIG.notebookStructure.sections;
    expectedSections.forEach(section => {
      const sectionNames = [section.name, ...section.aliases];
      let found = false;

      for (const name of sectionNames) {
        if (fullText.toLowerCase().includes(name.toLowerCase())) {
          found = true;
          break;
        }
      }

      if (found) {
        progress.sectionsFound.push(section.name);
      } else {
        progress.sectionsMissing.push(section.name);
      }
    });

    progress.sectionCompleteness = Math.round((progress.sectionsFound.length / expectedSections.length) * 100);

    // Detect weekly entries
    const weekPatterns = PROGRESS_CONFIG.notebookStructure.weekPatterns;
    const weeksFound = new Set();

    // Check for explicit week references (Week 1, Week 2, etc.)
    const weekMatches = fullText.matchAll(/week\s*(\d+)/gi);
    for (const match of weekMatches) {
      const weekNum = parseInt(match[1]);
      if (weekNum >= 1 && weekNum <= 16) {
        weeksFound.add(weekNum);
      }
    }

    // Also check for W1, W2, etc. format
    const shortWeekMatches = fullText.matchAll(/\bw(\d+)\b/gi);
    for (const match of shortWeekMatches) {
      const weekNum = parseInt(match[1]);
      if (weekNum >= 1 && weekNum <= 16) {
        weeksFound.add(weekNum);
      }
    }

    // Build weekly entry status
    for (let w = 1; w <= currentWeek; w++) {
      progress.weeklyEntries[w] = weeksFound.has(w) ? '✓' : '○';
      if (weeksFound.has(w)) {
        progress.weeksWithEntries++;
      }
    }

    progress.weeklyCompleteness = currentWeek > 0
      ? Math.round((progress.weeksWithEntries / currentWeek) * 100)
      : 0;

    // Generate alerts
    if (progress.daysSinceUpdate > PROGRESS_CONFIG.labNotebookTracking.notebookInactivityDays) {
      progress.alerts.push('Notebook not updated in ' + progress.daysSinceUpdate + ' days');
    }
    if (progress.sectionsMissing.length > 0) {
      progress.alerts.push('Missing sections: ' + progress.sectionsMissing.length);
    }
    if (progress.weeksWithEntries < currentWeek - 1) {
      progress.alerts.push('Missing ' + (currentWeek - progress.weeksWithEntries) + ' weekly entries');
    }

  } catch (error) {
    Logger.log('Error reading lab notebook ' + labNotebookId + ': ' + error.message);
    progress.alerts.push('Error reading notebook: ' + error.message);
  }

  return progress;
}

/**
 * Analyze lab notebook content with AI (optional feature)
 * @param {string} labNotebookId - Google Doc ID
 * @param {string} studentName - Student name for context
 * @returns {Object} AI analysis results
 */
function analyzeLabNotebookWithAI(labNotebookId, studentName) {
  const analysis = {
    success: false,
    qualityScore: 0,
    strengths: [],
    improvements: [],
    summary: ''
  };

  const apiKey = getClaudeApiKey();
  if (!apiKey) {
    analysis.summary = 'API key not configured';
    return analysis;
  }

  try {
    const doc = DocumentApp.openById(labNotebookId);
    const body = doc.getBody();
    const fullText = body.getText();

    // Truncate if too long (keep under ~10k chars for API)
    const truncatedText = fullText.length > 10000
      ? fullText.substring(0, 10000) + '\n...[truncated]'
      : fullText;

    const prompt = `Analyze this student lab notebook for a pharmaceutical sciences AI course.
The student is: ${studentName}

Expected sections:
1. AI-Assisted Learning Documentation (Weekly Inquiry Logs, AI Verification Log, Prompt Engineering Progress)
2. Technical Documentation (Daily Progress Notes, Code Documentation, Experimental Design)
3. Reflection Section (Weekly Reflections, Challenge Analysis, AI Learning Reflection)
4. Integration Section (Monthly Synthesis, Cross-Disciplinary Insights, Healthcare Impact)

Lab Notebook Content:
${truncatedText}

Provide a brief analysis in this exact JSON format:
{
  "qualityScore": <1-10>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "summary": "One sentence summary"
}`;

    const response = callClaudeAPI(prompt, 512);

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      analysis.success = true;
      analysis.qualityScore = parsed.qualityScore || 0;
      analysis.strengths = parsed.strengths || [];
      analysis.improvements = parsed.improvements || [];
      analysis.summary = parsed.summary || '';
    }

  } catch (error) {
    Logger.log('AI analysis error for ' + studentName + ': ' + error.message);
    analysis.summary = 'Analysis failed: ' + error.message;
  }

  return analysis;
}

/**
 * Get combined progress score (talktorials + lab notebook)
 */
function getCombinedProgressScore(talktorialPercent, notebookPercent) {
  const notebookWeight = PROGRESS_CONFIG.labNotebookTracking.notebookProgressWeight;
  const talktorialWeight = 1 - notebookWeight;

  return Math.round(
    (talktorialPercent * talktorialWeight) + (notebookPercent * notebookWeight)
  );
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
  const labNotebookIdCol = headers.indexOf('Lab Notebook ID');

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
  const labNotebookId = labNotebookIdCol !== -1 ? studentRow[labNotebookIdCol] : null;

  const progress = getStudentProgress(
    studentRow[nameCol],
    studentRow[folderIdCol],
    studentRow[talktorialFolderIdCol],
    currentWeek,
    labNotebookId
  );

  // Build detail message
  let detail = `Student: ${progress.name}\n\n`;

  // Overall progress section
  detail += `═══════════════════════════════════════\n`;
  detail += `OVERALL PROGRESS\n`;
  detail += `───────────────────────────────────────\n`;
  detail += `Combined Score: ${progress.progressPercent}%\n`;
  detail += `Last Activity: ${progress.lastActivity ? Utilities.formatDate(progress.lastActivity, 'America/New_York', 'MM/dd/yyyy') : 'Never'}\n`;
  detail += `Days Since Activity: ${progress.daysSinceActivity === 999 ? 'N/A' : progress.daysSinceActivity}\n\n`;

  // Talktorial progress section
  detail += `TALKTORIAL PROGRESS (70% weight)\n`;
  detail += `───────────────────────────────────────\n`;
  detail += `Completed: ${progress.completedCount}/${progress.totalExpected} (${progress.talktorialPercent}%)\n\n`;

  detail += `Week-by-Week:\n`;
  for (let w = 1; w <= currentWeek; w++) {
    const weekTalktorials = PROGRESS_CONFIG.talktorialSchedule[w] || [];
    if (weekTalktorials.length > 0) {
      detail += `  W${w}: ${progress.weekStatus[w] || '-'} (AI-PSCI-${weekTalktorials.map(n => String(n).padStart(3, '0')).join(', ')})\n`;
    }
  }

  // Lab notebook progress section
  detail += `\nLAB NOTEBOOK PROGRESS (30% weight)\n`;
  detail += `───────────────────────────────────────\n`;
  if (progress.notebook) {
    detail += `Weekly Entries: ${progress.notebook.weeksWithEntries}/${progress.notebook.expectedWeeks} weeks (${progress.notebookPercent}%)\n`;
    detail += `Total Words: ${progress.notebook.totalWordCount}\n`;
    detail += `Sections Found: ${progress.notebook.sectionsFound.length}/4\n`;
    if (progress.notebook.sectionsMissing.length > 0) {
      detail += `Missing: ${progress.notebook.sectionsMissing.join(', ')}\n`;
    }
    detail += `Last Updated: ${progress.notebook.lastModified ? Utilities.formatDate(progress.notebook.lastModified, 'America/New_York', 'MM/dd/yyyy') : 'Never'}\n`;

    if (progress.notebook.alerts.length > 0) {
      detail += `Alerts: ${progress.notebook.alerts.join('; ')}\n`;
    }
  } else {
    detail += `No lab notebook found\n`;
  }

  // Status section
  detail += `\n═══════════════════════════════════════\n`;
  detail += `Status: ${progress.needsAttention ? '⚠️ ' + progress.alertReason : '✅ On Track'}`;

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
    .addSubMenu(ui.createMenu('📬 Nudge Students')
      .addItem('👀 Preview Who Needs Nudging', 'previewNudgeEmails')
      .addSeparator()
      .addItem('📝 Nudge Behind on Current Week', 'nudgeBehindStudents')
      .addItem('⏰ Nudge Inactive Students', 'nudgeInactiveStudents')
      .addItem('⚠️ Nudge Low Progress Students', 'nudgeLowProgressStudents'))
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
