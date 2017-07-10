import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StanizerService } from '../../services/stanizer.service';
import {StoryDetailsPage} from "../storydetails/storydetails";

/**
 * More info on the slides management : https://ionicframework.com/docs/api/components/slides/Slides/
 */
@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html'
})
export class StoriesPage {

  public youtubeUrl:string = "www.youtube.com/embed/ERD4CbBDNI0?rel=0&amp;showinfo=0";
  public stanizedYoutubeUrl:any;


  public album1Data:Array<any> = [
      {id:"marieJosE-slide22",src:"assets/img/cHTUaigQQ2iFLSLC34OP_stadhuishalle.jpg"},
      {id:"marieJosE-slide29",src:"assets/img/peROWMdTyapL2RcptjpQ_hallerbos.jpg"},
      {id:"marieJosE-slide28",src:"assets/img/LVZpafa9RpCyPNPLYuSn_sabena-security.jpg"},
  ];

  public album2Data:Array<any> = [
      {id:"marieJosE-slide24",src:"assets/img/CBd1zASpTOmZptix3fng_family1.jpg"},
      {id:"marieJosE-slide25",src:"assets/img/TVRkzCgS7iNdKgM7PSwg_baby.jpg"},
      {id:"marieJosE-slide26",src:"assets/img/WE6rB9dZRTiIWQlP5qsA_kitten3.jpg"},
  ];

  public album3Data:Array<any> = [
      {id:"marieJosE-slide223",src:"assets/img/ARSdfjpfSAWvY2J9VpZe_moskow.jpg"},
      {id:"marieJosE-slide224",src:"assets/img/C6IS45JTlWcTrL5bnsaw_split-croatia.jpg"},
  ];

  public album4Data:Array<any> = [
      {id:"marieJosE-slide212",src:"assets/img/rJwCxPlrTsCi8xbyzE8m_tasselplay.jpg"},
      {id:"marieJosE-slide213",src:"assets/img/C6IS45JTlWcTrL5bnsaw_split-croatia.jpg"},
  ];

  public albums:Array<any> = [
    {name:"KinderTijd",data:this.album1Data},
    {name:"Favoriten",data:this.album2Data},
    {name:"Voer jow gesejutend",data:this.album3Data},
    {name:"Relevant vandaag",data:this.album4Data},
    ];

  constructor(public navCtrl: NavController,private stanizerService: StanizerService) {
      this.stanizedYoutubeUrl = this.stanizerService.sanitize(this.youtubeUrl);
  }


  showDetails(dataAlbum:Array<any>,dataIndex:number) {
    this.navCtrl.push(StoryDetailsPage, {
      album: dataAlbum,
      index: dataIndex ? dataIndex : 0
    })
  }
}
