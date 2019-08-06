import { Component, NgModule, ViewChild } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    HomeComponent,
    FooterComponent
  ]
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav') drawer;
  title = 'Noah Damiani - Consulting';
  opened  = false;
}


setTimeout(() => {
  document.querySelector('#logo').innerHTML = '&#8470;<span>&ordf;</span>&hstrok; &ETH;&aring;mi&aring;ni';
}, 0);
