import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Slides} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {StoriesPage} from "../stories/stories";


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  @ViewChild(Slides) slider: Slides;


  homeRoot = StoriesPage;
  slides: Array<any> = [
    {
      id: "slide1",
      title: "Herbeleef herinneringen",
      text: "Bekijk samen leuke momenten uit het verleden.",
      src: "assets/img/tutorial/intro-1.jpg"
    },
    {
      id: "slide29",
      title: "Familie geschiedenis",
      text: "Verzamel het verhaal van jouw familie om er samen op terug te blikken.",
      src: "assets/img/tutorial/intro-2.jpg"
    },
    {
      id: "slide3",
      title: "Gebeurtenissen",
      text: "Kijk terug naar historische momenten en naar hoe het leven vroeger was.",
      src: "assets/img/tutorial/intro-3.jpg"
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
