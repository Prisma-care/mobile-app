import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Slides} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {StoriesPage} from "../stories/stories";
import {ApiTestingPage} from "../api-testing/api-testing";
import { AlbumsPage } from "../albums/albums";


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  @ViewChild(Slides) slider: Slides;


  homeRoot = AlbumsPage;
  currentSlide: number = 0;
  slides: Array<any> = [
    {
      id: "slide1",
      title: "Start een leuke babbel",
      text: "Leer je geliefden beter kennen via vragen over hun kleurrijke verleden.",
      src: "assets/img/tutorial/intro-1.jpg"
    },
    {
      id: "slide29",
      title: "Familiegeschiedenis",
      text: "Leg de verhalen vast in een digitaal fotoalbum dat je samen kan bekijken.",
      src: "assets/img/tutorial/intro-2.jpg"
    },
    {
      id: "slide3",
      title: "Gebeurtenissen",
      text: "Laat je inspireren door foto’s uit de oude tijd in de app.",
      src: "assets/img/tutorial/intro-3.jpg"
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToTheApp() {
    // localStorage.clear();
    this.navCtrl.push(TabsPage);
  }


  goToSlide(index: number) {
    this.slider.slideTo(index);
    this.currentSlide = index;
  }

  getCurrentSlide(): number {
    return  this.slider.getActiveIndex();
    ;
  }

  testApi(){
    this.navCtrl.push(ApiTestingPage);
  }
}
