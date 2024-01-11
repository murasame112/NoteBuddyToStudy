import { Component, Input, OnInit } from '@angular/core';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { UsersService } from 'src/app/services/users.service';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { Group } from 'src/app/models/group.model';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-group-model',
  templateUrl: './group-model.component.html',
  styleUrls: ['./group-model.component.scss'],
})
export class GroupModelComponent extends Unsubscribe implements OnInit {
  @Input() groupData: Group | null = null;
  subcategoryName: string = '';

  constructor(
    private usersService: UsersService,
    private subcategoriesService: SubcategoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('data', this.groupData);
    this.getSubcategory();
  }

  getSubcategory() {
    if (this.groupData) {
      this.subcategoriesService
        .getSubcategoryById(this.groupData?.subcategory_id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (subcategory) => {
            this.subcategoryName = subcategory.name;
          },
          (error) => {}
        );
    }
  }

  getUsers() {}
}
