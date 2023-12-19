import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseService } from 'src/course/course.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RemoveCouseFromCatDto } from './dto/remove-course-from-cat.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly courseService: CourseService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      if (!createCategoryDto.name) throw new Error('Category name is required');
      if (!createCategoryDto.slug) throw new Error('Category slug is required');
      const newCat = new this.categoryModel(createCategoryDto);
      await newCat.save();
      return newCat;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    return this.categoryModel.find().populate('courses');
  }

  async findPopular() {
    const results = await this.categoryModel
      .find()
      .populate(
        'courses',
        '_id name description image views hours subjects demand',
        null,
        { sort: { views: -1 } },
      )
      .lean();

    const totalViewsCount = results.map((el) => {
      let totalViews = 0;
      el.courses.forEach((el) => {
        totalViews += el.views;
      });

      return {
        ...el,
        totalViews,
      };
    });

    const sortedByViews = totalViewsCount
      .slice()
      .sort((a, b) => a.totalViews - b.totalViews);
    return sortedByViews;
  }

  async findOne(slug: string) {
    return this.categoryModel.findOne({ slug });
  }

  async addCourse(slug: string, updateCategoryDto: UpdateCategoryDto) {
    const course = await this.courseService.findOne(updateCategoryDto.courseId);
    if (!course) throw new Error('Course not found');
    const category = await this.categoryModel.findOne({ slug });
    if (!category) throw new Error('Category not found');

    const duplicateCourse = category.courses.filter(
      (el: any) => el._id === course._id,
    );
    if (duplicateCourse && duplicateCourse.length > 0)
      throw new Error('This course already on this category');
    await this.categoryModel.findOneAndUpdate(
      { slug },
      { $push: { courses: course._id } },
      function (err, documents) {
        return documents;
      },
    );
  }

  async removeCourse(
    slug: string,
    removeCourseFromCatDto: RemoveCouseFromCatDto,
  ) {
    const course = await this.courseService.findOne(
      removeCourseFromCatDto.courseId,
    );
    if (!course) throw new Error('Course not found');
    const category = await this.categoryModel.findOne({ slug });
    if (!category) throw new Error('Category not found');

    const duplicateCourse = category.courses.filter(
      (el: any) => el._id === course._id,
    );
    if (duplicateCourse && duplicateCourse.length === 0)
      throw new Error('This course is not on this category');
    await this.categoryModel.findOneAndUpdate(
      { slug },
      { $pull: { courses: course._id } },
      function (err, documents) {
        return documents;
      },
    );
  }

  async remove(slug: string) {
    const category = await this.categoryModel.findOne({ slug });
    if (!category) throw new Error('Category not found');
    await this.categoryModel.findOneAndDelete({ slug });
    return { message: 'Delete Sucessful' };
  }
}
