import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { QuestionsService } from '../services/questions.service';
import { Question } from '../services/types';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonTextarea, IonButton, FormsModule]
})
export class QuestionsPage {
  sessionId = '';
  text = '';
  questions: Question[] = [];

  constructor(private route: ActivatedRoute, private questionsService: QuestionsService, private translate: TranslateService) {}

  ionViewWillEnter() {
    this.sessionId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load() {
    this.questionsService.list().subscribe((data) => {
      this.questions = data.data;
    });
  }

  submit() {
    if (!this.text.trim()) return;
    this.questionsService.create(this.sessionId, this.text).subscribe(() => {
      this.text = '';
      this.load();
    });
  }

  remove(questionId: string) {
    this.questionsService.remove(questionId).subscribe(() => {
      this.load();
    });
  }
}
