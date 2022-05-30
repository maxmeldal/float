import {Injectable} from '@angular/core';
import {ObservableStore} from "@northtech/ratatosk";
import {ApplicationStateData} from "../domain/application-state-data";

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService extends ObservableStore<ApplicationStateData> {

  constructor() {
    super({
        //apiUrl: "http://localhost:8080/api",
        apiUrl: "https://floatapp.azurewebsites.net/api",

        user: undefined,

        projects: [],
        wantedProjectId: undefined,
        selectedProject: undefined,

        buckets: [],
      }
    )
  }
}
