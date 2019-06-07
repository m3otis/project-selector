import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export class Project {
  constructor(public id: number, public description: string) {}
}
/*
Used 'Chips Autocomplete' as example src:
https://material.angular.io/components/chips/examples
and reworked parts in order to make use of
Project objects vs strings used in example
*/
@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.css']
})
export class ProjectSelectorComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  count = 0;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  projectControl = new FormControl();

  allProjectsNew: Project[] = [
    new Project(1, 'Toasty'),
    new Project(2, 'LGP'),
    new Project(3, 'MDC'),
    new Project(4, 'Death Stranding'),
    new Project(5, 'Cyberpunk 2077'),
    new Project(6, 'Labor Redimo')
  ];

  filteredProjects: Observable<Project[]>;

  chosenProjectsNew: Project[] = [new Project(7, 'SSMB: Ultimate')];

  @ViewChild('projectInput', { static: false }) projectInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor() {}

  ngOnInit() {
    this.filterProjects();
    this.sortProjects();
  }

  private sortProjects() {
    this.allProjectsNew.sort((a, b) => a.description > b.description ? 1 : -1);
  }

  filterProjects() {
    this.filteredProjects = this.projectControl.valueChanges.pipe(
      startWith(null),
      map((userInput: string | Project) => {
        if (typeof(userInput) === 'string') {
          console.log('filter');
          this.count++;
          console.log(this.count);
          return this.filterUsingString(userInput);
        } else {
          return this.allProjectsNew;
        }
      })
    );
  }

  private filterUsingString(userInput: string): Project[] {
    const filterValue = userInput.toLowerCase();
    return this.allProjectsNew.filter(
      p => p.description.toLowerCase().indexOf(filterValue) === 0
    );
  }

  add(event: MatChipInputEvent): void {
    // Add project only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our project
      if ((value || '').trim()) {
        alert('create new project?');
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.projectControl.setValue(null);
    }
  }

  remove(project: any): void {
    const index = this.chosenProjectsNew.indexOf(project);

    if (index >= 0) {
      this.chosenProjectsNew.splice(index, 1);
    }
    const a = new Array<Project>();

    this.allProjectsNew.forEach(element => {
      a.push(element);
    });
    a.push(project);
    this.allProjectsNew = a;

    this.filterProjects();
    this.allProjectsNew.sort((as, bs) =>
      as.description > bs.description ? 1 : -1
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.chosenProjectsNew.push(event.option.value);
    this.projectInput.nativeElement.value = '';
    this.projectControl.setValue(null);

    this.allProjectsNew = this.allProjectsNew.filter(p => {
      return p.id !== event.option.value.id;
    });
  }
}
