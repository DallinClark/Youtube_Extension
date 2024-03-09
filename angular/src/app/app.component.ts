import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import axios from 'axios';
declare const chrome: any;
import sentiment from 'sentiment'

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
  key: string = "AIzaSyCgkOGTu8drhwATKnA4y-gVhu6-3O1FO4w"
  comments: Comment[] = []
  error: string | null = null

  constructor(private cdRef: ChangeDetectorRef) { }

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
    const commentNumber = 10
    const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${commentNumber}&order=relevance&textFormat=plainText&videoId=${id}&key=${this.key}`)
    
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
    this.runPythonSentiment()
  }

  runPythonSentiment(){
    var s = new sentiment();
    var result = s.analyze('Cats are stupid.');
    console.dir(result); 
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

}


