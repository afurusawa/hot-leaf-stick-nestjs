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
import { CigarService } from './cigar.service';
import {
  CigarGetDTO,
  CigarPostPayload,
  CigarPatchPayload,
} from './dto/cigar.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('cigars')
@ApiBearerAuth()
@Controller('cigars')
@UseGuards(JwtAuthGuard)
export class CigarController {
  constructor(private readonly cigarService: CigarService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cigars' })
  @ApiResponse({
    status: 200,
    description: 'List of cigars',
    type: [CigarGetDTO],
  })
  async findAll(): Promise<CigarGetDTO[]> {
    return this.cigarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single cigar by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Cigar ID' })
  @ApiResponse({ status: 200, description: 'Cigar details', type: CigarGetDTO })
  @ApiResponse({ status: 404, description: 'Cigar not found' })
  async findOne(@Param('id') id: string): Promise<CigarGetDTO> {
    return this.cigarService.findOne(id);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new cigar' })
  @ApiBody({ type: CigarPostPayload })
  @ApiResponse({
    status: 200,
    description: 'Created cigar',
    type: CigarGetDTO,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createCigarDto: CigarPostPayload): Promise<CigarGetDTO> {
    return this.cigarService.create(createCigarDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cigar' })
  @ApiParam({ name: 'id', type: String, description: 'Cigar ID' })
  @ApiBody({ type: CigarPatchPayload })
  @ApiResponse({
    status: 200,
    description: 'Updated cigar',
    type: CigarPostPayload,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Cigar not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCigarDto: CigarPatchPayload,
  ): Promise<CigarGetDTO> {
    return this.cigarService.update(id, updateCigarDto);
  }
}
