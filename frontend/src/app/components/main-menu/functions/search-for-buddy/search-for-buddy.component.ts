import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { AddUserToGroup } from 'src/app/models/addUserToGroup.model';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { GroupsService } from 'src/app/services/groups.service';
import { SubcategoriesService } from 'src/app/services/subcategories.service';

@Component({
  selector: 'app-search-for-buddy',
  templateUrl: './search-for-buddy.component.html',
  styleUrls: ['./search-for-buddy.component.scss'],
})
export class SearchForBuddyComponent extends Unsubscribe implements OnInit {
  constructor(
    public authService: AuthService,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private groupsService: GroupsService
  ) {
    super();
  }

  isLoading: Boolean = true;
  searchBuddyForm!: FormGroup;
  categoriesOrigin: Category[] = [];
  subcategoriesOrigin: Subcategory[] = [];
  filteredSubcategories: Subcategory[] = [];
  userId: string | undefined = this.authService.currentUserSignal()?._id;

  ngOnInit(): void {
    this.searchBuddyForm = new FormGroup({
      searchValue: new FormControl('', Validators.required),
      courseId: new FormControl('', Validators.required),
      subcategoryId: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
    });

    this.getCategories();
    this.getSubcategories();
  }

  getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (cat) => {
          this.categoriesOrigin = cat;
          this.isLoading = false;
        },
        (error) => {}
      );
  }

  getSubcategories() {
    this.subcategoriesService
      .getSubcategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (subcat) => {
          this.subcategoriesOrigin = subcat;
        },
        (error) => {}
      );
  }

  onCategorySelect() {
    const selectedCategoryId = this.searchBuddyForm.value.courseId;
    const subcategoryControl = this.searchBuddyForm.get('subcategoryId');

    this.filteredSubcategories = this.subcategoriesOrigin.filter((subcat) => {
      return subcat.category_id === selectedCategoryId;
    });

    if (selectedCategoryId) {
      subcategoryControl?.enable();
      subcategoryControl?.setValidators(Validators.required);
    } else {
      subcategoryControl?.disable();
      subcategoryControl?.clearValidators();
    }

    subcategoryControl?.updateValueAndValidity();
  }

  searchBuddy(data: any) {
    if (this.searchBuddyForm.valid) {
      let group_type: 'two' | 'multiple' = data.searchValue;
      let subcategoryId: string = data.subcategoryId;

      if (this.userId) {
        let addToGroup: AddUserToGroup = {
          type: group_type,
          user_id: this.userId,
          subcategory_id: subcategoryId,
        };

        this.groupsService
          .addUserToGroup(addToGroup)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (res) => {
              console.log(res);

              alert('Udało się! Grupę znajdziesz w zakładce czat');

              const subcategoryControl =
                this.searchBuddyForm.get('subcategoryId');

              this.searchBuddyForm.reset();

              subcategoryControl?.disable();
              subcategoryControl?.clearValidators();
              this.searchBuddyForm.updateValueAndValidity();
              this.searchBuddyForm.patchValue({
                courseId: '',
                subcategoryId: '',
              });
            },
            (err) => {
              console.log(err.error);

              if (err.error === 'Error') {
                alert('Już jesteś dodany do takiej grupy');

                const subcategoryControl =
                  this.searchBuddyForm.get('subcategoryId');

                this.searchBuddyForm.reset();

                subcategoryControl?.disable();
                subcategoryControl?.clearValidators();
                this.searchBuddyForm.updateValueAndValidity();
                this.searchBuddyForm.patchValue({
                  courseId: '',
                  subcategoryId: '',
                });
              }
            }
          );
      }
    }
  }
}
