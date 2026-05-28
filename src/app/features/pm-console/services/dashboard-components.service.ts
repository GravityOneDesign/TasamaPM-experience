import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardComponentsQuery {
  frontDoorName: string;
  dashboardName: string;
  isGrouped?: boolean;
}

export interface DashboardComponentDetail {
  id: number;
  name: string;
  component: string | null;
  imagePath?: string | null;
  dashboardType?: number | null;
  description?: string | null;
  isAccessible?: boolean;
  orderLevel?: number | null;
}

export interface DashboardComponentGroup {
  name?: string | null;
  grouped?: DashboardComponentDetail[] | null;
  isAccessible?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardComponentsService {
  private readonly cdApiBaseUrl = environment.cdApiBaseUrl.replace(/\/$/, '');

  constructor(private readonly http: HttpClient) {}

  getDashboardComponentDetails(query: DashboardComponentsQuery): Observable<DashboardComponentGroup[]> {
    const params = new HttpParams()
      .set('frontDoorName', query.frontDoorName)
      .set('dashboardName', query.dashboardName)
      .set('isGrouped', String(query.isGrouped ?? true));

    return this.http.get<DashboardComponentGroup[]>(
      `${this.cdApiBaseUrl}/dashboards/GetDashboardComponentsDetails`,
      { params },
    );
  }

  getFirstAccessibleComponent(groups: DashboardComponentGroup[] | null | undefined): DashboardComponentDetail | null {
    return this.getAccessibleComponents(groups)[0] ?? null;
  }

  getAccessibleComponents(groups: DashboardComponentGroup[] | null | undefined): DashboardComponentDetail[] {
    if (!groups?.length) return [];

    const items = groups.flatMap((group) => {
      if (group?.isAccessible === false) return [];
      return group.grouped ?? [];
    });

    const sortedAccessible = items
      .filter((item) => item?.isAccessible !== false && !!item.component)
      .sort((a, b) => {
        const aOrder = Number.isFinite(a.orderLevel as number) ? (a.orderLevel as number) : Number.MAX_SAFE_INTEGER;
        const bOrder = Number.isFinite(b.orderLevel as number) ? (b.orderLevel as number) : Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
      });

    return sortedAccessible;
  }
}
