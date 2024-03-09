import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { exec } from 'child_process';

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
export class AppComponent {
  title = 'angular';

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
