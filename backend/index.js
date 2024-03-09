const axios = require('axios');

async function getComments(videoId, apiKey) {
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

        for (const comment of comments) {
            const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
            console.log(`Comment: ${commentText}`);

            if (comment.replies) {
                for (const reply of comment.replies.comments) {
                    const replyText = reply.snippet.textDisplay;
                    console.log(`Reply: ${replyText}`);
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching comments: ${error}`);
    }
}

// Replace 'YOUR_API_KEY' with your actual YouTube Data API key
const API_KEY = 'AIzaSyCCZ7zfyqQhm-Bh43N4XbrGSqNO-4si8Ug';

// Replace 'VIDEO_ID' with the ID of the YouTube video you want to scrape comments from
const VIDEO_ID = '0FtcHjI5lmw';

getComments(VIDEO_ID, API_KEY);