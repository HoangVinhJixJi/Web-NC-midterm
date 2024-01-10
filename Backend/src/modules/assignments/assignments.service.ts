import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment } from './schema/assignment.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateAssignmentDto } from './dto/create-assigment.dto';
@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel('Assignment')
    private assignmentsModel: Model<Assignment>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async create(assignmentData: CreateAssignmentDto): Promise<Assignment> {
    const newAssignmentData = {
      assignmentName: assignmentData.assignmentName,
      assignmentContent: assignmentData.assignmentContent,
      maxScore: assignmentData.maxScore,
      createAt: new Date().toString(),
      classId: assignmentData.classId,
      gradeStructureId: assignmentData.gradeStructureId,
    };
    const createAssignment = new this.assignmentsModel(newAssignmentData);
    const newAssignment = await createAssignment.save();
    return newAssignment;
  }
  async findAllByClassId(classId: string): Promise<Assignment[]> {
    try {
      const assignments = await this.assignmentsModel.find({ classId }).exec();
      return assignments;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteAssignmentById(assignmentId: any): Promise<Assignment | null> {
    try {
      const deletedAssignment = await this.assignmentsModel
        .findOneAndDelete(assignmentId)
        .exec();
      return deletedAssignment;
    } catch (error) {
      throw error;
    }
  }
  async findOneAndUpdate(
    classId: string,
    assigmentId: string,
    updatedData: any,
  ): Promise<Assignment | null> {
    return await this.assignmentsModel
      .findOneAndUpdate({ classId, _id: assigmentId }, updatedData, {
        new: true,
      })
      .exec();
  }
  async findOneById(assignmentId: string): Promise<Assignment | null> {
    try {
      return await this.assignmentsModel.findById(assignmentId).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
}
