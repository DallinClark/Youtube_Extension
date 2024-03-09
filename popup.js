const axios = require('axios');

// Function to fetch the video ID of the currently active tab
function getVideoId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab) {
        const videoId = extractVideoId(new URL(tab.url));
        callback(videoId);
      } else {
        console.error('Error: Could not get active tab.');
      }
    });
  }

async function getComments(videoId, apiKey) {

    let raw_comments = []

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
            params: {
                part: 'snippet',
                videoId: videoId,
                key: apiKey,
                maxResults: 100
            }
        });

        const comments = response.data.items;

        // console.log(comments)

        for (const comment of comments) {
            // const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
            // console.log(`Comment: ${commentText}`);

            // console.log(comment.snippet.topLevelComment)

            raw_comments.push(comment.snippet.topLevelComment.snippet.textOriginal)

            // if (comment.replies) {
            //     for (const reply of comment.replies.comments) {
            //         const replyText = reply.snippet.textDisplay;
            //         console.log(`Reply: ${replyText}`);
            //     }
            // }
        }
    } catch (error) {
        console.error(`Error fetching comments: ${error}`);
    }

    console.log(raw_comments)
}

// Replace 'YOUR_API_KEY' with your actual YouTube Data API key
const API_KEY = 'AIzaSyADXH44QlQYsv6jiTEC7L-7DQUwrP-m618';



// Replace 'VIDEO_ID' with the ID of the YouTube video you want to scrape comments from
const VIDEO_ID = getVideoId();

getComments(VIDEO_ID, API_KEY);