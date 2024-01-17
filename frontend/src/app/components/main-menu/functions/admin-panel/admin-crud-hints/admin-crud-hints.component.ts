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
  hintCropped: Hint[] = [];

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
        this.hintOrigin = hints;

        //!
        this.hintOrigin.forEach((hint) => {
          if (hint._id) {
            this.getCroppedHint(hint._id, hint.content);
          }
        });
        //!</>
      });
  }

  getCroppedHint(hint_id: string, content: string) {
    const croppedContent =
      content.length > 35 ? `${content.substring(0, 35)}..` : content;
    this.hintCropped.push({ _id: hint_id, content: croppedContent });
  }

  updateCroppedHint(index: number, updatedContent: string) {
    const croppedContent =
      updatedContent.length > 35
        ? `${updatedContent.substring(0, 35)}..`
        : updatedContent;
    this.hintCropped[index].content = croppedContent;
  }

  addHint(hint: Hint) {
    const isInvalid = this.addHintForm.invalid;
    this.isSubmittedAddHintForm = true;

    const newHint: Hint = {
      content: hint.content,
    };

    if (!isInvalid) {
      const checkIfHintExist = this.hintOrigin.some((hintA) => {
        return hintA.content.toLowerCase() === hint.content.toLowerCase();
      });

      console.log(checkIfHintExist);

      if (checkIfHintExist) {
        alert('Taka porada już istnieje');
      } else {
        this.hintService
          .addHint(newHint)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((hintId) => {
            let addNewHint: Hint = {
              _id: hintId.toString(),
              content: hint.content,
            };
            this.hintOrigin.push(addNewHint);
            //!
            if (addNewHint._id) {
              this.getCroppedHint(addNewHint._id, addNewHint.content);
            }
            //!
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
              this.hintOrigin[hintIndex].content = selectedHintContent;
              //!
              this.updateCroppedHint(hintIndex, selectedHintContent);
              //!
              this.editHintForm.patchValue({
                content: selectedHintContent,
              });
              this.isSubmittedEditHintForm = false;
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
          //!
          this.hintCropped = this.hintCropped.filter((hCropped) => {
            return hCropped._id != id;
          });
          //!
          this.isSubmittedEditHintForm = false;
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
