import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grade } from './schema/grade.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateGradeDto } from './dto/create-grade.dto';
@Injectable()
export class GradesService {
  constructor(
    @InjectModel('Grade')
    private gradesModel: Model<Grade>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async create(gradeData: CreateGradeDto): Promise<Grade> {
    //console.log('gradeData before update: ', gradeData);
    const newGradeData = {
      classId: gradeData.classId,
      assignmentId: gradeData.assignmentId,
      studentId: gradeData.studentId,
      score: gradeData.score,
      status: gradeData.status,
    };
    const existingGrade = await this.gradesModel
      .findOne({
        classId: gradeData.classId,
        assignmentId: gradeData.assignmentId,
        studentId: gradeData.studentId,
      })
      .exec();
    //console.log('existingGrade: ', existingGrade);
    // Nếu tồn tại grade
    if (existingGrade) {
      existingGrade.score = gradeData['score'];
      await existingGrade.save();
      return existingGrade;
    }

    // Nếu không tồn tại, tạo một grade mới score
    const createGrade = new this.gradesModel(newGradeData);
    const newGrade = await createGrade.save();
    return newGrade;
  }
  async deleteGrade(
    classId: string,
    assignmentId: string,
    studentId: string,
  ): Promise<any> {
    return await this.gradesModel
      .deleteOne({ classId, assignmentId, studentId })
      .exec();
  }
  async updateOneGrade(colName: string, data: any): Promise<any> {
    const classId = data.classId;
    const assignmentId = data.assignmentId;
    const studentId = data.studentId;
    const rs = await this.gradesModel
      .findOneAndUpdate(
        { classId, assignmentId, studentId },
        {
          [colName]: data[colName],
        },
        { new: true },
      )
      .exec();
    return rs;
  }

  async updateGradeAssignment(gradeData: any): Promise<Grade[]> {
    const updatedGrades = [];
    // Lặp qua từng phần tử trong mảng gradeData
    const classId = gradeData.classId;
    const assignmentId = gradeData.assignmentId;
    gradeData.list.forEach(async (entry) => {
      const { studentId, grade } = entry;
      // Tìm grade hiện tại
      const existingGrade = await this.gradesModel
        .findOne({ classId, assignmentId, studentId })
        .exec();
      // Nếu grade đã tồn tại, cập nhật điểm
      if (existingGrade) {
        if (grade === '') {
          console.log('********** delete one');
          await this.deleteGrade(classId, assignmentId, studentId);
        } else {
          existingGrade.score = grade;
          await existingGrade.save();
          updatedGrades.push(existingGrade);
        }
      } else {
        // Nếu grade chưa tồn tại, tạo mới và lưu vào database
        const newGradeData = {
          classId,
          assignmentId,
          studentId,
          score: grade,
          status: 'unlisted', // Bạn có thể cần điều chỉnh trạng thái tùy theo yêu cầu của bạn
        };
        const createGrade = new this.gradesModel(newGradeData);
        const newGrade = await createGrade.save();
        updatedGrades.push(newGrade);
      }
    });
    return updatedGrades;
  }
  async findAllByAssignmentId(
    classId: string,
    assignmentId: string,
  ): Promise<Grade[]> {
    try {
      const grades = await this.gradesModel
        .find({ classId, assignmentId })
        .exec();
      //console.log('grades by assignmentId: ', grades);
      return grades;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAllByClassId(classId: string): Promise<Grade[]> {
    try {
      const grades = await this.gradesModel.find({ classId }).exec();
      //console.log('grades by classId: ', grades);
      return grades;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteGradeById(gradeId: any): Promise<Grade | null> {
    try {
      const deletedGrade = await this.gradesModel
        .findOneAndDelete(gradeId)
        .exec();
      return deletedGrade;
    } catch (error) {
      throw error;
    }
  }
  async findOneAndUpdate(
    gradeId: string,
    updatedData: any,
  ): Promise<Grade | null> {
    return await this.gradesModel
      .findOneAndUpdate({ _id: gradeId }, updatedData, {
        new: true,
      })
      .exec();
  }
  async findOneById(gradeId: string): Promise<Grade | null> {
    try {
      return await this.gradesModel.findById(gradeId).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
}
