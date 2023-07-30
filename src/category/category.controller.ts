import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RemoveCouseFromCatDto } from './dto/remove-course-from-cat.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findOne(slug);
  }

  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.addCourse(slug, updateCategoryDto);
  }

  @Patch('/remove/:slug')
  removeCourse(
    @Param('slug') slug: string,
    @Body() removeCourseFromCatDto: RemoveCouseFromCatDto,
  ) {
    return this.categoryService.removeCourse(slug, removeCourseFromCatDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.categoryService.remove(slug);
  }
}
