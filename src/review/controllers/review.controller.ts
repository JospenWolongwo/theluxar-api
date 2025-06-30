import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import {
  ApiCreateReview,
  ApiFindAllReviews,
  ApiFindOneReview,
  ApiFindReviewsByProduct,
  ApiFindReviewsByStock,
  ApiFindReviewsByUser,
  ApiRemoveReview,
  ApiUpdateReview,
  ApiUpdateReviewHelpfulness
} from '../swagger/review-swagger.decorators';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiCreateReview()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @ApiFindAllReviews()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('product/:id')
  @ApiFindReviewsByProduct()
  findByProduct(@Param('id') id: string) {
    return this.reviewService.findByProduct(id);
  }

  @Get('stock/:id')
  @ApiFindReviewsByStock()
  findByStock(@Param('id') id: string) {
    return this.reviewService.findByStock(id);
  }

  @Get('user/:id')
  @ApiFindReviewsByUser()
  findByUser(@Param('id') id: string) {
    return this.reviewService.findByUser(id);
  }

  @Get(':id')
  @ApiFindOneReview()
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiUpdateReview()
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Patch(':id/helpfulness')
  @ApiUpdateReviewHelpfulness()
  updateHelpfulness(@Param('id') id: string, @Query('helpful') helpful: boolean) {
    return this.reviewService.updateHelpfulness(id, helpful);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiRemoveReview()
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
