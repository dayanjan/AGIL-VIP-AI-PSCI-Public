/**
 * ============================================================================
 * VIP SEMESTER SETUP SCRIPT
 * AI in Pharmaceutical Sciences: Bench to Bedside
 *
 * TEMPLATE VERSION - Configure for your institution
 * ============================================================================
 *
 * This script automates the beginning-of-semester setup:
 * - Creates student folders from a roster spreadsheet
 * - Copies and personalizes lab notebooks
 * - Copies Week 1 talktorials
 * - Sets up the Solutions folder
 * - Shares everything with appropriate permissions
 * - Sends welcome messages via email and Google Chat
 *
 * Also handles mid-semester additions:
 * - Detects new students added to roster
 * - Creates their folders with all talktorials up to current week
 * - Sends welcome message
 *
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION - UPDATE THESE VALUES FOR YOUR INSTITUTION
// ============================================================================

const SETUP_CONFIG = {

  // ---------------------------------------------------------------------------
  // INSTRUCTOR INFO
  // ---------------------------------------------------------------------------

  instructorEmail: 'YOUR_EMAIL@university.edu',    // UPDATE: Your email address
  instructorName: 'Dr. Your Name',                  // UPDATE: Your name as shown to students

  // ---------------------------------------------------------------------------
  // FOLDER IDS - Update these after creating your master folders
  // How to get a folder ID: Open folder in Google Drive, copy ID from URL
  // URL format: https://drive.google.com/drive/folders/FOLDER_ID_HERE
  // ---------------------------------------------------------------------------

  // The parent folder where all student folders will be created
  parentFolderId: 'PASTE_PARENT_FOLDER_ID_HERE',

  // Master templates folder containing your template files
  masterTemplatesFolderId: 'PASTE_MASTER_TEMPLATES_FOLDER_ID_HERE',

  // Inside master templates, the subfolder with empty talktorials
  talktorialTemplatesFolderId: 'PASTE_TALKTORIAL_TEMPLATES_FOLDER_ID_HERE',

  // Inside master templates, the subfolder with solution notebooks
  solutionTemplatesFolderId: 'PASTE_SOLUTION_TEMPLATES_FOLDER_ID_HERE',

  // Lab notebook template (Google Doc ID) - with instructions for students
  labNotebookTemplateId: 'PASTE_LAB_NOTEBOOK_TEMPLATE_ID_HERE',

  // Example lab notebook (Google Doc ID) - shows what good entries look like
  exampleLabNotebookId: 'PASTE_EXAMPLE_LAB_NOTEBOOK_ID_HERE',

  // Empty lab notebook template (Google Doc ID) - tabs only, no content
  emptyLabNotebookId: 'PASTE_EMPTY_LAB_NOTEBOOK_ID_HERE',

  // ---------------------------------------------------------------------------
  // ROSTER SPREADSHEET
  // ---------------------------------------------------------------------------

  // The spreadsheet containing student roster
  // Expected columns: Name, Email, Date Added, Folder Created, Folder ID, Lab Notebook ID
  rosterSpreadsheetId: 'PASTE_ROSTER_SPREADSHEET_ID_HERE',
  rosterSheetName: 'Roster',

  // ---------------------------------------------------------------------------
  // GOOGLE CHAT WEBHOOK (Optional)
  // ---------------------------------------------------------------------------

  // Webhook URL for Google Chat notifications
  // Get this from: Chat Space -> Apps & integrations -> Webhooks -> Create
  // Leave as placeholder if not using Chat notifications
  chatWebhookUrl: 'PASTE_WEBHOOK_URL_HERE',

  // ---------------------------------------------------------------------------
  // SEMESTER DATES - Update for your academic calendar
  // ---------------------------------------------------------------------------

  semesterStart: new Date('2026-01-12'),           // UPDATE: First day of classes
  semesterEnd: new Date('2026-05-12'),             // UPDATE: Last day of classes
  springBreakStart: new Date('2026-03-08'),        // UPDATE: Break start
  springBreakEnd: new Date('2026-03-15'),          // UPDATE: Break end

  // Prefix for student folder names (e.g., "2026-Spring-AGIL-AI-PSCI-Student Name")
  // Makes folders easier to find and sort
  folderPrefix: '2026-Spring-AGIL-AI-PSCI-',       // UPDATE: Your prefix

  // ---------------------------------------------------------------------------
  // TALKTORIAL SCHEDULE
  // Week number -> array of talktorial numbers to release that week
  // Customize based on your curriculum
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
// MAIN FUNCTIONS
// ============================================================================

/**
 * Initial semester setup - Run this ONCE at the beginning of the semester
 * Creates the Solutions folder and sets up all students in the roster
 */
function initialSemesterSetup() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Initial Semester Setup',
    'This will:\n' +
    '1. Create a Solutions folder\n' +
    '2. Create folders for all students in the roster\n' +
    '3. Copy lab notebooks and Week 1 talktorials\n' +
    '4. Send welcome emails and Chat messages\n\n' +
    'Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  Logger.log('Starting initial semester setup...');

  // Create Solutions folder
  const parentFolder = DriveApp.getFolderById(SETUP_CONFIG.parentFolderId);
  let solutionsFolder;

  const existingFolders = parentFolder.getFoldersByName('Solutions');
  if (existingFolders.hasNext()) {
    solutionsFolder = existingFolders.next();
    Logger.log('Solutions folder already exists');
  } else {
    solutionsFolder = parentFolder.createFolder('Solutions');
    Logger.log('Created Solutions folder');
  }

  // Process all students in roster
  processRoster(true);

  // Send initial Chat message
  sendChatMessage(
    '🎓 *Course Materials Ready!*\n\n' +
    'Welcome to the course!\n\n' +
    'Your folders have been set up with:\n' +
    '• Your personal Lab Notebook\n' +
    '• Example Lab Notebook (for reference)\n' +
    '• Week 1 Talktorials\n\n' +
    'Check your email for your folder link. 🚀'
  );

  ui.alert('Setup Complete', 'Initial semester setup finished. Check the logs for details.', ui.ButtonSet.OK);
}

/**
 * Process new students - Run this to check for and set up new students
 * Can be run manually or on a schedule
 */
function processNewStudents() {
  Logger.log('Checking for new students...');
  processRoster(false);
}

/**
 * Process the roster spreadsheet and set up students
 */
function processRoster(isInitialSetup) {
  const ss = SpreadsheetApp.openById(SETUP_CONFIG.rosterSpreadsheetId);
  const sheet = ss.getSheetByName(SETUP_CONFIG.rosterSheetName);

  if (!sheet) {
    Logger.log('ERROR: Roster sheet not found!');
    return;
  }

  const data = sheet.getDataRange().getValues();
  // Trim whitespace from headers to avoid matching issues
  const headers = data[0].map(h => String(h).trim());

  // Debug: Log all headers found
  Logger.log('Headers found: ' + JSON.stringify(headers));

  // Find column indices
  const nameCol = headers.indexOf('Name');
  const emailCol = headers.indexOf('Email');
  const dateAddedCol = headers.indexOf('Date Added');
  const folderCreatedCol = headers.indexOf('Folder Created');
  const folderIdCol = headers.indexOf('Folder ID');
  const labNotebookIdCol = headers.indexOf('Lab Notebook ID');
  const talktorialFolderIdCol = headers.indexOf('Talktorial Folder ID');

  // Debug: Log column indices
  Logger.log('Column indices: Name=' + nameCol + ', Email=' + emailCol +
             ', DateAdded=' + dateAddedCol + ', FolderCreated=' + folderCreatedCol +
             ', FolderID=' + folderIdCol + ', LabNotebookID=' + labNotebookIdCol +
             ', TalktorialFolderID=' + talktorialFolderIdCol);

  if (nameCol === -1 || emailCol === -1) {
    Logger.log('ERROR: Required columns (Name, Email) not found in roster!');
    return;
  }

  // Check for missing columns
  const missingCols = [];
  if (folderCreatedCol === -1) missingCols.push('Folder Created');
  if (folderIdCol === -1) missingCols.push('Folder ID');
  if (labNotebookIdCol === -1) missingCols.push('Lab Notebook ID');
  if (talktorialFolderIdCol === -1) missingCols.push('Talktorial Folder ID');

  if (missingCols.length > 0) {
    Logger.log('ERROR: Missing required columns: ' + missingCols.join(', '));
    Logger.log('Please add these column headers to Row 1 of your roster sheet.');
    SpreadsheetApp.getUi().alert(
      'Missing Columns',
      'Please add these columns to Row 1:\n\n' + missingCols.join('\n'),
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return;
  }

  const currentWeek = getCurrentWeek();
  let newStudentCount = 0;

  // Process each student row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[nameCol];
    const email = row[emailCol];
    const folderCreated = row[folderCreatedCol];

    // Skip empty rows or already-created students
    if (!name || !email) continue;
    if (folderCreated === true || folderCreated === 'Yes' || folderCreated === '✓') continue;

    Logger.log('Setting up student: ' + name);

    try {
      // Create student folder and materials
      const result = setupStudentFolder(name, email, currentWeek, isInitialSetup);

      // Update roster with folder info
      const rowNum = i + 1;
      sheet.getRange(rowNum, folderCreatedCol + 1).setValue('✓');
      sheet.getRange(rowNum, folderIdCol + 1).setValue(result.folderId);
      sheet.getRange(rowNum, labNotebookIdCol + 1).setValue(result.labNotebookId);
      sheet.getRange(rowNum, talktorialFolderIdCol + 1).setValue(result.talktorialFolderId);

      if (dateAddedCol !== -1 && !row[dateAddedCol]) {
        sheet.getRange(rowNum, dateAddedCol + 1).setValue(new Date());
      }

      newStudentCount++;

      // Send welcome email
      sendWelcomeEmail(name, email, result.folderUrl, currentWeek, isInitialSetup);

      // Small delay to avoid rate limits
      Utilities.sleep(1000);

    } catch (error) {
      Logger.log('ERROR setting up ' + name + ': ' + error.message);
    }
  }

  if (newStudentCount > 0) {
    Logger.log('Set up ' + newStudentCount + ' new student(s)');

    if (!isInitialSetup) {
      // Send Chat notification for mid-semester additions
      sendChatMessage(
        '👋 *New Student(s) Joined!*\n\n' +
        newStudentCount + ' new student(s) have been added to the course.\n' +
        'Their materials are ready in their folders.'
      );
    }
  } else {
    Logger.log('No new students to set up');
  }
}

/**
 * Create a student's folder with all materials
 */
function setupStudentFolder(studentName, studentEmail, currentWeek, isInitialSetup) {
  const parentFolder = DriveApp.getFolderById(SETUP_CONFIG.parentFolderId);

  // Create student folder with prefix for easy identification
  const folderName = SETUP_CONFIG.folderPrefix + studentName;
  const studentFolder = parentFolder.createFolder(folderName);
  const studentFolderId = studentFolder.getId();

  // Share folder with student (Editor access)
  try {
    studentFolder.addEditor(studentEmail);
  } catch (shareError) {
    Logger.log('Warning: Could not share folder with ' + studentEmail + ' (email may not exist)');
  }

  // Copy and personalize lab notebook
  const labNotebookTemplate = DriveApp.getFileById(SETUP_CONFIG.labNotebookTemplateId);
  const labNotebook = labNotebookTemplate.makeCopy(
    'Lab Notebook - ' + studentName,
    studentFolder
  );
  try {
    labNotebook.addEditor(studentEmail);
  } catch (shareError) {
    Logger.log('Warning: Could not share lab notebook with ' + studentEmail);
  }

  // Apply heading styles to enable document outline navigation
  try {
    applyHeadingStyles(labNotebook.getId());
    Logger.log('Applied heading styles to lab notebook for ' + studentName);
  } catch (error) {
    Logger.log('Warning: Could not apply heading styles: ' + error.message);
  }

  // Copy example lab notebook (View Only)
  const exampleNotebook = DriveApp.getFileById(SETUP_CONFIG.exampleLabNotebookId);
  const exampleCopy = exampleNotebook.makeCopy(
    '[Example] Lab Notebook',
    studentFolder
  );
  try {
    exampleCopy.addViewer(studentEmail);
    try {
      exampleCopy.removeEditor(studentEmail);
    } catch (e) {
      // Student wasn't an editor, that's fine
    }
  } catch (shareError) {
    Logger.log('Warning: Could not share example notebook with ' + studentEmail);
  }

  // Create Talktorials subfolder
  const talktorialFolder = studentFolder.createFolder('Talktorials');
  try {
    talktorialFolder.addEditor(studentEmail);
  } catch (shareError) {
    Logger.log('Warning: Could not share talktorials folder with ' + studentEmail);
  }

  // Copy talktorials up to current week
  const talktorialTemplatesFolder = DriveApp.getFolderById(SETUP_CONFIG.talktorialTemplatesFolderId);
  const talktorialsToRelease = getTalktorialsUpToWeek(currentWeek);

  talktorialsToRelease.forEach(num => {
    const paddedNum = String(num).padStart(3, '0');
    const searchName = 'AI-PSCI-' + paddedNum;

    const files = talktorialTemplatesFolder.getFilesByName(searchName + '.ipynb');
    if (files.hasNext()) {
      const template = files.next();
      const copy = template.makeCopy(
        'AI-PSCI-' + paddedNum + ' - ' + studentName + '.ipynb',
        talktorialFolder
      );
      try {
        copy.addEditor(studentEmail);
      } catch (shareError) {
        // Sharing will fail with fake test emails - that's OK
      }
    } else {
      // Try searching with partial match
      const allFiles = talktorialTemplatesFolder.getFiles();
      while (allFiles.hasNext()) {
        const file = allFiles.next();
        if (file.getName().toUpperCase().includes(searchName)) {
          const copy = file.makeCopy(
            'AI-PSCI-' + paddedNum + ' - ' + studentName + '.ipynb',
            talktorialFolder
          );
          try {
            copy.addEditor(studentEmail);
          } catch (shareError) {
            // Sharing will fail with fake test emails - that's OK
          }
          break;
        }
      }
    }
  });

  // Share Solutions folder with student (Commenter access)
  const solutionsFolders = parentFolder.getFoldersByName('Solutions');
  if (solutionsFolders.hasNext()) {
    const solutionsFolder = solutionsFolders.next();
    try {
      solutionsFolder.addCommenter(studentEmail);
    } catch (shareError) {
      Logger.log('Warning: Could not share solutions folder with ' + studentEmail);
    }
  }

  return {
    folderId: studentFolderId,
    folderUrl: studentFolder.getUrl(),
    labNotebookId: labNotebook.getId(),
    talktorialFolderId: talktorialFolder.getId()
  };
}

/**
 * Get array of talktorial numbers to release up to a given week
 */
function getTalktorialsUpToWeek(week) {
  const talktorials = [];
  for (let w = 1; w <= week; w++) {
    const weekTalktorials = SETUP_CONFIG.talktorialSchedule[w] || [];
    talktorials.push(...weekTalktorials);
  }
  return talktorials;
}

/**
 * Calculate current week of semester
 */
function getCurrentWeek() {
  const now = new Date();
  const start = SETUP_CONFIG.semesterStart;

  if (now < start) return 1; // Before semester, treat as week 1
  if (now > SETUP_CONFIG.semesterEnd) return 16;

  let weeks = Math.ceil((now - start) / (7 * 24 * 60 * 60 * 1000));

  if (now >= SETUP_CONFIG.springBreakStart && now <= SETUP_CONFIG.springBreakEnd) {
    return 8;
  }
  if (now > SETUP_CONFIG.springBreakEnd) {
    weeks -= 1;
  }

  return Math.min(weeks, 16);
}

// ============================================================================
// DOCUMENT FORMATTING FUNCTIONS
// ============================================================================

/**
 * Apply Google Docs heading styles to Markdown-formatted headings
 * This enables the document outline panel for easy navigation
 */
function applyHeadingStyles(docId) {
  const doc = DocumentApp.openById(docId);
  const tabs = doc.getTabs();

  // Process each tab in the document
  tabs.forEach(tab => {
    const docTab = tab.asDocumentTab();
    const body = docTab.getBody();
    formatBodyHeadings(body);

    // Also process any child tabs (nested tabs)
    const childTabs = tab.getChildTabs();
    childTabs.forEach(childTab => {
      const childDocTab = childTab.asDocumentTab();
      const childBody = childDocTab.getBody();
      formatBodyHeadings(childBody);
    });
  });

  doc.saveAndClose();
  Logger.log('Applied heading styles to document: ' + docId);
}

/**
 * Format headings within a document body
 */
function formatBodyHeadings(body) {
  const paragraphs = body.getParagraphs();

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const text = p.getText();

    if (!text || text.trim() === '') continue;

    // Check for Markdown heading patterns
    if (text.startsWith('#### ')) {
      p.setHeading(DocumentApp.ParagraphHeading.HEADING4);
      p.setText(text.substring(5));
    }
    else if (text.startsWith('### ')) {
      p.setHeading(DocumentApp.ParagraphHeading.HEADING3);
      p.setText(text.substring(4));
    }
    else if (text.startsWith('## ')) {
      p.setHeading(DocumentApp.ParagraphHeading.HEADING2);
      p.setText(text.substring(3));
    }
    else if (text.startsWith('# ')) {
      p.setHeading(DocumentApp.ParagraphHeading.HEADING1);
      p.setText(text.substring(2));
    }
  }
}

/**
 * Manually apply heading styles to a specific document
 */
function reformatLabNotebook() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Reformat Lab Notebook',
    'Enter the Google Doc ID to reformat:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.OK) {
    const docId = response.getResponseText().trim();
    if (docId) {
      try {
        applyHeadingStyles(docId);
        ui.alert('Success', 'Heading styles applied successfully!', ui.ButtonSet.OK);
      } catch (error) {
        ui.alert('Error', 'Failed to format document: ' + error.message, ui.ButtonSet.OK);
      }
    }
  }
}

// ============================================================================
// COMMUNICATION FUNCTIONS
// ============================================================================

/**
 * Send welcome email to new student
 */
function sendWelcomeEmail(name, email, folderUrl, currentWeek, isInitialSetup) {
  const firstName = name.split(' ')[0];

  let subject, body;

  if (isInitialSetup) {
    subject = '🎓 Welcome - Your Course Materials Are Ready!';
    body = `Hi ${firstName},

Welcome to the course!

Your course materials are ready and waiting for you:
📁 Your Folder: ${folderUrl}

Inside you'll find:
• Lab Notebook - ${name} (this is YOUR working document)
• [Example] Lab Notebook (reference for how to structure your entries)
• Talktorials folder with Week 1 materials

FIRST STEPS:
1. Open your Lab Notebook and familiarize yourself with the structure
2. Start working through the Week 1 talktorials
3. Document your process in your Lab Notebook
4. Come to class ready to discuss!

The Solutions folder will be shared after our class meeting, so you can compare your approach to the reference solutions.

Questions? Reply to this email.

${SETUP_CONFIG.instructorName}`;
  } else {
    // Mid-semester join
    const talktorialCount = getTalktorialsUpToWeek(currentWeek).length;
    subject = '🎓 Welcome - Joining Week ' + currentWeek;
    body = `Hi ${firstName},

Welcome to the course!

You're joining us in Week ${currentWeek}, and your materials are ready:
📁 Your Folder: ${folderUrl}

Inside you'll find:
• Lab Notebook - ${name} (this is YOUR working document)
• [Example] Lab Notebook (reference for how to structure your entries)
• Talktorials folder with ALL materials through Week ${currentWeek}

Since you're joining mid-semester, you have some catch-up talktorials. We'll discuss a reasonable plan to get you up to speed. Focus first on the most recent week's materials.

The Solutions folder contains reference solutions for past weeks, so you can check your work as you catch up.

Questions? Reply to this email.

${SETUP_CONFIG.instructorName}`;
  }

  MailApp.sendEmail(email, subject, body);
  Logger.log('Welcome email sent to ' + email);
}

/**
 * Send message to Google Chat via webhook
 */
function sendChatMessage(message) {
  if (!SETUP_CONFIG.chatWebhookUrl || SETUP_CONFIG.chatWebhookUrl === 'PASTE_WEBHOOK_URL_HERE') {
    Logger.log('Chat webhook not configured, skipping Chat notification');
    return;
  }

  const payload = {
    text: message
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(SETUP_CONFIG.chatWebhookUrl, options);
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
// ROSTER TEMPLATE CREATION
// ============================================================================

/**
 * Create the roster spreadsheet template
 * Run this once to set up your roster sheet structure
 */
function createRosterTemplate() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName('Roster');
  if (!sheet) {
    sheet = ss.insertSheet('Roster');
  } else {
    sheet.clear();
  }

  // Set up headers
  const headers = [
    'Name',
    'Email',
    'Date Added',
    'Folder Created',
    'Folder ID',
    'Lab Notebook ID',
    'Talktorial Folder ID'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('white');

  // Add sample data
  const sampleData = [
    ['Alice Smith', 'asmith@university.edu', '', '', '', '', ''],
    ['Bob Jones', 'bjones@university.edu', '', '', '', '', ''],
    ['Carol Wu', 'cwu@university.edu', '', '', '', '', '']
  ];

  sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);

  // Format
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  // Add data validation for Folder Created column
  const folderCreatedRange = sheet.getRange('D2:D100');
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['', '✓'], true)
    .build();
  folderCreatedRange.setDataValidation(rule);

  SpreadsheetApp.getUi().alert(
    'Roster Template Created',
    'Add your students to the Roster sheet, then run "Initial Semester Setup".\n\n' +
    'Required columns:\n' +
    '• Name: Student full name\n' +
    '• Email: Student email\n\n' +
    'Other columns are filled automatically.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ============================================================================
// MENU
// ============================================================================

function createSetupMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎓 VIP Setup')
    .addItem('📋 Create Roster Template', 'createRosterTemplate')
    .addSeparator()
    .addItem('🚀 Initial Semester Setup', 'initialSemesterSetup')
    .addItem('👤 Process New Students (Manual)', 'processNewStudents')
    .addSeparator()
    .addSubMenu(ui.createMenu('⏰ Automatic Triggers')
      .addItem('Set Daily New Student Check (8 AM)', 'setNewStudentTrigger')
      .addItem('Remove New Student Trigger', 'removeNewStudentTrigger')
      .addSeparator()
      .addItem('Show Trigger Status', 'showTriggerStatus'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📓 Lab Notebook')
      .addItem('Reformat (apply headings)', 'reformatLabNotebook'))
    .addSeparator()
    .addItem('💬 Test Chat Webhook', 'testChatWebhook')
    .addItem('📧 Test Email', 'testEmail')
    .addToUi();
}

/**
 * Test the Chat webhook
 */
function testChatWebhook() {
  sendChatMessage('🧪 *Test Message*\n\nIf you see this, the webhook is working!');
  SpreadsheetApp.getUi().alert('Test message sent! Check your Chat space.');
}

/**
 * Test email sending
 */
function testEmail() {
  MailApp.sendEmail(
    SETUP_CONFIG.instructorEmail,
    '🧪 VIP Setup - Test Email',
    'If you receive this, email sending is working correctly!'
  );
  SpreadsheetApp.getUi().alert('Test email sent to ' + SETUP_CONFIG.instructorEmail);
}

// ============================================================================
// TRIGGER MANAGEMENT
// ============================================================================

/**
 * Set up daily trigger to check for new students
 */
function setNewStudentTrigger() {
  // Remove existing triggers for this function
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processNewStudents') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new daily trigger at 8 AM
  ScriptApp.newTrigger('processNewStudents')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  SpreadsheetApp.getUi().alert(
    'Daily Trigger Set',
    'New student check will run automatically every day at 8 AM.\n\n' +
    'When you add a new student to the roster:\n' +
    '1. Add their Name and Email to the Roster sheet\n' +
    '2. Leave "Folder Created" blank\n' +
    '3. The system will automatically set them up by 8 AM the next day\n\n' +
    'Or run "Process New Students" manually for immediate setup.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Remove the daily new student trigger
 */
function removeNewStudentTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;

  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processNewStudents') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });

  if (removed > 0) {
    SpreadsheetApp.getUi().alert('Trigger Removed', 'Daily new student check has been disabled.', SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    SpreadsheetApp.getUi().alert('No Trigger Found', 'No daily trigger was set for new student processing.', SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Show current trigger status
 */
function showTriggerStatus() {
  const triggers = ScriptApp.getProjectTriggers();
  let status = 'Current Triggers:\n\n';
  let hasNewStudentTrigger = false;

  if (triggers.length === 0) {
    status = 'No triggers are currently set.\n\nUse "Set Daily New Student Check" to enable automatic processing.';
  } else {
    triggers.forEach(trigger => {
      const funcName = trigger.getHandlerFunction();
      const triggerType = trigger.getEventType();

      if (funcName === 'processNewStudents') {
        hasNewStudentTrigger = true;
        status += '✅ New Student Check: Daily at 8 AM\n';
      } else {
        status += '• ' + funcName + ' (' + triggerType + ')\n';
      }
    });

    if (!hasNewStudentTrigger) {
      status += '\n⚠️ Daily new student check is NOT enabled.\n';
      status += 'Use "Set Daily New Student Check" to enable.';
    }
  }

  SpreadsheetApp.getUi().alert('Trigger Status', status, SpreadsheetApp.getUi().ButtonSet.OK);
}
