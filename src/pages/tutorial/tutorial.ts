import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Slides} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  @ViewChild(Slides) slider: Slides;

  slides: Array<any> = [
    {
      id: "slide1",
      title: "Hoe was het vroeger?",
      text: "Kijk samen terug naar leuke verhalen over hoe we vroeger leefden.",
      src: "assets/img/tutorial/view-together.jpg"
    },
    {
      id: "slide29",
      title: "Wat zijn persoonlijke herinneringen?",
      text: "Bewaar verhalen van jouw familie en spreek er samen over.",
      src: "assets/img/tutorial/scan-photo.jpg"
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  goToTheApp() {
    this.navCtrl.push(TabsPage);
  }

  goToSlide(index:number) {
    if(index == this.slides.length)
      index = 0;
    this.slider.slideTo(index);
  }
}
