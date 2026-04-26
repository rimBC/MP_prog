import { Component, computed, OnInit } from '@angular/core';
import { MyTableLayout } from "../../shared/components/my-table-layout/my-table-layout";

@Component({
  selector: 'app-testing',
  imports: [MyTableLayout],
  templateUrl: './testing.html',
  styleUrl: './testing.css',
})
export class Testing {
  item: { id: number; name: string; email: string; status: string; role: string; } | undefined;
formatCurrency(arg0: any) {
}
  stats:any;
  OnInit(){
    this.stats = computed(() => {
    
    return {
      total:10,
      planned: 3,
      inProgress: 4,
      completed: 5,
      cancelled: 5,
      totalBudget: 5,
      totalHours: 5,
      totalParticipants: 4
    } as FormationStats;
  });  }
      

}
