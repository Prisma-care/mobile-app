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
    {id: "slide1", text: "", src: "assets/img/t/cHTUaigQQ2iFLSLC34OP_stadhuishalle.jpg"},
    {id: "slide29", text: "", src: "assets/img/t/peROWMdTyapL2RcptjpQ_hallerbos.jpg"},
    {id: "slide28", text: "", src: "assets/img/t/LVZpafa9RpCyPNPLYuSn_sabena-security.jpg"},
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  goToTheApp() {
    this.navCtrl.push(TabsPage);
  }

  nextSlide(){
    //this.slider.slideTo(this.slider._activeIndex+1 > ? this.slider.)
  }
}
