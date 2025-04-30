import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('collections')
@ApiBearerAuth()
@Controller('collections')
@UseGuards(AuthGuard('jwt'))
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiBody({ type: CreateCollectionDto })
  @ApiResponse({
    status: 201,
    description: 'The collection has been successfully created.',
    type: CreateCollectionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(
    @Body() createCollectionDto: CreateCollectionDto,
    @Request() req: { user: User },
  ) {
    return this.collectionsService.create(createCollectionDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all collections for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of collections',
    type: [CreateCollectionDto],
  })
  findAll(@Request() req: { user: User }) {
    return this.collectionsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a collection by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Collection ID' })
  @ApiResponse({
    status: 200,
    description: 'Collection details',
    type: CreateCollectionDto,
  })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  findOne(@Param('id') id: string, @Request() req: { user: User }) {
    return this.collectionsService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a collection' })
  @ApiParam({ name: 'id', type: String, description: 'Collection ID' })
  @ApiBody({ type: UpdateCollectionDto })
  @ApiResponse({
    status: 200,
    description: 'The collection has been successfully updated.',
    type: UpdateCollectionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @Request() req: { user: User },
  ) {
    return this.collectionsService.update(id, updateCollectionDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a collection' })
  @ApiParam({ name: 'id', type: String, description: 'Collection ID' })
  @ApiResponse({
    status: 200,
    description: 'The collection has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.collectionsService.remove(id, req.user);
  }
}
