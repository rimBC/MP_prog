import { Component } from '@angular/core';
import { ContactForm } from './contact-form/contact-form';

@Component({
  selector: 'app-contact',
  imports: [ContactForm],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
email:string= 'benchaalia.rim@etudiant-isi.utm.tn';

}
