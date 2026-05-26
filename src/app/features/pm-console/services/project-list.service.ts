import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  P3MProject,
  P3MProjectListRequest,
  P3MProjectListResponse,
  ProjectOption,
} from '../models/pm-console.types';

@Injectable({
  providedIn: 'root',
})
export class ProjectListService {
  private readonly baseUrl = environment.sdzBaseUrl.replace(/\/$/, '');

  constructor(private readonly http: HttpClient) {}

  getProjectList(
    stage = 'Active',
    pageSize = 100,
  ): Observable<P3MProjectListResponse> {
    const payload: P3MProjectListRequest = {
      ProjectStage: stage,
      ProjectStatus: null,
      PagingParams: { PageNumber: 1, PageSize: pageSize },
      SortDirections: 1,
      SortKeyColumn: 1,
      SearchParameter: '',
    };
    return this.http.post<P3MProjectListResponse>(
      `${this.baseUrl}/P3MRegister/GetProjectListforP3M`,
      payload,
    );
  }

  toProjectOptions(projects: P3MProject[]): ProjectOption[] {
    return [
      { id: 'all', name: 'All projects' },
      ...projects.map((p) => ({
        id: String(p.Id),
        name: p.ProjectName,
      })),
    ];
  }

  static parseNetDate(raw: string | null | undefined): Date | null {
    if (!raw) return null;
    const match = /\/Date\((-?\d+)\)\//.exec(raw);
    return match ? new Date(Number(match[1])) : null;
  }

  static computeSchedulePercent(
    startDate: string | null,
    endDate: string | null,
  ): number {
    const start = ProjectListService.parseNetDate(startDate);
    const end = ProjectListService.parseNetDate(endDate);
    if (!start || !end) return 0;
    const total = end.getTime() - start.getTime();
    if (total <= 0) return 100;
    const elapsed = Date.now() - start.getTime();
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }

  static mapStatusTone(
    reportStatus: number,
  ): 'green' | 'amber' | 'red' | 'blue' | 'neutral' {
    switch (reportStatus) {
      case 1:
        return 'green';
      case 2:
        return 'amber';
      case 3:
        return 'red';
      default:
        return 'blue';
    }
  }
}
