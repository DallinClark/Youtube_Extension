import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import axios from 'axios';
import sentiment from 'sentiment'
import { FormsModule } from '@angular/forms';

declare const chrome: any;

interface Comment {
  author: string;
  date: string;
  text: string;
  value: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BrowserModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular';

  key: string = "AIzaSyCgkOGTu8drhwATKnA4y-gVhu6-3O1FO4w"
  error: string | null = null

  average: number | null = null
  comments: Comment[] = []

  sortMode: string = "positive"

  constructor(private cdRef: ChangeDetectorRef, private zone: NgZone) { }

  getYoutubeVideoId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.{11})/;
    const match = url.match(regex);
    return match && match[1].length === 11 ? match[1] : null;
  };

  async ngOnInit() {
    await chrome.tabs.query({active: true, currentWindow: true}, async (tabs: any) => {
      if (tabs.length > 0) {
        const id = this.getYoutubeVideoId(tabs[0].url)
        if (id) {
          await this.getComments(id)
        } else {
          this.error = "The current tab is not a YouTube video"
          this.cdRef.detectChanges();
        }
      }
    })
  }

  async getComments(id: string) {
    const commentNumber = 50
    const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${commentNumber}&order=relevance&textFormat=plainText&videoId=${id}&key=${this.key}`)
    
    console.log(res)
    const items = res.data.items
    for (let i = 0; i < items.length; i++) {
      const comment : Comment = {
        author: items[i].snippet.topLevelComment.snippet.authorDisplayName,
        date: items[i].snippet.topLevelComment.snippet.publishedAt,
        text: items[i].snippet.topLevelComment.snippet.textDisplay,
        value: 0,
      }
      this.comments.push(comment)
    }
    console.log(this.comments)
    this.runPythonSentiment()
  }

  runPythonSentiment(){
    let s = new sentiment();
    let sum = 0;

    for (let i = 0; i < this.comments.length; i++) {
      let result = s.analyze(this.comments[i].text);
      this.comments[i].value = (result.comparative + 1) * 50;
      sum += this.comments[i].value;
    }

    this.average = sum / this.comments.length
    this.sortComments();
    
    // child.exec('python sentiment.py', (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`exec error: ${error}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);
    //   if (stderr) {
    //     console.error(`stderr: ${stderr}`);
    //   }
    // });
  }

  sortComments() {
    this.zone.run(() => {
      if (this.sortMode == "positive") {
        this.comments.sort((a, b) => b.value - a.value)
      } else if (this.sortMode == "negative") {
        this.comments.sort((a, b) => a.value - b.value)
      }

      this.cdRef.detectChanges();
    });
  }
}


