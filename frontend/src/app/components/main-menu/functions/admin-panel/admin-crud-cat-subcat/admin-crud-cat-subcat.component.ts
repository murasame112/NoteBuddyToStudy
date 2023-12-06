import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories.service';

@Component({
  selector: 'app-admin-crud-cat-subcat',
  templateUrl: './admin-crud-cat-subcat.component.html',
  styleUrls: ['./admin-crud-cat-subcat.component.scss'],
})
export class AdminCrudCatSubcatComponent extends Unsubscribe implements OnInit {
  addCategoryForm!: FormGroup;
  editCategoryForm!: FormGroup;
  addSubcategoryForm!: FormGroup;
  editSubcategoryForm!: FormGroup;

  isSubmitted: boolean = false;
  isSubmittedAddCategoryForm: boolean = false;
  isSubmittedEditCategoryForm: boolean = false;
  isSubmittedAddSubcategoryForm: boolean = false;
  isSubmittedEditSubcategoryForm: boolean = false;

  categoriesOrigin: Category[] = [];
  subcategoriesOrigin: Subcategory[] = [];
  filteredSubcategories: Subcategory[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService
  ) {
    super();
  }
  ngOnInit(): void {
    this.getCategories();
    this.getSubcategories();

    this.addCategoryForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });

    this.editCategoryForm = new FormGroup({
      selectedCategoryName: new FormControl('', Validators.required),
      categoryName: new FormControl('', Validators.required),
    });

    this.addSubcategoryForm = new FormGroup({
      category_id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });

    this.editSubcategoryForm = new FormGroup({
      category_id: new FormControl('', Validators.required),
      _id: new FormControl({ value: '', disabled: true }, Validators.required),
      name: new FormControl('', Validators.required),
    });
  }

  //Categories

  getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((categories) => {
        console.log('categoriesResult', categories);
        this.categoriesOrigin = categories;
      });
  }

  addCategory(categoryName: Category) {
    const isInvalid = this.addCategoryForm.invalid;
    this.isSubmittedAddCategoryForm = true;

    const newCategory: Category = {
      name: categoryName.name,
    };

    if (!isInvalid) {
      const checkIfCategoryExist = this.categoriesOrigin.some((cat) => {
        return cat.name.toLowerCase() === categoryName.name.toLocaleLowerCase();
      });

      if (checkIfCategoryExist) {
        alert('Taka kategoria już istnieje');
      } else {
        this.categoriesService
          .addCategory(newCategory)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((categoryId) => {
            // console.log('new Category id:', categoryId);
            let addNewCategory: Category = {
              _id: categoryId.toString(),
              name: categoryName.name,
            };
            this.categoriesOrigin.push(addNewCategory);
            console.log('Actual categoryArray', this.categoriesOrigin);
          });
        this.addCategoryForm.reset();
        this.addCategoryForm.markAsPristine();
        this.addCategoryForm.markAsUntouched();
        this.isSubmittedAddCategoryForm = false;
      }
    } else {
      alert('Wpisz nazwę kierunku');
    }
  }

  updateCategory() {
    let categoryId = this.editCategoryForm.get('selectedCategoryName')?.value;
    let selectedCategorName = this.editCategoryForm.get('categoryName')?.value;
    this.isSubmittedEditCategoryForm = true;

    if (categoryId && selectedCategorName) {
      console.log('selected category', categoryId);
      console.log('input value', selectedCategorName);

      const updateCategory: Category = {
        _id: categoryId,
        name: selectedCategorName,
      };

      if (categoryId != undefined) {
        const categoryIndex = this.categoriesOrigin.findIndex((cat) => {
          return cat._id === categoryId;
        });

        if (categoryIndex != -1) {
          this.categoriesService
            .updateCategory(updateCategory)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res) => {
              console.log('update', res);
              this.categoriesOrigin[categoryIndex].name = selectedCategorName;
              this.editCategoryForm.patchValue({
                categoryName: selectedCategorName,
              });
              this.isSubmittedEditCategoryForm = false;
              console.log('updateCategoryOrigin', this.categoriesOrigin);
            });
        }
      }
    } else {
      alert('nie wybrales kierunku');
    }
  }

  deleteCategory() {
    let id = this.editCategoryForm.get('selectedCategoryName')?.value;
    this.isSubmittedEditCategoryForm = true;

    if (id) {
      this.categoriesService
        .deleteCategory(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.categoriesOrigin = this.categoriesOrigin.filter((category) => {
            return category._id != id;
          });
          this.isSubmittedEditCategoryForm = false;
          console.log('categories after delete:', this.categoriesOrigin);
        });
      this.editCategoryForm.reset();
      this.editCategoryForm.markAsPristine();
      this.editCategoryForm.markAsUntouched();
      this.editCategoryForm.patchValue({
        selectedCategoryName: '',
      });
    } else {
      alert('nie wybrales kierunku');
    }
  }

  onEditCategoryChange() {
    const selectedCategoryId = this.editCategoryForm.value.selectedCategoryName;
    const selectedCategory = this.categoriesOrigin.find((cat) => {
      return cat._id === selectedCategoryId;
    });

    if (selectedCategory) {
      this.editCategoryForm.patchValue({
        categoryName: selectedCategory.name,
      });
    }
  }

  //Subcategories
  getSubcategories() {
    this.subcategoriesService
      .getSubcategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((subcategories) => {
        console.log('subcategoriesResult', subcategories);
        this.subcategoriesOrigin = subcategories;
      });
  }

  addSubcategory(subcategory: Subcategory) {
    const isInvalid = this.addSubcategoryForm.invalid;
    this.isSubmittedAddSubcategoryForm = true;

    const newSubcategory: Subcategory = {
      category_id: subcategory.category_id,
      name: subcategory.name,
    };

    if (!isInvalid) {
      const checkIfSubcategoryExist = this.subcategoriesOrigin.some(
        (subcat) => {
          return subcat.name.toLowerCase() === subcategory.name.toLowerCase();
        }
      );

      if (checkIfSubcategoryExist) {
        alert('Taki temat już istnieje');
      } else {
        this.subcategoriesService
          .addSubcategory(newSubcategory)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((subcategoryId) => {
            // console.log('new subcategory id:', subcategoryId);
            let addNewSubcategory: Subcategory = {
              _id: subcategoryId.toString(),
              category_id: subcategory.category_id,
              name: subcategory.name,
            };
            this.subcategoriesOrigin.push(addNewSubcategory);
            console.log('Actual subcategoryArray', this.subcategoriesOrigin);
          });
        this.addSubcategoryForm.reset();
        this.addSubcategoryForm.markAsPristine();
        this.addSubcategoryForm.markAsUntouched();
        this.isSubmittedAddSubcategoryForm = false;
      }
    } else {
      alert('Wybierz kierunek i wpisz nazwę tematu');
    }
  }

  updateSubcategory() {
    //id category
    let categoryId = this.editSubcategoryForm.get('category_id')?.value;
    //id subcategory
    let subcategoryId = this.editSubcategoryForm.get('_id')?.value;
    //input value subcategory name
    let subcategoryInputName = this.editSubcategoryForm.get('name')?.value;
    this.isSubmittedEditSubcategoryForm = true;

    if (categoryId && subcategoryId && subcategoryInputName) {
      console.log('selected category id:', categoryId);
      console.log('selected subcategory id:', subcategoryId);
      console.log('input value:', subcategoryInputName);

      const updateSubcategory: Subcategory = {
        _id: subcategoryId,
        category_id: categoryId,
        name: subcategoryInputName,
      };

      if (
        categoryId != undefined &&
        subcategoryId != undefined &&
        subcategoryInputName != ''
      ) {
        const subcategoryIndex = this.subcategoriesOrigin.findIndex(
          (subcat) => {
            return subcat._id === subcategoryId;
          }
        );

        if (subcategoryIndex != -1) {
          this.subcategoriesService
            .updateSubcategory(updateSubcategory)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res) => {
              console.log('update subcat', res);
              this.subcategoriesOrigin[subcategoryIndex].name =
                subcategoryInputName;

              this.editSubcategoryForm.patchValue({
                name: subcategoryInputName,
              });
              this.isSubmittedEditSubcategoryForm = false;

              console.log('updateSubcategoryOrigin', this.subcategoriesOrigin);
            });
        }
      }
    } else {
      alert('nie wybrales kierunku i tematu');
    }
  }

  deleteSubcategory() {
    let id = this.editSubcategoryForm.get('_id')?.value;
    this.isSubmittedEditSubcategoryForm = true;

    if (id) {
      this.subcategoriesService
        .deleteSubategory(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.subcategoriesOrigin = this.subcategoriesOrigin.filter(
            (subcategory) => {
              return subcategory._id != id;
            }
          );

          console.log('subcategories delete:', this.subcategoriesOrigin);
        });
      this.editSubcategoryForm.reset();
      this.editSubcategoryForm.markAsPristine();
      this.editSubcategoryForm.markAsUntouched();
      this.editSubcategoryForm.patchValue({
        category_id: '',
        _id: '',
      });
      this.isSubmittedEditSubcategoryForm = false;
    } else {
      alert('nie wybrales kierunku i tematu');
    }
  }

  onEditSubcategoryCategorySelectChange() {
    const selectedCategoryId = this.editSubcategoryForm.value.category_id;
    const subcategoryControl = this.editSubcategoryForm.get('_id');

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

  onEditSubcategoryChange() {
    const selectedSubcategoryId = this.editSubcategoryForm.value._id;
    const selectedSubcategory = this.subcategoriesOrigin.find((subcat) => {
      return subcat._id === selectedSubcategoryId;
    });

    console.log(selectedSubcategory);

    if (selectedSubcategory) {
      this.editSubcategoryForm.patchValue({
        name: selectedSubcategory.name,
      });
    }
  }
}
