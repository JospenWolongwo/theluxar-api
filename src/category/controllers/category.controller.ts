import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ApiCreateCategory,
  ApiFindAllCategories,
  ApiFindOneCategory,
  ApiFindRootCategories,
  ApiGetCategoryChildren,
  ApiRemoveCategory,
  ApiUpdateCategory
} from '../swagger/category-swagger.decorators';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiCreateCategory()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiFindAllCategories()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('root')
  @ApiFindRootCategories()
  findRootCategories() {
    return this.categoryService.findRootCategories();
  }

  @Get('parent/:id')
  @ApiOperation({ summary: 'Get categories by parent ID' })
  @ApiResponse({ status: 200, description: 'Return categories by parent ID.' })
  findByParent(@Param('id') id: string) {
    return this.categoryService.findByParent(id);
  }

  @Get(':id')
  @ApiFindOneCategory()
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiUpdateCategory()
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiRemoveCategory()
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
