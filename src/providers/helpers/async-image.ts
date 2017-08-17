import {Component, Input} from '@angular/core';
import {StoryService} from "../back-end/story.service";

@Component({
  selector: 'async-image',
  template: `<img [src]="img | safe" />`
})
export class AsyncImageComponent {

  @Input() filename: string;
  public img: any;

  constructor(public storyService: StoryService) {
  }

  public async ngOnInit(): Promise<void> {
    this.img = await this.storyService.getImage(this.filename).toPromise();
  }
}
