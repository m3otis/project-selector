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
  separatorKeysCodes: number[] = [ENTER, COMMA];
  // filteredProjects: Observable<Project[] | void>;
  projectControl = new FormControl();

  allProjectsNew: Project[] = [
    new Project(1, 'Toasty'),
    new Project(2, 'LGP'),
    new Project(3, 'MDC'),
    new Project(4, 'Death Stranding'),
    new Project(5, 'Cyberpunk 2077'),
    new Project(6, 'Labor Redimo')
  ];

  // filteredProjects: Project[] = [
  // ];

  filteredProjects: Observable<Project[]>;

  chosenProjectsNew: Project[] = [new Project(7, 'SSMB: Ultimate')];

  public chosenProjects: string[] = ['Toasty', 'LGP'];
  public allProjects: string[] = [
    'Labor Redimo',
    'LGP',
    'MDC',
    'Death Stranding',
    'Cyberpunk 2077'
  ];

  @ViewChild('fruitInput', { static: false }) projectInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor() {
    this.toasty();
  }

  toasty() {
    // this.filteredProjects = this.projectControl.valueChanges.pipe(
    //   startWith(null),
    // map((p: string) => {
    //   p ? this._filterString(p) : this.allProjectsNew.slice();
    // }));

    this.filteredProjects = this.projectControl.valueChanges.pipe(
      startWith(null),
      map((a: string | Project) => {
        if (typeof(a) === 'string') {
          console.log('a not null');
          return this._filterString(a);
        } else {
          console.log('a is null');
          return this.allProjectsNew;
        }
        // console.log('filter');
        // a ? this._filterString(a) : this.allProjectsNew.slice();
      })
    );

    // this.filteredProjects = this.projectControl.valueChanges.pipe(
    //   startWith(null),
    //   map((project: Project | null) =>
    //     project ? this._filter(project) : this.allProjectsNew.slice()
    //   )
    // );
  }

  ngOnInit() {
    this.allProjectsNew.sort((a, b) =>
      a.description > b.description ? 1 : -1
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
        // console.log('open dialog');
        console.log('add');
        console.log(value);
        // console.log('test');
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.projectControl.setValue(null);
    }
  }

  remove(project: any): void {
    console.log(project);
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

    this.toasty();
    this.allProjectsNew.sort((as, bs) =>
      as.description > bs.description ? 1 : -1
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    this.chosenProjectsNew.push(event.option.value);
    this.projectInput.nativeElement.value = '';
    this.projectControl.setValue(null);

    this.allProjectsNew = this.allProjectsNew.filter(p => {
      return p.id !== event.option.value.id;
    });

    console.log(event);
  }

  private _filter(project: Project): Project[] {
    const filterValue = project.description.toLowerCase();

    this.allProjectsNew.filter(
      p => p.description.toLowerCase().indexOf(filterValue) === 0
    );

    return this.allProjectsNew;
  }

  private _filterString(userInput: string): Project[] {
    const filterValue = userInput.toLowerCase();
    return this.allProjectsNew.filter(
      p => p.description.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
