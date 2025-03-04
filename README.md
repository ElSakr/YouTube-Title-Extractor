# YouTube Title Extractor

A Chrome extension that extracts video titles from a YouTube channel and sorts them chronologically.

## Features

- Extract video titles from any YouTube channel's videos page
- Auto-scroll to load more videos before extraction
- Sort videos from oldest to newest or newest to oldest
- Display titles with enumeration (1, 2, 3, etc.)
- Copy all enumerated titles to clipboard (without dates)
- Right-click context menu for quick access

## Installation

### From Source Code

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The extension should now be installed and visible in your Chrome toolbar

## Usage

1. Navigate to a YouTube channel's videos page (e.g., `https://www.youtube.com/@ChannelName/videos`)
2. Click on the extension icon in your Chrome toolbar
3. Choose one of the options:
   - "Extract Titles" - Extract only the currently visible videos
   - "Auto-Scroll & Extract" - Automatically scroll down to load more videos before extracting
4. The extension will extract all video titles
5. By default, videos are sorted from oldest to newest and displayed with enumeration
6. Use the sorting buttons to change the order
7. Click "Copy to Clipboard" to copy all enumerated titles (without dates)

## Alternative Access

You can also right-click on any YouTube channel videos page and select "Extract YouTube Titles" from the context menu.

## Notes

- The extension can only extract videos that are currently loaded on the page
- YouTube may change its page structure over time, which could affect the extension's functionality

## Troubleshooting

If the extension doesn't work as expected:

1. Make sure you're on a YouTube channel videos page (URL should contain `/videos`)
2. Try refreshing the page and then using the extension
3. If auto-scroll doesn't work, try manually scrolling down and then using "Extract Titles"
4. Check the Chrome console for any error messages

## License

This project is open source and available under the MIT License. 