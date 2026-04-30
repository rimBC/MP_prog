import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactMessagesService } from '../../../../core/services/contact-messages.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal';
ModalComponent

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule,CommonModule,ModalComponent],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm implements OnInit{

contactForm: any;
myEmail:string= '1ING02@etudiant-isi.utm.tn';
title: 'success'|'failed'='failed';
isModalVisible:boolean=false;
response :string=`No data wass sent`;
myAddress: string=`27 rue du liban 4éme etage, 1002 Tunis Tunisia (Karriery)`;

closeModal() {
  this.isModalVisible=false;

}

    constructor(private fb: FormBuilder,
                private contactService:ContactMessagesService){
                  

    }
    
    ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: '',
      message: ''
    });
  }

  
    sendMessage() { 
      console.log("our form",this.contactForm.value,
                             this.contactForm.invalid);
      const formData = this.contactForm.value;
    this.contactService.sendMessage(formData).subscribe({
        next: (response) => {
          console.log(response);
        
          this.isModalVisible = true;
          this.response = `Your message was sent successfully!
          we'll get back to you as soon as possible`;
          this.title = "success";
        },

         error: (err) => {
          console.error(err);
          this.isModalVisible = true;
          this.response = 'Error submitting form';
          this.title = "failed";
  }
});

      }

    closeModalOutsideClick(event: MouseEvent){
      const targetElement = event.target as HTMLElement
      if(targetElement.classList.contains("fixed")){
       this.closeModal();
    }
  }

      


}
