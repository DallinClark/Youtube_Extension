import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
// import * as child from 'child_process';
import axios from 'axios';
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
  title = 'angular';
  key = "AIzaSyCgkOGTu8drhwATKnA4y-gVhu6-3O1FO4w"
  comments: Comment[] = []
  async ngOnInit() {
    alert("hi")
    console.log("hi")
    await this.getComments()
  }


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


