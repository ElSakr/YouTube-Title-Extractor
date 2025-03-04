// Background script for YouTube Title Extractor

// Listen for installation
chrome.runtime.onInstalled.addListener(function() {
  console.log('YouTube Title Extractor installed');
});

// Optional: Add context menu item
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'extractTitles',
    title: 'Extract YouTube Titles',
    contexts: ['page'],
    documentUrlPatterns: ['*://*.youtube.com/*/videos']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'extractTitles') {
    // Open the popup
    chrome.action.openPopup();
  }
}); 