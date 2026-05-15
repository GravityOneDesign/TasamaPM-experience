import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { PmConsoleIconService } from '../pm-console-icon.service';

@Component({
  selector: 'span[pmConsoleIcon]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'icon',
    '[attr.aria-hidden]': 'ariaHidden',
  },
  template: `<i [attr.data-lucide]="pmConsoleIcon"></i>`,
})
export class PmConsoleIconComponent implements AfterViewInit, OnChanges {
  @Input() pmConsoleIcon = 'circle';
  @Input() ariaHidden = 'true';

  constructor(private readonly iconsService: PmConsoleIconService) {}

  ngAfterViewInit(): void {
    this.iconsService.refresh();
  }

  ngOnChanges(): void {
    this.iconsService.refresh();
  }
}
