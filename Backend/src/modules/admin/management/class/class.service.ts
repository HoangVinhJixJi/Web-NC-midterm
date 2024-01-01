import { Injectable } from '@nestjs/common';
import { ClassesService } from '../../../classes/classes.service';
import mongoose from 'mongoose';
import { SortOrderEnum } from '../../../../enums/sort-order.enum';

const PAGE_NUMBER_DEFAULT: number = 1;
const PAGE_SIZE_NUMBER_DEFAULT: number = 8;
const ClassStatus = {
  active: 'active',
  archivated: 'archivated',
};
const Action = {
  archive: 'archive',
  restore: 'restore',
  delete: 'delete',
};

@Injectable()
export class ClassService {
  constructor(private classesService: ClassesService) {}

  async getClasses(
    page: number = PAGE_NUMBER_DEFAULT,
    pageSize: number = PAGE_SIZE_NUMBER_DEFAULT,
    searchTerm: string = '',
    status: string = '',
    action: string = '',
    sortedBy: string = 'classId',
    sortOrder: string = SortOrderEnum.Increase,
  ) {
    const skip = (page - 1) * pageSize;
    const filter = this.createFilterForGettingClasses(
      searchTerm,
      status,
      action,
    );
    if (!filter) {
      return { totalPages: 0, classes: [] };
    }
    return await this.classesService.getClassListByPage(
      { skip, take: pageSize },
      filter,
      { sortedBy, sortOrder },
    );
  }
  private isMatchStatusAndAction(status: string, action: string) {
    return (
      status === '' ||
      action === '' ||
      (status.toLowerCase() === 'active' &&
        action.toLowerCase() === 'archive') ||
      (status.toLowerCase() === 'archivated' &&
        (action.toLowerCase() === 'restore' ||
          action.toLowerCase() === 'delete'))
    );
  }
  private createFilterForGettingClasses(
    searchTerm: string,
    status: string,
    action: string,
  ) {
    let filter: any = [];
    if (searchTerm !== '') {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(searchTerm);
      filter = [
        ...filter,
        {
          $or: isValidObjectId
            ? [
                { _id: searchTerm },
                { className: { $regex: searchTerm, $options: 'i' } },
              ]
            : [{ className: { $regex: searchTerm, $options: 'i' } }],
        },
      ];
    }
    if (this.isMatchStatusAndAction(status, action)) {
      if (status !== '') {
        return { $and: [...filter, { status: status.toLowerCase() }] };
      } else if (action !== '') {
        switch (action.toLowerCase()) {
          case Action.archive:
            return {
              $and: [...filter, { status: ClassStatus.active }],
            };
          case Action.restore:
          case Action.delete:
            return { $and: [...filter, { status: ClassStatus.archivated }] };
        }
      } else {
        return filter.length !== 0 ? { $and: filter } : {};
      }
    }
    return null;
  }
}
