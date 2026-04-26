import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-table-layout',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './my-table-layout.html',
  styleUrl: './my-table-layout.css',
})
export class MyTableLayout implements OnInit{
 
  @Input() ListName  : string =""
  @Input() Name  : string ="Item"
  @Input() Total  : string =""


  @Output() searchClicked = new EventEmitter<string>();
  @Output() addClicked = new EventEmitter<void>();
  @Output() exportClicked = new EventEmitter<void>();

  searchFormGroup! : FormGroup;


  constructor(private fb :FormBuilder){}

  ngOnInit(): void {

    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null)

      });
    
  }


  handleSearch(){
    const keyword = this.searchFormGroup.get('keyword')?.value;
    this.searchClicked.emit(keyword); // send input

  }
  onAdd() {
    alert('add clicked')
    this.addClicked.emit(); // no data
  }
  onExport() {
    alert('Export clicked')
    this.exportClicked.emit(); // no data
  }

 
  getPage(){
    
  }



}
