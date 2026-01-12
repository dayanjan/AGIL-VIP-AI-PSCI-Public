# Course Automation System

## AGIL AI-PSCI: Automated Course Management Infrastructure

This document describes the Google Apps Script automation system that powers the AGIL (AI-Guided Inquiry Learning) curriculum delivery for "AI in Pharmaceutical Sciences: Bench to Bedside."

---

## Overview

The automation system handles three core functions:

1. **Semester Setup** - Creating student folders, copying materials, sharing permissions
2. **Weekly Release** - Three-exposure progressive release of course materials
3. **Progress Monitoring** - Real-time tracking of student progress and alerts

### Three-Exposure Learning Model

The weekly release follows a deliberate three-exposure pedagogical pattern:

```
FRIDAY 6 PM (Exposure 1: Inquiry Phase)
├── Guided inquiry questions posted to Google Chat
├── Students explore questions with AI assistant
└── Document AI interactions, verify claims

SUNDAY 6 PM (Exposure 2: Implementation Phase)
├── Empty talktorial notebooks released to student folders
├── Students implement code based on inquiry exploration
└── Write code with AI assistance

THURSDAY 6 PM (Exposure 3: Synthesis Phase)
├── Solution notebooks released to Solutions folder
├── Students compare their approach with reference
└── In-class synthesis session follows
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Sheets                            │
│                  (Command Center)                           │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ 🎓 VIP      │ │ 📅 VIP      │ │ 📊 VIP Progress     │   │
│  │ Setup Menu  │ │ Release Menu│ │ Menu                │   │
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘   │
└─────────┼───────────────┼───────────────────┼──────────────┘
          │               │                   │
          ▼               ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  Google Apps Script                         │
│                                                             │
│  main.gs                    vip_semester_setup.gs           │
│  └── onOpen()               ├── initialSemesterSetup()      │
│  └── getSemesterInfo()      ├── processNewStudents()        │
│                             └── setupStudentFolder()        │
│                                                             │
│  vip_weekly_release.gs      vip_progress_monitor.gs         │
│  ├── fridayRelease()        ├── refreshProgressDashboard()  │
│  ├── sundayRelease()        ├── sendWeeklyProgressReport()  │
│  └── thursdayRelease()      └── checkInactiveStudents()     │
└─────────────────────────────────────────────────────────────┘
          │               │                   │
          ▼               ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Google Drive                             │
│                                                             │
│  📁 VIP Course Folder                                       │
│  ├── 📁 Solutions (shared with students as Commenters)      │
│  ├── 📁 Student-Name-1                                      │
│  │   ├── 📄 Lab Notebook - Student Name (Google Doc)        │
│  │   ├── 📄 [Example] Lab Notebook (View Only)              │
│  │   └── 📁 Talktorials                                     │
│  │       ├── 📓 AI-PSCI-001 - Student Name.ipynb            │
│  │       └── ...                                            │
│  └── 📁 Student-Name-2                                      │
│      └── ...                                                │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Notifications                             │
│                                                             │
│  📧 Email          💬 Google Chat        🤖 Claude API      │
│  └── Welcome       └── Weekly           └── AI Analysis     │
│  └── Reports          announcements        (optional)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Google Workspace Components

1. **Google Sheets** - Hosts the roster and serves as the control panel
2. **Google Drive** - Stores all course materials and student folders
3. **Gmail** - Sends automated emails (uses your Google account)
4. **Google Chat** (optional) - Posts notifications to a course space

### Required Setup Items

Before running the scripts, you need:

| Item | Purpose | How to Get |
|------|---------|------------|
| Parent Folder ID | Where student folders are created | Create folder, copy ID from URL |
| Master Templates Folder ID | Contains your template files | Create folder, copy ID |
| Talktorial Templates Folder ID | Empty talktorial notebooks | Subfolder of Master Templates |
| Solution Templates Folder ID | Your solution notebooks | Subfolder of Master Templates |
| Lab Notebook Template ID | Google Doc template for lab notebooks | Create doc, copy ID |
| Example Lab Notebook ID | Reference lab notebook for students | Create doc, copy ID |
| Roster Spreadsheet ID | The spreadsheet containing this script | Copy ID from URL |
| Chat Webhook URL (optional) | For Google Chat notifications | Create webhook in Chat space |

### Folder ID Location

To find a Google Drive folder ID:
1. Open the folder in Google Drive
2. Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
3. Copy the ID portion (the long string after `/folders/`)

---

## Setup Instructions

### Step 1: Create Master Templates Folder Structure

Create the following folder structure in Google Drive:

```
📁 Course Master Materials/
├── 📁 Talktorials/              (empty talktorial templates)
│   ├── 📓 AI-PSCI-001.ipynb
│   ├── 📓 AI-PSCI-002.ipynb
│   └── ... (all 20 empty notebooks)
├── 📁 Solutions/                (your completed solutions)
│   ├── 📓 AI-PSCI-001 - Dr. Name.ipynb
│   └── ... (your solution notebooks)
├── 📄 Lab Notebook Template     (Google Doc)
└── 📄 Example Lab Notebook      (Google Doc)
```

### Step 2: Create Semester Parent Folder

Create a folder for this semester where student folders will be created:

```
📁 VIP Spring 2026/
└── (student folders will be created here automatically)
```

### Step 3: Create Control Spreadsheet

1. Create a new Google Sheets spreadsheet
2. Name it something like "VIP Course Automation"
3. Copy the spreadsheet ID from the URL

### Step 4: Add Scripts to Spreadsheet

1. Open your spreadsheet
2. Go to **Extensions > Apps Script**
3. Delete any default code
4. Create four script files:
   - `main.gs`
   - `vip_semester_setup.gs`
   - `vip_weekly_release.gs`
   - `vip_progress_monitor.gs`
5. Copy the contents from the provided template files into each

### Step 5: Configure Scripts

Update the configuration constants in each script file:

#### In `vip_semester_setup.gs`:
```javascript
const SETUP_CONFIG = {
  instructorEmail: 'your.email@university.edu',
  instructorName: 'Dr. Your Name',
  parentFolderId: 'YOUR_PARENT_FOLDER_ID',
  masterTemplatesFolderId: 'YOUR_TEMPLATES_FOLDER_ID',
  talktorialTemplatesFolderId: 'YOUR_TALKTORIAL_TEMPLATES_ID',
  solutionTemplatesFolderId: 'YOUR_SOLUTIONS_TEMPLATES_ID',
  labNotebookTemplateId: 'YOUR_LAB_NOTEBOOK_DOC_ID',
  exampleLabNotebookId: 'YOUR_EXAMPLE_NOTEBOOK_ID',
  rosterSpreadsheetId: 'THIS_SPREADSHEET_ID',
  chatWebhookUrl: 'YOUR_CHAT_WEBHOOK_URL',
  // ... update semester dates
};
```

#### In `vip_weekly_release.gs`:
Update the `RELEASE_CONFIG` object with matching IDs.

#### In `vip_progress_monitor.gs`:
Update the `PROGRESS_CONFIG` object with matching IDs.

### Step 6: Authorize Scripts

1. Save all script files
2. Run any function (e.g., `createRosterTemplate`)
3. Click through the authorization prompts
4. Grant necessary permissions (Drive, Gmail, Sheets)

### Step 7: Create Roster

1. Refresh your spreadsheet
2. Click **🎓 VIP Setup > 📋 Create Roster Template**
3. Add your students' names and emails to the Roster sheet

### Step 8: Run Initial Setup

1. Click **🎓 VIP Setup > 🚀 Initial Semester Setup**
2. Confirm the setup
3. Wait for all folders to be created (may take several minutes for large classes)

### Step 9: Set Up Triggers

1. Click **📅 VIP Release > ⏰ Set Up Triggers > Set All Three Triggers**
2. Click **📊 VIP Progress > ⏰ Automatic Monitoring > Set Weekly Report**

---

## Usage Guide

### Weekly Operations

The system runs automatically once triggers are set:

| Day | Time | Action | Menu Override |
|-----|------|--------|---------------|
| Friday | 6 PM | Posts guided inquiry questions to Chat | 📅 VIP Release > Friday Release |
| Sunday | 6 PM | Releases empty talktorials to students | 📅 VIP Release > Sunday Release |
| Thursday | 6 PM | Releases solutions to Solutions folder | 📅 VIP Release > Thursday Release |
| Monday | 8 AM | Sends weekly progress report | 📊 VIP Progress > Send Weekly Report |
| Daily | 9 AM | Checks for inactive students | 📊 VIP Progress > Check Inactive Students |

### Adding New Students Mid-Semester

1. Add the student's Name and Email to the Roster sheet
2. Leave "Folder Created" blank
3. Either:
   - Wait for the daily 8 AM trigger, OR
   - Click **🎓 VIP Setup > 👤 Process New Students**

The system will:
- Create their folder with all materials up to the current week
- Send them a welcome email with catch-up instructions
- Notify the instructor via Chat

### Manual Release Functions

For testing or catch-up scenarios:

- **📅 VIP Release > 🔧 Manual Release > Release Talktorials for Specific Week**
- **📅 VIP Release > 🔧 Manual Release > Release Solutions for Specific Week**
- **📅 VIP Release > 🔧 Manual Release > Release All Solutions to Date**

### Viewing Progress

- **📊 VIP Progress > 🔄 Refresh Dashboard** - Updates the Progress Dashboard sheet
- **📊 VIP Progress > 👤 View Student Detail** - Shows detailed progress for one student

---

## Configuration Reference

### Talktorial Schedule

The `talktorialSchedule` object maps week numbers to talktorial numbers:

```javascript
talktorialSchedule: {
  1: [1, 2],      // Week 1: AI-PSCI-001, 002
  2: [3, 4],      // Week 2: AI-PSCI-003, 004
  // ...
  8: [14],        // Week 8 (before spring break)
  9: [15],        // Week 9 (after spring break)
  // ...
}
```

### Guided Inquiry Questions

Customize the `guidedInquiryQuestions` object in `vip_weekly_release.gs`:

```javascript
guidedInquiryQuestions: {
  1: {
    title: 'Week 1: Topic Name',
    talktorials: [
      {
        number: '001',
        topic: 'Talktorial Topic',
        questions: [
          'Question 1?',
          'Question 2?',
          // ... typically 4-5 questions per talktorial
        ]
      }
    ]
  }
}
```

### Alert Thresholds

In `vip_progress_monitor.gs`:

```javascript
// Days of inactivity before flagging a student
inactivityThresholdDays: 5,

// Minimum expected progress percentage
minExpectedProgressPercent: 70,
```

---

## Google Chat Webhook Setup

To enable Google Chat notifications:

1. Open your Google Chat space
2. Click the space name > **Apps & integrations** > **Webhooks**
3. Click **Create webhook**
4. Name it (e.g., "VIP Course Bot")
5. Copy the webhook URL
6. Paste it into the `chatWebhookUrl` config field

---

## Optional: Claude AI Analysis

The progress monitor includes optional AI-powered analysis of student lab notebooks using the Claude API.

### Setup

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Click **📊 VIP Progress > 🤖 AI Analysis > Update API Key**
3. Paste your API key (starts with `sk-ant-`)

### Features

- Analyzes lab notebook content for effort and engagement
- Detects blockers and confusion points
- Suggests instructor interventions
- Tracks sentiment and progress patterns

### Usage

- **Test Claude API** - Verify the API connection works
- **Update API Key** - Change the stored API key
- **Clear API Key** - Remove the API key from storage

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "Folder ID not found" | Double-check the ID was copied correctly from the URL |
| "Permission denied" | Re-run authorization; check you have edit access to folders |
| "Email not sent" | Check Gmail quota; verify email addresses are valid |
| "Chat message failed" | Verify webhook URL; check Chat space still exists |
| "Trigger not firing" | Check Apps Script execution log; re-create trigger |

### Viewing Logs

1. Go to **Extensions > Apps Script**
2. Click **Executions** in the left sidebar
3. View recent executions and error messages

### Execution Quotas

Google Apps Script has daily quotas:
- Email: 100/day (consumer), 1500/day (Workspace)
- Triggers: 20 triggers per script
- Execution time: 6 minutes per execution

---

## Customization

### Changing Release Times

In `vip_weekly_release.gs`, modify the trigger functions:

```javascript
ScriptApp.newTrigger('fridayRelease')
  .timeBased()
  .onWeekDay(ScriptApp.WeekDay.FRIDAY)
  .atHour(18)  // Change to your preferred hour (0-23)
  .create();
```

### Adding More Targets

The system is target-agnostic for weeks 1-4. For week 5+, students select from a dropdown in the notebooks. To add targets:

1. Update the talktorial templates with additional targets in the dropdown
2. No changes needed to automation scripts

### Custom Email Templates

Modify the `sendWelcomeEmail()` function in `vip_semester_setup.gs` to customize email content.

### Different Folder Naming

Change the `folderPrefix` config to use a different naming scheme:

```javascript
folderPrefix: '2026-Spring-PHARM-',  // Your custom prefix
```

---

## File Reference

| File | Purpose |
|------|---------|
| `main.gs` | Master onOpen() function, shared utilities |
| `vip_semester_setup.gs` | Initial setup, student folder creation |
| `vip_weekly_release.gs` | Three-exposure weekly release automation |
| `vip_progress_monitor.gs` | Progress dashboard and student tracking |
| `AUTOMATION.md` | This documentation file |

---

## Security Notes

- API keys are stored in Google Apps Script Properties (encrypted at rest)
- Student email addresses are only visible to authorized spreadsheet editors
- Folder sharing uses Google Drive's permission system
- No sensitive data is logged to external services

---

## Support

For issues or questions:
1. Check the [Execution Log](#viewing-logs) for error details
2. Verify all configuration IDs are correct
3. Test individual functions before relying on triggers
4. Review the [Troubleshooting](#troubleshooting) section

---

*This automation system is part of the AGIL (AI-Guided Inquiry Learning) framework for pharmaceutical sciences education.*
