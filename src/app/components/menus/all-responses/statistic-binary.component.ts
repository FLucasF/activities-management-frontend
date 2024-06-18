import { Component, OnInit } from '@angular/core';
import { ResponseService } from 'src/app/service/response/response.service';

@Component({
  selector: 'app-statistic-binary',
  templateUrl: './statistic-binary.component.html',
  styleUrls: ['./statistic-binary.component.css']
})
export class StatisticBinaryComponent implements OnInit {
  questions: any[] = [];
  filteredQuestions: any[] = [];
  searchTerm = '';
  selectedOrder: string = 'phaseActivity';
  dataOn = true;
  startDate: Date | null = null;
  endDate: Date | null = null;
  errorMessage: string = "";
  idApp: string = "WEB-BINARIOS 1.0"

  constructor(private responseService: ResponseService) { }

  ngOnInit(): void {
    this.loadAllQuestions();
  }

  loadAllQuestions(): void {
    this.errorMessage = "Carregando respostas..."
    this.responseService.getAllQuestion(this.idApp).subscribe(
      (data: any) => {
        this.questions = data;
        this.filterQuestions();
      },
      error => {
        console.error('erro ao buscar detalhes da atividade:', error);
        this.errorMessage = "Erro ao carregar respostas!"
      }
    );
  }

  filterQuestions(): void {
    if (this.selectedOrder && this.searchTerm.trim() !== '') {
      this.filteredQuestions = this.questions.filter(question =>
        question[this.selectedOrder] &&
        question[this.selectedOrder].toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredQuestions = this.questions.slice();
    }
  
    if (this.selectedOrder === "dateResponse" && this.startDate !== null && this.endDate !== null) {
      this.responseService.getAllQuestionWithDate(this.idApp, this.startDate, this.endDate).subscribe(
        (data: any) => {
          this.questions = data;
          // Aplicar novamente o filtro de searchTerm após atualizar as questões
          if (this.searchTerm.trim() !== '') {
            this.filteredQuestions = this.questions.filter(question =>
              question[this.selectedOrder] &&
              question[this.selectedOrder].toString().toLowerCase().includes(this.searchTerm.toLowerCase())
            );
          } else {
            this.filteredQuestions = this.questions.slice();
          }
        },
        error => {
          console.error('Erro ao buscar detalhes da atividade:', error);
          this.errorMessage = "Erro ao carregar respostas!"
        }
      );
    }
    this.filteredQuestions.reverse(); // Coloca as respostas por ordem de respostas mais recente
  }
}
