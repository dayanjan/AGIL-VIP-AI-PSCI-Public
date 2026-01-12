/**
 * ============================================================================
 * VIP MAIN SCRIPT
 * AI in Pharmaceutical Sciences: Bench to Bedside
 *
 * TEMPLATE VERSION - Configure for your institution
 * ============================================================================
 *
 * This file contains the master onOpen() function that initializes all menus.
 * All three VIP menus will appear in the spreadsheet.
 *
 * Files in this project:
 * - main.gs (this file) - Master onOpen() and shared utilities
 * - vip_semester_setup.gs - Initial semester setup, student folder creation
 * - vip_weekly_release.gs - Three-exposure weekly release automation
 * - vip_progress_monitor.gs - Progress dashboard and student tracking
 *
 * ============================================================================
 */

/**
 * Master onOpen function - creates all menus
 * This runs automatically when the spreadsheet is opened
 */
function onOpen() {
  createSetupMenu();    // From vip_semester_setup.gs
  createReleaseMenu();  // From vip_weekly_release.gs
  createProgressMenu(); // From vip_progress_monitor.gs
}

/**
 * Utility: Get the current semester info
 *
 * CONFIGURE: Update these dates for your semester
 */
function getSemesterInfo() {
  return {
    name: 'Spring 2026',                           // UPDATE: Your semester name
    code: '2026-Spring',                           // UPDATE: Your semester code
    start: new Date('2026-01-12'),                 // UPDATE: First day of classes
    end: new Date('2026-05-12'),                   // UPDATE: Last day of classes
    springBreakStart: new Date('2026-03-08'),      // UPDATE: Spring break start
    springBreakEnd: new Date('2026-03-15')         // UPDATE: Spring break end
  };
}
