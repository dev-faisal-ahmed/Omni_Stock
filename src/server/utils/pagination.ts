import { TMeta } from "../common/common.types";

export class Pagination {
  constructor(
    public page: number = 1,
    public limit: number = 10,
  ) {}

  get skip() {
    return (this.page - 1) * this.limit;
  }

  get take() {
    this.limit = Math.min(this.limit, 100); // Enforce max limit of 100
    return this.limit;
  }

  getMeta(totalItems: number): TMeta {
    return {
      page: this.page,
      limit: this.limit,
      total: totalItems,
      totalPage: Math.ceil(totalItems / this.limit),
    };
  }
}
