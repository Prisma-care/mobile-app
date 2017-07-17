import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})

export class QuestionsPage implements OnInit {

  categoryTitles: string[] = [
    "Voorouders",
    "Kindertijd en jeugd",
    "Opleiding en werk",
    "De liefde",
    "Gezin",
    "Vrije tijd en hobby's",
    "Vriendschap",
    "Vakanties en reizen"
  ];

  categories : any[];

  ngOnInit(): void {
    var _id = 1;
    this.categories = this.categoryTitles
      .map((s) => { return {"id": _id++, "title": s}; } );
  }

}
