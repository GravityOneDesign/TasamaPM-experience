import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  P3MPortfolio,
  P3MPortfolioListRequest,
  P3MPortfolioListResponse,
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

  getPortfolioList(pageSize = 100): Observable<P3MPortfolioListResponse> {
    const payload: P3MPortfolioListRequest = {
      PagingParams: { PageNumber: 1, PageSize: pageSize },
      SearchParameter: '',
      SortDirections: 1,
      SortKeyColumn: 1,
    };

    return this.http.post<P3MPortfolioListResponse>(
      `${this.baseUrl}/P3MRegister/GetPortfolioListforP3M`,
      payload,
    );
  }

  /** Supports PascalCase and camelCase API payloads, and bare arrays. */
  extractProjectList(response: unknown): P3MProject[] {
    return this.extractEntityList(response) as P3MProject[];
  }

  extractPortfolioList(response: unknown): P3MPortfolio[] {
    return this.extractEntityList(response) as P3MPortfolio[];
  }

  /** Supports PascalCase and camelCase API payloads, and bare arrays. */
  private extractEntityList(response: unknown): unknown[] {
    if (!response) return [];
    if (Array.isArray(response)) return response as unknown[];
    if (typeof response !== 'object') return [];

    const record = response as Record<string, unknown>;
    const list =
      record['List'] ??
      record['list'] ??
      record['Items'] ??
      record['items'] ??
      record['Projects'] ??
      record['projects'];
    if (Array.isArray(list)) return list as unknown[];

    const nested = record['Data'] ?? record['data'] ?? record['Result'] ?? record['result'];
    if (nested && nested !== response) {
      return this.extractEntityList(nested);
    }

    return [];
  }

  toProjectOptions(projects: P3MProject[] | null | undefined): ProjectOption[] {
    const options = (projects ?? [])
      .map((project) => {
        const raw = project as unknown as Record<string, unknown>;
        const id =
          raw['Id'] ??
          raw['id'] ??
          raw['ID'] ??
          raw['ProjectId'] ??
          raw['projectId'] ??
          raw['ProjectID'] ??
          raw['projectID'];
        const name =
          raw['ProjectName'] ??
          raw['projectName'] ??
          raw['Name'] ??
          raw['name'] ??
          raw['ProjectCode'] ??
          raw['projectCode'];
        if (id == null || id === '') return null;
        return { id: String(id), name: String(name || `Project ${id}`) };
      })
      .filter((option): option is ProjectOption => option !== null);

    return options;
  }

  toPortfolioOptions(portfolios: P3MPortfolio[] | null | undefined): ProjectOption[] {
    return (portfolios ?? [])
      .map((portfolio) => {
        const raw = portfolio as unknown as Record<string, unknown>;
        const id = raw['Id'] ?? raw['id'] ?? raw['ID'] ?? raw['PortfolioId'] ?? raw['portfolioId'];
        const name = raw['PortfolioName'] ?? raw['portfolioName'] ?? raw['Name'] ?? raw['name'];
        if (id == null || id === '') return null;
        return { id: String(id), name: String(name || `Portfolio ${id}`) };
      })
      .filter((option): option is ProjectOption => option !== null);
  }

  defaultProjectId(options: ProjectOption[]): string | null {
    return options[0]?.id ?? null;
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
