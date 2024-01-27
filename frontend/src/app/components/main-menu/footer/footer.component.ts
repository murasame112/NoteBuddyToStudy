import { Component, OnInit } from '@angular/core';
import { UserDocService } from 'src/app/services/user-doc.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private userDocService: UserDocService) {}

  copyrightYear: number | null = null;

  ngOnInit(): void {
    this.getYear();
  }

  getYear() {
    this.copyrightYear = new Date().getFullYear();
  }

  openUserDoc() {
    const pdfPath = this.userDocService.getUserDocPath();
    const pdfUrl = window.location.origin + pdfPath;
    window.open(pdfUrl, '_blank');
  }
}
