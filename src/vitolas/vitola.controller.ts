import {
  Controller,
  Post,
  Body,
  HttpCode,
  BadRequestException,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { VitolaService } from './vitola.service';
import { CreateVitolaDto } from './dto/vitola.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('vitolas')
@Controller('vitolas')
export class VitolaController {
  constructor(private readonly vitolaService: VitolaService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new vitola' })
  @ApiBody({ type: CreateVitolaDto })
  @ApiResponse({ status: 201, description: 'Vitola created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Cigar not found' })
  async create(@Body() createVitolaDto: CreateVitolaDto) {
    try {
      return await this.vitolaService.create(createVitolaDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create vitola');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all vitolas' })
  @ApiResponse({ status: 200, description: 'Returns all vitolas' })
  async findAll() {
    return this.vitolaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vitola by id' })
  @ApiParam({ name: 'id', description: 'Vitola ID' })
  @ApiResponse({ status: 200, description: 'Returns the vitola' })
  @ApiResponse({ status: 404, description: 'Vitola not found' })
  async findOne(@Param('id') id: string) {
    return this.vitolaService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vitola' })
  @ApiParam({ name: 'id', description: 'Vitola ID' })
  @ApiBody({ type: CreateVitolaDto })
  @ApiResponse({ status: 200, description: 'Vitola updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Vitola not found' })
  async update(
    @Param('id') id: string,
    @Body() updateVitolaDto: CreateVitolaDto,
  ) {
    return this.vitolaService.update(id, updateVitolaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vitola' })
  @ApiParam({ name: 'id', description: 'Vitola ID' })
  @ApiResponse({ status: 200, description: 'Vitola deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vitola not found' })
  async remove(@Param('id') id: string) {
    return this.vitolaService.remove(id);
  }
}
