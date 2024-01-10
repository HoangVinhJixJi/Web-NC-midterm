import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GradeStructure } from './schema/gradeStructure.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AddGradeCompositionDto } from './dto/add-gradeCompostion.dto';

@Injectable()
export class GradeStructuresService {
  constructor(
    @InjectModel('GradeStructure')
    private gradeStructuresModel: Model<GradeStructure>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async add(classId: string, userData: AddGradeCompositionDto) {
    const newGradeStructure = {
      classId: classId,
      name: userData.name,
      scale: userData.scale,
    };
    const createGradeStructure = new this.gradeStructuresModel(
      newGradeStructure,
    );
    return await createGradeStructure.save();
  }
  async delete(gradeStructureId: string): Promise<GradeStructure | null> {
    try {
      return await this.gradeStructuresModel
        .findOneAndDelete({ _id: gradeStructureId })
        .exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async findOneAndUpdate(
    gradeStructureId: string,
    updatedData: any,
  ): Promise<GradeStructure | null> {
    return await this.gradeStructuresModel
      .findOneAndUpdate({ _id: gradeStructureId }, updatedData, { new: true })
      .exec();
  }
  async findAllByClassId(classId: string): Promise<GradeStructure[]> {
    return await this.gradeStructuresModel.find({ classId }).exec();
  }
}
