/**
 * ============================================================================
 * VIP WEEKLY RELEASE SCRIPT
 * AI in Pharmaceutical Sciences: Bench to Bedside
 *
 * TEMPLATE VERSION - Configure for your institution
 * ============================================================================
 *
 * This script handles the THREE-EXPOSURE progressive release of course materials:
 *
 * FRIDAY 6 PM (Exposure 1: Inquiry Phase):
 * - Releases guided inquiry questions for the upcoming week
 * - Posts questions to Google Chat for students to explore with AI
 *
 * SUNDAY 6 PM (Exposure 2: Implementation Phase):
 * - Releases empty talktorial notebooks for the upcoming week
 * - Copies to each student's Talktorials folder
 * - Posts notification to Google Chat
 *
 * THURSDAY 6 PM (Exposure 3: Synthesis Phase):
 * - Releases solution notebooks for the current week
 * - Shares to the Solutions folder (students already have Commenter access)
 * - Posts notification to Google Chat
 *
 * Also handles:
 * - New student catch-up (checks roster for new students)
 * - Manual release functions for testing
 *
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION - UPDATE THESE VALUES FOR YOUR INSTITUTION
// ============================================================================

const RELEASE_CONFIG = {

  // ---------------------------------------------------------------------------
  // INSTRUCTOR INFO
  // ---------------------------------------------------------------------------

  instructorEmail: 'YOUR_EMAIL@university.edu',     // UPDATE: Your email
  instructorName: 'Dr. Your Name',                   // UPDATE: Your name

  // ---------------------------------------------------------------------------
  // FOLDER IDS
  // ---------------------------------------------------------------------------

  // Parent folder containing all student folders
  parentFolderId: 'PASTE_PARENT_FOLDER_ID_HERE',

  // Folder containing empty talktorial templates
  talktorialTemplatesFolderId: 'PASTE_TALKTORIAL_TEMPLATES_FOLDER_ID_HERE',

  // Folder containing your solution notebooks
  solutionTemplatesFolderId: 'PASTE_SOLUTION_TEMPLATES_FOLDER_ID_HERE',

  // ---------------------------------------------------------------------------
  // ROSTER SPREADSHEET
  // ---------------------------------------------------------------------------

  rosterSpreadsheetId: 'PASTE_ROSTER_SPREADSHEET_ID_HERE',
  rosterSheetName: 'Roster',

  // ---------------------------------------------------------------------------
  // GOOGLE CHAT WEBHOOK (Optional)
  // ---------------------------------------------------------------------------

  chatWebhookUrl: 'PASTE_WEBHOOK_URL_HERE',

  // ---------------------------------------------------------------------------
  // SEMESTER DATES - Update for your academic calendar
  // ---------------------------------------------------------------------------

  semesterStart: new Date('2026-01-12'),           // UPDATE: First day of classes
  semesterEnd: new Date('2026-05-12'),             // UPDATE: Last day of classes
  springBreakStart: new Date('2026-03-08'),        // UPDATE: Break start
  springBreakEnd: new Date('2026-03-15'),          // UPDATE: Break end

  // ---------------------------------------------------------------------------
  // TALKTORIAL SCHEDULE
  // Week number -> array of talktorial numbers to release that week
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
  },

  // ---------------------------------------------------------------------------
  // GUIDED INQUIRY QUESTIONS
  // Week number -> object with talktorial topics and questions
  // These are posted to Chat on Friday to prepare students for Sunday's talktorials
  //
  // CUSTOMIZE: Add your own questions for each week's topics
  // ---------------------------------------------------------------------------

  guidedInquiryQuestions: {
    1: {
      title: 'Week 1: Introduction to AI in Pharmaceuticals',
      talktorials: [
        {
          number: '001',
          topic: 'Introduction to Google Colab & AI-Assisted Coding',
          questions: [
            'What is Google Colab and why has it become essential for computational drug discovery research?',
            'How do pharmaceutical scientists use Python differently than software developers?',
            'What are the most common data formats used in pharmaceutical research (SMILES, SDF, PDB, FASTA)?',
            'What are the advantages and limitations of cloud-based computational environments for pharmaceutical research?',
            'Where might AI struggle to help you learn Python for pharmaceutical applications?'
          ]
        },
        {
          number: '002',
          topic: 'Effective AI Collaboration & Prompt Engineering',
          questions: [
            'What are the major categories of AI tools used in pharmaceutical research today?',
            'How do large language models (LLMs) like ChatGPT and Claude differ from specialized scientific AI models?',
            'What is prompt engineering, and why is it critical for using AI effectively in scientific research?',
            'What are the ethical considerations when using AI tools in pharmaceutical research?',
            'How should you verify AI-generated code or scientific claims?'
          ]
        }
      ]
    },
    2: {
      title: 'Week 2: Molecular Representations',
      talktorials: [
        {
          number: '003',
          topic: 'Molecular Representations',
          questions: [
            'What is SMILES notation and why was it developed?',
            'How do different molecular formats (SMILES, InChI, PDB) serve different purposes?',
            'Why is 3D structure important for understanding drug-target interactions?',
            'How do pharmaceutical scientists convert between molecular representations?',
            'What are the limitations of molecular representations for complex drugs (peptides, antibodies)?'
          ]
        },
        {
          number: '004',
          topic: 'RDKit Fundamentals',
          questions: [
            'What is RDKit and why is it the standard cheminformatics toolkit?',
            'What molecular properties are most important for drug development?',
            'How do pharmaceutical scientists use substructure searching in drug discovery?',
            'What visualizations help communicate molecular structure effectively?',
            'What are common pitfalls when working with molecular data computationally?'
          ]
        }
      ]
    },
    // ADD MORE WEEKS AS NEEDED
    // Each week follows the same structure:
    // {
    //   title: 'Week N: Topic Name',
    //   talktorials: [
    //     {
    //       number: '00X',
    //       topic: 'Talktorial Topic',
    //       questions: ['Question 1?', 'Question 2?', ...]
    //     }
    //   ]
    // }
    15: { title: 'Week 15: Capstone Presentations', talktorials: [] },
    16: { title: 'Week 16: Finals', talktorials: [] }
  }
};

// ============================================================================
// MAIN RELEASE FUNCTIONS
// ============================================================================

/**
 * FRIDAY RELEASE: Guided inquiry questions for upcoming week
 * Scheduled to run Friday at 6 PM
 */
function fridayRelease() {
  const currentWeek = getCurrentWeek();

  // During spring break, skip release
  const now = new Date();
  if (now >= RELEASE_CONFIG.springBreakStart && now <= RELEASE_CONFIG.springBreakEnd) {
    Logger.log('Spring break - no release');
    return;
  }

  const weekData = RELEASE_CONFIG.guidedInquiryQuestions[currentWeek];

  if (!weekData || weekData.talktorials.length === 0) {
    Logger.log('No guided inquiry questions scheduled for week ' + currentWeek);
    return;
  }

  Logger.log('Friday Release: Week ' + currentWeek + ' Guided Inquiry Questions');

  // Build the message with all questions for the week
  let message = `📖 *${weekData.title} - Guided Inquiry Questions*\n\n`;
  message += `These questions prepare you for this week's talktorials. Explore them with your AI assistant before Sunday!\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  weekData.talktorials.forEach(talktorial => {
    message += `*AI-PSCI-${talktorial.number}: ${talktorial.topic}*\n\n`;
    talktorial.questions.forEach((q, i) => {
      message += `${i + 1}. ${q}\n`;
    });
    message += `\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📝 *How to use these questions:*\n`;
  message += `• Ask your AI assistant to help explore each question\n`;
  message += `• Verify at least one claim against primary sources\n`;
  message += `• Document your AI interactions in your Lab Notebook\n`;
  message += `• Note any conflicting information or areas of confusion\n\n`;
  message += `Empty talktorials will be released Sunday at 6 PM. 🚀`;

  // Send Chat notification
  sendChatMessage(message);

  Logger.log('Friday release complete. Posted ' + weekData.talktorials.length + ' inquiry sets.');
}

/**
 * SUNDAY RELEASE: Empty talktorials for upcoming week
 * Scheduled to run Sunday at 6 PM
 */
function sundayRelease() {
  const currentWeek = getCurrentWeek();

  // During spring break, skip release
  const now = new Date();
  if (now >= RELEASE_CONFIG.springBreakStart && now <= RELEASE_CONFIG.springBreakEnd) {
    Logger.log('Spring break - no release');
    return;
  }

  const talktorialsToRelease = RELEASE_CONFIG.talktorialSchedule[currentWeek] || [];

  if (talktorialsToRelease.length === 0) {
    Logger.log('No talktorials scheduled for week ' + currentWeek);
    return;
  }

  Logger.log('Sunday Release: Week ' + currentWeek + ', Talktorials: ' + talktorialsToRelease.join(', '));

  // Get all students from roster
  const students = getActiveStudents();

  if (students.length === 0) {
    Logger.log('No active students found');
    return;
  }

  // Release to each student
  let successCount = 0;
  students.forEach(student => {
    try {
      releaseTalktorialsToStudent(student, talktorialsToRelease);
      successCount++;
    } catch (error) {
      Logger.log('Error releasing to ' + student.name + ': ' + error.message);
    }
  });

  // Format talktorial names for notification
  const talktorialNames = talktorialsToRelease.map(n => 'AI-PSCI-' + String(n).padStart(3, '0')).join(', ');

  // Send Chat notification
  sendChatMessage(
    `📚 *Week ${currentWeek} Talktorials Released!*\n\n` +
    `Empty talktorials are now in your folders:\n` +
    `• ${talktorialNames}\n\n` +
    `Use your AI assistant to write the code based on what you learned from Friday's guided inquiry questions.\n\n` +
    `Document your process in your Lab Notebook. Solutions will be released Thursday at 6 PM.\n\n` +
    `Questions? Post here! 💬`
  );

  Logger.log('Sunday release complete. Released to ' + successCount + ' students.');
}

/**
 * THURSDAY RELEASE: Solution notebooks for current week
 * Scheduled to run Thursday at 6 PM
 */
function thursdayRelease() {
  const currentWeek = getCurrentWeek();

  // During spring break, skip release
  const now = new Date();
  if (now >= RELEASE_CONFIG.springBreakStart && now <= RELEASE_CONFIG.springBreakEnd) {
    Logger.log('Spring break - no release');
    return;
  }

  const talktorialsToRelease = RELEASE_CONFIG.talktorialSchedule[currentWeek] || [];

  if (talktorialsToRelease.length === 0) {
    Logger.log('No solutions scheduled for week ' + currentWeek);
    return;
  }

  Logger.log('Thursday Release: Week ' + currentWeek + ', Solutions: ' + talktorialsToRelease.join(', '));

  // Get Solutions folder
  const parentFolder = DriveApp.getFolderById(RELEASE_CONFIG.parentFolderId);
  const solutionsFolders = parentFolder.getFoldersByName('Solutions');

  if (!solutionsFolders.hasNext()) {
    Logger.log('ERROR: Solutions folder not found!');
    return;
  }

  const solutionsFolder = solutionsFolders.next();
  const templateFolder = DriveApp.getFolderById(RELEASE_CONFIG.solutionTemplatesFolderId);

  // Copy each solution notebook
  let releasedCount = 0;
  talktorialsToRelease.forEach(num => {
    const paddedNum = String(num).padStart(3, '0');
    const solutionName = 'AI-PSCI-' + paddedNum + ' - ' + RELEASE_CONFIG.instructorName + '.ipynb';

    // Check if already released
    const existing = solutionsFolder.getFilesByName(solutionName);
    if (existing.hasNext()) {
      Logger.log('Solution ' + paddedNum + ' already exists, skipping');
      return;
    }

    // Find the template
    const files = templateFolder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      const fileName = file.getName().toUpperCase();
      if (fileName.includes('AI-PSCI-' + paddedNum) || fileName.includes('PSCI-' + paddedNum)) {
        // Copy to Solutions folder
        const copy = file.makeCopy(solutionName, solutionsFolder);
        releasedCount++;
        Logger.log('Released solution: ' + solutionName);
        break;
      }
    }
  });

  // Format talktorial names for notification
  const talktorialNames = talktorialsToRelease.map(n => 'AI-PSCI-' + String(n).padStart(3, '0')).join(', ');

  // Send Chat notification
  sendChatMessage(
    `✅ *Week ${currentWeek} Solutions Now Available!*\n\n` +
    `Reference solutions have been released:\n` +
    `• ${talktorialNames}\n\n` +
    `Find them in the *Solutions* folder. ` +
    `Compare your approach with the reference to deepen your understanding.\n\n` +
    `Tomorrow's guided inquiry questions will prepare you for next week! 🎉`
  );

  Logger.log('Thursday release complete. Released ' + releasedCount + ' solution(s).');
}

/**
 * Release specific talktorials to a student
 */
function releaseTalktorialsToStudent(student, talktorialNumbers) {
  const templateFolder = DriveApp.getFolderById(RELEASE_CONFIG.talktorialTemplatesFolderId);
  const studentTalktorialFolder = DriveApp.getFolderById(student.talktorialFolderId);

  talktorialNumbers.forEach(num => {
    const paddedNum = String(num).padStart(3, '0');
    const studentFileName = 'AI-PSCI-' + paddedNum + ' - ' + student.name + '.ipynb';
    const searchPattern = 'AI-PSCI-' + paddedNum;

    // Check if already exists
    const existing = studentTalktorialFolder.getFilesByName(studentFileName);
    if (existing.hasNext()) {
      Logger.log('Talktorial ' + paddedNum + ' already exists for ' + student.name + ', skipping');
      return;
    }

    // Find the template
    const files = templateFolder.getFiles();
    let found = false;
    while (files.hasNext()) {
      const file = files.next();
      const fileName = file.getName().toUpperCase();
      if (fileName.includes('AI-PSCI-' + paddedNum) || fileName.includes('PSCI-' + paddedNum)) {
        // Copy and personalize
        const copy = file.makeCopy(studentFileName, studentTalktorialFolder);
        try {
          copy.addEditor(student.email);
        } catch (e) {
          Logger.log('Warning: Could not add editor ' + student.email + ': ' + e.message);
        }
        Logger.log('Released ' + studentFileName);
        found = true;
        break;
      }
    }

    if (!found) {
      Logger.log('WARNING: No template found for ' + searchPattern + ' in folder!');
    }
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get list of active students from roster
 */
function getActiveStudents() {
  const ss = SpreadsheetApp.openById(RELEASE_CONFIG.rosterSpreadsheetId);
  const sheet = ss.getSheetByName(RELEASE_CONFIG.rosterSheetName);

  if (!sheet) {
    Logger.log('ERROR: Roster sheet not found!');
    return [];
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).trim());

  const nameCol = headers.indexOf('Name');
  const emailCol = headers.indexOf('Email');
  const folderCreatedCol = headers.indexOf('Folder Created');
  const talktorialFolderIdCol = headers.indexOf('Talktorial Folder ID');

  const students = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[nameCol];
    const email = row[emailCol];
    const folderCreated = String(row[folderCreatedCol]).trim();
    const talktorialFolderId = row[talktorialFolderIdCol];

    // Only include students who have been set up
    if (name && email && (folderCreated === '✓' || folderCreated === 'TRUE' || folderCreated === true) && talktorialFolderId) {
      students.push({
        name: name,
        email: email,
        talktorialFolderId: talktorialFolderId
      });
    }
  }

  return students;
}

/**
 * Calculate current week of semester
 */
function getCurrentWeek() {
  const now = new Date();
  const start = RELEASE_CONFIG.semesterStart;

  if (now < start) return 1;
  if (now > RELEASE_CONFIG.semesterEnd) return 16;

  let weeks = Math.ceil((now - start) / (7 * 24 * 60 * 60 * 1000));

  if (now >= RELEASE_CONFIG.springBreakStart && now <= RELEASE_CONFIG.springBreakEnd) {
    return 8;
  }
  if (now > RELEASE_CONFIG.springBreakEnd) {
    weeks -= 1;
  }

  return Math.min(weeks, 16);
}

/**
 * Send message to Google Chat via webhook
 */
function sendChatMessage(message) {
  if (!RELEASE_CONFIG.chatWebhookUrl || RELEASE_CONFIG.chatWebhookUrl === 'PASTE_WEBHOOK_URL_HERE') {
    Logger.log('Chat webhook not configured, skipping notification');
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
    const response = UrlFetchApp.fetch(RELEASE_CONFIG.chatWebhookUrl, options);
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
// MANUAL RELEASE FUNCTIONS (for testing or catch-up)
// ============================================================================

/**
 * Manually release guided inquiry questions for a specific week
 */
function manualInquiryRelease() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Manual Inquiry Release',
    'Enter the week number to release guided inquiry questions for (1-16):',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const week = parseInt(response.getResponseText());
  if (isNaN(week) || week < 1 || week > 16) {
    ui.alert('Invalid week number. Please enter a number between 1 and 16.');
    return;
  }

  const weekData = RELEASE_CONFIG.guidedInquiryQuestions[week];
  if (!weekData || weekData.talktorials.length === 0) {
    ui.alert('No guided inquiry questions configured for week ' + week);
    return;
  }

  const confirm = ui.alert(
    'Confirm Release',
    'Post guided inquiry questions for "' + weekData.title + '" to Chat?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  // Build and send the message
  let message = `📖 *${weekData.title} - Guided Inquiry Questions*\n\n`;
  message += `These questions prepare you for this week's talktorials. Explore them with your AI assistant!\n\n`;

  weekData.talktorials.forEach(talktorial => {
    message += `*AI-PSCI-${talktorial.number}: ${talktorial.topic}*\n\n`;
    talktorial.questions.forEach((q, i) => {
      message += `${i + 1}. ${q}\n`;
    });
    message += `\n`;
  });

  sendChatMessage(message);
  ui.alert('Guided inquiry questions for week ' + week + ' posted to Chat.');
}

/**
 * Manually release talktorials for a specific week
 */
function manualTalktorialRelease() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Manual Talktorial Release',
    'Enter the week number to release talktorials for (1-16):',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const week = parseInt(response.getResponseText());
  if (isNaN(week) || week < 1 || week > 16) {
    ui.alert('Invalid week number. Please enter a number between 1 and 16.');
    return;
  }

  const talktorials = RELEASE_CONFIG.talktorialSchedule[week] || [];
  if (talktorials.length === 0) {
    ui.alert('No talktorials scheduled for week ' + week);
    return;
  }

  const confirm = ui.alert(
    'Confirm Release',
    'Release talktorials ' + talktorials.map(n => 'AI-PSCI-' + String(n).padStart(3, '0')).join(', ') + ' to all students?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  const students = getActiveStudents();
  students.forEach(student => {
    try {
      releaseTalktorialsToStudent(student, talktorials);
    } catch (error) {
      Logger.log('Error releasing to ' + student.name + ': ' + error.message);
    }
  });

  ui.alert('Released talktorials for week ' + week + ' to ' + students.length + ' students.');
}

/**
 * Manually release solutions for a specific week
 */
function manualSolutionRelease() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Manual Solution Release',
    'Enter the week number to release solutions for (1-16):',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const week = parseInt(response.getResponseText());
  if (isNaN(week) || week < 1 || week > 16) {
    ui.alert('Invalid week number. Please enter a number between 1 and 16.');
    return;
  }

  const talktorials = RELEASE_CONFIG.talktorialSchedule[week] || [];
  if (talktorials.length === 0) {
    ui.alert('No solutions scheduled for week ' + week);
    return;
  }

  const confirm = ui.alert(
    'Confirm Release',
    'Release solutions for ' + talktorials.map(n => 'AI-PSCI-' + String(n).padStart(3, '0')).join(', ') + ' to Solutions folder?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  // Get Solutions folder
  const parentFolder = DriveApp.getFolderById(RELEASE_CONFIG.parentFolderId);
  const solutionsFolders = parentFolder.getFoldersByName('Solutions');

  if (!solutionsFolders.hasNext()) {
    ui.alert('ERROR: Solutions folder not found!');
    return;
  }

  const solutionsFolder = solutionsFolders.next();
  const templateFolder = DriveApp.getFolderById(RELEASE_CONFIG.solutionTemplatesFolderId);

  let releasedCount = 0;
  talktorials.forEach(num => {
    const paddedNum = String(num).padStart(3, '0');
    const solutionName = 'AI-PSCI-' + paddedNum + ' - ' + RELEASE_CONFIG.instructorName + '.ipynb';

    const existing = solutionsFolder.getFilesByName(solutionName);
    if (existing.hasNext()) {
      Logger.log('Solution ' + paddedNum + ' already exists, skipping');
      return;
    }

    const files = templateFolder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      const fileName = file.getName().toUpperCase();
      if (fileName.includes('AI-PSCI-' + paddedNum) || fileName.includes('PSCI-' + paddedNum)) {
        file.makeCopy(solutionName, solutionsFolder);
        releasedCount++;
        break;
      }
    }
  });

  ui.alert('Released ' + releasedCount + ' solution(s) for week ' + week);
}

/**
 * Release ALL solutions up to current week (for mid-semester setup)
 */
function releaseAllSolutionsToDate() {
  const ui = SpreadsheetApp.getUi();
  const currentWeek = getCurrentWeek();

  const confirm = ui.alert(
    'Release All Solutions',
    'This will release all solution notebooks for weeks 1-' + currentWeek + ' to the Solutions folder.\n\nContinue?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  const parentFolder = DriveApp.getFolderById(RELEASE_CONFIG.parentFolderId);
  const solutionsFolders = parentFolder.getFoldersByName('Solutions');

  if (!solutionsFolders.hasNext()) {
    ui.alert('ERROR: Solutions folder not found!');
    return;
  }

  const solutionsFolder = solutionsFolders.next();
  const templateFolder = DriveApp.getFolderById(RELEASE_CONFIG.solutionTemplatesFolderId);

  let releasedCount = 0;

  for (let week = 1; week <= currentWeek; week++) {
    const talktorials = RELEASE_CONFIG.talktorialSchedule[week] || [];

    talktorials.forEach(num => {
      const paddedNum = String(num).padStart(3, '0');
      const solutionName = 'AI-PSCI-' + paddedNum + ' - ' + RELEASE_CONFIG.instructorName + '.ipynb';

      const existing = solutionsFolder.getFilesByName(solutionName);
      if (existing.hasNext()) return;

      const files = templateFolder.getFiles();
      while (files.hasNext()) {
        const file = files.next();
        const fileName = file.getName().toUpperCase();
        if (fileName.includes('AI-PSCI-' + paddedNum) || fileName.includes('PSCI-' + paddedNum)) {
          file.makeCopy(solutionName, solutionsFolder);
          releasedCount++;
          break;
        }
      }
    });
  }

  ui.alert('Released ' + releasedCount + ' solution(s) through week ' + currentWeek);
}

// ============================================================================
// MENU AND TRIGGERS
// ============================================================================

function createReleaseMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📅 VIP Release')
    .addItem('📖 Friday Release (Guided Inquiry)', 'fridayRelease')
    .addItem('📚 Sunday Release (Talktorials)', 'sundayRelease')
    .addItem('✅ Thursday Release (Solutions)', 'thursdayRelease')
    .addSeparator()
    .addSubMenu(ui.createMenu('🔧 Manual Release')
      .addItem('Release Inquiry Questions for Specific Week', 'manualInquiryRelease')
      .addItem('Release Talktorials for Specific Week', 'manualTalktorialRelease')
      .addItem('Release Solutions for Specific Week', 'manualSolutionRelease')
      .addItem('Release All Solutions to Date', 'releaseAllSolutionsToDate'))
    .addSeparator()
    .addSubMenu(ui.createMenu('⏰ Set Up Triggers')
      .addItem('Set Friday 6 PM Trigger (Inquiry)', 'setFridayTrigger')
      .addItem('Set Sunday 6 PM Trigger (Talktorials)', 'setSundayTrigger')
      .addItem('Set Thursday 6 PM Trigger (Solutions)', 'setThursdayTrigger')
      .addItem('Set All Three Triggers', 'setAllTriggers')
      .addItem('Remove All Triggers', 'removeAllTriggers'))
    .addSeparator()
    .addItem('💬 Test Chat Webhook', 'testChatWebhook')
    .addItem('ℹ️ Show Current Week', 'showCurrentWeek')
    .addToUi();
}

/**
 * Set Friday 6 PM trigger for guided inquiry release
 */
function setFridayTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'fridayRelease') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('fridayRelease')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(18)
    .create();

  SpreadsheetApp.getUi().alert('Friday 6 PM trigger set for guided inquiry release.');
}

/**
 * Set Sunday 6 PM trigger for talktorial release
 */
function setSundayTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sundayRelease') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('sundayRelease')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(18)
    .create();

  SpreadsheetApp.getUi().alert('Sunday 6 PM trigger set for talktorial release.');
}

/**
 * Set Thursday 6 PM trigger for solution release
 */
function setThursdayTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'thursdayRelease') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('thursdayRelease')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.THURSDAY)
    .atHour(18)
    .create();

  SpreadsheetApp.getUi().alert('Thursday 6 PM trigger set for solution release.');
}

/**
 * Set all three triggers
 */
function setAllTriggers() {
  setFridayTrigger();
  setSundayTrigger();
  setThursdayTrigger();
  SpreadsheetApp.getUi().alert('All three triggers set:\n• Friday 6 PM: Guided Inquiry Questions\n• Sunday 6 PM: Empty Talktorials\n• Thursday 6 PM: Solutions');
}

/**
 * Remove all triggers
 */
function removeAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  SpreadsheetApp.getUi().alert('All triggers removed.');
}

/**
 * Test Chat webhook
 */
function testChatWebhook() {
  sendChatMessage('🧪 *Test Message*\n\nIf you see this, the weekly release webhook is working!');
  SpreadsheetApp.getUi().alert('Test message sent to Chat.');
}

/**
 * Show current week
 */
function showCurrentWeek() {
  const week = getCurrentWeek();
  const talktorials = RELEASE_CONFIG.talktorialSchedule[week] || [];
  const weekData = RELEASE_CONFIG.guidedInquiryQuestions[week];

  let message = 'Current Week: ' + week + '\n\n';

  message += 'RELEASE SCHEDULE:\n';
  message += '• Friday 6 PM: Guided Inquiry Questions\n';
  message += '• Sunday 6 PM: Empty Talktorials\n';
  message += '• Thursday 6 PM: Solutions\n\n';

  if (talktorials.length > 0) {
    message += 'Talktorials for this week:\n';
    message += talktorials.map(n => '• AI-PSCI-' + String(n).padStart(3, '0')).join('\n');
  } else {
    message += 'No talktorials scheduled for this week.';
  }

  SpreadsheetApp.getUi().alert('Week Information', message, SpreadsheetApp.getUi().ButtonSet.OK);
}
