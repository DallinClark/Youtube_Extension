import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { exec } from 'child_process';
import axios from 'axios';
declare const chrome: any;

interface Comment {
  author: string;
  date: string;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BrowserModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular';
  key = "AIzaSyCgkOGTu8drhwATKnA4y-gVhu6-3O1FO4w"
  comments: Comment[] = []
  async ngOnInit() {
    alert("hi")
    console.log("hi")
    await this.getComments()
  }

  currentTabUrl: string = 'loading...';

  constructor(private cdRef: ChangeDetectorRef) { }

  getYoutubeVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.{11})/;
    const match = url.match(regex);
    console.log(match);
    return match && match[1].length === 11 ? match[1] : 'Not a valid YouTube URL.';
  };

  ngOnInit() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs: any) => {
      if (tabs.length > 0) {
        this.currentTabUrl = this.getYoutubeVideoId(tabs[0].url);
        this.cdRef.detectChanges();
      }
    });
  }

  comments: Comment[] = [
    {
      author: 'John Doe',
      date: '2023-03-08',
      text: 'This is an awesome video!'
    },
    {
      author: 'Jane Smith',
      date: '2023-03-07',
      text: 'I really enjoyed watching this tutorial.'
    },
    {
      author: 'Bob Johnson',
      date: '2023-03-06',
      text: 'Great content! Keep up the good work.'

  async getComments() {
    const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&order=relevance&textFormat=plainText&videoId=zeD0g5xXo7E&key=${this.key}`)
    console.log(res)
    const items = res.data.items
    for (let i = 0; i < items.length; i++) {
      const comment = {
        author: items[i].snippet.topLevelComment.snippet.authorDisplayName,
        date: items[i].snippet.topLevelComment.snippet.publishedAt,
        text: items[i].snippet.topLevelComment.snippet.textDisplay
      }
      this.comments.push(comment)
    }
    console.log(this.comments)
  }

  
}

function runPythonSentiment(){
  exec('python sentiment.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });
}
