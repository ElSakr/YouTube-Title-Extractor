// This content script can be used to auto-scroll the page to load more videos
// It's not currently used by default, but can be added to the manifest if needed

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "autoScroll") {
    autoScroll(request.scrollCount || 5, sendResponse);
    return true; // Keep the message channel open for the async response
  }
});

// Function to auto-scroll the page to load more videos
function autoScroll(scrollCount, callback) {
  let scrolls = 0;
  let videoCountBefore = countVideos();
  let videoCountAfter = videoCountBefore;
  
  const scrollInterval = setInterval(() => {
    window.scrollTo(0, document.body.scrollHeight);
    scrolls++;
    
    // After each scroll, wait a bit and check if new videos loaded
    setTimeout(() => {
      videoCountAfter = countVideos();
      
      // If we've scrolled enough times or no new videos are loading
      if (scrolls >= scrollCount || (scrolls > 2 && videoCountAfter === videoCountBefore)) {
        clearInterval(scrollInterval);
        callback({
          success: true,
          videosLoaded: videoCountAfter,
          scrollsPerformed: scrolls
        });
      }
      
      videoCountBefore = videoCountAfter;
    }, 1500); // Wait 1.5 seconds after each scroll
    
  }, 2000); // Scroll every 2 seconds
}

// Count the number of video elements on the page
function countVideos() {
  return document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer').length;
} 