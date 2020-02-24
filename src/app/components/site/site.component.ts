import { Component, ViewChild } from '@angular/core';

import { faSearch, faUser, faCodeBranch, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { GitRepository } from 'src/app/models/GitRepository';
import { map, filter, mergeMap, tap, mergeAll } from 'rxjs/operators';
import { NgModel } from '@angular/forms';
import { inputIsEmpty } from 'src/app/utils/validate-input-empty';
import { Branch } from 'src/app/models/Branch';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent {
  @ViewChild('usernameInput') usernameFormModel: NgModel;

  repositories: GitRepository[];
  username: string;
  faSearch = faSearch;
  faUser = faUser;
  faBranch = faCodeBranch;
  faGithub = faGithub;
  faHashtag = faHashtag;
  showSpinner = false;

  constructor(private apiService: ApiService) { }

  onSubmit(): void {
    this.showSpinner = true;

    if (!this.validateInput()) {
      return;
    };

    this.repositories = [];

    this.apiService.getUserRepositories(this.username).pipe(
      mergeAll(),
      filter((repository: GitRepository): boolean => !repository.fork),
      mergeMap((repository: GitRepository) => {
        return this.apiService.getRepositoryBranches(repository.name, this.username).pipe(
          map((branches: Branch[]) => ({
            repository: {
              ...repository,
              branches
            }
          }))
        )
      }),
      tap(result => {
        if (result) {
          this.repositories.push(result.repository)
          this.showSpinner = false;
        }
      })
    ).subscribe();
  }

  private validateInput(): boolean {
    if (inputIsEmpty(this.usernameFormModel.control)) {
      this.usernameFormModel.control.markAsDirty();
      this.usernameFormModel.control.setErrors({
        incorrect: true,
        required: true
      });
      this.showSpinner = false;
      return false;
    }
    return true;
  }
}
