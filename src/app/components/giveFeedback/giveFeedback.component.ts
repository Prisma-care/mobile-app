import {Component} from "@angular/core";

@Component({
  selector: 'prisma-give-feedback',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title class="detail-title">
          Geef feedback
        </ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
        <div>
          <p class="text-give-feedback">
            Een team van vrijwilligers met <br/>
            een hart voor warme zorg <br/>
            maakt de Prisma app. <br/>
          </p>
          <p class="text-give-feedback">
            Heb je tips? <br/>
            Loopt er iets fout? <br/>
            Of wil je het team helpen? <br/>
          </p>
          <p class="text-give-feedback">
            We horen graag van jou.
          </p>
        </div>
      <hr>
      <a href="mailto:info@prismacare.com?subject=Bericht uit Prisma applicatie" ion-item no-lines detail-none class="send-email">
        <ion-icon name="mail" color="general" class="send-mail-icon"></ion-icon>
        Stuur email
      </a>

    </ion-content>

  `
})
export class GiveFeedbackComponent {

  constructor() {
  }

}
