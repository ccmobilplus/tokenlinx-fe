import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MainApiService } from '../services/main-api.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NoteModel } from '../models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss', '../home/home.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  id: string = '';
  $destroy = new Subject();
  userObj!: any;
  note: NoteModel = new NoteModel();
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private apiSvc: MainApiService,
    private spinner: NgxSpinnerService,
  ) {
    let user: any = localStorage.getItem('user');
    this.userObj = JSON.parse(user);
    this.route.params.subscribe(res => {
      this.id = res['id'];
      if (this.id)
        this.fetchNote();
      else {
        this.toastr.error("Invalid url");
        this.router.navigate(['/home']);
      }
    })
  }

  fetchNote(): void {
    this.spinner.show();
    this.apiSvc.getNoteById(this.id).pipe(takeUntil(this.$destroy))
      .subscribe((res: NoteModel) => {
        this.note = res;
      }).add(() => {
        this.spinner.hide();
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  claimNote(): void {
    this.spinner.show();
    this.apiSvc.claimNote(this.id).pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res: NoteModel) => {
          this.note = res;
          this.toastr.success(`You have claimed this property successfully`); ``
        },
        error: err => {
          if (err?.error) {
            this.toastr.error(err.error.message, err.error.message2);
          }
        }
      }).add(() => {
        this.spinner.hide();
      })
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/sign-in']);
    this.toastr.success('Logout Successfully', '');
  }

}
