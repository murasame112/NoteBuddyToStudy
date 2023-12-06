import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Hint } from 'src/app/models/hint.model';
import { HintsService } from 'src/app/services/hints.service';

@Component({
  selector: 'app-admin-crud-hints',
  templateUrl: './admin-crud-hints.component.html',
  styleUrls: ['./admin-crud-hints.component.scss'],
})
export class AdminCrudHintsComponent extends Unsubscribe implements OnInit {
  addHintForm!: FormGroup;
  editHintForm!: FormGroup;
  isSubmittedAddHintForm: boolean = false;
  isSubmittedEditHintForm: boolean = false;

  hintOrigin: Hint[] = [];

  constructor(private hintService: HintsService) {
    super();
  }
  ngOnInit(): void {
    this.getHints();

    this.addHintForm = new FormGroup({
      content: new FormControl('', Validators.required),
    });

    this.editHintForm = new FormGroup({
      _id: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
    });
  }

  getHints() {
    this.hintService
      .getHint()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((hints) => {
        console.log('getHints result:', hints);
        this.hintOrigin = hints;
      });
  }

  addHint(hint: Hint) {
    const isInvalid = this.addHintForm.invalid;
    this.isSubmittedAddHintForm = true;
    console.log(hint);

    const newHint: Hint = {
      content: hint.content,
    };

    if (!isInvalid) {
      const checkIfHintExist = this.hintOrigin.some((hintA) => {
        return hintA.content.toLowerCase() === hint.content.toLocaleLowerCase();
      });

      if (checkIfHintExist) {
        alert('Taka porada już istnieje');
      } else {
        this.hintService
          .addHint(newHint)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((hintId) => {
            // console.log('new Category id:', categoryId);
            let addNewHint: Hint = {
              _id: hintId.toString(),
              content: hint.content,
            };
            this.hintOrigin.push(addNewHint);
            console.log('Actual hintArray', this.hintOrigin);
          });
        this.addHintForm.reset();
        this.addHintForm.markAsPristine();
        this.addHintForm.markAsUntouched();
        this.isSubmittedAddHintForm = false;
      }
    } else {
      alert('Wpisz nazwę porady');
    }
  }

  updateHint() {
    let hintId = this.editHintForm.get('_id')?.value;
    let selectedHintContent = this.editHintForm.get('content')?.value;
    this.isSubmittedEditHintForm = true;

    if (hintId && selectedHintContent) {
      console.log('selected hint id:', hintId);
      console.log('hint content', selectedHintContent);

      const updateHint: Hint = {
        _id: hintId,
        content: selectedHintContent,
      };

      if (hintId != undefined) {
        const hintIndex = this.hintOrigin.findIndex((h) => {
          return h._id === hintId;
        });

        if (hintIndex != -1) {
          this.hintService
            .updateHint(updateHint)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res) => {
              console.log('update hint', res);
              this.hintOrigin[hintIndex].content = selectedHintContent;
              this.editHintForm.patchValue({
                content: selectedHintContent,
              });
              this.isSubmittedEditHintForm = false;
              console.log('updateHintOrigin', this.hintOrigin);
            });
        }
      }
    } else {
      alert('nie wybraleś porady');
    }
  }

  deleteHint() {
    let id = this.editHintForm.get('_id')?.value;
    this.isSubmittedEditHintForm = true;

    if (id) {
      this.hintService
        .deleteHint(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.hintOrigin = this.hintOrigin.filter((hint) => {
            return hint._id != id;
          });
          this.isSubmittedEditHintForm = false;
          console.log('hints after delete:', this.hintOrigin);
        });
      this.editHintForm.reset();
      this.editHintForm.markAsPristine();
      this.editHintForm.markAsUntouched();
      this.editHintForm.patchValue({
        _id: '',
        content: '',
      });
    } else {
      alert('nie wybraleś porady');
    }
  }

  onEditHintChange() {
    const selectedhintId = this.editHintForm.value._id;
    const selectedHint = this.hintOrigin.find((h) => {
      return h._id === selectedhintId;
    });

    if (selectedHint) {
      this.editHintForm.patchValue({
        content: selectedHint.content,
      });
    }
  }
}
