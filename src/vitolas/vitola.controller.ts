import {
  Controller,
  Post,
  Body,
  HttpCode,
  BadRequestException,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { VitolaService } from './vitola.service';
import { CreateVitolaDto, UpdateVitolaDto } from './dto/vitola.dto';
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
      console.error('Error creating vitola:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create vitola',
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all vitolas' })
  @ApiResponse({ status: 200, description: 'Returns all vitolas' })
  async findAll() {
    return this.vitolaService.findAll();
  }

  @Get('by-cigar/:cigarId')
  @ApiOperation({ summary: 'Get vitolas by cigar ID' })
  @ApiParam({ name: 'cigarId', description: 'Cigar ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns vitolas for the specified cigar',
  })
  @ApiResponse({ status: 404, description: 'Cigar not found' })
  async findByCigar(@Param('cigarId') cigarId: string) {
    return this.vitolaService.findByCigar(cigarId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vitola by id' })
  @ApiParam({ name: 'id', description: 'Vitola ID' })
  @ApiResponse({ status: 200, description: 'Returns the vitola' })
  @ApiResponse({ status: 404, description: 'Vitola not found' })
  async findOne(@Param('id') id: string) {
    return this.vitolaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a vitola' })
  @ApiParam({ name: 'id', description: 'Vitola ID' })
  @ApiBody({ type: UpdateVitolaDto })
  @ApiResponse({ status: 200, description: 'Vitola updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Vitola not found' })
  async update(
    @Param('id') id: string,
    @Body() updateVitolaDto: UpdateVitolaDto,
  ) {
    try {
      return await this.vitolaService.update(id, updateVitolaDto);
    } catch (error) {
      console.error('Error updating vitola:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to update vitola',
      );
    }
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
