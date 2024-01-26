import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment } from './schema/assignment.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateAssignmentDto } from './dto/create-assigment.dto';
import { GradeReviewsService } from '../gradeReviews/gradeReviews.service';
import { GradesService } from '../grades/grades.service';
@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel('Assignment')
    private assignmentsModel: Model<Assignment>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly gradeReviewsService: GradeReviewsService,
    @Inject(forwardRef(() => GradesService))
    private readonly gradesService: GradesService,
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
      const assignment = await this.findOneById(assignmentId);
      await this.gradeReviewsService.deleteByAssignmentId(assignmentId);
      await this.gradesService.deleteByAssignmentId(
        assignment.classId.toString(),
        assignmentId,
      );
      return deletedAssignment;
    } catch (error) {
      throw error;
    }
  }
  async findOneAndUpdate(data: any): Promise<Assignment | null> {
    const { _id, ...updateData } = data;
    const rs = await this.assignmentsModel
      .findOneAndUpdate({ _id }, updateData, {
        new: true,
      })
      .exec();
    return rs;
  }
  async findOneById(assignmentId: string): Promise<Assignment | null> {
    try {
      return await this.assignmentsModel.findById(assignmentId).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async adminClearAssignmentByClass(classId: any) {
    return this.assignmentsModel.deleteMany({ classId: classId }).exec();
  }
  async findAllByGradeStructureId(
    gradeStructureId: string,
  ): Promise<Assignment[]> {
    try {
      const assignments = await this.assignmentsModel
        .find({ gradeStructureId })
        .exec();
      return assignments;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteByGradeStructureId(gradeStructureId: string): Promise<void> {
    try {
      const assignments =
        await this.findAllByGradeStructureId(gradeStructureId);
      for (const assignment of assignments) {
        await this.deleteAssignmentById(assignment._id);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
