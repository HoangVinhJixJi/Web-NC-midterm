import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingInvite } from './schema/pendingInvite.schema';

@Injectable()
export class PendingInvitesService {
  constructor(
    @InjectModel('PendingInvite')
    private pendingInvitesModel: Model<PendingInvite>,
  ) {}
  async add(classId: string, email: string, role: string) {
    const newPendingInvite = {
      classId,
      email,
      role,
    };
    const createPendingInvite = new this.pendingInvitesModel(newPendingInvite);
    return createPendingInvite.save();
  }
  async findAllByClassId(classId: string): Promise<PendingInvite[]> {
    try {
      const enrollments = await this.pendingInvitesModel
        .find({ classId })
        .exec();
      return enrollments;
    } catch (error) {
      throw new Error(error);
    }
  }
  async delete(
    classId: string,
    email: string,
    role: string,
  ): Promise<PendingInvite | null> {
    try {
      return await this.pendingInvitesModel
        .findOneAndDelete({ classId, email, role })
        .exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEmailsByClassId(classId: string): Promise<string[]> {
    try {
      const pendingInvites = await this.pendingInvitesModel
        .find({ classId })
        .exec();

      const emails = pendingInvites.map((pendingInvite) => pendingInvite.email);
      return emails;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findByClassIdAndEmailAndRole(
    classId: string,
    email: string,
    role: string,
  ): Promise<PendingInvite | null> {
    try {
      return await this.pendingInvitesModel
        .findOne({ classId, email, role })
        .exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async findOneAndUpdate(
    classId: string,
    email: string,
    role: string,
    updatedData: any,
  ): Promise<PendingInvite | null> {
    return await this.pendingInvitesModel
      .findOneAndUpdate({ classId, email, role }, updatedData, { new: true })
      .exec();
  }
  async findOneById(pendingInviteId: string): Promise<PendingInvite | null> {
    try {
      return await this.pendingInvitesModel.findById(pendingInviteId).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
}
