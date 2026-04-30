import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-table-layout',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './my-table-layout.html',
  styleUrl: './my-table-layout.css',
})
export class MyTableLayout implements OnInit, OnChanges {

  @Input() ListName: string = '';
  @Input() Name: string = 'Item';
  /** Legacy string total — superseded by `totalItems` when provided. */
  @Input() Total: string = '';
  @Input() showPagination: boolean = true;

  /** Numeric total used to drive pagination (preferred over `Total`). */
  @Input() totalItems: number | null = null;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;

  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() searchClicked = new EventEmitter<string>();
  @Output() addClicked = new EventEmitter<void>();
  @Output() exportClicked = new EventEmitter<void>();

  private readonly _pageIndex = signal(0);
  private readonly _pageSize = signal(10);
  private readonly _total = signal(0);

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this._total() / Math.max(1, this._pageSize())))
  );

  readonly fromIndex = computed(() =>
    this._total() === 0 ? 0 : this._pageIndex() * this._pageSize() + 1
  );

  readonly toIndex = computed(() =>
    Math.min(this._total(), (this._pageIndex() + 1) * this._pageSize())
  );

  readonly pageNumbers = computed<number[]>(() => {
    const total = this.totalPages();
    const cur = this._pageIndex();
    const windowSize = 5;
    let start = Math.max(0, cur - 2);
    let end = Math.min(total, start + windowSize);
    start = Math.max(0, end - windowSize);
    const out: number[] = [];
    for (let i = start; i < end; i++) out.push(i);
    return out;
  });

  searchFormGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null),
    });
    this.syncFromInputs();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.syncFromInputs();
  }

  private syncFromInputs(): void {
    const total = this.totalItems !== null && this.totalItems !== undefined
      ? this.totalItems
      : Number(this.Total) || 0;
    this._total.set(Math.max(0, total));
    this._pageSize.set(Math.max(1, this.pageSize));
    this._pageIndex.set(Math.max(0, Math.min(this.pageIndex, this.totalPages() - 1)));
  }

  handleSearch() {
    const keyword = this.searchFormGroup.get('keyword')?.value;
    this.searchClicked.emit(keyword);
  }

  onAdd() {
    this.addClicked.emit();
  }

  onExport() {
    this.exportClicked.emit();
  }

  goToPage(p: number) {
    if (p < 0 || p >= this.totalPages()) return;
    if (p === this._pageIndex()) return;
    this._pageIndex.set(p);
    this.pageIndexChange.emit(p);
  }

  get currentPageIndex(): number {
    return this._pageIndex();
  }
}
