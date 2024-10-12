export class PaginationGalleryDto {
  data: any[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;

  constructor(data: any[], page: number, limit: number, totalPages: number, totalItems: number) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
  }

  getData(): any {
    return {
      data: this.data,
      meta: {
        currentPage: this.page,
        totalItems: this.totalItems,
        totalPages: this.totalPages,
      }
    }
  }
}