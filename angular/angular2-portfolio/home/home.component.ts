import { Component, OnInit, ViewChild } from '@angular/core';

interface Project {
  title: string;
  description: string;
  role: string;
  uri: string;
  image: string;
}

const projects: Array<Project> = [
  {
    'title': 'Brexit Calculator',
    'description': `<em>"With the Brexit vote and the subsequent
    decline of the pound, we turned lemons into lemonade by 
    highlighting to foreign travelers that there’s never been a better (or cheaper) time to visit London."</em> <br><br>
      - Figliulo & Partners`,
    'role': 'Front-end &amp; Back-end development.',
    'uri': 'http://brexitcalculator.com/',
    'image': 'brexit.png'
  },
  {
    'title': 'Street Smart Designs',
    'description': `I brought this gorgeous design
    to fruition with Meteor JS. I found the challenge of
    providing a responsive experience using this design comprised of many abnormal shapes particularly interesting.`,
    'role': 'Front-end &amp; Back-end development.',
    'uri': 'http://www.streetsmartdesigns.com/',
    'image': 'streetsmartdesigns.png'
  },
  {
    'title': 'Bloombox eCommerce',
    'description': `Full eCommerce suite for dispensary clients.
    Lead the UI and UX efforts, as well as the engineering,
    including dashboard management so that users can easily theme
    and edit their shop using Polymer &amp; TypeScript.`,
    'role': 'UX/UI + Front-End Engineering',
    'uri': 'https://shop.bloombox.cloud/',
    'image': 'shop-bloombox.png'
  },
  {
    'title': 'Bloombox Dashboard',
    'description': `Management dashboard for Bloombox retail services.
    Allows users to view KPI's, analytics, send email/SMS marketing content, as well as edit TV, menu, &amp; shop content.'`,
    'role': 'UX/UI + Front-End Engineering',
    'uri': 'https://manage.bloombox.cloud',
    'image': 'dashboard.png'
  }
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('section') input;
  @ViewChild('preview') preview;
  @ViewChild('cta') cta;
  projects: Array<Project> = projects;
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.input.nativeElement.classList.add('show');
      this.cta.nativeElement.classList.add('show');
    }, 500);
  }

  closeModal(e) {
    if (e.target.id === 'container') {
      return;
    }
    this.preview.nativeElement.classList.remove('show');
  }

  showPreview(event: Event, imgSrc: string, title: string): void {
    const responsiveImg = window.innerWidth > 767 ? imgSrc : `mobile/${imgSrc}`;
    this.preview.nativeElement.querySelector('.container').setAttribute('style', `background-image: url(/assets/img/${responsiveImg})`);
    this.preview.nativeElement.querySelector('h1').innerHTML = title;
    this.preview.nativeElement.classList.add('show');
  }
}
