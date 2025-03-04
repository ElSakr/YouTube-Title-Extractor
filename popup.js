document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractBtn');
  const scrollBtn = document.getElementById('scrollBtn');
  const sortOldestBtn = document.getElementById('sortOldestBtn');
  const sortNewestBtn = document.getElementById('sortNewestBtn');
  const copyBtn = document.getElementById('copyBtn');
  const statusDiv = document.getElementById('status');
  const resultsDiv = document.getElementById('results');
  const sortControls = document.querySelector('.sort-controls');
  
  let videoData = [];
  
  extractBtn.addEventListener('click', function() {
    statusDiv.textContent = 'Extracting video titles...';
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const activeTab = tabs[0];
      
      // Check if we're on a YouTube channel videos page
      if (!activeTab.url.includes('youtube.com/') || !activeTab.url.includes('/videos')) {
        statusDiv.textContent = 'Error: Please navigate to a YouTube channel videos page.';
        return;
      }
      
      // Extract without auto-scrolling
      extractVideos(activeTab);
    });
  });
  
  scrollBtn.addEventListener('click', function() {
    statusDiv.textContent = 'Auto-scrolling to load more videos...';
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const activeTab = tabs[0];
      
      // Check if we're on a YouTube channel videos page
      if (!activeTab.url.includes('youtube.com/') || !activeTab.url.includes('/videos')) {
        statusDiv.textContent = 'Error: Please navigate to a YouTube channel videos page.';
        return;
      }
      
      // Send message to content script to auto-scroll
      chrome.tabs.sendMessage(activeTab.id, {
        action: 'autoScroll',
        scrollCount: 5 // Adjust this number to control how many times to scroll
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.log('Error:', chrome.runtime.lastError);
          statusDiv.textContent = 'Auto-scroll failed. Extracting visible videos...';
          // Continue with extraction even if auto-scroll fails
          extractVideos(activeTab);
        } else if (response && response.success) {
          statusDiv.textContent = `Loaded ${response.videosLoaded} videos. Extracting...`;
          extractVideos(activeTab);
        } else {
          statusDiv.textContent = 'Auto-scroll failed. Extracting visible videos...';
          // Continue with extraction even if auto-scroll fails
          extractVideos(activeTab);
        }
      });
    });
  });
  
  function extractVideos(tab) {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: extractVideoInfo
    }, (results) => {
      if (chrome.runtime.lastError) {
        statusDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      
      if (results && results[0] && results[0].result) {
        videoData = results[0].result;
        
        if (videoData.length === 0) {
          statusDiv.textContent = 'No videos found. Try scrolling down on the page to load more videos.';
          return;
        }
        
        // Default sort: oldest to newest
        sortVideosByDate(true);
        displayResults();
        
        statusDiv.textContent = `Extracted ${videoData.length} videos.`;
        sortControls.style.display = 'block';
      } else {
        statusDiv.textContent = 'Error: Could not extract video information.';
      }
    });
  }
  
  sortOldestBtn.addEventListener('click', function() {
    sortVideosByDate(true);
    displayResults();
  });
  
  sortNewestBtn.addEventListener('click', function() {
    sortVideosByDate(false);
    displayResults();
  });
  
  copyBtn.addEventListener('click', function() {
    // Just copy the titles with enumeration, without dates
    const text = videoData.map((video, index) => `${index + 1}. ${video.title}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      statusDiv.textContent = 'Copied to clipboard!';
    }).catch(err => {
      statusDiv.textContent = 'Failed to copy: ' + err;
    });
  });
  
  function sortVideosByDate(oldestFirst) {
    videoData.sort((a, b) => {
      return oldestFirst ? a.date - b.date : b.date - a.date;
    });
  }
  
  function displayResults() {
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'block';
    
    videoData.forEach((video, index) => {
      const videoItem = document.createElement('div');
      videoItem.className = 'video-item';
      
      const title = document.createElement('div');
      // Add enumeration to the displayed titles
      title.textContent = `${index + 1}. ${video.title}`;
      
      const date = document.createElement('div');
      date.className = 'video-date';
      date.textContent = formatDate(video.date);
      
      videoItem.appendChild(title);
      videoItem.appendChild(date);
      resultsDiv.appendChild(videoItem);
    });
  }
  
  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
  }
});

// This function will be injected into the page
function extractVideoInfo() {
  // Get all video elements
  const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer');
  const videoData = [];
  
  videoElements.forEach(videoElement => {
    // Extract title
    const titleElement = videoElement.querySelector('#video-title, #title-wrapper h3');
    if (!titleElement) return;
    
    const title = titleElement.textContent.trim();
    
    // Extract date
    const dateElement = videoElement.querySelector('#metadata-line span:last-child, #metadata span:last-child');
    let dateText = '';
    let timestamp = 0;
    
    if (dateElement) {
      dateText = dateElement.textContent.trim();
      
      // Convert relative time to timestamp
      const now = new Date();
      
      if (dateText.includes('second')) {
        const seconds = parseInt(dateText) || 0;
        timestamp = now.getTime() - (seconds * 1000);
      } else if (dateText.includes('minute')) {
        const minutes = parseInt(dateText) || 0;
        timestamp = now.getTime() - (minutes * 60 * 1000);
      } else if (dateText.includes('hour')) {
        const hours = parseInt(dateText) || 0;
        timestamp = now.getTime() - (hours * 60 * 60 * 1000);
      } else if (dateText.includes('day')) {
        const days = parseInt(dateText) || 0;
        timestamp = now.getTime() - (days * 24 * 60 * 60 * 1000);
      } else if (dateText.includes('week')) {
        const weeks = parseInt(dateText) || 0;
        timestamp = now.getTime() - (weeks * 7 * 24 * 60 * 60 * 1000);
      } else if (dateText.includes('month')) {
        const months = parseInt(dateText) || 0;
        timestamp = now.getTime() - (months * 30 * 24 * 60 * 60 * 1000);
      } else if (dateText.includes('year')) {
        const years = parseInt(dateText) || 0;
        timestamp = now.getTime() - (years * 365 * 24 * 60 * 60 * 1000);
      } else {
        // If we can't parse the date, use current time
        timestamp = now.getTime();
      }
    }
    
    videoData.push({
      title: title,
      dateText: dateText,
      date: timestamp
    });
  });
  
  return videoData;
} 