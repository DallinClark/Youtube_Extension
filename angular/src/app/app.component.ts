import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
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
    }
  ];
}
