import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { HelperService } from '../services/helper.service';
import { MainApiService } from '../services/main-api.service';

export interface SEARCH {
  county: string;
  address: string;
  account_num: string;
  zip: string;
  note_owner?: any
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  searchData: SEARCH[] = [];
  userObj!: any;
  searchForm!: FormGroup;
  public onLocationEnter = new Subject<string>();
  public onLocationEnterSubscriber: any;
  filterOnlyMy = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private mainApiService: MainApiService,
    private helperService: HelperService) {
    this.filterOnlyMy = this.router.url == '/home/my';
  }

  ngOnInit(): void {
    this.initializeSearchForm();
    this.onSearchValueChange();
    let user: any = localStorage.getItem('user');
    this.userObj = JSON.parse(user);
    this.helperService.onAuthMessage().subscribe(d => {
      if (d.authenticate) {
        this.userObj = d.user;
      }
    });

  }
  ngAfterViewInit(): void {
    if (this.filterOnlyMy) {
      this.getSearch('');
    }
    this.getSearchAfterFewSeconds();
  }

  getSearchAfterFewSeconds() {
    this.onLocationEnterSubscriber = this.onLocationEnter.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(res => {
        if (res && this.searchForm.value['search']) {
          this.getSearch(this.searchForm.value['search']);
        }

      });
  }

  getSearch(value: string) {
    const searchValue = this.searchForm.value;
    let queryParams = `?type=${searchValue.type}&search=${searchValue.search}`;
    if (this.filterOnlyMy) {
      queryParams += `&onlyMe=true`;
    }
    this.mainApiService.getSearchResult(queryParams).subscribe(
      (resp: any) => {
        if (resp.code == 200) {
          this.searchData = resp.data.result ? resp.data.result : [];
        }

      })

  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/sign-in']);
    this.toastr.success('Logout Successfully', '');
  }

  initializeSearchForm() {
    this.searchForm = this.formBuilder.group({
      type: ['name', [Validators.required]],
      search: ['', [Validators.required]],
    });
  }

  onSearchValueChange() {
    this.searchForm.get("search")?.valueChanges.subscribe(x => {
      if (x && x.length > 0) {
        this.onLocationEnter.next(x)
      }
    })
  }

  routeToDetailsPage(data: any) {
    if (data)
      this.router.navigate([`/search-details/${data.id}`]);
  }
}
