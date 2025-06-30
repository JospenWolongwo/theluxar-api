import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ServiceCategoryService } from '../services/service-category.service';
import { CreateServiceCategoryDto } from '../dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from '../dto/update-service-category.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateServiceCategory,
  ApiFindAllServiceCategories,
  ApiFindOneServiceCategory,
  ApiUpdateServiceCategory,
  ApiRemoveServiceCategory,
} from '../swagger/service-category-swagger.decorators';

@ApiTags('Service Categories')
@Controller('service-categories')
export class ServiceCategoryController {
  constructor(private readonly serviceCategoryService: ServiceCategoryService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiCreateServiceCategory()
  create(@Body() createServiceCategoryDto: CreateServiceCategoryDto) {
    return this.serviceCategoryService.create(createServiceCategoryDto);
  }

  @Get()
  @ApiFindAllServiceCategories()
  findAll() {
    return this.serviceCategoryService.findAll();
  }

  @Get(':id')
  @ApiFindOneServiceCategory()
  findOne(@Param('id') id: string) {
    return this.serviceCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiUpdateServiceCategory()
  update(
    @Param('id') id: string,
    @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
  ) {
    return this.serviceCategoryService.update(id, updateServiceCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveServiceCategory()
  remove(@Param('id') id: string) {
    return this.serviceCategoryService.remove(id);
  }
}
