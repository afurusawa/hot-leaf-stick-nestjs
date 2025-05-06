import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { BrandService } from './brand.service';
import {
  BrandGetDTO,
  BrandPostPayload,
  BrandPatchPayload,
} from './dto/brand.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('brands')
@ApiBearerAuth()
@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({
    status: 200,
    description: 'List of brands',
    type: [BrandGetDTO],
  })
  async findAll(): Promise<BrandGetDTO[]> {
    return this.brandService.findAll();
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiBody({ type: BrandPostPayload })
  @ApiResponse({ status: 200, description: 'Created brand', type: BrandGetDTO })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createBrandDto: BrandPostPayload): Promise<BrandGetDTO> {
    return this.brandService.create(createBrandDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand' })
  @ApiParam({ name: 'id', type: String, description: 'Brand ID' })
  @ApiBody({ type: BrandPatchPayload })
  @ApiResponse({ status: 200, description: 'Updated brand', type: BrandGetDTO })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: BrandPatchPayload,
  ): Promise<BrandGetDTO> {
    return this.brandService.update(id, updateBrandDto);
  }
}
