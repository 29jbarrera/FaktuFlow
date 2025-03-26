import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputSwitchModule,
    ButtonModule,
    InputTextareaModule,
    AccordionModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  @Input() formFields: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
