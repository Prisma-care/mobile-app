import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from "../../core/authentication.service";
import {UserService} from "../../core/user.service";
import {AlbumListPage} from "../../albumList/albumList.component";
import {MixpanelService} from '../../core/mixpanel.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html',
})
export class InvitePage {

  patientId: string;
  inviterId: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(public authService: AuthenticationService,
              public navCtrl: NavController,
              public alertCtrl: AlertController,
              private userService: UserService,
              public navParams: NavParams,
              private mixpanel: MixpanelService,
              private fb: FormBuilder) {
  }

  ionViewDidLoad() {
    this.patientId = this.navParams.get("patientId");
    this.inviterId = this.userService.getCurrentUser().id;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [
        null, [
          Validators.required
        ],
        []
      ],
      lastName: [
        null, [
          Validators.required,
        ]
        , []
      ],
      email: [
        null, [
          Validators.required,
          Validators.email
        ], []
      ]
    });
  }

  invite({firstName, lastName, email}: { firstName: string, lastName: string, email: string }) {
    this.loading = true;
    this.mixpanel.track('InviteComponent::invite started');
    const data = {
      inviterId: this.inviterId,
      patientId: this.patientId,
      lastName,
      firstName,
      email
    };
    this.userService.inviteUser(data).subscribe(res => {
      if (res instanceof Error) {
        this.mixpanel.track('InviteComponent::invite error', data);
        this.invitePopup(firstName, res.message);
        this.loading = false;
      } else {
        this.mixpanel.track('InviteComponent::invite success', data);
        this.invitePopup(firstName);
        this.navCtrl.setRoot(AlbumListPage);
      }
    })
  }

  invitePopup(firstName, message?: string) {
    const messageToSend = message ? `${firstName} kon niet uitgenodigd worden.${message}` : `${firstName} ontvangt een e-mail met je uitnodiging.`;
    this.alertCtrl.create({
      title: messageToSend,
      buttons: ['Ok']
    }).present();
  }
}
